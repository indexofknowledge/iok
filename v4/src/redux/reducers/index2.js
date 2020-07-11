import Cytoscape from 'cytoscape';
import { sha256 } from 'js-sha256';
import { NTYPE } from '../../types';
import { ACTION_TYPES } from '../actions';
import { createNode, createEdge, updateEdges, merge, deleteNodeHelper, graphHelper } from './graphlib'
import calcCurrentNode from '../../calcCurrNode';

export default function graph(state = { graph: {}, selected: null, mergingNode: null }, action) {
  let { graph, selected, mergingNode } = state
  if (!state.graph.nodes || !state.graph.nodes.length) state.graph = [];
  const cy = Cytoscape({ elements: state.graph });
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
      console.log(newNode)
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
      merge(from, to, cy);
      graph = graphHelper(cy);
      break;
    }
    case ACTION_TYPES.UPLOAD_GRAPH: {
      graph = action.graph
      break;
    }
    case ACTION_TYPES.SELECT_NODE: {
      selected = action.node
      mergingNode = null
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
    mergingNode
  };
}
