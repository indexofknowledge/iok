import Cytoscape from 'cytoscape';
import { ACTION_TYPES } from '../actions';
import {
  createNode, createEdge, updateEdges, merge, deleteNodeHelper, graphHelper,
} from './graphlib';
import calcCurrentNode from '../../calcCurrNode';

const DEFAULT_STATE = { graph: {}, selected: null, mergingNode: null };

export default function reducer(state = DEFAULT_STATE, action) {
  let { graph, selected, mergingNode } = state;
  let elements = [];
  if (state.graph.nodes) elements = state.graph.nodes;
  if (state.graph.edges) elements = elements.concat(state.graph.edges);
  const cy = Cytoscape({ elements });

  switch (action.type) {
    case ACTION_TYPES.ADD_NODE: {
      const newNode = cy.add(createNode(action.props));
      if (action.parentId) {
        cy.add(createEdge(newNode, cy.getElementById(action.parentId)));
      }
      graph = graphHelper(cy);
      selected = calcCurrentNode(newNode);
      break;
    }
    case ACTION_TYPES.EDIT_NODE: {
      const oldNode = cy.getElementById(action.id);
      const newNode = cy.add(createNode({ ...oldNode.data(), ...action.props, id: undefined }));
      updateEdges(cy, oldNode, newNode);
      newNode.shift(oldNode.position());
      oldNode.remove();
      graph = graphHelper(cy);
      selected = calcCurrentNode(newNode);
      break;
    }
    case ACTION_TYPES.DELETE_NODE: {
      const node = cy.getElementById(action.id);
      deleteNodeHelper(node, cy);
      graph = graphHelper(cy);
      break;
    }
    case ACTION_TYPES.MERGE_NODE: {
      const from = cy.getElementById(action.fromId);
      const to = cy.getElementById(action.toId);
      selected = merge(from, to, cy);
      graph = graphHelper(cy);
      break;
    }
    case ACTION_TYPES.UPLOAD_GRAPH: {
      graph = action.graph;
      break;
    }
    case ACTION_TYPES.SELECT_NODE: {
      selected = action.node;
      break;
    }
    case ACTION_TYPES.SELECT_MERGE_NODE: {
      mergingNode = action.node;
      break;
    }
    default:
      break;
  }
  return {
    graph,
    selected,
    mergingNode,
  };
}
