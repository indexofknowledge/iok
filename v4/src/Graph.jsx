import { connect } from 'react-redux';
import IokEdit from './IokEdit';
import {
  addNode, editNode, deleteNode, mergeNode, selectNode, selectMergeNode, uploadGraph,
} from './redux/actions';

const mapStateToProps = (state) => {
  let elements = [];
  if (state.graph.nodes) elements = state.graph.nodes;
  if (state.graph.edges) elements = elements.concat(state.graph.edges);
  return {
    elements,
    graph: state.graph,
    selected: state.selected,
    mergingNode: state.mergingNode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addNode: (parentId, props) => dispatch(addNode(parentId, props)),
  editNode: (id, props) => dispatch(editNode(id, props)),
  deleteNode: (id) => dispatch(deleteNode(id)),
  mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  selectNode: (id) => dispatch(selectNode(id)),
  selectMergeNode: (id) => dispatch(selectMergeNode(id)),
  uploadGraph: (graph) => dispatch(uploadGraph(graph)),
});

const Graph = connect(mapStateToProps, mapDispatchToProps)(IokEdit);

export default Graph;
