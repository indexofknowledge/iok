import React, { Component } from 'react';
import './styles/IokText.css'

export default class IokText extends Component {

  constructor(props) {
    super(props)
    this.onMetaClick = this.props.onMetaClick ? this.props.onMetaClick : () => console.log("Meta Clicked")
    this.onRecenterClick = this.props.onRecenterClick ? this.props.onRecenterClick : () => console.log("Recenter Clicked")
    this.onRegroupClick = this.props.onRegroupClick
    this.onSaveClick = this.props.onSaveClick
    this.onDeleteClick = this.props.onDeleteClick
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
                  <button className="btn btn-info btn-lg" onClick={this.onRecenterClick}>Recenter</button>
                  <button className="btn btn-info btn-lg" onClick={this.onRegroupClick}>Regroup</button>
                  <button className="btn btn-info btn-lg" onClick={this.onSaveClick}>Save</button>
                  <button className="btn btn-info btn-lg" onClick={this.onDeleteClick}>Delete</button>
                </div>
            </div>
        </div>
      </div>
    );
  }
}
