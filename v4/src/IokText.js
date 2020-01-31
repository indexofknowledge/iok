import React, { Component } from 'react';
import AddNodeModal from './AddNodeModal'
import { sha256 } from 'js-sha256'

import './styles/IokText.css'

import { regroupCy, toggleDrawMode, toggleMeta, addNode } from './listen'

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

    this.state = {
      drawEnabled: false,
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

  /**
   * Adds node to cy with the given data
   * NOTE: Don't give me an id!
   * @param {*} data 
   */
  addNodeToCy(data) {
    var hash = sha256.create();
    hash.update(JSON.stringify(data))
    data = {...data, id: hash.hex()}
    console.log('DATA', data)
    addNode(this.state.cy, data)
  }

  render() {
    return (
      <div>
        <div id="cytext" className="iok-text">
            <div>
                <h2 id="nodetitle">Overview</h2>

                {/* used mainly to display info text to user */}
                <h4 id="nodesubtitle"></h4>

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
                  <h5>Misc IoK</h5>
                  <button className="btn btn-info btn-lg" onClick={this.onMetaClick}>Toggle meta graph</button>
                  <button className="btn btn-info btn-lg" onClick={this.onRegroupClick}>Regroup</button>

                  <h5>Edit</h5>
                  <AddNodeModal addNode={this.addNodeToCy}/>
                  <button className="btn btn-info btn-lg" onClick={this.onSaveClick}>Save</button>
                  <button className="btn btn-info btn-lg" onClick={this.onDeleteClick}>Delete</button>
                  <button 
                    className="btn btn-info btn-lg" 
                    onClick={
                      () => {
                        this.onDrawClick(); 
                        this.setState({drawEnabled: !this.state.drawEnabled});
                        return
                      }
                    }
                  >
                    Turn {this.state.drawEnabled ? 'off' : 'on'} edge drawing
                  </button>
                  <button className="btn btn-info btn-lg" onClick={this.onAddClick}>ADD TEST</button>
                </div>
            </div>
        </div>
      </div>
    );
  }
}
