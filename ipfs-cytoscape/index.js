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

// NOTE: only PUTs the minimum keys for each node, as calculated by verifyNodeShape
async function putGraph(graph) {
  verifyGraphShape(graph);
  const options = { format: 'dag-cbor', hashAlg: 'sha2-256', pin: 'true' };
  const putNodeProms = [];

  // PUT each individual node
  const putAndProm = (el, lst) => {
    const prom = ipfs.dag.put(el, options);
    lst.push(prom);
  };
  const graphNodes = graph.elements.nodes;
  for (let i = 0; i < graphNodes.length; i += 1) {
    const dat = graphNodes[i].data;
    putAndProm(verifyNodeShape(dat), putNodeProms);
  }
  const nodes = await Promise.all(putNodeProms);

  const { edges } = graph.elements;
  const ipfsGraph = { elements: { nodes, edges } };
  const cid = await ipfs.dag.put(ipfsGraph, options);
  return cid.toBaseEncodedString();
}

async function getGraph(cid, path = '') {
  // get cid or subgraph root cid
  // so we don't have to load in the entire IoK at once, only top level nodes and edges CIDs
  const graph = await ipfs.dag.get(cid + path);
  const nodeCids = graph.value.elements.nodes;
  for (let i = 0; i < nodeCids.length; i += 1) {
    graph.value.elements.nodes[i] = nodeCids[i].toBaseEncodedString();
  }
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

async function getFullGraph(cid) {
  const cgraph = await getGraph(cid);
  const hasKeys = 'elements' in cgraph && 'nodes' in cgraph.elements && 'edges' in cgraph.elements;
  if (!hasKeys) {
    throw Error('Invalid CID for graph, expected elements: {nodes, edges}');
  }

  // get node data by their CID
  const nodeCIDs = cgraph.elements.nodes;
  const getNodeProms = [];
  const getAndProm = (el, lst) => {
    const prom = ipfs.dag.get(el);
    lst.push(prom);
  };
  nodeCIDs.forEach((el) => getAndProm(el, getNodeProms));
  const vnodes = await Promise.all(getNodeProms);

  // construct a graph to return
  const ipfsGraph = { elements: { nodes: [], edges: [] } };
  vnodes.forEach((el) => ipfsGraph.elements.nodes.push({ data: el.value }));
  ipfsGraph.elements.edges.push(...cgraph.elements.edges);

  // populate the node IDs with their CID
  for (let i = 0; i < nodeCIDs.length; i += 1) {
    ipfsGraph.elements.nodes[i].data.id = nodeCIDs[i];
  }

  return ipfsGraph;
}

module.exports.putGraph = putGraph;
module.exports.getGraph = getGraph;
module.exports.getFullGraph = getFullGraph;

module.exports.verifyNodeShape = verifyNodeShape;

module.exports.formatGraph = formatGraph;
module.exports.objToCid = objToCid;
