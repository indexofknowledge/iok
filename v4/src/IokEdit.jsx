import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CytoscapeComponent from 'react-cytoscapejs';
import './IokEdit.css';
import { showBlockstackConnect } from '@blockstack/connect';
import NodeProperties from './NodeProperties';
import { saveIPFSGraph } from './storage/ipfs';
import { saveBlockstackGraph } from './storage/blockstack';
import { loadGraph, DEFAULT_SESSION } from './loading';
import { saveCache, wipeCache } from './storage/cache';
import { parseParams } from './urlUtils';
import { STORAGE_TYPES, NTYPE, TOOL_TYPES, IMPORT_TYPES } from './types';
import { graphFromUrl } from './md_scraper';

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
      importLink: "",
      secretCodeSign: [],
    };
    this.addNode = this.addNode.bind(this);
    this.editNode = this.editNode.bind(this);
    this.openEditNode = this.openEditNode.bind(this);
    this.setImportType = this.setImportType.bind(this);
    this.periodicallySaveCache = this.periodicallySaveCache.bind(this);
    this.clearTool = this.clearTool.bind(this);
    loadGraph(storage, options).then((graph) => uploadGraph(graph))
      .catch(() => alert('oops graph couldnt load'));
  }

  componentDidMount() {
    const { timerID } = this.state;
    clearInterval(timerID);
    const newTimerID = setInterval(this.periodicallySaveCache, 5000);
    this.setState({ timerID: newTimerID });
  }

  periodicallySaveCache() {
    const { storage, options } = this.state;
    const { graph } = this.props;
    saveCache(graph, storage, options);
  }

  clearTool() {
    if (this.state.tool == TOOL_TYPES.MERGE) {
      return;
    }
    this.setState({ tool: null });
  }

  onNodeTap(evt, cy) {
    const { selected, selectNode, mergingNode } = this.props;
    console.log('SELECTED', selected, 'MERGING', mergingNode);
    if (evt.target === cy) {
      if (selected) {
        this.clearTool();
        selectNode(null);
      }
    } else if (evt.target.isNode()) {
      const id = evt.target.id();
      if (selected && selected.id === id) return;
      this.clearTool();
      if (mergingNode !== null && id === mergingNode.id) {
        selectNode(null);
        return;
      }
      selectNode(id);
      //extra below
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

  initCy(cy) {
    const { selected, mergingNode } = this.props;
    cy.nodes().removeClass('selected merging');
    cy.maxZoom(10);
    cy.minZoom(0.1);
    if (selected) cy.getElementById(selected.id).addClass('selected');
    if (mergingNode) cy.getElementById(mergingNode.id).addClass('merging');
    cy.layout({
      name: 'breadthfirst', circle: false, fit: false, spacingFactor: 0.8,
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
  toggleTool(tool, condition) {
    if (this.state.tool === tool) {
      this.setState({ tool: null })
    } else if (condition) {
      this.setState({ tool })
    }
  }

  openAddNode() {
    this.toggleTool(TOOL_TYPES.ADD, true);
  }

  addNode(id, props) {
    const { addNode } = this.props;
    addNode(id, props);
    this.setState({ tool: null });
  }

  openEditNode() {
    const { selected } = this.props;
    if (selected) {
      this.nodeProps.current.setStateFromNode(selected.data);
    }
    this.toggleTool(TOOL_TYPES.EDIT, selected);
  }

  editNode(id, props) {
    const { editNode } = this.props;
    editNode(id, props);
    this.setState({ tool: null });
  }

  deleteNode() {
    const { deleteNode, selectNode, selected } = this.props;
    if (selected) deleteNode(selected.id);
    selectNode(null);
  }

  mergeNode() {
    const { selectMergeNode, selected, mergingNode } = this.props;
    const shouldMerge = !mergingNode && selected
    if (shouldMerge) selectMergeNode(selected.id);
    this.toggleTool(TOOL_TYPES.MERGE, shouldMerge);
  }

  endMerge() {
    const { selectMergeNode } = this.props;
    selectMergeNode(null);
    this.setState({ tool: null });
  }

  confirmMerge() {
    const {
      mergeNode, selectMergeNode, selected, mergingNode,
    } = this.props;
    if (mergingNode && selected
      && mergingNode.data.node_type !== NTYPE.RESO
      && selected.data.node_type !== NTYPE.RESO) {
      mergeNode(mergingNode.id, selected.id);
      selectMergeNode(null);
    } else {
      selectMergeNode(null);
      alert("You can't merge resource nodes");
    }
    this.setState({ tool: null });
  }

  importGraph(event) {
    const { uploadGraph } = this.props;
    const { importType, importLink } = this.state;
    if (importType === IMPORT_TYPES.BLOCKSTACK) {

    } else if (importType === IMPORT_TYPES.IPFS) {
      const { importGraph } = this.props;
      const { importLink } = this.state;
      console.log(importLink);
      loadGraph(STORAGE_TYPES.IPFS, { hash: importLink })
        .then((graph) => importGraph(graph))
        .catch((e) => { alert('oops graph couldnt load'); console.error(e); });

    } else if (importType === IMPORT_TYPES.LINK) {
      graphFromUrl(importLink).then((graph) => {
        uploadGraph(graph);
      })

    } else if (importType === IMPORT_TYPES.FILE) {
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
      reader.readAsText(importLink);
    }
  }

  setImportType(evt) {
    this.setState({ importType: evt.target.value });
  }

  saveIpfs() {
    const { graph } = this.props;
    console.log('PUBLISHING', graph);

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

  async saveBlockstack() {
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

  importBlockstack() {
    const { importGraph } = this.props;
    const loaduser = prompt("What's your blockstack username?");
    loadGraph(STORAGE_TYPES.BLOCKSTACK, { loaduser })
      .then((graph) => { importGraph(graph); console.log(graph); })
      .catch((e) => { alert('oops graph couldnt load'); console.error(e); });
  }

  importDialog() {
    const { importType, importLink } = this.state;
    return (
      <div className="dialog">
        <h2>Import Graph</h2>
        <div className="formgroup">
          <div className="formgroup">
            <input required id="i_blockstack" name="importType" type="radio" value={IMPORT_TYPES.BLOCKSTACK}
              checked={importType === IMPORT_TYPES.BLOCKSTACK} onChange={this.setImportType} />
            <label for="i_blockstack" className="button">Blockstack </label>

            <input required id="i_ipfs" name="importType" type="radio" value={IMPORT_TYPES.IPFS}
              checked={importType === IMPORT_TYPES.IPFS} onChange={this.setImportType} />
            <label for="i_ipfs" className="button" > IPFS</label>

            <input required id="i_link" name="importType" type="radio" value={IMPORT_TYPES.LINK}
              checked={importType === IMPORT_TYPES.LINK} onChange={this.setImportType} />
            <label for="i_link" className="button">Link</label>

            <input required id="i_file" name="importType" type="radio" value={IMPORT_TYPES.FILE}
              checked={importType === IMPORT_TYPES.FILE} onChange={this.setImportType} />
            <label for="i_file" className="button">File</label>
          </div>
          {/* <input required type="text" placeholder="Link" value={importLink} onChange={(ev) => this.setState({ importLink: ev.target.value })} /> */}
          {importType === IMPORT_TYPES.IPFS || importType === IMPORT_TYPES.LINK ?
            <input required type="text" placeholder={importType === IMPORT_TYPES.IPFS ? "Hash" : "Link"} value={importLink} onChange={(ev) => this.setState({ importLink: ev.target.value })} />
            : <span />
          }
          {importType === IMPORT_TYPES.FILE ? <input required type="file" onChange={(ev) => this.setState({ importLink: ev.target.files[0] })} />
            : <span />
          }
        </div>
        <div><input type="checkbox" id="replace" /> Replace Current Graph</div>
        <button type="submit" className="button filledButton rounded" onClick={/*document.getElementById('replace').checked ? */() => this.importGraph()}>Submit</button>
      </div>
    );
  }

  render() {
    const { elements, selected, mergingNode } = this.props;
    const { zoom, tool } = this.state;
    let submitFunc = null;
    if (tool === TOOL_TYPES.ADD) submitFunc = this.addNode;
    if (tool === TOOL_TYPES.EDIT) submitFunc = this.editNode;
    return (
      <div className="graph">
        <div className="toolbar">
          { /* eslint-disable-next-line */}
          <div className="birb" onClick={() => { document.querySelector('.birb').innerHTML = '🗿' }}>
            <span role="img" aria-label="bird">🐦</span>
            <span role="img" aria-label="bird">🐦</span>
          </div>
          <button className={tool === TOOL_TYPES.ADD ? 'tool active' : 'tool'} type="button" onClick={() => this.openAddNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </button>
          <button className={tool === TOOL_TYPES.EDIT ? 'tool active' : 'tool'} type="button" onClick={() => this.openEditNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.1346 5.62957C20.5138 6.01957 20.5138 6.64957 20.1346 7.03957L18.3554 8.86957L14.7096 5.11957L16.4888 3.28957C16.8679 2.89957 17.4804 2.89957 17.8596 3.28957L20.1346 5.62957ZM2.9165 20.9995V17.2495L13.6693 6.18953L17.3151 9.93953L6.56234 20.9995H2.9165Z" />
            </svg>
          </button>

          <button className={tool == TOOL_TYPES.MERGE ? 'tool active' : 'tool'} type="button" onClick={() => this.mergeNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.75022 20C13.0474 20 16.528 16.42 16.528 12C16.528 7.58 13.0474 4.00001 8.75022 4.00001C4.453 4.00001 0.972446 7.58001 0.972447 12C0.972448 16.42 4.453 20 8.75022 20ZM8.75013 5.99998C11.9682 5.99998 14.5835 8.68998 14.5835 12C14.5835 15.31 11.9682 18 8.75013 18C5.53208 18 2.9168 15.31 2.9168 12C2.9168 8.68998 5.53208 5.99998 8.75013 5.99998ZM16.528 17.6501C18.7933 16.8301 20.4169 14.6101 20.4169 12.0001C20.4169 9.3901 18.7933 7.1701 16.528 6.3501L16.528 4.26011C19.8822 5.1501 22.3613 8.2701 22.3613 12.0001C22.3613 15.7301 19.8822 18.8501 16.528 19.7401L16.528 17.6501Z" />
            </svg>
          </button>

          <button className="tool" type="button">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor">
              <path d="M29.9987 7.5L23.332 14.1667H28.332V25.8333C28.332 27.6667 26.832 29.1667 24.9987 29.1667C23.1654 29.1667 21.6654 27.6667 21.6654 25.8333V14.1667C21.6654 10.4833 18.682 7.5 14.9987 7.5C11.3154 7.5 8.33203 10.4833 8.33203 14.1667V25.8333H3.33203L9.9987 32.5L16.6654 25.8333H11.6654V14.1667C11.6654 12.3333 13.1654 10.8333 14.9987 10.8333C16.832 10.8333 18.332 12.3333 18.332 14.1667V25.8333C18.332 29.5167 21.3154 32.5 24.9987 32.5C28.682 32.5 31.6654 29.5167 31.6654 25.8333V14.1667H36.6654L29.9987 7.5Z" />
            </svg>
          </button>

          <button className="tool" type="button" onClick={() => this.deleteNode()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" />
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
          <div class="toolbar-bottom">
            <button className="tool" type="button">
              <svg width="24" height="24" viewBox="0 0 36 36" fill="currentColor" >
                <path d="M15 6H6C4.35 6 3.015 7.35 3.015 9L3 27C3 28.65 4.35 30 6 30H30C31.65 30 33 28.65 33 27V12C33 10.35 31.65 9 30 9H18L15 6Z" />
              </svg>
            </button>

            <button className="tool" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.10999 4 6.59998 5.64 5.34998 8.04C2.34003 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.78998 18 2 16.21 2 14C2 11.95 3.53003 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08002 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM10.55 13H8L12 9L16 13H13.45V16H10.55V13Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="innerGraph">
          <h1>Hiiiiiiiiii!! IoK</h1>
          <CytoscapeComponent
            cy={(cy) => this.initCy(cy)}
            elements={elements}
            style={{ width: '100%', height: '100%' }}
            stylesheet={IokStyle(zoom)}
          />
          <NodeProperties title="Hello node" node={selected} ref={this.nodeProps} submit={submitFunc} editing={submitFunc === this.editNode} cancel={this.clearTool} />
          <div style={{ position: 'fixed', bottom: 0 }}>
            <button type="button" className="button filledButton" onClick={() => this.importBlockstack()}>Import from Blockstack</button>
            <button type="button" className="button filledButton" onClick={() => this.saveIpfs()}>Save to IPFS</button>
            <button type="button" className="button filledButton" onClick={() => this.saveBlockstack()}>Save to Blockstack</button>
            <button type="button" className="button filledButton" onClick={wipeCache}>Wipe cache</button>
          </div>
          {/* <pre><code>{JSON.stringify(elements, null, 2)}</code></pre> */}
          {tool == TOOL_TYPES.MERGE ? (
            <div className="dialog">
              <h2>Merge Node</h2>
              <button type="button" className="button" onClick={() => this.endMerge()}>Cancel Merge</button>
              <button type="button" className="button filledButton" disabled={selected === null} onClick={() => this.confirmMerge()}>Confirm Merge</button>
            </div>
          ) : <div />}

          {this.importDialog()}

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
  selectMergeNode: PropTypes.func.isRequired,
  selected: PropTypes.object, // eslint-disable-line
  mergingNode: PropTypes.object, // eslint-disable-line
};

export default IokEdit;
