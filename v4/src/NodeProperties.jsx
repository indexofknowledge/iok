import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { NTYPE, RTYPE, NPAIR } from './types';
import './IokEdit.css';

class NodeProperties extends Component {
  static resetState() {
    return ({
      name: '',
      id: undefined,
      nodeType: null,
      resourceType: null,
      nodePair: [],
      resourceData: {},
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      ...NodeProperties.resetState(),
    };
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

  setNodeType(evt, newValue) {
    console.log(newValue[0], newValue[1]);
    this.setState({
      nodePair: evt.target.value, nodeType: newValue[0], resourceType: newValue[1],
    });
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
          <h2>Edit Node</h2>
          {this.selectNodeKind(true)}
        </div>
      );
    }
    return (
      <div className="dialog">
        <h2>Add Node</h2>
        {this.selectNodeKind(false)}
      </div>
    );
  }

  selectNodeKind(editing) {
    const { nodeType, resourceType } = this.state;
    const { cancel } = this.props;

    return (
      <div className="formgroup">
        <form onSubmit={() => this.handleSubmit()}>

          <input
            required
            id="add_topic"
            name="nodeType"
            type="radio"
            value={NPAIR.TOPIC}
            disabled={editing && nodeType === NTYPE.RESO}
            checked={nodeType === NPAIR.TOPIC[0]}
            onChange={(event) => this.setNodeType(event, NPAIR.TOPIC)}
          />
          <label htmlFor="add_topic" className="button">Topic</label>

          <input
            required
            id="add_desc"
            name="nodeType"
            type="radio"
            value={NPAIR.DESC}
            disabled={editing && nodeType === NTYPE.TOPIC}
            checked={nodeType === NPAIR.DESC[0] && resourceType === NPAIR.DESC[1]}
            onChange={(event) => this.setNodeType(event, NPAIR.DESC)}
          />
          <label htmlFor="add_desc" className="button">Description</label>

          <input
            required
            id="add_link"
            name="nodeType"
            type="radio"
            value={NPAIR.LINK}
            disabled={editing && nodeType === NTYPE.TOPIC}
            checked={nodeType === NPAIR.LINK[0] && resourceType === NPAIR.LINK[1]}
            onChange={(event) => this.setNodeType(event, NPAIR.LINK)}
          />
          <label htmlFor="add_link" className="button">Link</label>

          {nodeType === NTYPE.TOPIC ? this.topic() : this.descOrLink()}
          <div className="rightButton">
            <button type="button" className="button" onClick={cancel}>Cancel</button>
            <button type="submit" className="button filledButton">Submit</button>
          </div>
        </form>
      </div>
    );
  }

  topic() {
    const { name, nodeType } = this.state;
    if (nodeType === NTYPE.TOPIC) {
      return (
        <div className="formgroup">
          <label htmlFor="topicname">Topic Name</label>
          <input required id="topicname" type="text" placeholder="Bitcoin" value={name} onChange={(ev) => this.setState({ name: ev.target.value })} />
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
          <label htmlFor="desc">Link Text</label>
          <textarea
            required
            id="desc"
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
          <label htmlFor="url_text">Link Text</label>
          <input
            id="url_text"
            required
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

          <label htmlFor="url_link">URL</label>
          <input
            id="url_link"
            type="url"
            required
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
