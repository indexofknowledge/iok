import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap'

import { validURL } from './listen'

import './styles/AddNodeModal.css'

export default class EditNodeModal extends Component {
	constructor(props) {
		super(props);
    this.state = {
      isOpen: false,
      nodeType: 0,
      topicName: '',
      resourceType: 0
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
    this.setState({ // make it default again
      isOpen: false,
      nodeType: 0,
      topicName: '',
      resourceType: 0,
      resourceData: null
    })
    this.toggleModal()
  }

  handleSubmit() {
    alert('GOTCHA!')
    this.toggleModal()
  }

  render() {
    return (
      <span>
        <Button className="btn btn-info btn-lg btn-mod" onClick={this.toggleModal}>Edit node</Button>
        <Modal className="Modal" show={this.state.isOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Node</Modal.Title>
          </Modal.Header>

            <Modal.Body>
              <img src="https://www.dailydot.com/wp-content/uploads/2018/12/Big-Chungus-Meme.jpg" width="100%" />
            </Modal.Body>

            <Modal.Footer>
              <Button style={{'backgroundColor': '#a9a8a8'}}variant="primary" type="submit" onClick={this.handleSubmit}>
                Edit node
              </Button>
            </Modal.Footer>

        </Modal>
      </span>
    );
  }
}
