// eslint-disable-line
/* eslint-disable no-alert */
import React, { Component } from 'react';
import { UserSession } from 'blockstack';
import { PropTypes } from 'prop-types';
import { appConfig } from './constants';
import './styles/Landing.css';

class Landing extends Component {
  constructor() {
    super();
    this.userSession = new UserSession({ appConfig });
  }

  signIn(e) {
    e.preventDefault();
    this.userSession.redirectToSignIn();
  }

  render() {
    const { guestModeHandler } = this.props;
    return (
      <div className="Landing">
        <div className="form-signin">
          <h1 className="h1 mb-3 font-weight-normal">Index of Knowledge</h1>
          <button
            type="button"
            className="btn btn-lg btn-primary btn-block"
            onClick={this.signIn.bind(this)}
          >
            Sign in with Blockstack
          </button>
          <button
            type="button"
            className="btn btn-lg btn-primary btn-block"
            onClick={guestModeHandler}
          >
            Continue as guest
          </button>
        </div>
      </div>
    );
  }
}

Landing.defaultProps = {
  guestModeHandler: () => alert('ERROR: guestModeHandler() invalid'),
};

Landing.propTypes = {
  guestModeHandler: PropTypes.func,
};

export default Landing;
