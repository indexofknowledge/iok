import React, { Component } from 'react'
import { UserSession } from 'blockstack'
import Split from 'react-split'
import { Button, Modal } from 'react-bootstrap'

import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import edgehandles from 'cytoscape-edgehandles'

import NavBar from './NavBar'
import IokText from './IokText'
import { appConfig, GRAPH_FILENAME, DEFL_GRAPH_ELEMENTS, DEFL_GRAPH_STYLE } from './constants'
import './styles/SignedIn.css'

import { regroupCy, registerNodeTap, registerEdgeHandles, addNode } from './listen'

const TAG = 'SignedIn'

Cytoscape.use(dagre)
Cytoscape.use(edgehandles)

class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    var username = this.userSession.loadUserData().username
    var splits = window.location.pathname.split('/')
    var loadUsername = username
    if (splits.length === 2 && splits[1]) {
      loadUsername = splits[1]
    }

    this.state = {
      savingGraph: false,
      graphLoaded: false,
      unableToLoadGraph: false,
      username: username,
      loadUsername: loadUsername
    }

    this.loadGraph = this.loadGraph.bind(this)
    this.saveGraph = this.saveGraph.bind(this)
    this.deleteGraph = this.deleteGraph.bind(this)
    this.signOut = this.signOut.bind(this)
    this.changeLoadUser = this.changeLoadUser.bind(this)
    this.loadDefaultGraph = this.loadDefaultGraph.bind(this)
    this.loadEmptyGraph = this.loadEmptyGraph.bind(this)
  }

  // since we're creating the cytoscape div in this component,
  // only create the cy instance (and load data into it) after
  // we've rendered 
  componentDidMount() {
    this.setState({
      cy: Cytoscape({
        container: document.getElementById("cy"),
        layout: { 
          name: 'dagre', 
          animate: true,
        },
        style: DEFL_GRAPH_STYLE
      }),
    }, () => {
      registerNodeTap(this.state.cy)
      registerEdgeHandles(this.state.cy)
    }) // trace...
    this.loadGraph()
  }

  // this is important since we want to re-render each time the user changes
  changeLoadUser(newUser) { 
    this.setState({ loadUsername: newUser })
  }

  /**
   * Load cy instance from Gaia into local state
   */
  loadGraph() {
    console.log(TAG, "Loading", this.state.loadUsername, "'s data")
    const options = { decrypt: false, username: this.state.loadUsername }
    this.userSession.getFile(GRAPH_FILENAME, options)
    .then((content) => {
      if(content && content.length > 0) {
        // console.log(TAG, 'Loaded data:', content)
        const graph = JSON.parse(content)
        this.state.cy.json(graph) // edit local cy in place

        console.log("Cy currently size", this.state.cy.elements().length)
        regroupCy(this.state.cy)
        this.setState({ graphLoaded: true }) // induce a re-render with state change

      } else {

        this.setState({ unableToLoadGraph: true })

        // this.state.cy.json({
        //   elements: DEFL_GRAPH_ELEMENTS,
        //   style: DEFL_GRAPH_STYLE
        // })

        // TODO might need to indicate that this is default, and re-fetch...
        // this.setState({ graphLoaded: true }) // induce a re-render with state change

      }


    })
  }

  /**
   * Save local cy instance to Gaia as json
   */
  saveGraph() {
    // this.setState({savingGraph: true}) // XXX: might not need this to rerender
    const options = { encrypt: false }
    var graph = this.state.cy.json()
    // var graph = {elements: this.state.graphElements, style: this.state.graphStyles}
    console.log(TAG, "SAVING...", graph)
    this.userSession.putFile(GRAPH_FILENAME, JSON.stringify(graph), options)
    .finally(() => {
      // this.setState({savingGraph: false})
    })
  }

  /**
   * a cheap delete func based off save empty
   */
  deleteGraph() {
    this.userSession.deleteFile(GRAPH_FILENAME)
    .finally(() => {
      this.state.cy.json({
        elements: [],
        style: DEFL_GRAPH_STYLE
      })
      this.setState({
        graphLoaded: false,
        unableToLoadGraph: true
      })
      this.loadGraph()
    })
  }

  signOut(e) {
    e.preventDefault()
    this.userSession.signUserOut()
    window.location = '/'
  }

  loadEmptyGraph() {
    this.setState({ graphLoaded: true, unableToLoadGraph: false })
    addNode(this.state.cy, { name: 'delet this' })
    addNode(this.state.cy, { name: 'delet this too' })
    regroupCy(this.state.cy, )
  }

  loadDefaultGraph() {
    this.state.cy.json({
      elements: DEFL_GRAPH_ELEMENTS,
      style: DEFL_GRAPH_STYLE
    })
    this.setState({ graphLoaded: true, unableToLoadGraph: false})
    regroupCy(this.state.cy)
  }

  render() {
    return (
      <div className="SignedIn">

        <Modal className="Modal" show={!this.state.graphLoaded && !this.state.unableToLoadGraph}>
          <Modal.Header>
            <Modal.Title>Loading graph from blockstack</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>

        <Modal className="Modal" show={this.state.unableToLoadGraph} onHide={this.loadEmptyGraph}>
          <Modal.Header>
            <Modal.Title>Unable to fetch graph</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button style={{'backgroundColor': '#a9a8a8'}} variant="secondary" type="submit" onClick={this.loadEmptyGraph}>
              Load empty
            </Button>
            <Button style={{'backgroundColor': '#a9a8a8'}} variant="primary" type="submit" onClick={this.loadDefaultGraph}>
              Load default
            </Button>
          </Modal.Footer>
        </Modal>

        <NavBar className="nav-parent" username={this.state.username} loadName={this.state.loadUsername} changeLoadUser={this.state.changeLoadUser} signOut={this.signOut}/>
        <Split className="split-parent" 
            sizes={[60, 40]}
            gutterStyle={function(dimension, gutterSize) { // override somehow
              return {
                  'width': '8px',
                  'height': '90vh',
                  'background-color': '#18191c'
                }
            }}
            gutterAlign="center"
            direction="horizontal"
            cursor="col-resize"
        >
            {/* first split */}
            <div className="split split-horizontal">
              <p className="hidden-msg">p.s. refresh if the graph doesn't load</p>
              <div className="split content" id="cy"/>
            </div>

            {/* second split */}
            <div className="split split-horizontal">
              <IokText 
                className="split content"
                cy={this.state.cy}
                onSaveClick={this.saveGraph}
                onDeleteClick={this.deleteGraph}
              />
            </div>
        </Split>
      </div>
    );
  }
}

export default SignedIn
