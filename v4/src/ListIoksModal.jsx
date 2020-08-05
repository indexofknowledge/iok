// eslint-disable-line
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap'; // eslint-disable-line
import { IOKS } from './constants';
// import './styles/ListIoksModal.css';

class ListIoksModal extends Component {
  /**
   * iokLink can either be a full URL or a blockstack ID,
   * in which case it should be prefixed with the current URL. The
   * prior is to give users the flexibility to host their own IoKs
   */
  static makeIokComponent(user, app) {
    return <a href={app}>{user}</a>;
  }

  // stolen from: https://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery
  static replaceUrlParam(url, paramName, paramValue) {
    let paramV = paramValue;
    if (paramValue == null) {
      paramV = '';
    }
    const pattern = new RegExp(`\\b(${paramName}=).*?(&|#|$)`);
    if (url.search(pattern) >= 0) {
      return url.replace(pattern, `$1${paramV}$2`);
    }
    const urlNew = url.replace(/[?#]$/, '');
    return `${urlNew + (urlNew.indexOf('?') > 0 ? '&' : '?') + paramName}=${paramV}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <Button className="btn btn-info btn-lg btn-mod" onClick={this.toggleModal}>List IoKs</Button>
        <Modal className="Modal" show={isOpen} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>IoK Public Listing</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ul>
              { /* eslint-disable-next-line max-len */}
              {IOKS.map((iok) => <li key={iok.user}>{ListIoksModal.makeIokComponent(iok.user, iok.app)}</li>)}
            </ul>

          </Modal.Body>

        </Modal>
      </div>
    );
  }
}

export default ListIoksModal;
