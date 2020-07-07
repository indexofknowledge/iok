import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';
import './IokEdit.css';
import calcCurrentNode from './calcCurrNode';
import NodeProperties from './NodeProperties';

const IokStyle = (zoom) => [
  {
    selector: 'node[name]',
    style: {
      'background-color': '#f8be35',
      label: 'data(name)',
      'font-size': 15 / Math.sqrt(zoom) + 'px',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 4,
      'target-arrow-shape': 'triangle',
      'line-color': '#FFE6A9',
      'target-arrow-color': '#FFE6A9',
      'curve-style': 'bezier',
    },
  }, {
    selector: '.selected',
    style: {
      'background-color': '#75b5aa',
      'line-color': '#75b5aa',
      'target-arrow-color': '#75b5aa',
    },
  },
  {
    selector: '.merging',
    style: {
      'background-color': '#d9f2b8',
      'line-color': '#d9f2b8',
      'target-arrow-color': '#d9f2b8',
    },
  },
];

class IokEdit extends Component {
  constructor(props) {
    super(props);
    this.nodeProps = React.createRef();
    this.state = {
      zoom: 1,
    };
  }

  onNodeTap(evt, cy) {
    const { selected, selectNode } = this.props;
    if (evt.target === cy) {
      if (selected) selectNode(null);
      this.nodeProps.current.setStateFromNode({});
    } else if (evt.target.isNode()) {
      const id = evt.target.id();
      if (!selected || selected.id !== id) {
        selectNode(calcCurrentNode(evt.target));
        this.nodeProps.current.setStateFromNode(evt.target.data());
      }
    }
  }

  initCy(cy) {
    const { selected, mergingNode } = this.props;
    cy.nodes().removeClass('selected merging');
    if (selected) cy.getElementById(selected.id).addClass('selected');
    if (mergingNode) cy.getElementById(mergingNode.id).addClass('merging');
    cy.layout({ name: 'breadthfirst', fit: false }).run();

    if (cy === this.cy) return;
    this.cy = cy;
    // Needed to handle multiple triggers
    // when React is slow to update
    /* let lastSelected = null; */
    cy.autounselectify(true);
    cy.autoungrabify(true);
    cy.on('tap', (evt) => this.onNodeTap(evt, cy));
    cy.on('zoom', (evt) => this.setState({ zoom: cy.zoom() }));
  }

  addNode() {
    const { addNode, selected } = this.props;
    const parent = selected || {};
    addNode(parent.id, {
      name: `Test ${Math.random()}`,
      node_type: 1,
    });
  }

  editNode() {
    const { editNode } = this.props;
    // ask for edits
    editNode();
  }

  deleteNode() {
    const { deleteNode, selectNode, selected } = this.props;
    if (selected) deleteNode(selected.id);
    selectNode(null);
  }

  mergeNode() {
    const { selectMergeNode, selected, mergingNode } = this.props;
    if (!mergingNode) {
      selectMergeNode(selected);
    }
  }

  endMerge() {
    const { selectMergeNode } = this.props;
    selectMergeNode(null);
  }

  confirmMerge() {
    const { mergeNode, selectMergeNode, selected, mergingNode } = this.props;
    if (mergingNode && selected) {
      mergeNode(mergingNode.id, selected.id);
      selectMergeNode(null);
    }
  }

  importGraph(event) {
    const { uploadGraph } = this.props;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const obj = JSON.parse(ev.target.result);
        uploadGraph(obj);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    if (event.target.files) reader.readAsText(event.target.files[0]);
  }

  downloadGraph() {
    const { graph } = this.props;
    const exportName = 'file.json';
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(graph))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  addNodeDialog() {

  }

  render() {
    const { elements, selected, mergingNode } = this.props;
    const { zoom } = this.state;
    return (
      <div className="graph">
        <h1>Hello I'm a birb 🐦. *Chirp*</h1>
        <div>
          <div>
            <button type="button" onClick={() => this.addNode()}>Add node</button>
            <button type="button" onClick={() => this.editNode()}>Edit node</button>
            <button type="button" onClick={() => this.deleteNode()}>Delete node</button>
            <button type="button" onClick={() => this.mergeNode()}>Merge node</button>

            <button type="button" onClick={() => document.getElementById('selectedFile').click()}>Import Graph</button>
            <input type="file" id="selectedFile" className="nodisplay" onChange={(evt) => this.importGraph(evt)} />
            <button type="button" onClick={() => this.downloadGraph()}>Export Graph</button>
            <button type="button" onClick={() => this.mergeNode()}>Publish Graph</button>


            {mergingNode ? (
              <div>
                <button onClick={() => this.endMerge()}>Cancel Merge</button>
                <button onClick={() => this.confirmMerge()}>Confirm Merge</button>
              </div>
            ) : <div />}
          </div>

          <CytoscapeComponent
            cy={(cy) => this.initCy(cy)}
            elements={elements}
            style={{ width: '100%', height: '400px' }}
            stylesheet={IokStyle(zoom)}
          />
        </div>

        <p>
          <code>
            Selected:
            {selected ? selected.id : 'null'}
          </code>
        </p>
        <NodeProperties title="Hello node" node={selected} ref={this.nodeProps} />
        <pre><code>{JSON.stringify(elements, null, 2)}</code></pre>
      </div>
    );
  }
}

IokEdit.propTypes = {
  graph: PropTypes.arrayOf(PropTypes.object).isRequired,
  addNode: PropTypes.func.isRequired,
  editNode: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  mergeNode: PropTypes.func.isRequired,
  uploadGraph: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  selectMergeNode: PropTypes.func.isRequired,
  selected: PropTypes.object,
  mergingNode: PropTypes.object,
};

export default IokEdit;