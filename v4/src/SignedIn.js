import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { UserSession } from 'blockstack'
import Split from 'react-split'

import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import edgehandles from 'cytoscape-edgehandles'

import NavBar from './NavBar'
import IokText from './IokText'
import { appConfig, GRAPH_FILENAME, DEFL_GRAPH_ELEMENTS, DEFL_GRAPH_STYLE } from './constants'
import './styles/SignedIn.css'

import { regroupCy, registerNodeTap, highlightNodeDepsOnClick, registerEdgeHandles } from './listen'

const TAG = 'SignedIn'

Cytoscape.use(dagre)
Cytoscape.use(edgehandles)

class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    this.state = {
      savingGraph: false,
      gotGraph: false,
    }

    this.loadGraph = this.loadGraph.bind(this)
    this.saveGraph = this.saveGraph.bind(this)
    this.deleteGraph = this.deleteGraph.bind(this)
    this.signOut = this.signOut.bind(this)
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
          padding: 10
        }
      }),
    }, () => {
      registerNodeTap(this.state.cy)
      registerEdgeHandles(this.state.cy)
    }) // trace...
    this.loadGraph()
  }

  // /**
  //  * Setup some stuff about the group assuming that we have cy
  //  */
  // setupGraph() {

  // }

  /**
   * Load cy instance from Gaia into local state
   */
  loadGraph() {
    console.log(TAG, "Loading data from Gaia...")
    const options = { decrypt: false }
    this.userSession.getFile(GRAPH_FILENAME, options)
    .then((content) => {
      if(content && content.length > 0) {
        const graph = JSON.parse(content)
        console.log(TAG, 'Loaded data:', graph)

        this.state.cy.json(graph) // edit local cy in place

      } else {
        alert('Failed to get graph data...')
        this.state.cy.json({
          elements: DEFL_GRAPH_ELEMENTS,
          style: DEFL_GRAPH_STYLE
        })

        // TODO might need to indicate that this is default, and re-fetch...
        // this.setState({ gotGraph: true }) // induce a re-render with state change

      }
      console.log("Cy currently size", this.state.cy.elements().length)
      regroupCy(this.state.cy)
      this.setState({ gotGraph: true }) // induce a re-render with state change

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
      alert("Graph deleted! Showing default")
      this.state.cy.json({
        elements: DEFL_GRAPH_ELEMENTS,
        style: DEFL_GRAPH_STYLE
      })
      this.setState({
        gotGraph: false // XXX: need another flag prob...
      })
    })
  }

  signOut(e) {
    e.preventDefault()
    this.userSession.signUserOut()
    window.location = '/'
  }

  render() {
    const username = this.userSession.loadUserData().username

    if(window.location.pathname === '/') {
      return (
        <Redirect to={`/iok/${username}`} />
      )
    }

    return (
      <div className="SignedIn">
        <NavBar className="nav-parent" username={username} signOut={this.signOut}/>
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
