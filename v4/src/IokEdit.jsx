import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import './IokEdit.css';
import { showBlockstackConnect } from '@blockstack/connect';
import NodeProperties from './NodeProperties';
import { saveIPFSGraph } from './storage/ipfs';
import { saveBlockstackGraph } from './storage/blockstack';
import { loadGraph, DEFAULT_SESSION } from './loading';
import { saveCache } from './storage/cache';
import { parseParams } from './urlUtils';
import treeLayout from './layout';
import {
  STORAGE_TYPES, NTYPE, TOOL_TYPES, IMPORT_TYPES,
} from './types';
import { graphFromUrl } from './md_scraper';
import Toolbar from './Toolbar';


Cytoscape.use(treeLayout);

const IokStyle = (zoom) => [
  {
    selector: 'node[name]',
    style: {
      'background-color': '#DAB357',
      label: 'data(name)',
      'font-size': `${15 / Math.sqrt(zoom)}px`,
      color: '#D8D9F3',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      'target-arrow-shape': 'triangle',
      'line-color': '#5B67B2',
      'target-arrow-color': '#5B67B2',
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
    const { uploadGraph } = this.props;
    this.nodeProps = React.createRef();
    const { storage, options } = parseParams();
    this.state = {
      zoom: 1,
      tool: null,
      storage,
      options,
      importType: 0,
      importLink: '',
      secretCodeSign: [],
    };
    loadGraph(storage, options).then((graph) => uploadGraph(graph))
      .catch(() => alert('oops graph couldnt load'));
  }

  componentDidMount() {
    const { timerID } = this.state;
    clearInterval(timerID);
    const newTimerID = setInterval(this.periodicallySaveCache, 5000);
    this.setState({ timerID: newTimerID });
  }

  onNodeTap = (evt, cy) => {
    const { selected, selectNode, prevNode } = this.props;
    if (evt.target === cy) {
      if (selected) {
        this.clearTool();
        selectNode(null);
      }
    } else if (evt.target.isNode()) {
      const id = evt.target.id();
      if (selected && selected.id === id) return;
      this.clearTool();
      if (prevNode !== null && id === prevNode.id) {
        selectNode(null);
        return;
      }
      selectNode(id);
      // extra below
      const { secretCodeSign } = this.state;
      this.setState({ secretCodeSign: [...secretCodeSign, id] }, () => {
        // eslint-disable-next-line
        if (JSON.stringify(this.statesecretCodeSign) === JSON.stringify(['04eaf9a2a65d37f254fab35f969da7b133cea2087e1be846ea2dc8ccbb0e2470',
          'e6f043e27913e1ceb469bfbcc6eca983a374918618c4912e65f4756f6e177855', '8d3e61ce168c16ae5c10fc0eb2085e7063844736be62d37c1318b437e60a06b2',
          '71686ead6a4dc2481870877da6a888fab7c488819572c391b71acabd047930fe', 'e6f043e27913e1ceb469bfbcc6eca983a374918618c4912e65f4756f6e177855'])) {
          window.location = 'https://bab-internal.slack.com';
        }
      });
    }
  }

  clearTool = () => {
    const { tool } = this.state;
    if (tool === TOOL_TYPES.MERGE || tool === TOOL_TYPES.CONNECT) {
      return;
    }
    this.setState({ tool: null });
  }

  periodicallySaveCache = () => {
    const { storage, options } = this.state;
    const { graph } = this.props;
    saveCache(graph, storage, options);
  }

  initCy = (cy) => {
    const { selected, prevNode } = this.props;
    cy.nodes().removeClass('selected merging');
    cy.maxZoom(10);
    cy.minZoom(0.1);
    if (selected) cy.getElementById(selected.id).addClass('selected');
    if (prevNode) cy.getElementById(prevNode.id).addClass('merging');
    cy.layout({
      /* name: 'breadthfirst', fit: false, spacingFactor: 0.8, circle: true, maximal: true */
      name: 'treeCircle',
    }).run();

    if (cy === this.cy) return;
    this.cy = cy;
    // Needed to handle multiple triggers
    // when React is slow to update
    /* let lastSelected = null; */
    cy.autounselectify(true);
    cy.autoungrabify(true);
    cy.boxSelectionEnabled(false);
    cy.on('tap', (evt) => this.onNodeTap(evt, cy));
    cy.on('zoom', () => this.setState({ zoom: cy.zoom() }));
    cy.pan({ x: 0, y: 50 });
    function recenterMaybe() {
      const width = cy.width();
      const height = cy.height();
      const rbb = cy.elements().renderedBoundingbox();
      if (rbb.x2 < 0 || rbb.y2 < 0 || rbb.x1 > width || rbb.y1 > height) {
        cy.off('mouseup touchend zoom', recenterMaybe);
        cy.animate({
          zoom: 1,
          pan: { x: 0, y: 50 },
          easing: 'ease-out',
          duration: 500,
          complete: () => {
            cy.on('mouseup touchend zoom', recenterMaybe);
          },
        });
      }
    }
    cy.on('mouseup touchend zoom', recenterMaybe);
  }

  /** If tool is already selected, unselect it
   *  Else select the tool if condition is true
   */
  toggleTool = (tool, condition) => {
    // eslint-disable-next-line
    if (this.state.tool === tool) {
      this.setState({ tool: null });
    } else if (condition) {
      this.setState({ tool });
    }
  }

  openAddNode = () => {
    this.nodeProps.current.setStateFromNode(NodeProperties.resetState());
    this.toggleTool(TOOL_TYPES.ADD, true);
  }

  addNode = (id, props) => {
    const { addNode } = this.props;
    addNode(id, props);
    this.setState({ tool: null });
  }

  openEditNode = () => {
    const { selected } = this.props;
    if (selected) {
      this.nodeProps.current.setStateFromNode(selected.data);
    }
    this.toggleTool(TOOL_TYPES.EDIT, selected);
  }

  editNode = (id, props) => {
    const { editNode } = this.props;
    editNode(id, props);
    this.setState({ tool: null });
  }

  deleteNode = () => {
    const { deleteNode, selectNode, selected } = this.props;
    if (selected) deleteNode(selected.id);
    selectNode(null);
  }

  mergeNode = () => {
    const { selectPrevNode, selected, prevNode } = this.props;
    const shouldMerge = !prevNode && selected;
    if (shouldMerge) selectPrevNode(selected.id);
    this.toggleTool(TOOL_TYPES.MERGE, shouldMerge);
  }

  endMergeorConnect = () => {
    const { selectPrevNode } = this.props;
    selectPrevNode(null);
    this.setState({ tool: null });
  }

  confirmMerge = () => {
    const {
      mergeNode, selectPrevNode, selected, prevNode,
    } = this.props;
    if (prevNode && selected
      && prevNode.data.node_type !== NTYPE.RESO
      && selected.data.node_type !== NTYPE.RESO) {
      mergeNode(prevNode.id, selected.id);
      selectPrevNode(null);
    } else {
      selectPrevNode(null);
      alert("You can't merge resource nodes");
    }
    this.setState({ tool: null });
  }

  connectNode = () => {
    const { selectPrevNode, selected, prevNode } = this.props;
    const shouldConnect = !prevNode && selected;
    if (shouldConnect) selectPrevNode(selected.id);
    this.toggleTool(TOOL_TYPES.CONNECT, shouldConnect);
  }

  confirmConnect = () => {
    const {
      connectNode, selectPrevNode, selected, prevNode,
    } = this.props;
    if (prevNode && selected && selected.data.node_type === NTYPE.TOPIC) {
      console.log(prevNode, 'AND', selected);
      connectNode(prevNode.id, selected.id);
      selectPrevNode(null);
    } else {
      selectPrevNode(null);
      alert("You can't connect");
    }
    this.setState({ tool: null });
  }

  importGraph = (importOrMerge) => {
    // const { uploadGraph, importGraph } = this.props;
    const { importType, importLink } = this.state;

    if (importType === IMPORT_TYPES.BLOCKSTACK) {
      // Maybe do stuff later
    } else if (importType === IMPORT_TYPES.IPFS) {
      loadGraph(STORAGE_TYPES.IPFS, { hash: importLink })
        .then((graph) => importOrMerge(graph))
        .catch((e) => { alert('oops graph couldnt load'); console.error(e); });
    } else if (importType === IMPORT_TYPES.LINK) {
      graphFromUrl(importLink).then((graph) => {
        importOrMerge(graph);
      });
    } else if (importType === IMPORT_TYPES.FILE) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const obj = JSON.parse(ev.target.result);
          console.log(obj);
          importOrMerge(obj);
        } catch (err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(importLink);
    }
    this.setState({ tool: null });
  }

  setImportType = (evt) => {
    this.setState({ importType: evt.target.value });
  }

  saveIpfs = () => {
    const { graph } = this.props;
    // saveCache(graph, storage, options);

    // switch (storage) {
    // case STORAGE_TYPES.IPFS:
    // might result in invalid state if cache is not updated after onHashChange
    saveIPFSGraph(graph, (hash) => { alert(`New hash: ${hash}`); });
    // break;
    // case STORAGE_TYPES.BLOCKSTACK:
    //   saveBlockstackGraph(graph, this.userSession);
    //   break;
    // default:
    //   break;
    // }
  }

  saveBlockstack = async () => {
    const { graph } = this.props;
    console.log('AM I SIGNED IN', DEFAULT_SESSION.isUserSignedIn());
    console.log(DEFAULT_SESSION.loadUserData());
    console.log(DEFAULT_SESSION.getFile('graph.json', { decrypt: false }).then((f) => console.log('the file', f), (e) => console.error(e)));
    window.session = DEFAULT_SESSION;
    if (!DEFAULT_SESSION.isUserSignedIn()) {
      showBlockstackConnect({
        redirectTo: '/',
        userSession: DEFAULT_SESSION,
        sendToSignIn: true,
        finished: ({ userSession }) => {
          console.log('user session', userSession);
          this.saveBlockstack();
        },
        appDetails: {
          name: 'Index of Knowledge',
          icon: 'favicon.ico',
        },
      });
      return;
    }
    console.log('saving to', DEFAULT_SESSION);
    saveBlockstackGraph(graph, DEFAULT_SESSION).then(() => {
      alert('It saved!');
      console.log(DEFAULT_SESSION);
    }, () => (e) => {
      alert(`oops ${e.message}`);
    });
  }

  downloadGraph = () => {
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

  importBlockstack = () => {
    const { importGraph } = this.props;
    const loaduser = prompt("What's your blockstack username?");
    loadGraph(STORAGE_TYPES.BLOCKSTACK, { loaduser })
      .then((graph) => { importGraph(graph); console.log(graph); })
      .catch((e) => { alert('oops graph couldnt load'); console.error(e); });
  }

  importDialog = (importOrMerge) => {
    const { importType, importLink } = this.state;
    const { importGraph } = this.props;
    return (
      <div className="dialog">
        <h2>{importOrMerge === importGraph ? 'Import Graph' : 'Upload Graph'}</h2>
        <p>{importOrMerge === importGraph ? 'Add a graph to your workspace.' : 'Replace your workspace with a new graph.'}</p>
        <div className="formgroup">
          <div className="formgroup">
            <input
              required
              id="i_blockstack"
              name="importType"
              type="radio"
              value={IMPORT_TYPES.BLOCKSTACK}
              checked={importType === IMPORT_TYPES.BLOCKSTACK}
              onChange={this.setImportType}
            />
            <label htmlFor="i_blockstack" className="button">Blockstack </label>

            <input
              required
              id="i_ipfs"
              name="importType"
              type="radio"
              value={IMPORT_TYPES.IPFS}
              checked={importType === IMPORT_TYPES.IPFS}
              onChange={this.setImportType}
            />
            <label htmlFor="i_ipfs" className="button"> IPFS</label>

            <input
              required
              id="i_link"
              name="importType"
              type="radio"
              value={IMPORT_TYPES.LINK}
              checked={importType === IMPORT_TYPES.LINK}
              onChange={this.setImportType}
            />
            <label htmlFor="i_link" className="button">Link</label>

            <input
              required
              id="i_file"
              name="importType"
              type="radio"
              value={IMPORT_TYPES.FILE}
              checked={importType === IMPORT_TYPES.FILE}
              onChange={this.setImportType}
            />
            <label htmlFor="i_file" className="button">File</label>
          </div>
          {/* <input required type="text" placeholder="Link" value={importLink}
              onChange={(ev) => this.setState({ importLink: ev.target.value })} /> */}
          {importType === IMPORT_TYPES.IPFS || importType === IMPORT_TYPES.LINK
            ? <input required type="text" placeholder={importType === IMPORT_TYPES.IPFS ? 'Hash' : 'Link'} value={importLink} onChange={(ev) => this.setState({ importLink: ev.target.value })} />
            : <span />}
          {importType === IMPORT_TYPES.FILE ? <input required type="file" onChange={(ev) => this.setState({ importLink: ev.target.files[0] })} />
            : <span />}
        </div>
        <div className="rightButton">
          <button type="button" className="button" onClick={() => this.clearTool()}>Cancel</button>
          <button type="submit" className="button filledButton" onClick={() => this.importGraph(importOrMerge)}>Submit</button>
        </div>
      </div>
    );
  }

  render() {
    const {
      elements, selected, uploadGraph, importGraph,
    } = this.props;
    const { zoom, tool } = this.state;
    let submitFunc = null;
    if (tool === TOOL_TYPES.ADD) submitFunc = this.addNode;
    if (tool === TOOL_TYPES.EDIT) submitFunc = this.editNode;
    return (
      <div className="graph">
        <Toolbar tool={tool}
          openAddNode={this.openAddNode} openEditNode={this.openEditNode} mergeNode={this.mergeNode} connectNode={this.connectNode} deleteNode={this.deleteNode} toggleTool={this.toggleTool} downloadGraph={this.downloadGraph}
        />

        <div className="innerGraph">
          <h1>Hiiiiiiiiii!! IoK</h1>
          <CytoscapeComponent
            cy={(cy) => this.initCy(cy)}
            elements={elements}
            style={{ width: '100%', height: '100%' }}
            stylesheet={IokStyle(zoom)}
          />
          <NodeProperties title="Hello node" node={selected} ref={this.nodeProps} submit={submitFunc} editing={submitFunc === this.editNode} cancel={this.clearTool} />
          {tool === TOOL_TYPES.MERGE ? (
            <div className="dialog">
              <h2>Merge Node</h2>
              <p> Select a node to combine with your currently selected node.</p>
              <button type="button" className="button" onClick={() => this.endMergeorConnect()}>Cancel Merge</button>
              <button type="button" className="button filledButton" disabled={selected === null} onClick={() => this.confirmMerge()}>Confirm Merge</button>
            </div>
          ) : ''}
          {tool === TOOL_TYPES.CONNECT ? (
            <div className="dialog">
              <h2>Connect Node</h2>
              <p>Choose a new parent for your currently selected node.</p>
              <button type="button" className="button" onClick={() => this.endMergeorConnect()}>Cancel Connect</button>
              <button type="button" className="button filledButton" disabled={selected === null} onClick={() => this.confirmConnect()}>Confirm Connect</button>
            </div>
          ) : <div />}
          {tool === TOOL_TYPES.IMPORT ? this.importDialog(importGraph) : ''}
          {tool === TOOL_TYPES.OPEN ? this.importDialog(uploadGraph) : ''}

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
  importGraph: PropTypes.func.isRequired,
  uploadGraph: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  selectPrevNode: PropTypes.func.isRequired,
  connectNode: PropTypes.func.isRequired,
  selected: PropTypes.object, // eslint-disable-line
  prevNode: PropTypes.object, // eslint-disable-line
};

export default IokEdit;
