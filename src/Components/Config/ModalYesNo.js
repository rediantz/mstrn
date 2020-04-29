import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
class ModalYesNo extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    closeModal(){
        this.props.onHide();
    }
    yesHandler(){
        this.props.yesClick(this.props.data);
    }
    render() { 
        return (
        <>
        <Modal
                show = {this.props.show}
                onHide = {this.props.onHide}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop = 'static'
                keyboard = 'false'
                >
                <Modal.Body>
                    <div className="text-center">{this.props.text}</div>
                    <div className="d-flex flex-row justify-content-center my-2">
                        <Button 
                            className="col-5 mx-1" 
                            variant="danger" 
                            onClick={this.yesHandler.bind(this)}
                            disabled={this.props.isLoading}>
                            <FontAwesomeIcon icon={faCheckCircle}/> Ya
                        </Button>
                        <Button 
                            className="col-5 mx-1" 
                            variant="success"
                            onClick={this.closeModal.bind(this)}
                            disabled={this.props.isLoading}>
                            <FontAwesomeIcon icon={faTimesCircle}/> Tidak
                        </Button>
                    </div>
                    
                </Modal.Body>
            </Modal>
        </>);
    }
}
 
export default ModalYesNo;