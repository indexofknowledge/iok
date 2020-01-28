import React, { Component } from 'react'
import './styles/App.css'
import { UserSession } from 'blockstack'

import Landing from './Landing'
import SignedIn from './SignedIn'

class App extends Component {

  constructor() {
    super()
    this.userSession = new UserSession()
  }

  componentWillMount() {
    const session = this.userSession
    if(!session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
      .then((userData) => {
        if(!userData.username) {
          throw new Error('This app requires a username.')
        }
        window.location = `/iok/${userData.username}`
      })
    }
  }

  render() {
    return (
      <div className="site-wrapper">
        {this.userSession.isUserSignedIn() ?
          <SignedIn />
        :
          <Landing />
        }
      </div>
    );
  }
}

export default App
