import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap'

import './styles/AddNodeModal.css'

export default class AddNodeModal extends Component {
	constructor(props) {
		super(props);
    this.state = { 
      isOpen: false,
      isResource: false, // XXX: maybe do this with nodeTypes
      isTopic: false,
      topicName: ''
    }
    this.addNode = this.props.addNode
    this.toggleModal = this.toggleModal.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
	}
	
	toggleModal = event => {
		const { isOpen } = this.state;
		this.setState({ isOpen: !isOpen });
  }
  
  handleClose() {
    this.toggleModal()
  }

  handleSubmit() {
    this.addNode({'id': "AAAAAAAAA"})
    this.toggleModal()
  }

  render() {
    return (
      <div>
        <Button className="btn btn-primary" onClick={this.toggleModal}>Open Modal</Button>
        <Modal show={this.state.isOpen} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Add node
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}