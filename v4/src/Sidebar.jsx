import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  mergeNode, selectNode, selectMergeNode, toggleNodeTraversed
} from './redux/actions';
import IokText from './IokText';

const mapStateToProps = (state) => ({
  selected: state.selected,
  mergingNode: state.mergingNode,
  traversed: state.traversed,
});

const mapDispatchToProps = (dispatch) => ({
  mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  selectNode: (id) => dispatch(selectNode(id)),
  selectMergeNode: (id) => dispatch(selectMergeNode(id)),
  toggleNodeTraversed: (id) => dispatch(toggleNodeTraversed(id)),
});

const FullSideBar = ({ mergingNode, selected, traversed, toggleNodeTraversed }) => (
  <div>
    {mergingNode ? <IokText node={mergingNode} traversed={traversed} toggleNodeTraversed={toggleNodeTraversed}/> : <div />}
    <IokText node={selected} traversed={traversed} toggleNodeTraversed={toggleNodeTraversed}/>
  </div>
);

FullSideBar.propTypes = {
  mergingNode: PropTypes.object, // eslint-disable-line
  selected: PropTypes.object, // eslint-disable-line
  traversed: PropTypes.object, // eslint-disable-line
  toggleNodeTraversed: PropTypes.func, // eslint-disable-line
};

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(FullSideBar);

export default Sidebar;
