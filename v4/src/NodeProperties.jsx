import React, { Component } from 'react';

import { PropTypes } from 'prop-types';
import { NTYPE, RTYPE } from './types';

class NodeProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.resetState()
    };
    this.setResourceType = this.setResourceType.bind(this);
    this.setNodeType = this.setNodeType.bind(this);
  }

  setStateFromNode(node) {
    const { editing } = this.props;
    if (editing) {
      this.setState({
        name: (node ? node.name : ''),
        nodeType: (node ? node.node_type : null),
        resourceType: (node ? node.resource_type : null),
        resourceData: (node ? node.data || {} : {}),
      })
    }
  }

  setNodeType(evt) {
    this.setState({ nodeType: Number(evt.target.value) });
  }

  setResourceType(evt) {
    this.setState({ resourceType: Number(evt.target.value) });
  }

  handleSubmit() {
    const { submit, node } = this.props;
    let newPropsToPassIn = {
      name: this.state.name,
      node_type: this.state.nodeType,
      resource_type: this.state.resourceType,
      data: this.state.resourceData
    }
    let id = node ? node.id : null;
    submit(id, newPropsToPassIn);
    this.setState({ ...this.resetState() });
  }

  resetState() {
    return ({
      name: '',
      id: undefined, //id for some reason becomes a property after submitting??
      nodeType: null,
      resourceType: null,
      resourceData: {},
    });
  }

  addOrEdit() {
    //ADD CHECKS FOR SUBMIT BUTTON????
    const { node, editing } = this.props;
    const { nodeType } = this.state;
    if (editing) {
      if (!node) return <span />;
      return (
        <>
          <h2>Edit Node</h2>
          <p>{node.name}</p>
          {this.topicOrResource()}
          <button onClick={() => this.handleSubmit()}>Submit</button>
        </>
      );
    }
    return (
      <>
        <h2>Add Node</h2>
        <div className="formgroup">
          <label>Type of Node</label>
          <label>
            <input type="radio" value="1" checked={nodeType === 1} onChange={this.setNodeType} />
          Topic
        </label>
          <label>
            <input type="radio" value="2" checked={nodeType === 2} onChange={this.setNodeType} />
          Resource
        </label>
          {this.topicOrResource()}
          <button onClick={() => this.handleSubmit()}>Submit</button>
        </div>
      </>
    );

  }

  topicOrResource() {
    const { name, resourceType, nodeType } = this.state;

    if (nodeType === NTYPE.TOPIC) {
      return (
        <div className="formgroup">
          <label>Topic Name</label>
          <input type="text" placeholder="Bitcoin" value={name} onChange={(ev) => this.setState({ name: ev.target.value })} />
        </div>
      );
    } else if (nodeType === NTYPE.RESO) {
      return (
        <div className="formgroup">
          <label>Resource Type</label>
          <label>
            <input type="radio" value="1" checked={resourceType === 1} onChange={this.setResourceType} />
            Description
          </label>
          <label>
            <input type="radio" value="4" checked={resourceType === 4} onChange={this.setResourceType} />
            Link
          </label>
          {this.descOrLink()}
        </div>
      );
    }

  }

  descOrLink() {
    const {
      resourceType, resourceData,
    } = this.state;
    if (resourceType === RTYPE.DESC) {
      return (
        <div>
          <input
            id="abc"
            name="abc"
            type="text"
            placeholder="Bitcoin is a p2p cash system"
            value={resourceData.text}
            onChange={(ev) => {
              const val = ev.target.value; // to save the virtual event
              this.setState((prevState) => ({
                resourceData: {
                  ...prevState.resourceData,
                  text: val,
                },
              }));
            }}
          />
          {/* <input.Feedback type="invalid">
            Please provide valid resource data
          </input.Feedback> */}
          {/* Resource data can be a description or hyperlink */}
        </div>
      );
    } else if (resourceType === RTYPE.LINK) {
      return (
        <div>
          <input
            type="text"
            placeholder="Bitcoin whitepaper"
            value={resourceData ? resourceData.text : null}
            onChange={(ev) => {
              const val = ev.target.value; // to save the virtual event
              this.setState((prevState) => ({
                resourceData: {
                  ...prevState.resourceData,
                  text: val,
                },
              }));
            }}
          />
          {/* <input.Feedback type="invalid">
            Please provide valid resource link name
          </input.Feedback>
          <form.Text>
            Resource link name
          </form.Text> */}

          <input
            type="url"
            placeholder="https://bitcoin.org/bitcoin.pdf"
            value={resourceData ? resourceData.link : null}
            onChange={(ev) => {
              const val = ev.target.value;
              this.setState((prevState) => ({
                resourceData: {
                  ...prevState.resourceData,
                  link: val,
                },
              }));
            }}
          />
          {/* <input.Feedback type="invalid">
            Please provide valid resource link
          </input.Feedback>
          <form.Text>
            Resource link URL
          </form.Text> */}
        </div>
      );
    }
  }

  render() {
    return this.addOrEdit();
  }
}

NodeProperties.defaultProps = {
  node: null,
};

NodeProperties.propTypes = {
  title: PropTypes.string.isRequired,
  node: PropTypes.object,
  submit: PropTypes.func.isRequired,
};

export default NodeProperties;
