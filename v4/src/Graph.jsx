import { connect } from 'react-redux';
import IokEdit from './IokEdit';
import {
  addNode, editNode, deleteNode, mergeNode, connectNode, selectNode, selectPrevNode,
  toggleNodeTraversed, uploadGraph, importGraph,
} from './redux/actions';

const mapStateToProps = (state) => {
  let elements = [];
  if (state.graph.elements.nodes) elements = state.graph.elements.nodes;
  if (state.graph.elements.edges) elements = elements.concat(state.graph.elements.edges);
  return {
    elements,
    graph: state.graph,
    selected: state.selected,
    prevNode: state.prevNode,
    traversed: state.traversed,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addNode: (parentId, props) => dispatch(addNode(parentId, props)),
  editNode: (id, props) => dispatch(editNode(id, props)),
  deleteNode: (id) => dispatch(deleteNode(id)),
  mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  connectNode: (childId, newParentId) => dispatch(connectNode(childId, newParentId)),
  selectNode: (id) => dispatch(selectNode(id)),
  selectPrevNode: (id) => dispatch(selectPrevNode(id)),
  toggleNodeTraversed: (id) => dispatch(toggleNodeTraversed(id)),
  uploadGraph: (graph) => dispatch(uploadGraph(graph)),
  importGraph: (graph) => dispatch(importGraph(graph)),
});

const Graph = connect(mapStateToProps, mapDispatchToProps)(IokEdit);

export default Graph;
