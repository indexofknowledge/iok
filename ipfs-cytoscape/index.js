// Initiate ipfs and CID instance
const IpfsClient = require('ipfs-http-client');
const DagCBOR = require('ipld-dag-cbor');

// Connecting ipfs instance to infura node
const ipfs = new IpfsClient({
  host: 'ipfs.infura.io', port: '5001', protocol: 'https', apiPath: '/api/v0',
});

function verifyGraphShape(graph) {
  const hasKeys = 'elements' in graph && 'nodes' in graph.elements && 'edges' in graph.elements;
  if (!hasKeys) {
    throw Error('Invalid graph, expected elements: {nodes, edges}');
  }
}

/**
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
  let hasKeys = 'data' in node && 'node_type' in node.data;
  if (!hasKeys) {
    throw Error('Invalid node, expected data: {node_type}');
  }

  if (node.data.node_type === 1) { // topic
    hasKeys = 'name' in node.data;
    if (!hasKeys) {
      throw Error('Invalid Topic node, expected `name`');
    }
    return { data: { name: node.data.name, node_type: node.data.node_type } };
  }

  if (node.data.node_type === 2) { // resource
    hasKeys = 'resource_type' in node.data && 'data' in node.data;
    if (!hasKeys) {
      throw Error('Invalid Resource node, expected `resource_type` and `data`');
    }
    return {
      data: {
        node_type: node.data.node_type,
        resource_type: node.data.resource_type,
        data: node.data.data,
      },
    };
  }
  throw Error('Invalid node_type');
}

async function putGraph(graph) {
  verifyGraphShape(graph);
  const options = { format: 'dag-cbor', hashAlg: 'sha2-256', pin: 'true' };
  const putNodeProms = [];
  // putEdgeProms = []
  const putAndProm = (el, lst) => {
    const prom = ipfs.dag.put(el, options);
    lst.push(prom);
  };
  graph.elements.nodes.forEach((el) => putAndProm(verifyNodeShape(el), putNodeProms));
  // graph.elements.edges.forEach((el) => putAndProm(el, putEdgeProms))
  const nodes = await Promise.all(putNodeProms);
  // edges = await Promise.all(putEdgeProms)
  const { edges } = graph.elements; // XXX: edges are lightweight and don't need lazy
  const ipfsGraph = { elements: { nodes, edges } };
  const cid = await ipfs.dag.put(ipfsGraph, options);
  return cid.toBaseEncodedString();
}

async function getGraph(cid, path = '') {
  // get cid or subgraph root cid
  // so we don't have to load in the entire IoK at once, only top level nodes and edges CIDs
  const graph = await ipfs.dag.get(cid + path);
  return graph.value;
}

async function getFullGraph(cid) {
  const cgraph = await getGraph(cid);
  const hasKeys = 'elements' in cgraph && 'nodes' in cgraph.elements && 'edges' in cgraph.elements;
  if (!hasKeys) {
    throw Error('Invalid CID for graph, expected elements: {nodes, edges}');
  }
  const nodeCIDs = cgraph.elements.nodes;
  // edgeCIDs = cgraph.elements.edges
  const getNodeProms = [];
  // getEdgeProms = []
  const getAndProm = (el, lst) => {
    const prom = ipfs.dag.get(el);
    lst.push(prom);
  };
  nodeCIDs.forEach((el) => getAndProm(el, getNodeProms));
  // edgeCIDs.forEach((el) => getAndProm(el, getEdgeProms))
  const vnodes = await Promise.all(getNodeProms);
  // vedges = await Promise.all(getEdgeProms)
  const ipfsGraph = { elements: { nodes: [], edges: [] } };
  vnodes.forEach((el) => ipfsGraph.elements.nodes.push(el.value));

  if (nodeCIDs.length !== ipfsGraph.elements.nodes.length) {
    throw Error('Uh oh! Some GETs failed');
  }

  // node ID's are stored implicitly as their IPLD CID's, so
  // reconstruct them here
  for (let i = 0; i < nodeCIDs.length; i += 1) {
    const nodeId = nodeCIDs[i];
    ipfsGraph.elements.nodes[i].data.id = nodeId.toBaseEncodedString();
  }
  // vedges.forEach(el => ipfsGraph.elements.edges.push(el.value))
  ipfsGraph.elements.edges.push(...cgraph.elements.edges);
  return ipfsGraph;
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
    const bare = verifyNodeShape(nodes[i]);
    // eslint-disable-next-line no-await-in-loop
    const newId = await objToCid(bare);
    bare.data.id = newId;
    nodes[i] = bare;

    // XXX: probably a better way to do this in cytoscape
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

module.exports.putGraph = putGraph;
module.exports.getGraph = getGraph;
module.exports.getFullGraph = getFullGraph;

module.exports.formatGraph = formatGraph;
module.exports.objToCid = objToCid;
