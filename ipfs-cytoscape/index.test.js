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

test('putGraph and getGraph preserve extra keys', async () => {
  const graphCpy = JSON.parse(JSON.stringify(graph));
  const newField = 'abc';
  for (let i = 0; i < graphCpy.elements.nodes.length; i += 1) {
    graphCpy.elements.nodes[i].data[newField] = 'xyz';
  }
  const cid = await lib.putGraph(graphCpy);

  const retGraph = await lib.getGraph(cid);
  for (let j = 0; j < retGraph.elements.nodes.length; j += 1) {
    const node = retGraph.elements.nodes[j];
    expect(node).toHaveProperty(['data', newField]);
  }
});

test('formatGraph calculates IDs and only replaces necessary keys', async () => {
  const dummyId = 'dummyId';
  const dummyGraph = {
    elements: {
      nodes: [{
        data: {
          abc: 'xyz', id: dummyId, node_type: 1, name: 'dummyName',
        },
      }],
      edges: [{ data: { source: dummyId, target: 'dummy2' } }],
    },
  };
  const formattedGraph = await lib.formatGraph(dummyGraph);
  // IDs changed
  expect(formattedGraph.elements.nodes[0].data.id).toEqual(expect.not.stringMatching(dummyId));
  expect(formattedGraph.elements.edges[0].data.source).toEqual(expect.not.stringMatching(dummyId));
  expect(formattedGraph.elements.edges[0].data.target).toEqual(expect.not.stringMatching(dummyId));
  // extra key was persisted
  expect(formattedGraph.elements.nodes[0].data).toHaveProperty(['abc']);
});
