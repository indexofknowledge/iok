//Initiate ipfs and CID instance
const ipfsClient = require('ipfs-http-client');

//Connecting ipfs instance to infura node
const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', apiPath: '/api/v0' });

async function putGraph(graph) {
    let hasKeys = "elements" in graph && "nodes" in graph.elements && "edges" in graph.elements
    if (!hasKeys) {
        throw Error("Invalid graph, expected elements: {nodes, edges}")
    }
    options = { format: 'dag-cbor', hashAlg: 'sha2-256', pin: 'true' }
    putNodeProms = []
    putEdgeProms = []
    putAndProm = (el, lst) => {
        prom = ipfs.dag.put(el, options);
        lst.push(prom);
    }
    graph.elements.nodes.forEach((el) => putAndProm(el, putNodeProms))
    graph.elements.edges.forEach((el) => putAndProm(el, putEdgeProms))
    nodes = await Promise.all(putNodeProms)
    edges = await Promise.all(putEdgeProms)
    ipfsGraph = { "elements": { nodes, edges } }
    cid = await ipfs.dag.put(ipfsGraph, options)
    return cid.toBaseEncodedString();
}

// XXX: infura does not support params to dag_get
async function getGraph(cid, path = "") {
    // get cid or subgraph root cid
    // so we don't have to load in the entire IoK at once, only top level nodes and edges CIDs
    const graph = await ipfs.dag.get(cid + path);
    return graph.value
}

async function getFullGraph(cid) {
    cgraph = await getGraph(cid)
    let hasKeys = "elements" in cgraph && "nodes" in cgraph.elements && "edges" in cgraph.elements
    if (!hasKeys) {
        throw Error("Invalid CID for graph, expected elements: {nodes, edges}")
    }
    nodeCIDs = cgraph.elements.nodes
    edgeCIDs = cgraph.elements.edges
    getNodeProms = []
    getEdgeProms = []
    getAndProm = (el, lst) => {
        prom = ipfs.dag.get(el)
        lst.push(prom)
    }
    nodeCIDs.forEach((el) => getAndProm(el, getNodeProms))
    edgeCIDs.forEach((el) => getAndProm(el, getEdgeProms))
    vnodes = await Promise.all(getNodeProms)
    vedges = await Promise.all(getEdgeProms)
    ipfsGraph = { "elements": { "nodes": [], "edges": [] } }
    vnodes.forEach(el => ipfsGraph.elements.nodes.push(el.value))
    vedges.forEach(el => ipfsGraph.elements.edges.push(el.value))
    return ipfsGraph
}

module.exports.putGraph = putGraph;
module.exports.getGraph = getGraph;
module.exports.getFullGraph = getFullGraph;



