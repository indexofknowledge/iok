import React, { Component } from 'react'
import './styles/App.css'
import { UserSession } from 'blockstack'

import Landing from './Landing'
import SignedIn from './SignedIn'

class App extends Component {

  constructor() {
    super()
    this.userSession = new UserSession()
    var par = new URLSearchParams(window.location.search)
    this.state = {
      guestMode: par.has('guest') && par.get('guest') === 'true',
      jsonMode: par.has('json') && par.get('json') === 'true'
    }
    console.log("GUEST MODE?", this.state.guestMode)
    this.changeToGuestMode = this.changeToGuestMode.bind(this)
  }

  componentDidMount() {
    // moved from deprecated
    const session = this.userSession
    if(!this.state.guestMode && !session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
      .then((userData) => {
        if(!userData.username) {
          throw new Error('This app requires a username.')
        }
        window.location.href = '/';
      })
    }
  }

  changeToGuestMode() {
    var url = new URL(window.location.href)
    var par = url.searchParams
    par.set('guest', 'true')
    window.location.href = url
  }

  render() {
    return (
      <div className="site-wrapper">
        {this.state.guestMode || this.userSession.isUserSignedIn() ?
          <SignedIn jsonMode={this.state.jsonMode} guestMode={this.state.guestMode}/>
        :
          <Landing guestModeHandler={this.changeToGuestMode}/>
        }
      </div>
    );
  }
}

export default App
