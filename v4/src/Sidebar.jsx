import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  mergeNode, selectNode, selectPrevNode,
} from './redux/actions';
import IokText from './IokText';

const mapStateToProps = (state) => ({
  selected: state.selected,
  prevNode: state.prevNode,
});

const mapDispatchToProps = (dispatch) => ({
  mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  selectNode: (id) => dispatch(selectNode(id)),
  selectPrevNode: (id) => dispatch(selectPrevNode(id)),
});

const FullSideBar = ({ prevNode, selected }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {prevNode ? <IokText node={prevNode} /> : <div />}
    {!prevNode || (prevNode && selected) ? <IokText node={selected} /> : <div />}
  </div>
);

FullSideBar.propTypes = {
  prevNode: PropTypes.object, // eslint-disable-line
  selected: PropTypes.object, // eslint-disable-line
};

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(FullSideBar);

export default Sidebar;
