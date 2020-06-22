import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';
import './IokEdit.css';

class IokEdit extends Component {

  render() {
    const { graph } = this.props;

    return <div>
      <span>Hello I'm a birb 🐦. *Chirp*</span>
      <div>
        <div>
          <button onClick={() => this.addNode()}>Add node</button>
          <button onClick={() => this.addNode()}>Edit node</button>
          <button onClick={() => this.addNode()}>Delete node</button>
          <button onClick={() => this.addNode()}>Merge node</button>
        </div>
        <CytoscapeComponent elements={graph} style={{ width: '600px', height: '400px' }} />
      </div>

      <pre><code>{JSON.stringify(graph, null, 2)}</code></pre>
    </div>
  }

  addNode() {
    const { addNode } = this.props;
    addNode(null, {
      name: 'Test ' + Math.random(),
      resource_type: 1,
    });
  }
}

IokEdit.propTypes = {
  graph: PropTypes.array.isRequired,
  addNode: PropTypes.func.isRequired,
}

export default IokEdit;

