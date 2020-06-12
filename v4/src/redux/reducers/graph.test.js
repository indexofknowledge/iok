import { addNode } from '../actions';
import graph from './graph';

describe('graphs reducer', () => {
  it('should return the initial state', () => {
    expect(graph(undefined, {})).toEqual({});
  });

  it('should handle ADD_NODE', () => {
    expect(
      graph({}, addNode(null, { id: 'test', name: 'hello' })),
    ).toEqual({
      nodes: [
        { data: { id: 'test', name: 'hello' } },
      ],
    });

    expect(
      graph({
        nodes: [
          { data: { id: 'test' } },
        ],
      }, addNode('test', { id: 'another' })),
    ).toEqual({
      nodes: [
        { data: { id: 'test' } },
        { data: { id: 'another' } },
      ],
      edges: [
        { data: { id: '9bb5bde1a740465d012231e350aa8934f64d078ac1349d6a10852cbf1369d15f', target: 'test', source: 'another' } },
      ],
    });
  });
});
