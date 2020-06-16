import childProcess from 'child_process'; // eslint-disable-line
import { jsGraphFromText } from './md_scraper'; // eslint-disable-line

const wrapData = (x) => ({ data: x });
const path = require('path');

function createTestNode(nodeType, name, id, resType, text, link) {
  if (nodeType === 1) {
    return wrapData({
      id: expect.toStartWith(id),
      name,
      node_type: nodeType,
    });
  }
  if (nodeType === 2) {
    return wrapData({
      data: {
        text, link,
      },
      id: expect.toStartWith(id),
      name,
      node_type: nodeType,
      resource_type: resType,
    });
  }
  return null;
}

function createTestEdge(id, source, target) {
  return wrapData({
    id: expect.toStartWith(id),
    source: expect.toStartWith(source),
    target: expect.toStartWith(target),
  });
}

// compare just the beginning for id hashes
expect.extend({
  toStartWith(received, beginning) {
    // if (beginning.length !== 10) console.error(`${beginning} is length ${beginning.length}`)
    return {
      message: () => `${received} should equal ${beginning}`,
      pass: beginning.slice(0, 10) === (received.slice(0, 10)),
    };
  },
});

function pyGraphFromText(text) {
  const output = childProcess.spawnSync(
    'pipenv',
    ['run', 'python3', '-m', 'mdscraper', '-'],
    {
      cwd: path.join(__dirname, '/../../src'),
      input: text,
    },
  );
  if (output.status !== 0) {
    throw new Error(`Python processes exited with code ${output.status}
      and error message ${output.error}. stderr was ${output.stderr}`);
  }
  return JSON.parse(output.stdout.toString());
}

// Tests
function testMarkdownScraper(name, graphFromText) {
  describe(name, () => {
    it('should parse an empty markdown', () => {
      expect(graphFromText('')).toEqual({
        nodes: [],
        edges: [],
      });
    });

    it('should parse a single node', () => {
      expect(graphFromText('Node')).toEqual({
        nodes: [
          createTestNode(2, 'Node', '7ab42597ae', 1, 'Node', ''),
        ],
        edges: [],
      });
    });

    it('only description resource nodes', () => {
      expect(graphFromText('- FirstRes \n-SecondRes \nThirdRes')).toEqual({
        nodes: [
          createTestNode(2, 'FirstRes', '8a16879556', 1, 'FirstRes', ''),
          createTestNode(2, 'SecondRes', 'cded3d6d39', 1, 'SecondRes', ''),
          createTestNode(2, 'ThirdRes', '1a35511639', 1, 'ThirdRes', ''),
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
          createTestNode(2, 'linkTitle1', 'dbb99b9f85', 2, 'linkTitle1', 'insertLink1'),
          createTestNode(2, 'linkTitle2', 'c655b93dff', 2, 'linkTitle2', 'insertLink2'),
          createTestNode(2, 'linkTitle3', '55cc6a45ea', 2, 'linkTitle3', 'insertLink3'),
        ],
        edges: [],
      });
    });

    it('only same level topic nodes', () => {
      expect(graphFromText('# First Topic \n# Second Topic \n# Third Topic')).toEqual({
        nodes: [
          createTestNode(1, 'First Topic', 'fc56b16568', null, null, null),
          createTestNode(1, 'Second Topic', 'faeb199ae3', null, null, null),
          createTestNode(1, 'Third Topic', '00006a770b', null, null, null),
        ],
        edges: [],
      });
    });

    it('same (higher) level topic nodes', () => {
      expect(graphFromText('### First Topic \n### Second Topic \n### Third Topic')).toEqual({
        nodes: [
          createTestNode(1, 'First Topic', 'fc56b16568', null, null, null),
          createTestNode(1, 'Second Topic', 'faeb199ae3', null, null, null),
          createTestNode(1, 'Third Topic', '00006a770b', null, null, null),
        ],
        edges: [],
      });
    });

    it('nested topic nodes', () => {
      expect(graphFromText(
        '# First Topic \n# SecondTopic \n## Second Topic Nested \n### Second Topic Nested Nested \n# Third Topic',
      )).toEqual({
        nodes: [
          createTestNode(1, 'First Topic', 'fc56b16568', null, null, null),
          createTestNode(1, 'SecondTopic', '6763fa83c2', null, null, null),
          createTestNode(1, 'Second Topic Nested', '4d5775b756', null, null, null),
          createTestNode(1, 'Second Topic Nested Nested', '1b5e1a9bf8', null, null, null),
          createTestNode(1, 'Third Topic', '00006a770b', null, null, null),
        ],
        edges: [
          createTestEdge('10f8d7bc5f', '4d5775b756', '6763fa83c2'),
          createTestEdge('8c9f06a735', '1b5e1a9bf8', '4d5775b756'),
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
          createTestNode(1, 'Topic1', 'd59f7ae6a9', null, null, null),
          createTestNode(2, 'Topic1ResL', '4e380a6f1e', 2, 'Topic1ResLink', 'Link1'),
          createTestNode(1, 'Topic2', '95d5b9038c', null, null, null),
          createTestNode(2, 'Topic2ResD', '1c0b28ed7c', 1, 'Topic2ResDesc', ''),
          createTestNode(1, 'Topic2Nested', '7dc5f5a8d8', null, null, null),
        ],
        edges: [
          createTestEdge('1e646b414d', '4e380a6f1e', 'd59f7ae6a9'),
          createTestEdge('ef3c796c13', '95d5b9038c', 'd59f7ae6a9'),
          createTestEdge('673fe87639', '1c0b28ed7c', '95d5b9038c'),
          createTestEdge('07c7bdfba8', '7dc5f5a8d8', 'd59f7ae6a9'),
        ],
      });
    });
  });
}

testMarkdownScraper('Javascript markdown scraper', jsGraphFromText);
testMarkdownScraper('Python markdown scraper', pyGraphFromText);
