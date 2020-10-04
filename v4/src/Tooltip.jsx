import React, { Component } from 'react';

class ToolTip extends Component {
  render() {
    const {
      title, desc
    } = this.props;
    return (
      <div className='tooltip'>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    )
  }
}

export default ToolTip;