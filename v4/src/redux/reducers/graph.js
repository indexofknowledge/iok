import Cytoscape from 'cytoscape';
import { sha256 } from 'js-sha256';

function edgeId(sourceId, targetId) {
  const hash = sha256.create();
  hash.update(sourceId + targetId);
  return hash.hex();
}

/** Moves all edges from oldNode to newNode */
function updateEdges(cy, oldNode, newNode) {
  oldNode.incomers((el) => el.isNode()).map(
    (neighbor) => cy.add({
      group: 'edges',
      data: { source: neighbor.id(), target: newNode.id() },
    }),
  );
  oldNode.outgoers((el) => el.isNode()).map(
    (neighbor) => cy.add({
      group: 'edges',
      data: { source: newNode.id(), target: neighbor.id() },
    }),
  );
  cy.remove(oldNode.connectedEdges());
}

export default function graph(state = {}, action) {
  // Hack to make sure cytoscape doesn't add a default node for us
  // eslint-disable-next-line no-param-reassign
  if (!state.nodes || !state.nodes.length) state = [];

  const cy = Cytoscape({ elements: state });
  switch (action.type) {
    case 'ADD_NODE': {
      const newNode = cy.add({ group: 'nodes', data: action.props });
      if (action.parentId) {
        cy.add({
          group: 'edges',
          data: {
            id: edgeId(newNode.id(), action.parentId),
            source: newNode.id(),
            target: action.parentId,
          },
        });
      }
      break;
    }
    case 'EDIT_NODE': {
      const oldNode = cy.getElementById(action.id);
      const newNode = cy.add({ group: 'nodes', data: action.props });
      updateEdges(cy, oldNode, newNode);
      newNode.shift(oldNode.position());
      oldNode.remove();
      break;
    }
    case 'DELETE_NODE': {
      cy.getElementById(action.id).remove();
      break;
    }
    case 'MERGE_NODE': {
      console.log("Huh? I can't hear you, honey. A little louder please?");
      break;
    }
    default:
      return state;
  }
  const j = cy.json().elements;
  if (j.nodes) j.nodes = j.nodes.map((n) => ({ data: n.data }));
  if (j.edges) j.edges = j.edges.map((e) => ({ data: e.data }));
  return j;
}
