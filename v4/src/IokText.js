import React, { Component } from 'react';
import './styles/IokText.css'

import { regroupCy, toggleDrawMode, toggleMeta, registerEdgeHandles, addNode } from './listen'

export default class IokText extends Component {

  constructor(props) {
    super(props)
    this.onSaveClick = this.props.onSaveClick
    this.onDeleteClick = this.props.onDeleteClick

    this.onMetaClick = this.onMetaClick.bind(this)
    this.onRegroupClick = this.onRegroupClick.bind(this)
    this.onDrawClick = this.onDrawClick.bind(this)
    this.onAddClick = this.onAddClick.bind(this)

    this.state = {
      drawEnabled: false,
      registeredEh: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    var reh = false
    if (props.cy && !state.registeredEh) { // only register once since we recycle cy instances
      registerEdgeHandles(props.cy)
      reh = true
    }
    return { // TODO: figure out why this is called twice
      cy: props.cy,
      registeredEh: reh
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
      id: rand,
      node_type: 1,
      name: rand
    }
    addNode(this.state.cy, data)
  }

  render() {
    return (
      <div>
        <div id="cytext" className="iok-text">
            <div>
                <h2>Index of Knowledge</h2>
                <h3 id="nodetitle">Overview</h3>
        
                <div>
                  <h5>Description</h5>
                  <p id="nodetext">
                    Index of Knowledge (IoK) is a curated collection of resources for blockchain, grouped by topic and topologically ordered by pedagogical dependency.
                  </p>
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

                <div>
                  <h5>Misc IoK</h5>
                  <button className="btn btn-info btn-lg" onClick={this.onMetaClick}>Toggle meta graph</button>
                  <button className="btn btn-info btn-lg" onClick={this.onRegroupClick}>Regroup</button>
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
                    Draw {this.state.drawEnabled ? 'off' : 'on'}
                  </button>
                  <button className="btn btn-info btn-lg" onClick={this.onAddClick}>ADD TEST</button>
                </div>
            </div>
        </div>
      </div>
    );
  }
}
