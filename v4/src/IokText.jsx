// eslint-disable-line
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { Component } from 'react';
// import { Button, Modal } from 'react-bootstrap';
// import { sha256 } from 'js-sha256';
import { PropTypes } from 'prop-types';
// import AddNodeModal from './AddNodeModal';
// import EditNodeModal from './EditNodeModal';
// import ListIoksModal from './ListIoksModal';
// import Log from './log';
// import './styles/IokText.css';
import './IokText.css';

// import {
//   regroupCy, toggleDrawMode, toggleMeta, addNode, getNodesEdgesJson,
// } from './listen';
// import { GRAPH_FILENAME } from './constants';
import { NTYPE } from './types';

class IokText extends Component {
  static getDerivedStateFromProps(props) {
    return { // TODO: figure out why this is called twice
      cy: props.cy,
    };
  }

  render() {
    const { node } = this.props;
    const data = node ? node.data : {
      name: 'Overview',
      data: { text: 'Index of Knowledge (IoK) is a curated collection of resources for blockchain, grouped by topic and topologically ordered by pedagogical dependency.' },
      resource_type: 1,
      node_type: 2,
    };

    let subtitle = '';
    if (!node) {
      subtitle = 'NOTE: No node selected.';
    } else if (data.node_type === NTYPE.RESO) {
      subtitle = 'NOTE: Resource node. Displaying own contents';
    }

    const neighbors = node ? node.neighbors : [data];
    const depList = [];
    const descList = [];
    const linkList = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const neighbor of neighbors) {
      if (neighbor.node_type === NTYPE.TOPIC) { // topic is dep
        depList.push(<li key={neighbor.name}>{neighbor.name}</li>);
      } else if (neighbor.node_type === NTYPE.RESO) { // resource
        if (neighbor.resource_type === 1) { // desc
          descList.push(<li key={neighbor.data}>{neighbor.data.text}</li>);
        } else { // link type
          // eslint-disable-next-line max-len
          linkList.push(<li key={neighbor.data}><a href={neighbor.data.link}>{neighbor.data.text}</a></li>);
        }
      }
    }
    // XXX: HACK!! if no node is selected, we use a linkList alongside a descList
    if (!node) {
      linkList.push(<li key="dummy"><a href=".">Resource links appear here!</a></li>);
    }

    return (

      <div className="sidebar">

        <h2 className="nodetitle">{data.name}</h2>
        <p>From IoK</p>
        <p className="nodeid">{data.id}</p>
        <p id="nodesubtitle">{subtitle}</p>

        {depList.length !== 0 && (
          <div>
            <h5>You'll first need to understand</h5>
            <ul id="nodedeps">
              {depList}
            </ul>
          </div>
        )}

        {descList.length !== 0 && (
          <div>
            <h5>What is {data.name}?</h5>
            <ul id="nodedescs">
              {descList}
            </ul>
          </div>
        )}

        {linkList.length !== 0 && (
          <div>
            <h5>Learn more</h5>
            <ul id="nodelinks">
              {linkList}
            </ul>
          </div>
        )}



      </div>

    );
  }
}

IokText.defaultProps = {
  onSaveClick: () => alert('ERROR: onSaveClick() invalid'),
  onDeleteClick: () => alert('ERROR: onDeleteClick() invalid'),
  loadGraphHandler: () => alert('ERROR: loadGraphHandler() invalid'),
  cy: {}, // XXX: UGLY!!!!
  currNode: null,
  graphLoaded: false,
  guestMode: false,
  setCurrNode: () => alert('ERROR: setCurrNode() invalid'),
};

IokText.propTypes = {
  onSaveClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  loadGraphHandler: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  cy: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  node: PropTypes.object, // XXX: a good excuse to use TypeScript...
  // graphLoaded: PropTypes.bool,
  // guestMode: PropTypes.bool,
  // setCurrNode: PropTypes.func,
};

export default IokText;
