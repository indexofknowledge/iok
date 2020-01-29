import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { UserSession } from 'blockstack'
import Split from 'react-split'

import NavBar from './NavBar'
import IokGraph from './IokGraph'
import IokText from './IokText'
import { appConfig, GRAPH_FILENAME, DEFL_GRAPH_ELEMENTS, DEFL_GRAPH_STYLE } from './constants'
import './styles/SignedIn.css'

import { registerCy, getCy, registerNodeTap, recenterCy, regroupCy, toggleDrawMode, toggleMeta, highlightNodeDepsOnClick } from './listen'

const TAG = 'SignedIn'

class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    this.state = {
      // tricky with how react detects change, so store graph as eles and styles
      graphElements: DEFL_GRAPH_ELEMENTS, 
      graphStyles: DEFL_GRAPH_STYLE,
      savingGraph: false,
      gotGraph: false,
      //selectedAnimal: false,
      //selectedTerritory: false
    }

    this.loadGraph = this.loadGraph.bind(this)
    this.saveGraph = this.saveGraph.bind(this)
    this.deleteGraph = this.deleteGraph.bind(this)
    this.signOut = this.signOut.bind(this)

    // only want to do this once
    console.log(TAG, "Loading data from Gaia...")
    this.loadGraph()
  }

  loadGraph() {
    const options = { decrypt: false }
    this.userSession.getFile(GRAPH_FILENAME, options)
    .then((content) => {
      if(content && content.length > 0) {
        const graph = JSON.parse(content)
        console.log(TAG, 'Loaded data:', graph)
        // graph has dummy default values. get rid of it
        if (!graph.style || graph.style.length <= 1) {
          graph.style = DEFL_GRAPH_STYLE
        }
        if (!graph.elements || graph.elements.length < 1) {
          graph.elements = DEFL_GRAPH_ELEMENTS
        }

        this.setState({
          graphElements: graph.elements, 
          graphStyles: graph.style, 
          gotGraph: true
        })
      } else {
        console.log(TAG, 'Failed to get graph data...')
        alert('Failed to get graph data...')
        this.setState({
          graphElements: DEFL_GRAPH_ELEMENTS,
          graphStyles: DEFL_GRAPH_STYLE,
          gotGraph: false
        })
      }
    })
  }

  saveGraph() {
    this.setState({savingGraph: true})
    const options = { encrypt: false }
    var cy = getCy()
    var graph = cy.json()
    // var graph = {elements: this.state.graphElements, style: this.state.graphStyles}
    console.log(TAG, "SAVING...", graph)
    this.userSession.putFile(GRAPH_FILENAME, JSON.stringify(graph), options)
    .finally(() => {
      this.setState({savingGraph: false})
    })
  }

  // a cheap delete func based off save empty
  deleteGraph() {
    this.userSession.deleteFile(GRAPH_FILENAME)
    .finally(() => {
      alert("Graph deleted! Showing default")
      this.setState({
        graphElements: DEFL_GRAPH_ELEMENTS,
        graphStyles: DEFL_GRAPH_STYLE,
        gotGraph: false})
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
            sizes={[75, 25]}
            gutterStyle={function(dimension, gutterSize) { // override somehow
              return {
                  'width': '8px',
                  'height': '90vh',
                }
            }}
            minSize={100}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
        >
            {/* first split */}
            <div className="split split-horizontal">
              <IokGraph 
                className="split content"
                elements={this.state.graphElements} 
                styles={this.state.graphStyles}
                saveGraph={this.saveGraph} 
                key={this.state.graphElements}
                cyRegCallback={(c) => {
                  registerCy(c);
                  registerNodeTap(highlightNodeDepsOnClick);
                }}
              />
            </div>

            {/* second split */}
            <div className="split split-horizontal">
              <IokText 
                className="split content"
                onRegroupClick={regroupCy}
                onMetaClick={toggleMeta}
                onSaveClick={this.saveGraph}
                onDeleteClick={this.deleteGraph}
                onDrawClick={toggleDrawMode}
              />
            </div>
        </Split>
      </div>
    );
  }
}

export default SignedIn
