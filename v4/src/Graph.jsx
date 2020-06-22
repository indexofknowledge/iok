import { connect } from 'react-redux'
import IokEdit from './IokEdit';
import { addNode, editNode, deleteNode, mergeNode } from '././redux/actions'

const mapStateToProps = state => {
  let elements = [];
  if (state.graph.nodes) elements = state.graph.nodes;
  if (state.graph.edges) elements = elements.concat(state.graph.edges);
  return {
    graph: elements
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addNode: (parentId, props) => dispatch(addNode(parentId, props)),
    editNode: (id, props) => dispatch(editNode(id, props)),
    deleteNode: (id) => dispatch(deleteNode(id)),
    mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  }
}

const Graph = connect(mapStateToProps, mapDispatchToProps)(IokEdit)

export default Graph