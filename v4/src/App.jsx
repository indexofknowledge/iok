// eslint-disable-line
import React, { Component } from 'react';
import './styles/App.css';
import { UserSession } from 'blockstack';

import Landing from './Landing';
import SignedIn from './SignedIn';

class App extends Component {
  static changeToGuestMode() {
    const url = new URL(window.location.href);
    const par = url.searchParams;
    par.set('guest', 'true');
    window.location.href = url;
  }

  constructor() {
    super();
    this.userSession = new UserSession();
    const par = new URLSearchParams(window.location.search);
    const guestMode = par.has('guest') && par.get('guest') === 'true';
    this.state = {
      guestMode,
    };
    console.log('GUEST MODE?', guestMode);
    this.changeToGuestMode = this.changeToGuestMode.bind(this);
  }

  componentDidMount() {
    const { guestMode } = this.state;
    // moved from deprecated
    const session = this.userSession;
    if (!guestMode && !session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
        .then((userData) => {
          if (!userData.username) {
            throw new Error('This app requires a username.');
          }
          window.location.href = '/';
        });
    }
  }

  render() {
    const { guestMode } = this.state;
    return (
      <div className="site-wrapper">
        {guestMode || this.userSession.isUserSignedIn()
          ? <SignedIn guestMode={guestMode} />
          : <Landing guestModeHandler={this.changeToGuestMode} />
        }
      </div>
    );
  }
}

export default App;
