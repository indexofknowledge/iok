import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  mergeNode, selectNode, selectPrevNode, toggleNodeTraversed
} from './redux/actions';
import IokText from './IokText';

const mapStateToProps = (state) => ({
  selected: state.selected,
  prevNode: state.prevNode,
  traversed: state.traversed,
});

const mapDispatchToProps = (dispatch) => ({
  mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  selectNode: (id) => dispatch(selectNode(id)),
  selectPrevNode: (id) => dispatch(selectPrevNode(id)),
  toggleNodeTraversed: (id) => dispatch(toggleNodeTraversed(id)),
});

const FullSideBar = ({ prevNode, selected, traversed, toggleNodeTraversed }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {prevNode ? <IokText node={prevNode} traversed={traversed} toggleNodeTraversed={toggleNodeTraversed}/> : <div />}
    {!prevNode || (prevNode && selected) ? <IokText node={selected} traversed={traversed} toggleNodeTraversed={toggleNodeTraversed}/> : <div />}
  </div>
);

FullSideBar.propTypes = {
  prevNode: PropTypes.object, // eslint-disable-line
  selected: PropTypes.object, // eslint-disable-line
  traversed: PropTypes.object, // eslint-disable-line
  toggleNodeTraversed: PropTypes.func, // eslint-disable-line
};

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(FullSideBar);

export default Sidebar;
