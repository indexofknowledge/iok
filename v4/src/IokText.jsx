// eslint-disable-line
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { sha256 } from 'js-sha256';
import { PropTypes } from 'prop-types';
import AddNodeModal from './AddNodeModal';
import ListIoksModal from './ListIoksModal';

import './styles/IokText.css';

import {
  regroupCy, toggleDrawMode, toggleMeta, addNode, getNodesEdgesJson,
} from './listen';
import { GRAPH_FILENAME, NTYPE } from './constants';

class IokText extends Component {
  constructor(props) {
    super(props);

    const { onSaveClick, onDeleteClick } = this.props;

    this.onSaveClick = onSaveClick;
    this.onDeleteClick = onDeleteClick;

    this.state = {
      drawEnabled: false,
      showDeleteModal: false,
      showSaveModal: false,
    };
  }

  static getDerivedStateFromProps(props) {
    return { // TODO: figure out why this is called twice
      cy: props.cy,
    };
  }

  onMetaClick() {
    const { cy } = this.state;
    toggleMeta(cy);
  }

  onRegroupClick() {
    const { cy } = this.state;
    regroupCy(cy);
  }

  static onDrawClick() {
    toggleDrawMode();
  }

  onAddClick() {
    const rand = String(Math.ceil(Math.random() * 1000000));
    const data = {
      node_type: 1,
      name: 'rand-'.concat(rand),
    };
    this.addNodeToCy(data);
  }

  toggleDeleteModal() {
    const { showDeleteModal } = this.state;
    this.setState({ showDeleteModal: !showDeleteModal });
  }

  toggleSaveModal() {
    const { showSaveModal } = this.state;
    this.setState({ showSaveModal: !showSaveModal });
  }

  /**
   * Adds node to cy with the given data
   * NOTE: Don't give me an id!
   * XXX: perhaps move this to utils
   * @param {*} data
   */
  addNodeToCy(data) {
    const { cy } = this.state;
    const hash = sha256.create();
    hash.update(JSON.stringify(data));
    let dataWithHash = { ...data, id: hash.hex() };
    if (!('name' in data)) { // XXX: make a note of this... give it a name...
      dataWithHash = { ...dataWithHash, name: 'res-'.concat(dataWithHash.id.substring(0, 10)) };
    }
    console.log('DATA', dataWithHash);
    addNode(cy, dataWithHash);
  }

  downloadGraph() {
    const { cy } = this.state;
    const exportObj = getNodesEdgesJson(cy);
    const exportName = GRAPH_FILENAME;
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  render() {
    // XXX: makes the linter happy, but hard to read...
    const { currNode, graphLoaded, guestMode } = this.props;
    const { showDeleteModal, showSaveModal, drawEnabled } = this.state;

    const node = currNode;
    const data = node && Object.keys(node).length > 0 ? node.data() : {
      name: 'Overview',
      data: {
        text: 'Index of Knowledge (IoK) is a curated collection of resources for blockchain, grouped by topic and topologically ordered by pedagogical dependency.',
      },
      resource_type: 1,
      node_type: 2,
    };

    let subtitle = '';
    if (data.node_type === NTYPE.RESO) {
      subtitle = 'NOTE: Resource node. Displaying own contents';
    }

    let neighbors = [data];

    if (data.node_type === NTYPE.TOPIC) {
      neighbors = node.incomers((el) => el.isNode())
        .map((neighbor) => neighbor.data());
    }

    const depList = [];
    const descList = [];
    const linkList = [];

    // XXX: look into this
    // eslint-disable-next-line no-restricted-syntax
    for (const neighbor of neighbors) {
      if (neighbor.node_type === NTYPE.TOPIC) { // topic is dep
        depList.push(<li key={neighbor.name}>{neighbor.name}</li>);
      } else if (neighbor.node_type === NTYPE.RESO) { // resource
        if (neighbor.resource_type === 1) { // desc
          descList.push(<li key={neighbor.data}>{neighbor.data.text}</li>);
        } else { // link type
          // eslint-disable-next-line max-len
          linkList.push(<li key={neighbor.data.text}><a href={neighbor.data.link}>{neighbor.data.text}</a></li>);
        }
      }
    }
    // XXX: HACK!! if no node is selected, we use a linkList alongside a descList
    if (!node) {
      linkList.push(<li key="dummy"><a href=".">Resource links appear here!</a></li>);
    }

    return (

      <div>

        <Modal className="Modal" show={showDeleteModal} onHide={this.toggleDeleteModal}>
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
        </Modal>

        <div id="cytext" className="iok-text">
          <div>
            <h2 className="breaking" id="nodetitle">{data.name}</h2>

            {/* used mainly to display info text to user */}
            <p className="breaking" id="nodeid">{data.id}</p>
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
                <AddNodeModal addNode={this.addNodeToCy} />

                <button
                  type="button"
                  className="btn btn-info btn-lg btn-util"
                  onClick={
                    () => {
                      this.onDrawClick();
                      this.setState({ drawEnabled: !drawEnabled });
                    }
                  }
                >
                  {`Turn ${drawEnabled ? 'OFF' : 'ON'} edge drawing`}
                </button>

                {!graphLoaded || guestMode ? <div /> : (
                  <div>
                    <button type="button" className="btn btn-info btn-lg btn-save" onClick={this.toggleSaveModal}>Save</button>
                    <button type="button" className="btn btn-info btn-lg btn-delete" onClick={this.toggleDeleteModal}>Delete</button>
                  </div>
                )}

              </div>

              <div className="misc-div">
                <h5>Misc</h5>
                <ListIoksModal />
                {graphLoaded ? <button type="button" id="downloadButton" className="btn btn-info btn-lg btn-util" onClick={this.downloadGraph}>Download</button> : <div />}

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
  cy: {}, // XXX: UGLY!!!!
  currNode: {},
  graphLoaded: false,
  guestMode: false,
};

IokText.propTypes = {
  onSaveClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  cy: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  currNode: PropTypes.object, // XXX: a good excuse to use TypeScript...
  graphLoaded: PropTypes.bool,
  guestMode: PropTypes.bool,
};

export default IokText;
