import { sha256 } from 'js-sha256';
import { objToCid, verifyNodeShape } from 'ipfs-cytoscape';
import { NTYPE } from '../../types';

const incomers = (node) => node.incomers((el) => el.isNode());
const outgoers = (node) => node.outgoers((el) => el.isNode());

// eslint-disable-next-line
function nodeId(props, includeSource = true) {
  // call objToCid synchronously
  const bareNodeData = verifyNodeShape(props);
  return objToCid(bareNodeData);
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

  // handle cases where nodes are directly related
  const testFromId = nodeId(from.data(), false);
  const testToId = nodeId(to.data(), false);

  // if the node is repeated / in hashtable, merge it, else, add i
  // eslint-disable-next-line no-restricted-syntax
  for (const node of incomers(from).union(incomers(to))) {
    const id = nodeId(node.data(), false);
    if (id !== testFromId && id !== testToId) {
      if (nodes[id]) {
        nodes[id] = merge(node, nodes[id], cy);
      } else {
        nodes[id] = node;
      }
    }
  }

  from.remove();
  to.remove();
  Object.values(nodes).forEach((node) => cy.add(createEdge(node, newNode)));

  return newNode;
}

function isConnected(root, newParent) {
  const children = incomers(root);
  if (root === newParent) {
    return true;
  } if (children.length < 1) {
    return false;
  }
  let childConnected = false;
  for (const node of children) {
    childConnected = childConnected || isConnected(node, newParent);
  }
  return childConnected;
}

function deleteNodeHelper(node, cy) {
  // recursively send in a node, if theres no incomers, delete it
  const nodes = incomers(node);
  if (nodes) {
    nodes.map((nodeIn) => deleteNodeHelper(nodeIn, cy));
  }
  cy.remove(node);
}

function graphHelper(cy) {
  const j = cy.json().elements;
  if (j.nodes) j.nodes = j.nodes.map((n) => ({ data: n.data }));
  if (j.edges) j.edges = j.edges.map((e) => ({ data: e.data }));
  return { elements: j };
}

function calcCurrentNode(node) {
  if (node && node.isNode()) {
    let neighbors = [node.data()];

    if (node.data('node_type') === NTYPE.TOPIC) {
      neighbors = node.incomers((el) => el.isNode())
        .map((neighbor) => neighbor.data());
    }

    return {
      id: node.id(),
      data: node.data(),
      neighbors,
    };
  }
  return null;
}

export {
  incomers, outgoers,
  nodeId, createNode,
  edgeId, createEdge, updateEdges,
  merge, deleteNodeHelper, graphHelper,
  calcCurrentNode, isConnected,
};
