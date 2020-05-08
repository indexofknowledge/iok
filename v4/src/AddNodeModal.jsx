// eslint-disable-line
/* eslint-disable no-alert */
/* eslint-disable no-nested-ternary */ // XXX: !!!!!!!!PLEASE FIX THIS!!!!!!!
import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { validURL } from './listen';

import './styles/AddNodeModal.css';

class AddNodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      nodeType: 0,
      topicName: '',
      resourceType: 0,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  handleClose() {
    this.setState({ // make it default again
      isOpen: false,
      nodeType: 0,
      topicName: '',
      resourceType: 0,
      resourceData: null,
    });
    this.toggleModal();
  }

  handleSubmit() {
    const {
      nodeType, topicName, resourceType, resourceData,
    } = this.state;
    let data = {};

    // get the topic name, or don't have the key
    if (nodeType === 0) {
      alert('Missing node type');
      return;
    } if (nodeType === 1) {
      if (topicName.length === 0) {
        alert('Missing topic name');
        return;
      }
      data = { name: topicName };
    } else { // nodeType === 2 aka Resource
      if (resourceType === 0) {
        alert('Missing resource type');
        return;
      }
      data = {
        resource_type: resourceType,
        data: resourceData,
      };
      if (resourceType > 1) { // check the link
        if (!resourceData.text || resourceData.text.length === 0) {
          alert('Missing resource text');
          return;
        }
        const valid = validURL(resourceData.link);
        if (!valid) {
          alert('Invalid URL');
          return;
        }
      }
    }

    data.node_type = nodeType; // everyone has a nodeType

    const { addNode } = this.props;
    addNode(data);

    this.toggleModal();
  }

  pickedNode() {
    const { nodeType } = this.state;
    if (nodeType === 0) {
      return (<p>Pick a node type please</p>);
    }
    return this.fillInNode();
  }

  fillInNode() {
    const { nodeType } = this.state;
    if (nodeType === 1) {
      return (
        <Form.Group>
          <Form.Label>Topic Name</Form.Label>
          <Form.Control type="text" placeholder="Bitcoin" onChange={(ev) => this.setState({ topicName: ev.target.value })} />
        </Form.Group>
      );
    }
    return (
      <Form.Group>
        <Form.Label>Resource data</Form.Label>
        <Form.Group>
          <Form.Check type="radio" name="radioResourceType" label="Description" onClick={() => this.setState({ resourceType: 1, resourceData: {} })} />
          <Form.Check type="radio" name="radioResourceType" label="Article" onClick={() => this.setState({ resourceType: 2, resourceData: {} })} />
          <Form.Check type="radio" name="radioResourceType" label="Video" onClick={() => this.setState({ resourceType: 3, resourceData: {} })} />
          <Form.Check type="radio" name="radioResourceType" label="Paper" onClick={() => this.setState({ resourceType: 4, resourceData: {} })} />
        </Form.Group>
        {this.topicOrResource()}
      </Form.Group>
    );
  }

  topicOrResource() {
    const { resourceType } = this.state;
    if (resourceType === 0 || resourceType === 1) {
      return (
        <div>
          <Form.Control
            type="text"
            placeholder="Bitcoin is a p2p cash system"
            onChange={(ev) => {
              this.setState({
                resourceData: {
                  text: ev.target.value,
                  link: null,
                },
              });
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide valid resource data
          </Form.Control.Feedback>
          <Form.Text>
            Resource data can be a description or hyperlink
          </Form.Text>
        </div>
      );
    }
    return (
      <div>
        <Form.Control
          type="text"
          placeholder="Bitcoin whitepaper"
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
        <Form.Control.Feedback type="invalid">
          Please provide valid resource link name
        </Form.Control.Feedback>
        <Form.Text>
          Resource link name
        </Form.Text>

        <Form.Control
          type="url"
          placeholder="https://bitcoin.org/bitcoin.pdf"
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
        <Form.Control.Feedback type="invalid">
          Please provide valid resource link
        </Form.Control.Feedback>
        <Form.Text>
          Resource link URL
        </Form.Text>
      </div>
    );
  }


  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <Button className="btn btn-info btn-lg btn-mod" onClick={this.toggleModal}>Add node</Button>
        <Modal className="Modal" show={isOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Node</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Label>Node type</Form.Label>
            <Form.Group>
              <Form.Check type="radio" name="radioNodeType" label="Topic" onClick={() => this.setState({ nodeType: 1 })} />
              <Form.Check type="radio" name="radioNodeType" label="Resource" onClick={() => this.setState({ nodeType: 2 })} />
            </Form.Group>
            {this.pickedNode()}
          </Modal.Body>

          <Modal.Footer>
            <Button style={{ backgroundColor: '#a9a8a8' }} variant="primary" type="submit" onClick={this.handleSubmit}>
              Add node
            </Button>
          </Modal.Footer>

        </Modal>
      </div>
    );
  }
}

AddNodeModal.defaultProps = {
  addNode: () => alert('ERROR: addNode() invalid'),
};

AddNodeModal.propTypes = {
  addNode: PropTypes.func,
};

export default AddNodeModal;
