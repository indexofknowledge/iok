import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap'

import './styles/AddNodeModal.css'

export default class AddNodeModal extends Component {
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
      resourceType: 0
    })
    this.toggleModal()
  }

  handleSubmit() {
    var nodeType = this.state.nodeType

    // get the topic name, or don't have the key
    if (nodeType === 0) {
      alert("Must have node type!")
      return
    } else if (nodeType === 1) {
      if (this.state.topicName.length === 0) {
        alert("Invalid topic name!")
        return
      }
      var data = { name: this.state.topicName }
    } else { // nodeType === 2 aka Resource
      if (this.state.resourceType === 0) {
        alert("Invalid resource type!")
        return
      }
      var data = {
        resourceType: this.state.resourceType
      }
    }

    data.node_type = nodeType // everyone has a nodeType

    this.addNode(data)
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

          <Form>
            <Modal.Body>
              <Form.Label>Node Type</Form.Label>
              <Form.Group>
                <Form.Check type="radio" name="radioNodeType" label="Topic" onClick={() => this.setState({nodeType: 1})} />
                <Form.Check type="radio" name="radioNodeType" label="Resource" onClick={() => this.setState({nodeType: 2})} />
              </Form.Group>

              {/* so lazy */}
              {
              this.state.nodeType === 0 ? <p>Pick a node type please</p> : (
                this.state.nodeType === 1 ? 
                  <Form.Group>
                    <Form.Label>Topic Name</Form.Label>
                    <Form.Control type="text" placeholder="Bitcoin" onChange={ev => this.setState({topicName: ev.target.value})}/>
                  </Form.Group>
                : 
                  <Form.Group>
                    <Form.Label>Resource data</Form.Label>
                    <Form.Group>
                      <Form.Check type="radio" name="radioResourceType" label="Description" onClick={() => this.setState({resourceType: 1})} />
                      <Form.Check type="radio" name="radioResourceType" label="Article" onClick={() => this.setState({resourceType: 2})} />
                      <Form.Check type="radio" name="radioResourceType" label="Video" onClick={() => this.setState({resourceType: 3})} />
                      <Form.Check type="radio" name="radioResourceType" label="Paper" onClick={() => this.setState({resourceType: 4})} />
                    </Form.Group>
                    <Form.Control type="text" placeholder="Bitcoin is a p2p cash system" />
                    <Form.Control.Feedback type="invalid">
                      Please provide valid resource data
                    </Form.Control.Feedback>
                    <Form.Text>
                      Resource data can be a description or hyperlink
                    </Form.Text>
                  </Form.Group>
                
                )
              }

            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                Add node
              </Button>
            </Modal.Footer>
          </Form>

        </Modal>
      </div>
    );
  }
}