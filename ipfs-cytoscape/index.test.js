const lib = require('./index.js');
const tgraph = require('./testGraph.js');

const { graph } = tgraph;
const graphCid = tgraph.cid;

// test depends on connection speed with public ipfs node
// so might be flaky; timeout at 60s
jest.setTimeout(60000);
test('putGraph completes with CID', async () => {
  const cid = await lib.putGraph(graph);
  expect(cid).toEqual(graphCid);
});

test('getGraph completes with exact match', async () => {
  const retGraph = await lib.getGraph(graphCid);
  expect(retGraph).toHaveProperty(['elements', 'nodes']);
  expect(retGraph).toHaveProperty(['elements', 'edges']);
  expect(retGraph).toEqual(graph);
});
