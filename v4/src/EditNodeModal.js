import React, { Component } from 'react';
import { Button, Modal, Form, ToggleButtonGroup, ToggleButton, Nav } from 'react-bootstrap'
import { GRAPH_FILENAME, NTYPE, RTYPE } from './constants'

import { validURL } from './listen'
import { sha256 } from 'js-sha256'
import './styles/AddNodeModal.css'

export default class EditNodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      topicName: '',
      resourceType: (this.props.node ? this.props.node.data('resource_type') : 0),
      resourceData: {}
    }
    this.addNode = this.props.addNode
    this.toggleModal = this.toggleModal.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setResourceType = this.setResourceType.bind(this)
  }

  toggleModal = event => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  handleOpen() {
    this.setState({ // make it default again
      isOpen: true,
      topicName: (this.props.node ? this.props.node.data('name') : ''),
      resourceType: (this.props.node ? this.props.node.data('resource_type') : 0),
      resourceData: (this.props.node ? this.props.node.data('data') : {})
    })
  }

  handleClose() {
    this.setState({ // make it default again
      isOpen: false
    })
    this.toggleModal()
  }

  handleSubmit() {
    this.toggleModal()
    const node = this.props.node
    const data = { ...node.data() }
    data.resource_type = this.state.resourceType
    data.data = this.state.resourceData
    if (this.state.topicName) {
      data.name = this.state.topicName
    }
    if (JSON.stringify(data) === JSON.stringify(node.data())) {
      return; // No changes to save
    }

    //if this is a resource node delete its name
    if (data.node_type === 2) {
      delete data.name
    }

    //if nodetype, rename

    delete data.id

    const newNode = this.props.addNode(data)
    this.props.setNode(newNode)

    //take existing edges and put newNode 
    this.props.updateEdges(node, newNode)
    newNode.shift(node.position())

    //delete n
    this.props.removeNode(node)

  }

  setResourceType(resourceType) {
    this.setState({ resourceType })
  }

  render() {
    console.log(this.props.node ? this.props.node.data() : '');
    const node = this.props.node;
    if (!node) return <span></span>
    return (
      <span>
        <Button className="btn btn-info btn-lg btn-mod" onClick={this.toggleModal}>Edit node</Button>
        <Modal className="Modal" show={this.state.isOpen} onHide={this.handleClose} onShow={this.handleOpen}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Node</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{node.data('name')}</p>
            {node.data('node_type') == NTYPE.TOPIC ?
              <Form.Group>
                <Form.Label>Topic Name</Form.Label>
                <Form.Control type="text" placeholder="Bitcoin" value={this.state.topicName} onChange={ev => this.setState({ topicName: ev.target.value })} />
              </Form.Group>
              :
              <Form.Group>
                <Form.Label>Resource data</Form.Label>

                <ToggleButtonGroup type="radio" name="idk" value={this.state.resourceType} onChange={this.setResourceType}>
                  <ToggleButton value={1}>Description</ToggleButton>
                  <ToggleButton value={2}>Article</ToggleButton>
                  <ToggleButton value={3}>Video</ToggleButton>
                  <ToggleButton value={4}>Paper</ToggleButton>
                </ToggleButtonGroup>

                {
                  this.state.resourceType === 0 || this.state.resourceType === RTYPE.DESC ?
                    <div>
                      <Form.Control
                        id="abc"
                        name="abc"
                        type="text"
                        placeholder="Bitcoin is a p2p cash system"
                        value={this.state.resourceData.text}
                        onChange={ev => {
                          var val = ev.target.value // to save the virtual event
                          this.setState(prevState => ({
                            resourceData: {
                              ...prevState.resourceData,
                              text: val
                            }
                          }))
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide valid resource data
                          </Form.Control.Feedback>
                      <Form.Text>
                        Resource data can be a description or hyperlink
                          </Form.Text>
                    </div>
                    :
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Bitcoin whitepaper"
                        value={this.state.resourceData ? this.state.resourceData.text : null}
                        onChange={ev => {
                          var val = ev.target.value // to save the virtual event
                          this.setState(prevState => ({
                            resourceData: {
                              ...prevState.resourceData,
                              text: val
                            }
                          }))
                        }} />
                      <Form.Control.Feedback type="invalid">
                        Please provide valid resource link name
                          </Form.Control.Feedback>
                      <Form.Text>
                        Resource link name
                          </Form.Text>

                      <Form.Control
                        type="url"
                        placeholder="https://bitcoin.org/bitcoin.pdf"
                        value={this.state.resourceData ? this.state.resourceData.link : null}
                        onChange={ev => {
                          var val = ev.target.value
                          this.setState(prevState => ({
                            resourceData: {
                              ...prevState.resourceData,
                              link: val
                            }
                          }))
                        }} />
                      <Form.Control.Feedback type="invalid">
                        Please provide valid resource link
                          </Form.Control.Feedback>
                      <Form.Text>
                        Resource link URL
                          </Form.Text>
                    </div>
                }

              </Form.Group>
            }
          </Modal.Body>

          <Modal.Footer>
            <Button style={{ 'backgroundColor': '#a9a8a8' }} variant="primary" type="submit" onClick={this.handleSubmit}>
              Edit node
              </Button>
          </Modal.Footer>

        </Modal>
      </span>
    );
  }
}
