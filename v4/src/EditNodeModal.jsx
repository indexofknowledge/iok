// eslint-disable-line
/* eslint-disable no-alert */
/* eslint-disable no-nested-ternary */ // XXX: !!!!!!!!PLEASE FIX THIS!!!!!!!
import React, { Component } from 'react';
import {
  Button, Modal, Form, ToggleButtonGroup, ToggleButton,
} from 'react-bootstrap';

import { PropTypes } from 'prop-types';
import { NTYPE, RTYPE } from './constants';

import './styles/AddNodeModal.css';

class EditNodeModal extends Component {
  constructor(props) {
    super(props);
    const { addNode, node } = this.props;
    console.log(node)
    this.state = {
      isOpen: false,
      topicName: '',
      resourceType: (node ? node.data('resource_type') : 0),
      resourceData: {},
    };

    this.addNode = addNode;
    this.toggleModal = this.toggleModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setResourceType = this.setResourceType.bind(this);
  }

  setResourceType(resourceType) {
    this.setState({ resourceType });
  }

  toggleModal() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  handleOpen() {
    const { node } = this.props;
    this.setState({ // make it default again
      isOpen: true,
      topicName: (node ? node.data('name') : ''),
      resourceType: (node ? node.data('resource_type') : 0),
      resourceData: (node ? node.data('data') : {}),
    });
  }

  handleClose() {
    this.setState({ // make it default again
      isOpen: false,
    });
    this.toggleModal();
  }

  handleSubmit() {
    this.toggleModal();
    const {
      node, addNode, setNode, updateEdges, removeNode,
    } = this.props;
    const data = { ...node.data() };
    const { resourceType, resourceData, topicName } = this.state;
    data.resource_type = resourceType;
    data.data = resourceData;
    if (topicName) {
      data.name = topicName;
    }
    if (JSON.stringify(data) === JSON.stringify(node.data())) {
      return; // No changes to save
    }

    // if this is a resource node delete its name
    if (data.node_type === 2) {
      delete data.name;
    }

    // if nodetype, rename

    delete data.id;

    const newNode = addNode(data);
    setNode(newNode);

    // take existing edges and put newNode
    updateEdges(node, newNode);
    newNode.shift(node.position());

    // delete n
    removeNode(node);
  }


  render() {
    const { node } = this.props;
    const {
      isOpen, topicName, resourceType, resourceData,
    } = this.state;
    if (!node) return <span />;
    return (
      <span>
        <Button className="btn btn-info btn-lg btn-mod" onClick={this.toggleModal}>Edit node</Button>
        <Modal className="Modal" show={isOpen} onHide={this.handleClose} onShow={this.handleOpen}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Node</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{node.data('name')}</p>
            {node.data('node_type') === NTYPE.TOPIC
              ? (
                <Form.Group>
                  <Form.Label>Topic Name</Form.Label>
                  <Form.Control type="text" placeholder="Bitcoin" value={topicName} onChange={(ev) => this.setState({ topicName: ev.target.value })} />
                </Form.Group>
              )
              : (
                <Form.Group>
                  <Form.Label>Resource data</Form.Label>

                  <ToggleButtonGroup type="radio" name="idk" value={resourceType} onChange={this.setResourceType}>
                    <ToggleButton value={1}>Description</ToggleButton>
                    <ToggleButton value={2}>Article</ToggleButton>
                    <ToggleButton value={3}>Video</ToggleButton>
                    <ToggleButton value={4}>Paper</ToggleButton>
                  </ToggleButtonGroup>

                  {
                    resourceType === 0 || resourceType === RTYPE.DESC
                      ? (
                        <div>
                          <Form.Control
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
                          <Form.Control.Feedback type="invalid">
                            Please provide valid resource data
                          </Form.Control.Feedback>
                          <Form.Text>
                            Resource data can be a description or hyperlink
                          </Form.Text>
                        </div>
                      )
                      : (
                        <div>
                          <Form.Control
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
                          <Form.Control.Feedback type="invalid">
                            Please provide valid resource link name
                          </Form.Control.Feedback>
                          <Form.Text>
                            Resource link name
                          </Form.Text>

                          <Form.Control
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
                          <Form.Control.Feedback type="invalid">
                            Please provide valid resource link
                          </Form.Control.Feedback>
                          <Form.Text>
                            Resource link URL
                          </Form.Text>
                        </div>
                      )
                  }

                </Form.Group>
              )
            }
          </Modal.Body>

          <Modal.Footer>
            <Button style={{ backgroundColor: '#a9a8a8' }} variant="primary" type="submit" onClick={this.handleSubmit}>
              Edit node
            </Button>
          </Modal.Footer>

        </Modal>
      </span>
    );
  }
}

EditNodeModal.defaultProps = {
  addNode: () => alert('ERROR: addNode() invalid'),
  node: null,
  setNode: () => alert('ERROR: setNode() invalid'),
  updateEdges: () => alert('ERROR: updateEdgges() invalid'),
  removeNode: () => alert('ERROR: removeNode() invalid'),
};

EditNodeModal.propTypes = {
  addNode: PropTypes.func,
  node: PropTypes.object, // eslint-disable-line
  setNode: PropTypes.func,
  updateEdges: PropTypes.func,
  removeNode: PropTypes.func,
};

export default EditNodeModal;
