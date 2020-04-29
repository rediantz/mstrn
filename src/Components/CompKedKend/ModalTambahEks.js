import React, { Component } from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';
import Config from '../Config/Config';
class ModalTambahEks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newEkspedisi : '',
            ekspedisi : props.listEkspedisi,
            formRef : null,
            isConnect : false
        }
        console.log(props);
    }
    componentDidUpdate(nextProps){
        if(nextProps.listEkspedisi !== this.state.ekspedisi){
            this.setState({ekspedisi : nextProps.listEkspedisi});
        }
    }
    addListEkspedisi(e){
        e.preventDefault();
        let Data = {
            KodeEkspedisi : '',
            NamaEkspedisi : this.state.newEkspedisi.toString().toUpperCase(),
            SpellingNamaEkspedisi : this.state.newEkspedisi.toString().toLowerCase(),
            Email : '',
            NoWA : '',
            IDuser : '',
            Password : ''
        }
        //this.props.addListEkspedisi('Dian');
           //this.props.addListEkspedisi(this.state.newEkspedisi);
            //Lempar ke Database
        if(this.state.isConnect === false){
            console.log("GettingData");
            this.setState({ isConnect : true});
            axios.post(Config.api+'/addekspedisi', {
                data : Data
            }).then((response) => {
                console.log(response.data);
                if(response.data === false){
                    alert("Error getting Data");
                }else if(response.data === "dataada"){
                    alert("Expedisi sudah terdaftar");
                }else{
                    Data.KodeEkspedisi = response.data.expcode;
                    this.props.addListEkspedisi(Data);
                    this.formRef.reset();
                    this.props.onHide();
                }
                this.setState({isConnect : false});
            })
            this.setState({newEkspedisi : ''});   
            window.location.reload(true);
        }
    }
    onChangeHandler(e){
        this.setState({[e.target.name] : e.target.value});
    }
    render() { 
        return (
            <div>
                <Modal
                show = {this.props.show}
                onHide = {this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Form autoComplete="off" ref={(ref) => this.formRef = ref} onSubmit={this.addListEkspedisi.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Add New Ekspedisi
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Nama Ekspedisi</Form.Label>
                    <Form.Control type="text" placeholder="Nama Ekspedisi" name="newEkspedisi" onChange={this.onChangeHandler.bind(this)} required/>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="Submit" variant="success" className="p-0 w-100" disabled={this.state.isConnect}>
                        {this.state.isConnect ? "Loading..." : "Add Ekspedisi"}</Button>
                </Modal.Footer>
                </Form>
            </Modal>
            </div>                         
        );
    }
}
 
export default ModalTambahEks;