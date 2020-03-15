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
  appConfig, GRAPH_FILENAME, DEFL_GRAPH_ELEMENTS, DEFL_GRAPH_STYLE,
} from './constants';
import './styles/SignedIn.css';

import {
  regroupCy, registerNodeTap, registerEdgeHandles, addNode, toggleMeta, getExportableJson,
} from './listen';

const TAG = 'SignedIn';

Cytoscape.use(dagre);
Cytoscape.use(cola);
Cytoscape.use(edgehandles);

class SignedIn extends Component {
  static overrideGutterStyle() { // override somehow
    return {
      width: '8px',
      height: '90vh',
      'background-color': '#18191c',
    };
  }

  constructor(props) {
    super(props);
    const { guestMode } = this.props;

    this.userSession = new UserSession({ appConfig });
    let username = 'guest';
    if (!guestMode) {
      username = this.userSession.loadUserData().username;
    }
    const url = new URL(window.location.href);
    const par = url.searchParams;
    let loadUsername = username;
    if (par.has('loaduser')) {
      loadUsername = par.get('loaduser');
    } else {
      par.set('loaduser', username);
      window.location.href = url;
    }

    this.state = {
      graphLoaded: false,
      unableToLoadGraph: false,
      guestMode,
      username,
      loadUsername,
      selectedNode: '',
    };

    this.loadGraph = this.loadGraph.bind(this);
    this.saveGraph = this.saveGraph.bind(this);
    this.deleteGraph = this.deleteGraph.bind(this);
    this.signOut = this.signOut.bind(this);
    this.changeLoadUser = this.changeLoadUser.bind(this);
    this.loadDefaultGraph = this.loadDefaultGraph.bind(this);
    this.loadEmptyGraph = this.loadEmptyGraph.bind(this);
  }

  // since we're creating the cytoscape div in this component,
  // only create the cy instance (and load data into it) after
  // we've rendered
  componentDidMount() {
    this.setState({
      cy: Cytoscape({
        container: document.getElementById('cy'),
        layout: {
          name: 'dagre',
          animate: true,
        },
        style: DEFL_GRAPH_STYLE,
      }),
    }, () => {
      const { cy } = this.state;
      registerNodeTap(cy, (node) => {
        this.setState({ selectedNode: node });
      });
      registerEdgeHandles(cy);
    }); // trace...
    this.loadGraph();
  }

  // this is important since we want to re-render each time the user changes
  changeLoadUser(newUser) {
    this.setState({ loadUsername: newUser });
  }

  /**
   * Load cy instance from Gaia into local state
   */
  loadGraph() {
    const { loadUsername } = this.state;
    console.log(TAG, 'Loading', loadUsername, "'s data");
    const options = { decrypt: false, username: loadUsername };
    this.userSession.getFile(GRAPH_FILENAME, options)
      .then((content) => {
        if (content && content.length > 0) {
          const { cy } = this.state;
          // console.log(TAG, 'Loaded data:', content)
          const graph = JSON.parse(content);
          cy.json(graph); // edit local cy in place

          console.log('Cy currently size', cy.elements().length);
          regroupCy(cy);

          this.setState({ graphLoaded: true });
        } else {
          this.setState({ unableToLoadGraph: true, loadUsername: 'default' });
        } // deal with fail and err as same
      }).catch(() => {
        this.setState({ unableToLoadGraph: true, loadUsername: 'default' });
      });
  }

  /**
   * Save local cy instance to Gaia as json
   */
  saveGraph() {
    const { cy } = this.state;
    // this.setState({savingGraph: true}) // XXX: might not need this to rerender
    const options = { encrypt: false };
    // var graph = this.state.cy.json()
    const graph = getExportableJson(cy);
    // var graph = {elements: this.state.graphElements, style: this.state.graphStyles}
    console.log(TAG, 'SAVING...', graph);
    this.userSession.putFile(GRAPH_FILENAME, JSON.stringify(graph), options)
      .finally(() => {
        // this.setState({savingGraph: false})
      });
  }

  /**
   * a cheap delete func based off save empty
   */
  deleteGraph() {
    const { cy } = this.state;
    this.userSession.deleteFile(GRAPH_FILENAME)
      .finally(() => {
        cy.json({
          elements: [],
          style: DEFL_GRAPH_STYLE,
        });
        this.setState({
          graphLoaded: false,
          unableToLoadGraph: true,
          loadUsername: 'default',
        });
        this.loadGraph();
      });
  }

  signOut(e) {
    e.preventDefault();
    this.userSession.signUserOut();
    window.location = '/';
  }

  loadEmptyGraph() {
    const { cy } = this.state;
    this.setState({ graphLoaded: true, unableToLoadGraph: false });
    addNode(cy, { name: 'delet this' });
    addNode(cy, { name: 'delet this too' });
    regroupCy(cy);
  }

  loadDefaultGraph() {
    const { cy } = this.state;
    cy.json({
      elements: DEFL_GRAPH_ELEMENTS,
      style: DEFL_GRAPH_STYLE,
    });
    this.setState({ graphLoaded: true, unableToLoadGraph: false });
    regroupCy(cy);
  }

  render() {
    const {
      cy, graphLoaded, unableToLoadGraph, username, loadUsername,
      changeLoadUser, selectedNode, guestMode,
    } = this.state;
    return (
      <div className="SignedIn">

        <Modal className="Modal" show={!graphLoaded && !unableToLoadGraph}>
          <Modal.Header>
            <Modal.Title>Loading graph from blockstack</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>

        <Modal className="Modal" show={unableToLoadGraph} onHide={this.loadEmptyGraph}>
          <Modal.Header>
            <Modal.Title>Unable to fetch graph</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button style={{ backgroundColor: '#a9a8a8' }} variant="secondary" type="submit" onClick={this.loadEmptyGraph}>
              Load empty
            </Button>
            <Button style={{ backgroundColor: '#a9a8a8' }} variant="primary" type="submit" onClick={this.loadDefaultGraph}>
              Load default
            </Button>
          </Modal.Footer>
        </Modal>

        <NavBar
          username={username}
          loadName={loadUsername}
          changeLoadUser={changeLoadUser}
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
              <p className="hidden-msg">p.s. refresh if the graph does not load</p>
              <div className="cy-overlay">
                <Button className="btn btn-info btn-lg btn-util" onClick={() => toggleMeta(cy)}>Toggle meta-graph</Button>
                <Button className="btn btn-info btn-lg btn-util" onClick={() => regroupCy(cy)}>Regroup dagre</Button>
                <Button className="btn btn-info btn-lg btn-util" onClick={() => regroupCy(cy, true)}>Regroup cola</Button>
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
              guestMode={guestMode}
              graphLoaded={graphLoaded}
            />
          </div>
        </Split>
      </div>
    );
  }
}

SignedIn.defaultProps = {
  guestMode: false,
};

SignedIn.propTypes = {
  guestMode: PropTypes.bool,

};

export default SignedIn;
