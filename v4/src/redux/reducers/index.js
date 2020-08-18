import Cytoscape from 'cytoscape';
import { ACTION_TYPES } from '../actions';
import {
  createNode, createEdge, updateEdges, merge, deleteNodeHelper, graphHelper,
  outgoers, calcCurrentNode, isConnected
} from './graphlib';

const DEFAULT_STATE = { graph: { elements: {} }, selected: null, mergingNode: null };

function graphToElements(graph) {
  let elements = [];
  if (graph.elements.nodes) elements = graph.elements.nodes;
  if (graph.elements.edges) elements = elements.concat(graph.elements.edges);
  return elements;
}

export default function reducer(state = DEFAULT_STATE, action) {
  let { graph, selected, mergingNode } = state;
  const elements = graphToElements(state.graph);
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
      const parent = outgoers(to)[0];
      const newNode = merge(from, to, cy);
      if (parent && parent != from) cy.add(createEdge(newNode, parent));
      selected = calcCurrentNode(newNode);
      mergingNode = null;
      graph = graphHelper(cy);
      break;
    }

    case ACTION_TYPES.CONNECT_NODE: {
      const child = cy.getElementById(action.childId);
      const newParent = cy.getElementById(action.newParentId);
      if (isConnected === false) {
        const oldEdge = child.outgoers((el) => el.isEdge())[0];
        if (oldEdge) cy.remove(oldEdge);
        cy.add(createEdge(child, newParent));
      }
      break;
    }

    case ACTION_TYPES.UPLOAD_GRAPH: {
      graph = action.graph;
      break;
    }
    case ACTION_TYPES.IMPORT_GRAPH: {
      cy.add(graphToElements(action.graph));
      graph = graphHelper(cy);
      break;
    }
    case ACTION_TYPES.SELECT_NODE: {
      selected = calcCurrentNode(cy.getElementById(action.nodeId));
      break;
    }
    case ACTION_TYPES.SELECT_MERGE_NODE: {
      mergingNode = calcCurrentNode(cy.getElementById(action.nodeId));
      selected = null;
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
