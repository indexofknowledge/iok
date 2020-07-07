import Cytoscape from 'cytoscape';
import { sha256 } from 'js-sha256';
import { NTYPE } from '../../types';
import { ACTION_TYPES } from '../actions';

const incomers = (node) => node.incomers((el) => el.isNode());
const outgoers = (node) => node.outgoers((el) => el.isNode());

function nodeId(props, includeSource = true) {
  const hash = sha256.create();
  let hashStr = props.name + (JSON.stringify(props.data) || '');
  if (includeSource) hashStr += props.source;
  hash.update(hashStr);
  return hash.hex();
}

function createNode(props) {
  // eslint-disable-next-line no-param-reassign
  if (!props.id) props.id = nodeId(props);
  return {
    group: 'nodes',
    data: props,
  };
}

function edgeId(sourceId, targetId) {
  const hash = sha256.create();
  hash.update(sourceId + targetId);
  return hash.hex();
}

function createEdge(source, target) {
  return {
    group: 'edges',
    data: {
      id: edgeId(source.id(), target.id()),
      source: source.id(),
      target: target.id(),
    },
  };
}

/** Moves all edges from oldNode to newNode */
function updateEdges(cy, oldNode, newNode) {
  incomers(oldNode).map((neighbor) => cy.add(createEdge(neighbor, newNode)));
  outgoers(oldNode).map((neighbor) => cy.add(createEdge(newNode, neighbor)));
  cy.remove(oldNode.connectedEdges());
}

function merge(from, to, cy) {
  // CONSIDER WHICH CONTRIBUTOR (if different) WE WANT TO KEEP
  if (from.data('node_type') === NTYPE.RESO
    || to.data('node_type') === NTYPE.RESO) return from;

  // create new node, a mix of nodes From and To
  const newNode = cy.add(createNode({
    name: `${from.data('name')} || ${to.data('name')}`,
    node_type: NTYPE.TOPIC,
  }));
  const nodes = {};

  // if the node is repeated / in hashtable, merge it, else, add i
  // eslint-disable-next-line no-restricted-syntax
  for (const node of incomers(from).union(incomers(to))) {
    const id = nodeId(node.data(), false);
    if (nodes[id]) {
      nodes[id] = merge(node, nodes[id], cy);
    } else {
      nodes[id] = node;
    }
  }

  from.remove();
  to.remove();
  Object.values(nodes).forEach((node) => cy.add(createEdge(node, newNode)));

  return newNode;
}

function deleteNodeHelper(node, cy) {
  // recursively send in a node, if theres no incomers, delete it
  const nodes = incomers(node);
  if (nodes) {
    nodes.map((nodeIn) => deleteNodeHelper(nodeIn, cy));
  }
  cy.remove(node);
}

export default function graph(state = {}, action) {
  // Hack to make sure cytoscape doesn't add a default node for us
  // eslint-disable-next-line no-param-reassign
  if (!state.nodes || !state.nodes.length) state = [];

  const cy = Cytoscape({ elements: state });
  switch (action.type) {
    case ACTION_TYPES.ADD_NODE: {
      const newNode = cy.add(createNode(action.props));
      if (action.parentId) {
        cy.add(createEdge(newNode, cy.getElementById(action.parentId)));
      }
      break;
    }
    case ACTION_TYPES.EDIT_NODE: {
      const oldNode = cy.getElementById(action.id);
      const newNode = cy.add(createNode({ ...oldNode.data(), ...action.props, id: undefined }));
      updateEdges(cy, oldNode, newNode);
      newNode.shift(oldNode.position());
      oldNode.remove();
      break;
    }
    case ACTION_TYPES.DELETE_NODE: {
      // cy.getElementById(action.id).remove();
      const node = cy.getElementById(action.id);
      deleteNodeHelper(node, cy);
      break;
    }
    case ACTION_TYPES.MERGE_NODE: {
      const from = cy.getElementById(action.fromId);
      const to = cy.getElementById(action.toId);
      merge(from, to, cy);
      break;
    }
    case ACTION_TYPES.UPLOAD_GRAPH: {
      return action.graph;
    }
    default:
      break;
  }
  const j = cy.json().elements;
  if (j.nodes) j.nodes = j.nodes.map((n) => ({ data: n.data }));
  if (j.edges) j.edges = j.edges.map((e) => ({ data: e.data }));
  return j;
}
