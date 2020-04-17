// eslint-disable-line
import React from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import './styles/NavBar.css';

const NavBar = function render(props) {
  const {
    username, loadName, changeLoadUser, signOut,
  } = props;
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-blue fixed-top">
      <Link className="navbar-brand" onClick={() => changeLoadUser(username)} to="/">Index of Knowledge</Link>

      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          {/* <Link className="nav-link" to='/me'>{username}</Link> */}
        </li>
      </ul>
      <p className="navbar-nav mr-auto">
        {`Viewing ${loadName}'s IoK, logged in as ${username}`}
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={signOut.bind(this)}
      >
        {`Sign ${username === 'guest' ? 'in' : 'out'}`}
      </button>
    </nav>
  );
};

NavBar.defaultProps = {
  username: 'default',
  loadName: 'default',
  // XXX: replace these alerts
  // eslint-disable-next-line no-alert
  changeLoadUser: () => alert('ERROR: changeLoadUser() invalid'),
  // eslint-disable-next-line no-alert
  signOut: () => alert('ERROR: signOut() invalid'),
};

NavBar.propTypes = {
  username: PropTypes.string,
  loadName: PropTypes.string,
  changeLoadUser: PropTypes.func,
  signOut: PropTypes.func,
};

export default NavBar;
