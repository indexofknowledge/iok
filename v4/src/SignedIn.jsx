// eslint-disable-line
/* eslint-disable no-console */
import React, { Component } from 'react';
import { UserSession } from 'blockstack';
import Split from 'react-split';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import edgehandles from 'cytoscape-edgehandles';

import NavBar from './NavBar';
import IokText from './IokText';
import {
  appConfig,
  GRAPH_FILENAME,
  DEFL_GRAPH_ELEMENTS,
  DEFL_GRAPH_STYLE,
  DEFL_STORAGE_OPTIONS,
  DEFL_STORAGE,
} from './constants';
import Log from './log';
import { loadBlockstackGraph, saveBlockstackGraph } from './storage/blockstack';
import { loadIPFSGraph, saveIPFSGraph } from './storage/ipfs';
import { loadCache, saveCache, wipeCache } from './storage/cache';
import './styles/SignedIn.css';

import {
  regroupCy,
  registerNodeTap,
  registerEdgeHandles,
  toggleMeta,
  getExportableJson,
} from './listen';

import { STORAGE_TYPES } from './types';

Cytoscape.use(dagre);
Cytoscape.use(cola);
Cytoscape.use(edgehandles);

class SignedIn extends Component {
  static overrideGutterStyle() {
    // override somehow
    return {
      width: '8px',
      height: '100vh',
      'background-color': '#18191c',
    };
  }

  constructor(props) {
    super(props);
    const { storage, options } = this.props;
    Log.info('storage/options');
    Log.info(storage);
    Log.info(options);

    this.userSession = new UserSession({ appConfig });

    this.state = {
      storage,
      options,
      graphLoaded: false,
      unableToLoadGraph: false,
      selectedNode: null,
      timerID: 0,
    };

    this.loadGraph = this.loadGraph.bind(this);
    this.saveGraph = this.saveGraph.bind(this);
    this.deleteGraph = this.deleteGraph.bind(this);
    this.signOut = this.signOut.bind(this);
    this.changeLoadUser = this.changeLoadUser.bind(this);
    this.loadDefaultGraph = this.loadDefaultGraph.bind(this);
    this.loadEmptyGraph = this.loadEmptyGraph.bind(this);
    this.loadGraphFromFile = this.loadGraphFromFile.bind(this);
    this.onSuccessLoadGraph = this.onSuccessLoadGraph.bind(this);
    this.onErrorLoadGraph = this.onErrorLoadGraph.bind(this);
    this.periodicallySaveCache = this.periodicallySaveCache.bind(this);
  }

  // since we're creating the cytoscape div in this component,
  // only create the cy instance (and load data into it) after
  // we've rendered
  componentDidMount() {
    const cy = Cytoscape({
      container: document.getElementById('cy'),
      layout: {
        name: 'dagre',
        animate: true,
      },
      style: DEFL_GRAPH_STYLE,
    });
    this.setState({ cy }, () => {
      registerNodeTap(cy, (node) => {
        this.setState({ selectedNode: node });
      });
      registerEdgeHandles(cy);
      this.loadGraph();

      // autosave every second
      // to prevent interleaving interval calls, keep the timerID in state
      // and clear it before setting a new interval
      const { timerID } = this.state;
      clearInterval(timerID);
      const newTimerID = setInterval(this.periodicallySaveCache, 1000);
      this.setState({ timerID: newTimerID });
    });
  }

  onSuccessLoadGraph(jsonGraph) {
    const { cy, storage, options } = this.state;
    Log.info(jsonGraph);
    Log.info(cy);
    cy.json(jsonGraph); // edit local cy in place
    Log.info('Cy currently size', cy.elements().length);
    regroupCy(cy, false);
    regroupCy(cy);
    this.setState({ graphLoaded: true });

    // save it to cache too
    saveCache(jsonGraph, storage, options);
  }

  onErrorLoadGraph(e) {
    Log.error('Failed to load graph', e);
    const { options } = this.state;
    this.setState({
      unableToLoadGraph: true,
      options: { ...options, loaduser: 'default' },
    });
  }

  periodicallySaveCache() {
    const { cy, storage, options } = this.state;
    const graph = getExportableJson(cy);
    saveCache(graph, storage, options);
  }

  // this is important since we want to re-render each time the user changes
  changeLoadUser(newUser) {
    const { options } = this.state;
    this.setState({ options: { ...options, loaduser: newUser } });
  }

  /**
   * Load cy instance from various storage providers
   */
  loadGraph() {
    const { storage, options } = this.state;

    // only load from cache if it's valid and it's what we're requesting
    const cached = loadCache((err) => { Log.error(err, 'cache invalid'); });
    if (Object.keys(cached).length > 0) {
      // cache is exactly what we're requesting if it's the same storage and options
      // e.g. loading from a cached IoK copied from someone's blockstack storage
      if ((cached.storage === storage
        && JSON.stringify(cached.options) === JSON.stringify(options))) {
        Log.info('Load request cache');
        this.onSuccessLoadGraph(cached.graph);
        return;
      }
      // if we're loading the default graph, check cache first
      if (storage === DEFL_STORAGE
        && JSON.stringify(options) === JSON.stringify(DEFL_STORAGE_OPTIONS)) {
        Log.info('Load DEFL request cache');
        this.onSuccessLoadGraph(cached.graph);
        return;
      }
    }

    switch (storage) {
      case STORAGE_TYPES.IPFS:
        loadIPFSGraph(options.hash, this.onSuccessLoadGraph, this.onErrorLoadGraph);
        break;
      case STORAGE_TYPES.BLOCKSTACK:
        loadBlockstackGraph(
          this.userSession,
          options.loaduser,
          this.onSuccessLoadGraph,
          this.onErrorLoadGraph,
        );
        break;
      default:
        break;
    }
  }

  /**
   * Support loading graph from user-uploaded JSON file
   */
  loadGraphFromFile(content) {
    const { cy, options } = this.state;
    try {
      cy.json({
        elements: content,
        style: DEFL_GRAPH_STYLE,
      });
      regroupCy(cy, false);
      regroupCy(cy);
      this.setState({ graphLoaded: true });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Invalid graph format');
      this.setState({ unableToLoadGraph: true, options: { ...options, loaduser: 'default' } });
    }
  }

  /**
   * Save local cy instance to Gaia as json
   */
  saveGraph() {
    const { cy, storage, options } = this.state;
    const graph = getExportableJson(cy);

    saveCache(graph, storage, options);

    switch (storage) {
      case STORAGE_TYPES.IPFS:
        // might result in invalid state if cache is not updated after onHashChange
        saveIPFSGraph(graph, (hash) => { this.setState({ options: { hash } }); alert(hash); });
        break;
      case STORAGE_TYPES.BLOCKSTACK:
        saveBlockstackGraph(graph, this.userSession);
        break;
      default:
        break;
    }
  }

  /**
   * a cheap delete func based off save empty
   */
  deleteGraph() {
    const { cy, storage, options } = this.state;
    switch (storage) {
      case STORAGE_TYPES.IPFS:
        Log.error('IPFS delete not implemented');
        break;
      case STORAGE_TYPES.BLOCKSTACK:
        this.userSession.deleteFile(GRAPH_FILENAME).finally(() => {
          cy.json({
            elements: [],
            style: DEFL_GRAPH_STYLE,
          });
          this.setState({
            graphLoaded: false,
            unableToLoadGraph: true,
            options: { ...options, loaduser: 'default' },
          });
          this.loadGraph();
        });
        break;
      default:
        break;
    }

    wipeCache();
  }

  signOut(e) {
    const { storage } = this.state;
    if (storage === STORAGE_TYPES.BLOCKSTACK) {
      e.preventDefault();
      this.userSession.signUserOut();
      window.location = '/?storage='.concat(STORAGE_TYPES.BLOCKSTACK);
    }
  }

  loadEmptyGraph() {
    const { cy } = this.state;
    this.setState({ graphLoaded: true, unableToLoadGraph: false });
    regroupCy(cy);
  }

  loadDefaultGraph() {
    const { cy } = this.state;
    cy.json({
      elements: DEFL_GRAPH_ELEMENTS,
      style: DEFL_GRAPH_STYLE,
    });
    this.setState({ graphLoaded: true, unableToLoadGraph: false });
    regroupCy(cy, false);
    regroupCy(cy);
  }

  NavOrNot() {
    const { storage, options } = this.state;
    if (storage === STORAGE_TYPES.IPFS) {
      return (null);
    }

    return (
      <NavBar

        username={options.username}
        loadName={options.loaduser}
        changeLoadUser={this.changeLoadUser}
        signOut={this.signOut}
      />
    );
  }

  render() {
    const {
      cy,
      storage,
      options,
      graphLoaded,
      unableToLoadGraph,
      selectedNode,
    } = this.state;

    const { guest } = options;

    return (
      <div className="SignedIn">
        <Modal className="Modal" show={!graphLoaded && !unableToLoadGraph}>
          <Modal.Header>
            <Modal.Title>
              {'Loading graph from '.concat(storage)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer />
        </Modal>

        <Modal
          className="Modal"
          show={unableToLoadGraph}
          onHide={this.loadEmptyGraph}
        >
          <Modal.Header>
            <Modal.Title>Unable to fetch graph</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              style={{ backgroundColor: '#a9a8a8' }}
              variant="secondary"
              type="submit"
              onClick={this.loadEmptyGraph}
            >
              Load empty
            </Button>
            <Button
              style={{ backgroundColor: '#a9a8a8' }}
              variant="primary"
              type="submit"
              onClick={this.loadDefaultGraph}
            >
              Load default
            </Button>
          </Modal.Footer>
        </Modal>

        <NavBar
          storage={storage}
          options={options}
          changeLoadUser={this.changeLoadUser}
          signOut={this.signOut}
        />

        <Split
          className="split-parent"
          sizes={[60, 40]}
          gutterStyle={SignedIn.overrideGutterStyle}
          gutterAlign="center"
          direction="horizontal"
          cursor="col-resize"
        >
          {/* first split */}
          <div className="split split-horizontal">
            <div className="split content" id="cy">
              <p className="hidden-msg">
                p.s. refresh if the graph does not load
              </p>
              <div className="cy-overlay">
                <Button
                  className="btn btn-info btn-lg btn-util"
                  onClick={() => toggleMeta(cy)}
                >
                  Toggle meta-graph
                </Button>
                <Button
                  className="btn btn-info btn-lg btn-util"
                  onClick={() => regroupCy(cy, false)}
                >
                  Regroup dagre
                </Button>
                <Button
                  className="btn btn-info btn-lg btn-util"
                  onClick={() => regroupCy(cy)}
                >
                  Regroup cola
                </Button>
              </div>
            </div>
          </div>

          {/* second split */}
          <div className="split split-horizontal">
            <IokText
              currNode={selectedNode}
              className="split content"
              cy={cy}
              onSaveClick={this.saveGraph}
              onDeleteClick={this.deleteGraph}
              loadGraphHandler={this.loadGraphFromFile}
              guestMode={guest}
              graphLoaded={graphLoaded}
              setCurrNode={(node) => this.setState({ selectedNode: node })}
            />
          </div>
        </Split>
      </div>
    );
  }
}

SignedIn.defaultProps = {
  storage: DEFL_STORAGE,
  options: DEFL_STORAGE_OPTIONS,
};

SignedIn.propTypes = {
  storage: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object,
};

export default SignedIn;
