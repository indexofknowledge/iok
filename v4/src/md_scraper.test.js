/* eslint-disable */
import { graph_from_text } from './md_scraper'

describe('markdown scraper', () => {

  it('should parse an empty markdown', () => {
    expect(graph_from_text('')).toEqual({
      nodes: [],
      edges: [],
    });
  });

  it('only description resource nodes', () => {
    expect(graph_from_text(
      '- FirstRes \n-SecondRes \nThirdRes'
    )).toEqual({
      nodes: [
        {
          "data": {
            "text": "FirstRes",
            "link": "",
          },
          "id": "1e71a7e10dd511b4937b4de28665cb2cdefcf99526e987931a355ab9ce82809a",
          "name": "FirstRes",
          "node_type": 2,
          "resource_type": 1,
        },
        {
          "data": {
            "text": "SecondRes",
            "link": "",
          },
          "id": "4faea3d4eb412cea485e9e70c5f8a64b4af3690b5a9c9488bc7a3a0e065459d7",
          "name": "SecondRes",
          "node_type": 2,
          "resource_type": 1,
        },
        {
          "data": {
            "text": "ThirdRes",
            "link": "",
          },
          "id": "c0dd146d647e4eeded368dcae8030c55bbf1ffa7516399deca7b918c82e2c343",
          "name": "ThirdRes",
          "node_type": 2,
          "resource_type": 1,
        },
      ],
      edges: [],
    })
  });

  it('only link resource nodes', () => {
    expect(graph_from_text(
      `- [linkTitle1](insertLink1) extra
      \n- [linkTitle2](insertLink2) extra text
      \n- [linkTitle3](insertLink3) extra text idk`
    )).toEqual({
      nodes: [
        {
          "data": {
            "link": "insertLink1",
            "text": "linkTitle1",
          },
          "id": "40f38118359d044116aa7954b8c223b50081b62f26384b0f082223739e216032",
          "name": "linkTitle1",
          "node_type": 2,
          "resource_type": 2,
        },
        {
          "data": {
            "link": "insertLink2",
            "text": "linkTitle2",
          },
          "id": "4b9abb860dda2bc8fa41e2ed036c7fa6c19038ef694917424343d328efa6c6b7",
          "name": "linkTitle2",
          "node_type": 2,
          "resource_type": 2,
        },
        {
          "data": {
            "link": "insertLink3",
            "text": "linkTitle3",
          },
          "id": "8dfd191644db73fe0aebf493432ec81b9fe9005124633e51de49889420cefb18",
          "name": "linkTitle3",
          "node_type": 2,
          "resource_type": 2,
        },
      ],
      edges: [],
    });
  });

  it('only same level topic nodes', () => {
    expect(graph_from_text(
      '# First Topic \n# Second Topic \n# Third Topic'
    )).toEqual({
      "nodes": [
        {
          "id": "e00194285639baedc6dc178503819739df8fc8bd504bd83d115bb3f64c530d3a",
          "name": "First Topic",
          "node_type": 1,
        },
        {
          "id": "6890869a8baf91bbf01ef426bcf38b638e13409df7ff490ddd05c68d6d09d2c8",
          "name": "Second Topic",
          "node_type": 1,
        },
        {
          "id": "dcd9cbfb54e9dbcff23b828abf4d538224b0005d892beae877872c007eea3f14",
          "name": "Third Topic",
          "node_type": 1,
        },
      ],
      edges: []
    })
  });

  it('same (higher) level topic nodes', () => {
    expect(graph_from_text(
      '### First Topic \n### Second Topic \n### Third Topic'
    )).toEqual({
      "nodes": [
        {
          "id": "e00194285639baedc6dc178503819739df8fc8bd504bd83d115bb3f64c530d3a",
          "name": "First Topic",
          "node_type": 1,
        },
        {
          "id": "6890869a8baf91bbf01ef426bcf38b638e13409df7ff490ddd05c68d6d09d2c8",
          "name": "Second Topic",
          "node_type": 1,
        },
        {
          "id": "dcd9cbfb54e9dbcff23b828abf4d538224b0005d892beae877872c007eea3f14",
          "name": "Third Topic",
          "node_type": 1,
        },
      ],
      edges: []
    })
  });

  it('nested topic nodes', () => {
    expect(graph_from_text(
      '# FirstTopic \n# SecondTopic \n## Second Topic Nested \n### Second Topic Nested Nested \n# Third Topic'
    )).toEqual({
      nodes: [{
        id: "22b99d04ec216612ca648389a1bc45b4229ba77bd5d131bc49022f18a6d04482",
        name: "FirstTopic",
        node_type: 1,
      },
      {
        "id": "e211c01f4db8f6727eb99275b69d646ece818cfe2e6a0ce53c40010c3bf5168a",
        "name": "SecondTopic",
        "node_type": 1,
      },
      {
        "id": "7f6a3d4c56d4201bb2fcda0f1b73e46022d5fb3655c5faa73da4de852418d2c2",
        "name": "Second Topic Nested",
        "node_type": 1,
      },
      {
        "id": "b786e851cddca7fa4379fb7873c5b6a36b1bfc7603084d38b6e08b43a97b9dd2",
        "name": "Second Topic Nested Nested",
        "node_type": 1,
      },
      {
        "id": "dcd9cbfb54e9dbcff23b828abf4d538224b0005d892beae877872c007eea3f14",
        "name": "Third Topic",
        "node_type": 1,
      },
      ],
      edges: [
        {
          "id": "44b392290a2160bcf448693e013b409e0824c4f63f2e7b13239cf1dcfaf32ac2",
          "source": "7f6a3d4c56d4201bb2fcda0f1b73e46022d5fb3655c5faa73da4de852418d2c2",
          "target": "e211c01f4db8f6727eb99275b69d646ece818cfe2e6a0ce53c40010c3bf5168a",
        },
        {
          "id": "acee519799f614a9d6ab1a8783c5e2b48309c1da80bdf9d7120dcb2321f0b901",
          "source": "b786e851cddca7fa4379fb7873c5b6a36b1bfc7603084d38b6e08b43a97b9dd2",
          "target": "7f6a3d4c56d4201bb2fcda0f1b73e46022d5fb3655c5faa73da4de852418d2c2",
        },
      ]
    })
  });

  it('mix of resource and topic nodes', () => {
    expect(graph_from_text(
      `# Topic1 \n- [Topic1Resource1Link](Link3)
      \n## Topic2 Nested \n- Topic2NestResource1Desc 
      \n## Topic2 Nested 2`
    )).toEqual({
      nodes: [
        {
          "id": "ddc41a6256b8d5582119ff7b4b702d5956f912df3a0eaacecd50ab393d6f5bea",
          "name": "Topic1",
          "node_type": 1,
        },
        {
          "data": {
            "link": "Link3",
            "text": "Topic1Resource1Link",
          },
          "id": "4a0b9d569b364e252ad9b055fa6e77d73e2ee87614a7b7c714551bc4397bb128",
          "name": "Topic1Reso",
          "node_type": 2,
          "resource_type": 2,
        },
        {
          "id": "6a89618a01641f4d0abf0905c8523ad2689cf645a044c3bc3234a3597999d388",
          "name": "Topic2 Nested",
          "node_type": 1,
        },
        {
          "data": {
            "link": "",
            "text": "Topic2NestResource1Desc",
          },
          "id": "e4d4054a242ece026c4f4711b45068e535694794461649c21bbafbbc99964a6a",
          "name": "Topic2Nest",
          "node_type": 2,
          "resource_type": 1,
        },
        {
          "id": "fcfc46e167d8f04d0d142b9891cc35b1a861bdfc0b6ef581d57f72b340121227",
          "name": "Topic2 Nested 2",
          "node_type": 1,
        },
      ],
      edges: [
        {
          "id": "88479500733f77e49f943e18782a50c74e3feb418c8d4c0f9be97dd74572d391",
          "source": "4a0b9d569b364e252ad9b055fa6e77d73e2ee87614a7b7c714551bc4397bb128",
          "target": "ddc41a6256b8d5582119ff7b4b702d5956f912df3a0eaacecd50ab393d6f5bea",
        },
        {
          "id": "42017da84ea3807ba0df9ae4c9d7263a4d733595b21232dbf8f6c0a7b965c293",
          "source": "6a89618a01641f4d0abf0905c8523ad2689cf645a044c3bc3234a3597999d388",
          "target": "ddc41a6256b8d5582119ff7b4b702d5956f912df3a0eaacecd50ab393d6f5bea",
        },
        {
          "id": "4fb4116b612ba287b24a8b5142814b125a6dd4e5eb9c9b3faf746d10eec1f6f5",
          "source": "e4d4054a242ece026c4f4711b45068e535694794461649c21bbafbbc99964a6a",
          "target": "6a89618a01641f4d0abf0905c8523ad2689cf645a044c3bc3234a3597999d388",
        },
        {
          "id": "496a801f39a547028cc7af69fa4308eb04cf5e4ddbc6bf44c771a64995c44389",
          "source": "fcfc46e167d8f04d0d142b9891cc35b1a861bdfc0b6ef581d57f72b340121227",
          "target": "ddc41a6256b8d5582119ff7b4b702d5956f912df3a0eaacecd50ab393d6f5bea",
        },
      ],
    });
  });

});