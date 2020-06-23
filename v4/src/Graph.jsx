import { connect } from 'react-redux';
import IokEdit from './IokEdit';
import {
  addNode, editNode, deleteNode, mergeNode, selectNode,
} from './redux/actions';

const mapStateToProps = (state) => {
  let elements = [];
  if (state.graph.nodes) elements = state.graph.nodes;
  if (state.graph.edges) elements = elements.concat(state.graph.edges);
  return {
    graph: elements,
    selected: state.selected,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addNode: (parentId, props) => dispatch(addNode(parentId, props)),
  editNode: (id, props) => dispatch(editNode(id, props)),
  deleteNode: (id) => dispatch(deleteNode(id)),
  mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  selectNode: (id) => dispatch(selectNode(id)),
});

const Graph = connect(mapStateToProps, mapDispatchToProps)(IokEdit);

export default Graph;
