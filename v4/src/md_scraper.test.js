import { graphFromText } from './md_scraper'; // eslint-disable-line

function createTestNode(nodeType, name, id, resType, text, link) {
  if (nodeType === 1) {
    return {
      id: expect.toStartWith(id),
      name,
      node_type: nodeType,
    };
  }
  if (nodeType === 2) {
    return {
      data: {
        text, link,
      },
      id: expect.toStartWith(id),
      name,
      node_type: nodeType,
      resource_type: resType,
    };
  }
  return null;
}

function createTestEdge(id, source, target) {
  return {
    id: expect.toStartWith(id),
    source: expect.toStartWith(source),
    target: expect.toStartWith(target),
  };
}

// compare just the beginning for id hashes
expect.extend({
  toStartWith(received, beginning) {
    return {
      message: () => `${received} should equal ${beginning}`,
      pass: beginning.slice(0, 10) === (received.slice(0, 10)),
    };
  },
});

// Tests
describe('markdown scraper', () => {
  it('should parse an empty markdown', () => {
    expect(graphFromText('')).toEqual({
      nodes: [],
      edges: [],
    });
  });

  it('only description resource nodes', () => {
    expect(graphFromText('- FirstRes \n-SecondRes \nThirdRes')).toEqual({
      nodes: [
        createTestNode(2, 'FirstRes', '1e71a7e10dd511b4937b4de28', 1, 'FirstRes', ''),
        createTestNode(2, 'SecondRes', '4faea3d4eb412cea485e9e70', 1, 'SecondRes', ''),
        createTestNode(2, 'ThirdRes', 'c0dd146d647e4eeded368dcae', 1, 'ThirdRes', ''),
      ],
      edges: [],
    });
  });

  it('only link resource nodes', () => {
    expect(graphFromText(
      `- [linkTitle1](insertLink1) extra
      \n- [linkTitle2](insertLink2) extra text
      \n- [linkTitle3](insertLink3) extra text idk`,
    )).toEqual({
      nodes: [
        createTestNode(2, 'linkTitle1', '40f38118359d044116aa7954b8c223b', 2, 'linkTitle1', 'insertLink1'),
        createTestNode(2, 'linkTitle2', '4b9abb860dda2bc8fa41e2ed036c7fa', 2, 'linkTitle2', 'insertLink2'),
        createTestNode(2, 'linkTitle3', '8dfd191644db73fe0aebf493432ec81', 2, 'linkTitle3', 'insertLink3'),
      ],
      edges: [],
    });
  });

  it('only same level topic nodes', () => {
    expect(graphFromText('# First Topic \n# Second Topic \n# Third Topic')).toEqual({
      nodes: [
        createTestNode(1, 'First Topic', 'e00194285639baedc6dc17', null, null, null),
        createTestNode(1, 'Second Topic', '6890869a8baf91bbf01ef', null, null, null),
        createTestNode(1, 'Third Topic', 'dcd9cbfb54e9dbcff2', null, null, null),
      ],
      edges: [],
    });
  });

  it('same (higher) level topic nodes', () => {
    expect(graphFromText('### First Topic \n### Second Topic \n### Third Topic')).toEqual({
      nodes: [
        createTestNode(1, 'First Topic', 'e00194285639baedc6dc1', null, null, null),
        createTestNode(1, 'Second Topic', '6890869a8baf91bbf01e', null, null, null),
        createTestNode(1, 'Third Topic', 'dcd9cbfb54e9dbcff2', null, null, null),
      ],
      edges: [],
    });
  });

  it('nested topic nodes', () => {
    expect(graphFromText(
      '# First Topic \n# SecondTopic \n## Second Topic Nested \n### Second Topic Nested Nested \n# Third Topic',
    )).toEqual({
      nodes: [
        createTestNode(1, 'First Topic', 'e00194285639baedc6dc1785038', null, null, null),
        createTestNode(1, 'SecondTopic', 'e211c01f4db8f6727eb99275b69d646ece', null, null, null),
        createTestNode(1, 'Second Topic Nested', '7f6a3d4c56d4201bb2fcda0f1b7', null, null, null),
        createTestNode(1, 'Second Topic Nested Nested', 'b786e851cddca7fa4379f', null, null, null),
        createTestNode(1, 'Third Topic', 'dcd9cbfb54e9dbcff23b828abf4d5382', null, null, null),
      ],
      edges: [
        createTestEdge('44b392290a2160bcf4', '7f6a3d4c56d4201bb2f', 'e211c01f4db8f6727eb99275b'),
        createTestEdge('acee519799f614a9d6', 'b786e851cddca7fa437', '7f6a3d4c56d4201bb2fcda0f1'),
      ],
    });
  });

  it('mix of resource and topic nodes', () => {
    expect(graphFromText(
      `# Topic1 \n- [Topic1ResLink](Link1)
      \n## Topic2 \n- Topic2ResDesc 
      \n## Topic2Nested`,
    )).toEqual({
      nodes: [
        createTestNode(1, 'Topic1', 'ddc41a6256b8d5582119ff7b4b702d5', null, null, null),
        createTestNode(2, 'Topic1ResL', '9d631c4a21315dafc31e8b15c47d', 2, 'Topic1ResLink', 'Link1'),
        createTestNode(1, 'Topic2', '508f75c1fd41d83b3a09121502965e8d', null, null, null),
        createTestNode(2, 'Topic2ResD', '85388daed79a483b01c67', 1, 'Topic2ResDesc', ''),
        createTestNode(1, 'Topic2Nested', '8a95cfed41193f52443d0d5782b', null, null, null),
      ],
      edges: [
        createTestEdge('855b63c2a3f3d9c2fdc620fdb68', '9d631c4a21315dafc31e8b15c4', 'ddc41a6256b8d5582119ff7b'),
        createTestEdge('3902a3caa209498566943ed8aca', '508f75c1fd41d83b3a09121502', 'ddc41a6256b8d5582119ff7b'),
        createTestEdge('53d69247e0eae30dd3381af564e', '85388daed79a483b01c67b742a', '508f75c1fd41d83b3a091215'),
        createTestEdge('b0ebf88195fe7ea87b07bd26e3e', '8a95cfed41193f52443d0d5782', 'ddc41a6256b8d5582119ff7b'),
      ],
    });
  });
});
