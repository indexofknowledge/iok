import React, { Component } from 'react';
import AddNodeModal from './AddNodeModal'
import { Button, Modal } from 'react-bootstrap'
import { sha256 } from 'js-sha256'

import './styles/IokText.css'

import { regroupCy, toggleDrawMode, toggleMeta, addNode, getNodesEdgesJson } from './listen'
import { GRAPH_FILENAME, NTYPE } from './constants'

export default class IokText extends Component {

  constructor(props) {
    super(props)
    this.onSaveClick = this.props.onSaveClick
    this.onDeleteClick = this.props.onDeleteClick

    this.onMetaClick = this.onMetaClick.bind(this)
    this.onRegroupClick = this.onRegroupClick.bind(this)
    this.onDrawClick = this.onDrawClick.bind(this)
    this.onAddClick = this.onAddClick.bind(this)
    this.addNodeToCy = this.addNodeToCy.bind(this)
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)
    this.toggleSaveModal = this.toggleSaveModal.bind(this)
    this.downloadGraph = this.downloadGraph.bind(this)

    this.state = {
      drawEnabled: false,
      showDeleteModal: false,
      showSaveModal: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    return { // TODO: figure out why this is called twice
      cy: props.cy,
    }
  }

  onMetaClick() {
    toggleMeta(this.state.cy)
  }

  onRegroupClick() {
    regroupCy(this.state.cy)
  }

  onDrawClick() {
    toggleDrawMode()
  }

  onAddClick() {
    var rand = String(Math.ceil(Math.random() * 1000000))
    var data = {
      node_type: 1,
      name: 'rand-'.concat(rand)
    }
    this.addNodeToCy(data)
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }

  toggleSaveModal() {
    this.setState({ showSaveModal: !this.state.showSaveModal })
  }

  /**
   * Adds node to cy with the given data
   * NOTE: Don't give me an id!
   * XXX: perhaps move this to utils
   * @param {*} data 
   */
  addNodeToCy(data) {
    var hash = sha256.create();
    hash.update(JSON.stringify(data))
    data = { ...data, id: hash.hex() }
    if (!('name' in data)) { // XXX: make a note of this... give it a name...
      data = { ...data, name: 'res-'.concat(data.id.substring(0, 10)) }
    }
    console.log('DATA', data)
    addNode(this.state.cy, data)
  }

  downloadGraph() {
    var exportObj = getNodesEdgesJson(this.state.cy)
    var exportName = GRAPH_FILENAME
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  render() {
    const node = this.props.currNode;
    const data = node ? node.data() : {
      name: "Overview",
      data: "Index of Knowledge (IoK) is a curated collection of resources for blockchain, grouped by topic and topologically ordered by pedagogical dependency.", resource_type: 1, node_type: 2,
    };

    let subtitle = '';
    if (data.node_type === NTYPE.RESO) {
      subtitle = 'NOTE: Resource node. Displaying own contents';
    }

    let neighbors = [data];

    if (data.node_type === NTYPE.TOPIC) {
      neighbors = node.incomers((el) => el.isNode())
        .map(neighbor => neighbor.data());
    }

    const depList = [];
    const descList = [];
    const linkList = [];

    for (const neighbor of neighbors) {
      if (neighbor.node_type === NTYPE.TOPIC) { // topic is dep
        depList.push(<li>{neighbor.name}</li>);
      } else if (neighbor.node_type === NTYPE.RESO) { // resource
        if (neighbor.resource_type === 1) { // desc
          descList.push(<li>{neighbor.data}</li>);
        } else { // link type
          linkList.push(<li><a href={neighbor.data.link}>{neighbor.data.text}</a></li>);
        }
      }
    }
    //XXX: HACK!! if no node is selected, we use a linkList alongside a descList
    if (!node) {
      linkList.push(<li><a href=".">Resource links appear here!</a></li>);
    }

    return (

      <div>

        <Modal className="Modal" show={this.state.showDeleteModal} onHide={this.toggleDeleteModal}>
          <Modal.Header>
            <Modal.Title>Delete your IoK?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This will delete all your IoK data from your Blockstack data locker.
          </Modal.Body>
          <Modal.Footer>
            <Button className={"btn btn-info btn-lg btn-delete"} onClick={() => { this.onDeleteClick(); this.toggleDeleteModal() }}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal className="Modal" show={this.state.showSaveModal} onHide={this.toggleSaveModal}>
          <Modal.Header>
            <Modal.Title>Save your IoK?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This will save your IoK data to your Blockstack data locker, potentially overwriting previous versions.
          </Modal.Body>
          <Modal.Footer>
            <Button className={"btn btn-info btn-lg btn-save"} onClick={() => { this.onSaveClick(); this.toggleSaveModal() }}>
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

            <hr className="hr-sep"></hr>

            {descList.length !== 0 && <div>
              <h5>Description(s)</h5>
              <ul id="nodedescs">
                {descList}
              </ul>
            </div>}

            {linkList.length !== 0 && <div>
              <h5>Links</h5>
              <ul id="nodelinks">
                {linkList}
              </ul>
            </div>}

            {depList.length !== 0 && <div>
              <h5>Dependencies</h5>
              <ul id="nodedeps">
                {depList}
              </ul>
            </div>}

            <hr className="hr-sep"></hr>

            <div>
              {/* <div>
                    <h5>Misc IoK</h5>
                    <button className="btn btn-info btn-lg btn-util" onClick={this.onMetaClick}>Toggle meta-graph</button>
                    <button className="btn btn-info btn-lg btn-util" onClick={this.onRegroupClick}>Regroup</button>
                  </div> */}

              <div className="edit-div">
                <h5>Edit</h5>
                <AddNodeModal addNode={this.addNodeToCy} />

                {this.props.guestMode ? <div></div> :
                  <div><button className="btn btn-info btn-lg btn-save" onClick={this.toggleSaveModal}>Save</button>
                    <button className="btn btn-info btn-lg btn-delete" onClick={this.toggleDeleteModal}>Delete</button></div>
                }

                <button
                  className="btn btn-info btn-lg btn-util"
                  onClick={
                    () => {
                      this.onDrawClick();
                      this.setState({ drawEnabled: !this.state.drawEnabled });
                      return
                    }
                  }
                >
                  Turn {this.state.drawEnabled ? 'OFF' : 'ON'} edge drawing
                    </button>
                {this.props.graphLoaded ? <button id="downloadButton" className="btn btn-info btn-lg btn-util" onClick={this.downloadGraph}>Download</button> : <div></div>}

              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
