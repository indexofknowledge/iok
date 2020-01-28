import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { UserSession } from 'blockstack'
import Split from 'react-split'

import NavBar from './NavBar'
import IokGraph from './IokGraph'
import { appConfig, GRAPH_FILENAME } from './constants'
import './styles/SignedIn.css'

class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    this.state = {
      me: {},
      savingMe: false,
      savingKingdown: false,
      redirectToMe: false
      //selectedAnimal: false,
      //selectedTerritory: false
    }

    this.loadMe = this.loadMe.bind(this)
    this.saveMe = this.saveMe.bind(this)
    this.signOut = this.signOut.bind(this)
  }

  componentWillMount() {
    this.loadMe()
  }

  loadMe() {
    const options = { decrypt: false }
    this.userSession.getFile(GRAPH_FILENAME, options)
    .then((content) => {
      if(content) {
        const me = JSON.parse(content)
        console.log('Loaded data:', me)
        this.setState({me, redirectToMe: false})
      } else {
        console.error('Failed to load data')
        const me = {val: "val123"}
        this.saveMe(me)
        this.setState({me, redirectToMe: true})
      }
    })
  }

  saveMe(me) {
    this.setState({me, savingMe: true})
    const options = { encrypt: false }
    this.userSession.putFile(GRAPH_FILENAME, JSON.stringify(me), options)
    .finally(() => {
      this.setState({savingMe: false, redirectToMe: false})
    })
  }

  signOut(e) {
    e.preventDefault()
    this.userSession.signUserOut()
    window.location = '/'
  }

  render() {
    const username = this.userSession.loadUserData().username
    const me = this.state.me
    const redirectToMe = this.state.redirectToMe

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
                  'height': '1000px',
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
            <div className="split split-horizontal">
              <div className="graph-parent">
                <IokGraph className="split content"></IokGraph>
              </div>
            </div>
            <div className="split split-horizontal">
                <p className="split content">HELLO1</p> 
            </div>
        </Split>
      </div>
    );
  }
}

export default SignedIn
