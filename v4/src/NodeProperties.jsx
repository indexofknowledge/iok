import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { NTYPE, RTYPE } from './types';
import './IokEdit.css';

class NodeProperties extends Component {
  static resetState() {
    return ({
      name: '',
      id: undefined,
      nodeType: null,
      resourceType: null,
      resourceData: {},
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      ...NodeProperties.resetState(),
    };
    this.setResourceType = this.setResourceType.bind(this);
    this.setNodeType = this.setNodeType.bind(this);
  }

  setStateFromNode(node) {
    this.setState({
      name: (node ? node.name : ''),
      nodeType: (node ? node.node_type : null),
      resourceType: (node ? node.resource_type : null),
      resourceData: (node ? node.data || {} : {}),
    });
  }

  setNodeType(evt) {
    this.setState({ nodeType: Number(evt.target.value) });
  }

  setResourceType(evt) {
    this.setState({ resourceType: Number(evt.target.value) });
  }

  handleSubmit() {
    const { submit, node } = this.props;
    const {
      name, nodeType, resourceType, resourceData,
    } = this.state;
    const newPropsToPassIn = {
      name,
      node_type: nodeType,
      resource_type: resourceType,
      data: resourceData,
    };
    const id = node ? node.id : null;
    submit(id, newPropsToPassIn);
    this.setState(NodeProperties.resetState());
  }

  addOrEdit() {

    const { node, editing } = this.props;
    const { nodeType } = this.state;
    if (editing) {
      if (!node) return <span />;
      return (
        <div className="dialog">
          <form onSubmit={(e) => this.handleSubmit()}>
            <h2>Edit Node</h2>
            <p>{node.name}</p>
            {this.topicOrResource()}
            <button type="submit">Submit</button>
          </form>
        </div >
      );
    }
    return (
      <div className="dialog">
        <h2>Add Node</h2>
        <div className="formgroup">
          <form onSubmit={(e) => this.handleSubmit()}>
            Type of Node
            <label>
              <input required name="nodeType" type="radio" value="1" checked={nodeType === 1} onChange={this.setNodeType} />
              Topic
            </label>
            <label>
              <input required name="nodeType" type="radio" value="2" checked={nodeType === 2} onChange={this.setNodeType} />
            Resource
          </label>
            {this.topicOrResource()}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }

  topicOrResource() {
    const { name, resourceType, nodeType } = this.state;

    if (nodeType === NTYPE.TOPIC) {
      return (
        <div className="formgroup">
          <label>
            Topic Name
            <input required type="text" placeholder="Bitcoin" value={name} onChange={(ev) => this.setState({ name: ev.target.value })} />
          </label>
        </div>
      );
    }
    if (nodeType === NTYPE.RESO) {
      return (
        <div className="formgroup">
          Resource Type
          <label>
            <input required name="resourceType" type="radio" value="1" checked={resourceType === 1} onChange={this.setResourceType} />
            Description
          </label>
          <label>
            <input required name="resourceType" type="radio" value="4" checked={resourceType === 4} onChange={this.setResourceType} />
            Link
          </label>
          {this.descOrLink()}
        </div>
      );
    }
    return <div />;
  }

  descOrLink() {
    const {
      resourceType, resourceData,
    } = this.state;
    if (resourceType === RTYPE.DESC) {
      return (
        <div>
          <input required
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
        </div>
      );
    }
    if (resourceType === RTYPE.LINK) {
      return (
        <div>
          <input required
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

          <input
            type="url" required
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
        </div>
      );
    }
    return (<div />);
  }

  render() {
    const { submit } = this.props;
    if (submit) return this.addOrEdit();
    return '';
  }
}

NodeProperties.defaultProps = {
  node: null,
  submit: null,
};

NodeProperties.propTypes = {
  editing: PropTypes.bool.isRequired,
  node: PropTypes.object, // eslint-disable-line
  submit: PropTypes.func,
};

export default NodeProperties;
