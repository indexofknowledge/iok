/* eslint-disable */
/* eslint-disable no-console */
import React, { Component } from 'react';
import './App.css';
import { UserSession } from 'blockstack';
import Graph from './Graph';
import Sidebar from './Sidebar';
// import Landing from './Landing';
// import SignedIn from './SignedIn';
// import Log from './log';
// import { STORAGE_TYPES } from './types';
// import { parseParams, redirectGuest, redirectStorage } from './urlUtils';

class App extends Component {

  // componentDidMount() {
  //   const { storage, options } = this.state;
  //   const session = this.userSession;

  //   // If we're using blockstack authed, get the username
  //   if (storage === STORAGE_TYPES.BLOCKSTACK
  //     && !('guest' in options)
  //     && !options.guest) {
  //     if (!session.isUserSignedIn() && session.isSignInPending()) {
  //       session.handlePendingSignIn().then((userData) => {
  //         if (!userData.username) {
  //           throw new Error('This app requires a username.');
  //         }
  //         this.setState({ options: { ...options, username: userData.username } });
  //         redirectStorage(STORAGE_TYPES.BLOCKSTACK, { loaduser: userData.username });
  //       });
  //     }
  //   }
  // }

  render() {
    return (
      <div className="alignedstuff">
        <Graph />
        <Sidebar />
        {/* {storage === STORAGE_TYPES.IPFS || options.guest ||
        this.userSession.isUserSignedIn() ? (
          <SignedIn storage={storage} options={options} />
        ) : (
            <Landing guestModeHandler={redirectGuest} />
          )} */}
      </div>
    );
  }
}

export default App;
