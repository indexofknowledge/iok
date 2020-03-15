import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap'

import { validURL } from './listen'
import { IOKS } from './constants' 

import './styles/ListIoksModal.css'

export default class ListIoksModal extends Component {
	constructor(props) {
		super(props);
    this.state = { 
      isOpen: false,
    }
    this.toggleModal = this.toggleModal.bind(this)
	}
	
	toggleModal = event => {
		const { isOpen } = this.state;
		this.setState({ isOpen: !isOpen });
  }

  /**
   * iokLink can either be a full URL or a blockstack ID,
   * in which case it should be prefixed with the current URL. The 
   * prior is to give users the flexibility to host their own IoKs
   */
  makeIokComponent = (user, app) => {
    return <a href={app}>{user}</a>
  }

  // stolen from: https://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery
  replaceUrlParam = (url, paramName, paramValue) => {
    if (paramValue == null) {
        paramValue = '';
    }
    var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
    if (url.search(pattern)>=0) {
        return url.replace(pattern,'$1' + paramValue + '$2');
    }
    url = url.replace(/[?#]$/,'');
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
  }

  render() {
    return (
      <div>
        <Button className="btn btn-info btn-lg btn-mod" onClick={this.toggleModal}>List IoKs</Button>
        <Modal className="Modal" show={this.state.isOpen} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>IoK Public Listing</Modal.Title>
          </Modal.Header>

            <Modal.Body>
              <ul>
                {IOKS.map((iok, index) => {
                  return <li>{this.makeIokComponent(iok.user, iok.app)}</li>
                })}
              </ul>

            </Modal.Body>

        </Modal>
      </div>
    );
  }
}