import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';
import './IokEdit.css';

class IokEdit extends Component {
  render() {
    const { graph, selected } = this.props;
    return (
      <div>
        <h1>Hello I'm a birb 🐦. *Chirp*</h1>
        <div>
          <div>
            <button onClick={() => this.addNode()}>Add node</button>
            <button onClick={() => this.addNode()}>Edit node</button>
            <button onClick={() => this.addNode()}>Delete node</button>
            <button onClick={() => this.addNode()}>Merge node</button>
          </div>
          <CytoscapeComponent cy={(cy) => this.initCy(cy)} elements={graph} style={{ width: '600px', height: '400px' }} />
        </div>

        <p>
          <code>
            Selected:
            {selected ? selected.id : 'null'}
          </code>
        </p>
        <pre><code>{JSON.stringify(graph, null, 2)}</code></pre>
      </div>
    );
  }

  initCy(cy) {
    if (cy === this.cy) return;
    this.cy = cy;
    // Needed to handle multiple triggers
    // when React is slow to update
    /* let lastSelected = null; */
    cy.on('tap', (evt) => {
      const { selected, selectNode } = this.props;
      if (evt.target === cy) {
        if (selected) selectNode(null);
      } else if (evt.target.isNode()) {
        const id = evt.target.id();
        if (!selected || selected.id !== id) selectNode({ id });
      }
    });
  }

  addNode() {
    const { addNode } = this.props;
    addNode(null, {
      name: `Test ${Math.random()}`,
      resource_type: 1,
    });
  }
}

IokEdit.propTypes = {
  graph: PropTypes.arrayOf(PropTypes.object).isRequired,
  addNode: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  selected: PropTypes.object,
};

export default IokEdit;
