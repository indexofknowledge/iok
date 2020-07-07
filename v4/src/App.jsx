// eslint-disable-line
/* eslint-disable no-console */
import React, { Component } from 'react';
import './styles/App.css';
// import { UserSession } from 'blockstack';

// import Landing from './Landing';
// import SignedIn from './SignedIn';
// import Log from './log';
// import { STORAGE_TYPES } from './types';
// import { DEFL_STORAGE, DEFL_STORAGE_OPTIONS } from './constants';

import Graph from './Graph';
import Sidebar from './Sidebar';
import './App.css';

class App extends Component {
  // static changeToGuestMode() {
  //   const url = new URL(window.location.href);
  //   const par = url.searchParams;
  //   par.set('guest', 'true');
  //   window.location.href = url;
  // }

  // static parseParams() {
  //   const par = new URLSearchParams(window.location.search);

  //   /**
  //    * Params parsing logic, mainly for configuring storage
  //    * and related options
  //    * */
  //   let storage = DEFL_STORAGE;
  //   let options = JSON.parse(JSON.stringify(DEFL_STORAGE_OPTIONS));
  //   if (par.has('storage')) {
  //     switch (par.get('storage')) {
  //       case STORAGE_TYPES.BLOCKSTACK:
  //         storage = STORAGE_TYPES.BLOCKSTACK;
  //         if (par.has('guest') && par.get('guest') === 'true') {
  //           options.guest = true;
  //           options.username = 'guest';
  //         } else {
  //           options.guest = false;
  //         }
  //         if (par.has('loaduser')) {
  //           options.loaduser = par.get('loaduser');
  //         }
  //         break;
  //       case STORAGE_TYPES.IPFS:
  //         storage = STORAGE_TYPES.IPFS;
  //         if (par.has('hash')) {
  //           options.hash = par.get('hash');
  //         }
  //         break;
  //       default:
  //         storage = DEFL_STORAGE;
  //         options = JSON.parse(JSON.stringify(DEFL_STORAGE_OPTIONS));
  //     }
  //   }
  //   return { storage, options };
  // }

  // constructor() {
  //   super();

  //   const { storage, options } = App.parseParams();
  //   this.state = { storage, options };
  //   this.userSession = new UserSession();

  //   Log.info(storage, options);
  // }

  // componentDidMount() {
  //   const { storage, options } = this.state;
  //   const session = this.userSession;

  //   // If we're using blockstack, get the username
  //   if (storage === STORAGE_TYPES.BLOCKSTACK
  //     && !('guest' in options)
  //     && !('loaduser' in options)
  //     && !options.guest
  //     && !options.loaduser
  //     && !session.isUserSignedIn()
  //     && session.isSignInPending()) {
  //     session.handlePendingSignIn().then((userData) => {
  //       if (!userData.username) {
  //         throw new Error('This app requires a username.');
  //       }
  //       this.setState({ options: { ...options, username: userData.username } });
  //       window.location.href = '/';
  //     });
  //   }
  // }

  // render() {
  //   const { storage, options } = this.state;
  //   Log.trace('Re-render App.jsx:', storage, options);
  //   return (
  //     <div className="site-wrapper">
  //       {storage === STORAGE_TYPES.IPFS || options.guest || this.userSession.isUserSignedIn() ? (
  //         <SignedIn storage={storage} options={options} />
  //       ) : (
  //         <Landing guestModeHandler={App.changeToGuestMode} />
  //       )}
  //     </div>
  //   );
  // }
  render() {
    return (
      <div className="alignedstuff">
        <Graph />
        <Sidebar />
      </div>
    );
  }
}

export default App;
