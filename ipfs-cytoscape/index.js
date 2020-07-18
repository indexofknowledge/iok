/* eslint-disable no-console */
// Initiate ipfs and CID instance
const IpfsClient = require('ipfs-http-client');
const DagCBOR = require('ipld-dag-cbor');

// Connecting ipfs instance to infura node
const ipfs = new IpfsClient({
  host: 'ipfs.infura.io', port: '5001', protocol: 'https', apiPath: '/api/v0',
});

const options = { format: 'dag-cbor', hashAlg: 'sha2-256', pin: 'true' };

function verifyGraphShape(graph) {
  const hasKeys = 'elements' in graph && 'nodes' in graph.elements && 'edges' in graph.elements;
  if (!hasKeys) {
    throw Error('Invalid graph, expected elements: {nodes, edges}');
  }
}

/**
 * Verify a given object is a node in cytoscape form
 * and return only its key fields
 *
 * At the bare minimum, we should have:
 * All nodes should contain `node_type`
 *  Topic nodes (1) should contain
 *    name
 *
 *  Resource nodes (2) should contain
 *    resource_type
 *    data
 *
 * @param {*} node
 */
function verifyNodeShape(node) {
  let hasKeys = 'node_type' in node;
  if (!hasKeys) {
    throw Error('Invalid node, expected {node_type}');
  }

  if (node.node_type === 1) { // topic
    hasKeys = 'name' in node;
    if (!hasKeys) {
      throw Error('Invalid Topic node, expected `name`');
    }
    return { name: node.name, node_type: node.node_type };
  }

  if (node.node_type === 2) { // resource
    hasKeys = 'resource_type' in node && 'data' in node;
    if (!hasKeys) {
      throw Error('Invalid Resource node, expected `resource_type` and `data`');
    }
    return {
      node_type: node.node_type,
      resource_type: node.resource_type,
      data: node.data,
    };
  }
  throw Error('Invalid node_type');
}

async function putGraph(graph) {
  verifyGraphShape(graph);
  const cid = await ipfs.dag.put(graph, options);
  return cid.toBaseEncodedString();
}

async function getGraph(cid, path = '') {
  const graph = await ipfs.dag.get(cid + path);
  return graph.value;
}

async function objToCid(obj) {
  const ser = DagCBOR.util.serialize(obj);
  const cid = await DagCBOR.util.cid(ser);
  return cid.toBaseEncodedString();
}

// replace all node ids with IPLD CIDs based on hash
// of the "bare" node
async function formatGraph(graph) {
  verifyGraphShape(graph);

  // for each of the nodes, change its id
  const { nodes, edges } = graph.elements;

  for (let i = 0; i < nodes.length; i += 1) {
    const oldId = nodes[i].data.id;
    const bare = verifyNodeShape(nodes[i].data);
    // eslint-disable-next-line no-await-in-loop
    const newId = await objToCid(bare);
    bare.id = newId;
    nodes[i] = { data: bare };

    // XXX: probably a better way to do this in cytoscape
    // replaces old node ID with new node ID
    for (let j = 0; j < edges.length; j += 1) {
      const dat = edges[j].data;
      const { source, target } = dat;
      if (source === oldId) {
        dat.source = newId;
      } else if (target === oldId) {
        dat.target = newId;
      }
    }
  }
  return graph;
}

// TODO(rustielin): disable lazy-loading for now for performance reasons
//                  we can just calculate graph element CID directly

// async function putGraph(graph) {
//   const hasKeys = 'elements' in graph && 'nodes' in graph.elements && 'edges' in graph.elements;
//   if (!hasKeys) {
//     throw Error('Invalid graph, expected elements: {nodes, edges}');
//   }

//   const putNodeProms = [];
//   // putEdgeProms = []
//   const putAndProm = (el, lst) => {
//     const prom = ipfs.dag.put(el, options);
//     lst.push(prom);
//   };
//   graph.elements.nodes.forEach((el) => putAndProm(el, putNodeProms));
//   // graph.elements.edges.forEach((el) => putAndProm(el, putEdgeProms))
//   const nodes = await Promise.all(putNodeProms);
//   // edges = await Promise.all(putEdgeProms)
//   const { edges } = graph.elements; // XXX: edges are lightweight and don't need lazy
//   const ipfsGraph = { elements: { nodes, edges } };
//   const cid = await ipfs.dag.put(ipfsGraph, options);
//   return cid.toBaseEncodedString();
// }

// async function getFullGraph(cid) {
//   const cgraph = await getGraph(cid);
//   const hasKeys = 'elements' in cgraph && 'nodes' in cgraph.elements && 'edges' in cgraph.elements;
//   if (!hasKeys) {
//     throw Error('Invalid CID for graph, expected elements: {nodes, edges}');
//   }
//   const nodeCIDs = cgraph.elements.nodes;
//   // edgeCIDs = cgraph.elements.edges
//   const getNodeProms = [];
//   // getEdgeProms = []
//   const getAndProm = (el, lst) => {
//     const prom = ipfs.dag.get(el);
//     lst.push(prom);
//   };
//   nodeCIDs.forEach((el) => getAndProm(el, getNodeProms));
//   // edgeCIDs.forEach((el) => getAndProm(el, getEdgeProms))
//   const vnodes = await Promise.all(getNodeProms);
//   // vedges = await Promise.all(getEdgeProms)
//   const ipfsGraph = { elements: { nodes: [], edges: [] } };
//   vnodes.forEach((el) => ipfsGraph.elements.nodes.push(el.value));
//   // vedges.forEach(el => ipfsGraph.elements.edges.push(el.value))
//   ipfsGraph.elements.edges.push(...cgraph.elements.edges);
//   return ipfsGraph;
// }

// verify that a list of node IDs are all CID and exist in the graph
function verifyNodeIds(graph, cids) {
  verifyGraphShape(graph);
  const nodeCids = new Set(graph.elements.nodes.map((el) => el.data.id));
  for (let i = 0; i < cids.length; i += 1) {
    const traversedNode = cids[i];
    if (!nodeCids.has(traversedNode)) {
      console.log(`Graph elements provided do not have node ${traversedNode}`);
      return false;
    }
  }
  return true;
}

// given a graph, its cid, and a list of
// node IDs, create and pin an IoK traversal state
async function putTraversalState(cid, graph, traversedList) {
  if (!Array.isArray(traversedList)) {
    throw Error('Expected `traversedList` to be an array');
  }

  const verified = verifyNodeIds(graph, traversedList);
  if (!verified) {
    throw Error(`Graph with CID ${cid} and traversal ${traversedList} INVALID!`);
  }

  // construct the traversal state obj
  traversedList.sort();
  const traversalState = { cid, traversedNodes: traversedList };
  const traversalCid = await ipfs.dag.put(traversalState, options);
  return traversalCid;
}

module.exports.putGraph = putGraph;
module.exports.getGraph = getGraph;
// module.exports.getFullGraph = getFullGraph;

module.exports.verifyNodeShape = verifyNodeShape;
module.exports.formatGraph = formatGraph;
module.exports.objToCid = objToCid;

module.exports.verifyNodeIds = verifyNodeIds;
module.exports.putTraversalState = putTraversalState;
