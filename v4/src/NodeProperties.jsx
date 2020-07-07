import React, { Component } from 'react';

import { PropTypes } from 'prop-types';
import { NTYPE, RTYPE } from './types';

class NodeProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.setResourceType = this.setResourceType.bind(this);
  }

  setStateFromNode(node) {
    // const { node } = this.props;
    this.setState({
      topicName: (node ? node.name : ''),
      resourceType: (node ? node.resource_type : 0),
      resourceData: (node ? node.data || {} : {}),
    })
    console.log(node)
  }

  setResourceType(evt) {
    this.setState({ resourceType: Number(evt.target.value) });
  }

  handleSubmit() {
    const { submit } = this.props;
    submit(this.state);
  }

  topicOrResource() {
    const { node } = this.props;
    const { topicName, resourceType } = this.state;

    if (node.data.node_type === NTYPE.TOPIC) {
      return (
        <div className="formgroup">
          <label>Topic Name</label>
          <input type="text" placeholder="Bitcoin" value={topicName} onChange={(ev) => this.setState({ topicName: ev.target.value })} />
        </div>
      );
    }
    return (
      <div className="formgroup">
        <label>Resource data</label>

        <label>
          <input type="radio" value="1" checked={resourceType === 1} onChange={this.setResourceType} />
          Description
        </label>
        <label>
          <input type="radio" value="2" checked={resourceType === 2} onChange={this.setResourceType} />
          Article
        </label>
        <label>
          <input type="radio" value="3" checked={resourceType === 3} onChange={this.setResourceType} />
          Video
        </label>
        <label>
          <input type="radio" value="4" checked={resourceType === 4} onChange={this.setResourceType} />
          Paper
        </label>

        {this.descOrLink()}

      </div>
    );
  }

  descOrLink() {
    const {
      resourceType, resourceData,
    } = this.state;
    if (resourceType === 0 || resourceType === RTYPE.DESC) {
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
    }

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


  render() {
    const { node } = this.props;
    const {
      isOpen,
    } = this.state;
    if (!node) return <span />;
    return (
      //   <span>
      // <Button className="btn btn-info btn-lg btn-mod" onClick={this.toggleModal}>Edit node</Button>
      // <Modal className="Modal" show={isOpen} onHide={this.handleClose} onShow={this.handleOpen}>
      //       <Modal.Header closeButton>
      // <Modal.Title>Edit Node</Modal.Title>
      <>
        <h2>Edit Node</h2>

        <p>{node.name}</p>
        {this.topicOrResource()}
        <button onClick={() => this.handleSubmit()}>Submit</button>
      </>
    );
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
