// eslint-disable-line
/* eslint-disable guard-for-in */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { STORAGE_TYPES } from './types';
import { DEFL_STORAGE, DEFL_STORAGE_OPTIONS } from './constants';
import { redirectStorage, redirectDefl } from './urlUtils';
// import './styles/NavBar.css';

class NavBar extends Component {
  static onHomeClick(storage, options, changeLoadUser) {
    switch (storage) {
      case STORAGE_TYPES.BLOCKSTACK:
        changeLoadUser(options.username);
        break;
      case STORAGE_TYPES.IPFS:
        redirectDefl();
        break;
      default:
        break;
    }
  }

  static greetingBuilder(storage, options) {
    switch (storage) {
      case STORAGE_TYPES.BLOCKSTACK:
        return `Viewing ${options.loaduser}'s IoK, logged in as ${options.username}`;
      case STORAGE_TYPES.IPFS:
        return options.hash;
      default:
        return 'Hello';
    }
  }

  static signOutBuilder(storage, options, signOutHandler) {
    switch (storage) {
      case STORAGE_TYPES.BLOCKSTACK:
        return (
          <button
            type="button"
            className="btn btn-primary"
            onClick={signOutHandler}
          >
            Sign
            {options.username === 'guest' ? ' in' : ' out'}

          </button>
        );
      case STORAGE_TYPES.IPFS:
        return '';
      default:
        return 'Hello';
    }
  }

  static selectStorageBuilder(storage) {
    switch (storage) {
      case STORAGE_TYPES.BLOCKSTACK:
        return (
          <button
            type="button"
            className="btn btn-info btn-lg btn-util"
            onClick={() => redirectStorage(STORAGE_TYPES.IPFS)}
          >
            Try IPFS!
          </button>
        );
      case STORAGE_TYPES.IPFS:
        return (
          <button
            type="button"
            className="btn btn-info btn-lg btn-util"
            onClick={() => redirectStorage(STORAGE_TYPES.BLOCKSTACK)}
          >
            Try Blockstack!
          </button>
        );
      default:
        return 'Hello';
    }
  }

  render() {
    const {
      storage, options, changeLoadUser, signOut,
    } = this.props;
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-blue fixed-top">
        <Link className="navbar-brand" onClick={() => NavBar.onHomeClick(storage, options, changeLoadUser)} to="/">Index of Knowledge</Link>

        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            {NavBar.greetingBuilder(storage, options)}
          </li>
        </ul>
        <p className="navbar-nav mr-auto">
          {}
        </p>
        {NavBar.selectStorageBuilder(storage)}
        {NavBar.signOutBuilder(storage, options, signOut.bind(this))}
      </nav>
    );
  }
}

NavBar.defaultProps = {
  storage: DEFL_STORAGE,
  options: DEFL_STORAGE_OPTIONS,
  // XXX: replace these alerts
  // eslint-disable-next-line no-alert
  changeLoadUser: () => alert('ERROR: changeLoadUser() invalid'),
  // eslint-disable-next-line no-alert
  signOut: () => alert('ERROR: signOut() invalid'),
};

NavBar.propTypes = {
  storage: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object,
  changeLoadUser: PropTypes.func,
  signOut: PropTypes.func,
};

export default NavBar;
