lib = require('ipfs-cytoscape');

async function putGraph() {
    ret = await lib.putGraph(JSON.parse(process.env.GRAPH));
    console.log(ret);
}

async function getFullGraph() {
    ret = await lib.getFullGraph(process.env.CID);
    console.log(JSON.stringify(ret));
}

fname = process.env.FUNC;
if (fname === 'putGraph') {
    f = putGraph;
} else if (fname === 'getFullGraph') {
    f = getFullGraph;
}

f();
