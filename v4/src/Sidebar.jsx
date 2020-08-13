import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  mergeNode, selectNode, selectMergeNode,
} from './redux/actions';
import IokText from './IokText';

const mapStateToProps = (state) => ({
  selected: state.selected,
  mergingNode: state.mergingNode,
});

const mapDispatchToProps = (dispatch) => ({
  mergeNode: (fromId, toId) => dispatch(mergeNode(fromId, toId)),
  selectNode: (id) => dispatch(selectNode(id)),
  selectMergeNode: (id) => dispatch(selectMergeNode(id)),
});

const FullSideBar = ({ mergingNode, selected }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {mergingNode ? <IokText node={mergingNode} /> : <div />}
    {!mergingNode || (mergingNode && selected) ? <IokText node={selected} /> : <div />}
  </div >
);

FullSideBar.propTypes = {
  mergingNode: PropTypes.object, // eslint-disable-line
  selected: PropTypes.object, // eslint-disable-line
};

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(FullSideBar);

export default Sidebar;
