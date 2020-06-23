import {
  addNode, editNode, deleteNode, mergeNode,
} from '../actions';
import graph from './graph';

function edge(id, source, target) {
  return {
    data: { id, source, target },
  };
}

function node(id, name) {
  if (name) {
    if (name.startsWith('TOPIC')) {
      return {
        data: { id, name, node_type: 1 },
      };
    }
    if (name.startsWith('RES')) {
      return {
        data: { id, data: { text: name }, node_type: 2 },
      };
    }
    throw new Error('Node name should start with TOPIC or RES');
  } else {
    return { data: { id } };
  }
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

const sw = (x) => expect.toStartWith(x);

describe('graphs reducer', () => {
  it('should return the initial state', () => {
    expect(graph(undefined, {})).toEqual({});
  });

  it('should handle ADD_NODE', () => {
    expect(graph({}, addNode(null, { id: 'test', name: 'TOPIC1', node_type: 1 })))
      .toEqual({ nodes: [node('test', 'TOPIC1')] });

    expect(graph({ nodes: [node('test')] }, addNode(null, { id: 'another' })))
      .toEqual({ nodes: [node('test'), node('another')] });

    expect(graph({ nodes: [node('test')] }, addNode('test', { id: 'another' })))
      .toEqual({
        nodes: [node('test'), node('another')],
        edges: [edge(sw('9bb5bde1a74'), 'another', 'test')],
      });
  });

  it('should handle EDIT_NODE', () => {
    expect(graph({ nodes: [node('test', 'RESabc')] }, editNode('test', { data: { text: 'RES123' } })))
      .toEqual({ nodes: [node(sw('f3f44b2cb5'), 'RES123')] });

    const test2 = sw('e2fe3a8cfa'); // new id for modified node
    expect(graph({
      nodes: [node('test', 'TOPIC1'), node('test2', 'TOPIC2'), node('test3', 'TOPIC3')],
      edges: [edge('edge2', 'test3', 'test2'), edge('edge', 'test2', 'test')],
    }, editNode('test2', { name: 'TOPICmod' })))
      .toEqual({
        nodes: [node('test', 'TOPIC1'), node(test2, 'TOPICmod'), node('test3', 'TOPIC3')],
        edges: [edge(sw('25b474ff33'), 'test3', test2), edge(sw('a38ea1c97b'), test2, 'test')],
      });
  });

  it('should handle DELETE_NODE', () => {
    expect(graph({ nodes: [node('test', 'RESabc')] }, deleteNode('test')))
      .toEqual({});

    expect(graph({
      nodes: [node('test', 'TOPIC1'), node('test2', 'TOPIC2'), node('test3', 'TOPIC3')],
      edges: [edge('edge2', 'test3', 'test2'), edge('edge', 'test2', 'test')],
    }, deleteNode('test2')))
      .toEqual({
        nodes: [node('test', 'TOPIC1'), node('test3', 'TOPIC3')],
      });
  });

  it('should handle MERGE_NODE', () => {
    expect(
      graph({
        nodes: [node('test', 'TOPIC1'), node('test2', 'TOPIC2')],
      }, mergeNode('test', 'test2')),
    ).toEqual({
      nodes: [node(sw('043f13a4c7'), 'TOPIC1 || TOPIC2')],
    });

    expect(
      graph({
        nodes: [
          node('test', 'TOPIC1'), node('test22', 'TOPIC2'), node('test333', 'TOPIC3'),
          node('test4444', 'TOPIC4'),
        ],
        edges: [
          edge('something', 'test333', 'test'), edge('something22', 'test4444', 'test22'),
        ],
      }, mergeNode('test', 'test22')),
    ).toEqual({
      nodes: [node(sw('043f13a4c72157198'), 'TOPIC1 || TOPIC2'), node('test4444', 'TOPIC4'), node('test333', 'TOPIC3'),
      ],
      edges: [edge(sw('81d0d8f25fe167f02'), 'test333', sw('043f13a4c7215')), edge(sw('2aae1faf79c'), 'test4444', sw('043f13a4c72'))],
    });
  });
});
