// Initiate ipfs and CID instance
const IpfsClient = require('ipfs-http-client');
const DagCBOR = require('ipld-dag-cbor');

// Connecting ipfs instance to infura node
const ipfs = new IpfsClient({
  host: 'ipfs.infura.io', port: '5001', protocol: 'https', apiPath: '/api/v0',
});

async function putGraph(graph) {
  const hasKeys = 'elements' in graph && 'nodes' in graph.elements && 'edges' in graph.elements;
  if (!hasKeys) {
    throw Error('Invalid graph, expected elements: {nodes, edges}');
  }
  const options = { format: 'dag-cbor', hashAlg: 'sha2-256', pin: 'true' };
  const putNodeProms = [];
  // putEdgeProms = []
  const putAndProm = (el, lst) => {
    const prom = ipfs.dag.put(el, options);
    lst.push(prom);
  };
  graph.elements.nodes.forEach((el) => putAndProm(el, putNodeProms));
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
  // vedges.forEach(el => ipfsGraph.elements.edges.push(el.value))
  ipfsGraph.elements.edges.push(...cgraph.elements.edges);
  return ipfsGraph;
}

async function objToCid(obj) {
  const ser = DagCBOR.util.serialize(obj);
  const cid = await DagCBOR.util.cid(ser);
  return cid.toBaseEncodedString();
}

module.exports.putGraph = putGraph;
module.exports.getGraph = getGraph;
module.exports.getFullGraph = getFullGraph;

module.exports.objToCid = objToCid;
