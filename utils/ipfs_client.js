lib = require('ipfs-cytoscape');

async function putGraph() {
    ret = await lib.putGraph(JSON.parse(process.env.GRAPH));
    console.log(ret);
}

async function getFullGraph() {
    ret = await lib.getFullGraph(process.env.CID);
    console.log(JSON.stringify(ret));
}

async function getGraph() {
    ret = await lib.getGraph(process.env.CID);
    console.log(JSON.stringify(ret));
}

async function objToCid() {
    ret = await lib.objToCid(JSON.parse(process.env.OBJ));
    console.log(ret);
}

async function formatGraph() {
    ret = await lib.formatGraph(JSON.parse(process.env.GRAPH));
    console.log(JSON.stringify(ret));
}

fname = process.env.FUNC;
if (fname === 'putGraph') {
    f = putGraph;
} else if (fname === 'getFullGraph') {
    f = getFullGraph;
} else if (fname === 'objToCid') {
    f = objToCid;
} else if (fname === 'formatGraph') {
    f = formatGraph;
} else if (fname === 'getGraph') {
    f = getGraph;
}

f();
