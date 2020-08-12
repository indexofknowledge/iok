/* eslint-disable no-console */
// Initiate ipfs and CID instance
const IpfsClient = require('ipfs-http-client');
const DagCBOR = require('ipld-dag-cbor');

const multicodec = require('multicodec');
const multihashing = require('multihashing');
const CID = require('cids');

// Connecting ipfs instance to infura node
const ipfs = new IpfsClient({
  host: 'ipfs.infura.io', port: '5001', protocol: 'https', apiPath: '/api/v0',
});

const options = { format: 'dag-cbor', hashAlg: 'sha2-256', pin: 'true' };

/**
 * Verify a given object is a node in cytoscape form
 * and return only its bare minimum fields. This is useful
 * for consistency of node ID calculation by CID.
 *
 * All nodes should contain `node_type` and `id`.
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

/**
 * Given a graph, verifies it's in cytoscape graph shape (elements: { nodes, edges })
 * and also that the nodes have the minimum fields required per IoK graph format.
 * NOTE: This does not verify node IDs are calculated correctly or whether edges are valid.
 * @param {*} graph
 */
function verifyGraphShape(graph) {
  const hasKeys = 'elements' in graph && 'nodes' in graph.elements && 'edges' in graph.elements;
  if (!hasKeys) {
    throw Error('Invalid graph, expected elements: {nodes, edges}');
  }
  const { nodes } = graph.elements;
  for (let i = 0; i < nodes.length; i += 1) {
    verifyNodeShape(nodes[i].data);
  }
}

/**
 * Given a graph of the right shape, pins it to IPFS and returns
 * the corresponding CID.
 * @param {*} graph
 */
async function putGraph(graph) {
  verifyGraphShape(graph);
  const cid = await ipfs.dag.put(graph, options);
  return cid.toBaseEncodedString();
}

/**
 * Given a CID, fetches the backing object from IPFS. An optional
 * `path` parameter is optional, and can be used for debugging.
 * @param {*} cid
 * @param {*} path
 */
async function getGraph(cid, path = '') {
  const graph = await ipfs.dag.get(cid + path);
  return graph.value;
}

/**
 * Given a CBOR-serializable JSON object, calculate its CID.
 * @param {*} obj
 */
function objToCid(obj) {
  const ser = DagCBOR.util.serialize(obj);

  const multihash = multihashing(ser, DagCBOR.defaultHashAlg)
  const codecName = multicodec.print[DagCBOR.codec]
  const cid = new CID(1, codecName, multihash)

  return cid.toBaseEncodedString();
}

/**
 * Given a graph, verify it's the right shape and also recalculate
 * all node IDs based on CID of each's node's minimum keys.
 * @param {*} graph
 */
async function formatGraph(graph) {
  verifyGraphShape(graph);

  // for each of the nodes, change its ID
  const { nodes, edges } = graph.elements;
  for (let i = 0; i < nodes.length; i += 1) {
    const oldId = nodes[i].data.id;
    const bare = verifyNodeShape(nodes[i].data);
    // eslint-disable-next-line no-await-in-loop
    const newId = await objToCid(bare);
    nodes[i].data.id = newId;

    // XXX: probably a better way to do this in cytoscape
    // replaces old node ID with new node ID for each edge
    // NOTE: this does not work for self-edges
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

/**
 * Verify that the given list of node IDs all exist in the graph. This is useful
 * for traversal verification, since an Iok traversal is just a set of node IDs, not
 * necessarily fringe or representing a full subtree.
 * @param {*} graph
 * @param {*} ids
 */
function verifyNodeIds(graph, ids) {
  verifyGraphShape(graph);
  const nodeIds = new Set(graph.elements.nodes.map((el) => el.data.id));
  for (let i = 0; i < ids.length; i += 1) {
    const traversedNode = ids[i];
    if (!nodeIds.has(traversedNode)) {
      console.log(`Graph elements provided do not have node ${traversedNode}`);
      return false;
    }
  }
  return true;
}

/**
 * Given a graph, its CID, and a list of node IDs, create and pin an IoK traversal
 * state.
 * @param {*} cid
 * @param {*} graph
 * @param {*} traversedList
 */
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
