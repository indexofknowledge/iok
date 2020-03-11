import React, { Component } from 'react';
import AddNodeModal from './AddNodeModal'
import { Button, Modal } from 'react-bootstrap'
import { sha256 } from 'js-sha256'

import './styles/IokText.css'

import { regroupCy, toggleDrawMode, toggleMeta, addNode, getNodesEdgesJson } from './listen'
import { GRAPH_FILENAME } from './constants'

export default class IokText extends Component {

  constructor(props) {
    super(props)
    this.onSaveClick = this.props.onSaveClick
    this.onDeleteClick = this.props.onDeleteClick
    this.loadGraphHandler = this.props.loadGraphHandler

    this.onMetaClick = this.onMetaClick.bind(this)
    this.onRegroupClick = this.onRegroupClick.bind(this)
    this.onDrawClick = this.onDrawClick.bind(this)
    this.onAddClick = this.onAddClick.bind(this)
    this.addNodeToCy = this.addNodeToCy.bind(this)
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)
    this.toggleSaveModal = this.toggleSaveModal.bind(this)
    this.downloadGraph = this.downloadGraph.bind(this)
    this.onFileUploadHandler = this.onFileUploadHandler.bind(this)

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
    data = {...data, id: hash.hex()}
    if (!('name' in data)) { // XXX: make a note of this... give it a name...
      data = {...data, name: 'res-'.concat(data.id.substring(0, 10))}
    }
    console.log('DATA', data)
    addNode(this.state.cy, data)
  }

  downloadGraph(){
    var exportObj = getNodesEdgesJson(this.state.cy)
    var exportName = GRAPH_FILENAME
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  onFileUploadHandler = event => {
    var reader = new FileReader();
    reader.onload = event => {
      // console.log(event.target.result);
      try {
        var obj = JSON.parse(event.target.result);
        this.loadGraphHandler(obj);
      } catch (err) {
        console.log(err)
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(event.target.files[0]);
  }

  render() {
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
            <Button className={"btn btn-info btn-lg btn-delete"} onClick={() => {this.onDeleteClick(); this.toggleDeleteModal()}}>
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
            <Button className={"btn btn-info btn-lg btn-save"} onClick={() => {this.onSaveClick(); this.toggleSaveModal()}}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <div id="cytext" className="iok-text">
            <div>
                <h2 className="breaking" id="nodetitle">Overview</h2>

                {/* used mainly to display info text to user */}
                <p className="breaking" id="nodeid"></p>
                <p id="nodesubtitle"></p>

                <hr className="hr-sep"></hr>
        
                <div>
                  <h5>Description(s)</h5>
                  <ul id="nodedescs">
                    <li>Index of Knowledge (IoK) is a curated collection of resources for blockchain, grouped by topic and topologically ordered by pedagogical dependency.</li>
                  </ul>
                </div>
        
                <div>
                  <h5>Links</h5>
                  <ul id="nodelinks">
                      <li><a href=".">Resource links appear here!</a></li>
                  </ul>
                </div>

                <div>
                  <h5>Dependencies</h5>
                  <ul id="nodedeps">
                      <li>placeholder dep</li>
                  </ul>
                </div>

                <hr className="hr-sep"></hr>

                <div>
                  {/* <div>
                    <h5>Misc IoK</h5>
                    <button className="btn btn-info btn-lg btn-util" onClick={this.onMetaClick}>Toggle meta-graph</button>
                    <button className="btn btn-info btn-lg btn-util" onClick={this.onRegroupClick}>Regroup</button>
                  </div> */}

                  <div className="edit-div">
                    <h5>Edit</h5>
                    <AddNodeModal addNode={this.addNodeToCy}/>

                    {this.props.guestMode ? <div></div> : 
                    <div><button className="btn btn-info btn-lg btn-save" onClick={this.toggleSaveModal}>Save</button>
                    <button className="btn btn-info btn-lg btn-delete" onClick={this.toggleDeleteModal}>Delete</button></div>
                    }
                    
                    <button 
                      className="btn btn-info btn-lg btn-util" 
                      onClick={
                        () => {
                          this.onDrawClick(); 
                          this.setState({drawEnabled: !this.state.drawEnabled});
                          return
                        }
                      }
                    >
                      Turn {this.state.drawEnabled ? 'OFF' : 'ON'} edge drawing
                    </button>
                    {this.props.graphLoaded ? <button id="downloadButton" className="btn btn-info btn-lg btn-util" onClick={this.downloadGraph}>Download</button> : <div></div>}
                    <input className="btn btn-info btn-lg btn-upload" type="file" name="file" onChange={this.onFileUploadHandler}/>
                  </div>

                </div>
            </div>
        </div>
      </div>
    );
  }
}
