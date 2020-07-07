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

        {/* <Modal className="Modal" show={showDeleteModal} onHide={this.toggleDeleteModal}>
          <Modal.Header>
            <Modal.Title>Delete your IoK?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This will delete all your IoK data from your Blockstack data locker.
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-info btn-lg btn-delete" onClick={() => { this.onDeleteClick(); this.toggleDeleteModal(); }}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal className="Modal" show={showSaveModal} onHide={this.toggleSaveModal}>
          <Modal.Header>
            <Modal.Title>Save your IoK?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This will save your IoK data to your Blockstack data locker,
            potentially overwriting previous versions.
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-info btn-lg btn-save" onClick={() => { this.onSaveClick(); this.toggleSaveModal(); }}>
              Save
            </Button>
          </Modal.Footer>
        </Modal> */}

        <div id="cytext" className="iok-text">
          <div>
            <h2 className="breaking" id="nodetitle">{data.name}</h2>

            {/* used mainly to display info text to user */}
            <p className="breaking" class="nodeid">{data.id}</p>
            <p id="nodesubtitle">{subtitle}</p>

            <hr className="hr-sep" />

            {descList.length !== 0 && (
              <div>
                <h5>Description(s)</h5>
                <ul id="nodedescs">
                  {descList}
                </ul>
              </div>
            )}

            {linkList.length !== 0 && (
              <div>
                <h5>Links</h5>
                <ul id="nodelinks">
                  {linkList}
                </ul>
              </div>
            )}

            {depList.length !== 0 && (
              <div>
                <h5>Dependencies</h5>
                <ul id="nodedeps">
                  {depList}
                </ul>
              </div>
            )}

            <hr className="hr-sep" />

            <div>
              <div className="edit-div">
                <h5>Edit</h5>
                {/* <EditNodeModal
                  node={node}
                  addNode={this.addNodeToCy}
                  removeNode={this.removeNodeFromCy}
                  setNode={setCurrNode}
                  updateEdges={this.updateEdgesFromCy}
                />
                <AddNodeModal addNode={this.addNodeToCy} /> */}

                <div>
                  <button type="button" className="btn btn-info btn-lg btn-save" onClick={this.toggleSaveModal}>Save</button>
                  <button type="button" className="btn btn-info btn-lg btn-delete" onClick={this.toggleDeleteModal}>Delete</button>
                </div>

              </div>

              <div className="misc-div">
                <h5>Misc</h5>
                {/* <ListIoksModal /> */}
                <button type="button" id="downloadButton" className="btn btn-info btn-lg btn-util" onClick={this.downloadGraph}>Download</button>
                :
                <div />
                <input className="btn btn-info btn-lg btn-upload" type="file" name="file" onChange={this.onFileUploadHandler} />
              </div>

            </div>
          </div>
        </div>
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
