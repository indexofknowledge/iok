import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';
import './IokEdit.css';
import NodeProperties from './NodeProperties';
import { saveIPFSGraph } from './storage/ipfs';
import { loadGraph } from './loading.js';
import { parseParams } from './urlUtils';
const IokStyle = (zoom) => [
  {
    selector: 'node[name]',
    style: {
      'background-color': '#f8be35',
      label: 'data(name)',
      'font-size': `${15 / Math.sqrt(zoom)}px`,
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
    const { storage, options } = parseParams();
    this.state = {
      zoom: 1,
      submitFunc: null,
      storage,
      options
    };
    this.addNode = this.addNode.bind(this);
    this.editNode = this.editNode.bind(this);
    loadGraph(storage, options).then((json) => this.onSuccessLoadGraph(json))
      .catch(() => alert('oops graph couldnt load'));
  }

  onNodeTap(evt, cy) {
    const { selected, selectNode } = this.props;
    if (evt.target === cy) {
      if (selected) {
        selectNode(null);
        this.setState({ submitFunc: null });
      }
    } else if (evt.target.isNode()) {
      const id = evt.target.id();
      if (!selected || selected.id !== id) {
        selectNode(id);
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
    cy.on('zoom', () => this.setState({ zoom: cy.zoom() }));
  }

  openAddNode() {
    this.setState({ submitFunc: this.addNode });
  }

  addNode(id, props) {
    const { addNode } = this.props;
    addNode(id, props);
    this.setState({ submitFunc: null });
  }

  openEditNode() {
    const { selected } = this.props;
    this.nodeProps.current.setStateFromNode(selected.data);
    this.setState({ submitFunc: this.editNode });
  }

  editNode(id, props) {
    const { editNode } = this.props;
    editNode(id, props);
    this.setState({ submitFunc: null });
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
    const {
      mergeNode, selectMergeNode, selected, mergingNode,
    } = this.props;
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
        console.log(obj);
        uploadGraph(obj);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    if (event.target.files) reader.readAsText(event.target.files[0]);
  }

  publishGraph() {
    const { graph } = this.props;
    console.log('PUBLISHING', { elements: graph });

    // saveCache(graph, storage, options);

    // switch (storage) {
    // case STORAGE_TYPES.IPFS:
    // might result in invalid state if cache is not updated after onHashChange
    saveIPFSGraph({ elements: graph },
      (hash) => { alert(hash); });
    // break;
    // case STORAGE_TYPES.BLOCKSTACK:
    //   saveBlockstackGraph(graph, this.userSession);
    //   break;
    // default:
    //   break;
    // }
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

  onSuccessLoadGraph(graph) {
    const { uploadGraph } = this.props;
    if (graph) uploadGraph(graph);
    console.log("THE SUCCESS", graph.elements);
  }

  render() {
    const { elements, selected, mergingNode } = this.props;
    const { zoom, submitFunc } = this.state;
    return (
      <div className="graph">
        <div className="toolbar">
          <div className="birb"><span role="img" aria-label="bird">🐦</span></div>
          <button className="tool" type="button" onClick={() => this.openAddNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </button>
          <button className="tool" type="button" onClick={() => this.openEditNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.1346 5.62957C20.5138 6.01957 20.5138 6.64957 20.1346 7.03957L18.3554 8.86957L14.7096 5.11957L16.4888 3.28957C16.8679 2.89957 17.4804 2.89957 17.8596 3.28957L20.1346 5.62957ZM2.9165 20.9995V17.2495L13.6693 6.18953L17.3151 9.93953L6.56234 20.9995H2.9165Z" />
            </svg>
          </button>
          <button className="tool" type="button" onClick={() => this.deleteNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" />
            </svg>
          </button>
          <button className="tool" type="button" onClick={() => this.mergeNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.75022 20C13.0474 20 16.528 16.42 16.528 12C16.528 7.58 13.0474 4.00001 8.75022 4.00001C4.453 4.00001 0.972446 7.58001 0.972447 12C0.972448 16.42 4.453 20 8.75022 20ZM8.75013 5.99998C11.9682 5.99998 14.5835 8.68998 14.5835 12C14.5835 15.31 11.9682 18 8.75013 18C5.53208 18 2.9168 15.31 2.9168 12C2.9168 8.68998 5.53208 5.99998 8.75013 5.99998ZM16.528 17.6501C18.7933 16.8301 20.4169 14.6101 20.4169 12.0001C20.4169 9.3901 18.7933 7.1701 16.528 6.3501L16.528 4.26011C19.8822 5.1501 22.3613 8.2701 22.3613 12.0001C22.3613 15.7301 19.8822 18.8501 16.528 19.7401L16.528 17.6501Z" />
            </svg>
          </button>

          <button className="tool" type="button" onClick={() => document.getElementById('selectedFile').click()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 5V3H20V5H4ZM11 11H8L12 7L16 11H13V21H11V11Z" />
            </svg>
          </button>
          <input type="file" id="selectedFile" className="nodisplay" onChange={(evt) => this.importGraph(evt)} />
          <button className="tool" type="button" onClick={() => this.downloadGraph()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 13H16L12 17L8 13H11V3H13V13ZM4 21V19H20V21H4Z" />
            </svg>
          </button>
          <button className="tool" type="button" onClick={() => this.publishGraph()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4C15.64 4 18.67 6.59 19.35 10.04C21.95 10.22 24 12.36 24 15C24 17.76 21.76 20 19 20H6C2.69 20 0 17.31 0 14C0 10.91 2.34 8.36 5.35 8.04C6.6 5.64 9.11 4 12 4ZM13.9999 17V13H16.9999L11.9999 7.99997L6.99992 13H9.99992V17H13.9999Z" />
            </svg>
          </button>

          {mergingNode ? (
            <div>
              <button type="button" className="tool" onClick={() => this.endMerge()}>Cancel Merge</button>
              <button type="button" className="tool" onClick={() => this.confirmMerge()}>Confirm Merge</button>
            </div>
          ) : <div />}
        </div>

        <div className="innerGraph">
          <h1>Hiiiiiiiiii!! IoK</h1>
          <CytoscapeComponent
            cy={(cy) => this.initCy(cy)}
            elements={elements}
            style={{ width: '100%', height: '100%' }}
            stylesheet={IokStyle(zoom)}
          />
          {/* <p>
            <code>
              Selected:
            {selected ? selected.id : 'null'}
            </code>
          </p> */}
          <NodeProperties title="Hello node" node={selected} ref={this.nodeProps} submit={submitFunc} editing={submitFunc === this.editNode} />
          {/* <pre><code>{JSON.stringify(elements, null, 2)}</code></pre> */}
        </div>
      </div>
    );
  }
}

IokEdit.propTypes = {
  graph: PropTypes.object.isRequired, // eslint-disable-line
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  addNode: PropTypes.func.isRequired,
  editNode: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  mergeNode: PropTypes.func.isRequired,
  uploadGraph: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  selectMergeNode: PropTypes.func.isRequired,
  selected: PropTypes.object, // eslint-disable-line
  mergingNode: PropTypes.object, // eslint-disable-line
};

export default IokEdit;
