import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './styles/NavBar.css'

class NavBar extends Component {

  render() {
    const username = this.props.username
    const loadUsername = this.props.loadName
    const changeLoad = this.props.changeLoadUser
    return (
<nav className="navbar navbar-expand-md navbar-dark bg-blue fixed-top">
<Link className="navbar-brand" onClick={() => changeLoad(username)} to='/'>Index of Knowledge</Link>

<ul className="navbar-nav mr-auto">
  <li className="nav-item">
    {/* <Link className="nav-link" to='/me'>{username}</Link> */}
  </li>
</ul>
  <p className="navbar-nav mr-auto">Viewing {loadUsername}'s IoK, logged in as {username}</p>
<button
  className="btn btn-primary"
  onClick={this.props.signOut.bind(this)}
>Sign {username === 'guest' ? 'in' : 'out'}
</button>
</nav>
)
}
}

export default NavBar
