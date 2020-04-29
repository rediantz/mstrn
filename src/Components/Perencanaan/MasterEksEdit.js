import React, { Component } from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';
import Config from '../Config/Config';
class MasterEksEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formRef : null,
            KodeEkspedisi : props.Ekspedisi.KodeEkspedisi,
            NamaEkspedisi : props.Ekspedisi.NamaEkspedisi,
            SpellingNamaEkspedisi : props.Ekspedisi.SpellingNamaEkspedisi,
            Email : props.Ekspedisi.Email,
            NoWA : props.Ekspedisi.NoWA,
            IDuser : props.Ekspedisi.IDuser,
            Password : props.Ekspedisi.Password,
            isGetData : false,
        }
    }
    componentWillReceiveProps(nextProps){
        //console.log("componentWillReceiveProps -");
        //console.log(nextProps);
        if(nextProps.Ekspedisi.KodeEkspedisi !== this.state.KodeEkspedisi){
            this.setState({
                KodeEkspedisi : nextProps.Ekspedisi.KodeEkspedisi,
                NamaEkspedisi : nextProps.Ekspedisi.NamaEkspedisi,
                SpellingNamaEkspedisi : nextProps.Ekspedisi.SpellingNamaEkspedisi,
                Email : nextProps.Ekspedisi.Email,
                NoWA : nextProps.Ekspedisi.NoWA,
                IDuser : nextProps.Ekspedisi.IDuser,
                Password : nextProps.Ekspedisi.Password
            });
        }
    }
    onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        });
    }
    onSubmit(e){
        e.preventDefault();
        //let res;
        this.setState({
            isGetData : true
        })
        let newData = {
            KodeEkspedisi : this.state.KodeEkspedisi,
            NamaEkspedisi : (this.state.NamaEkspedisi).toString().toUpperCase(),
            SpellingNamaEkspedisi : (this.state.NamaEkspedisi).toString().toLowerCase(),
            Email : this.state.Email,
            NoWA : this.state.NoWA,
            IDuser : this.state.IDuser,
            Password : this.state.Password
        }
        //memoize(this.props.editMasterEks(newData));
        
        axios.post(Config.api+'/editmasterekspedisi', {
            data : newData
        }).then((response) => {
            console.log(response.data);
            if(response.data === true){
                console.log(this.props);
                this.setState({
                    isGetData : false
                })
                this.props.editMasterEks(newData);
                this.props.onHide();
            }
        })
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
                <Form autoComplete="off" ref={(ref) => this.formRef = ref} onSubmit={this.onSubmit.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Edit Ekspedisi
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Kode Ekspedisi</Form.Label>
                    <Form.Control type="text" readOnly placeholder="Nama Ekspedisi" name="KodeEkspedisi" value={this.state.KodeEkspedisi}/>
                    <Form.Label>Nama Ekspedisi</Form.Label>
                    <Form.Control type="text" name="NamaEkspedisi" value={this.state.NamaEkspedisi} onChange={this.onChange.bind(this)}/>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" name="Email" value={this.state.Email} onChange={this.onChange.bind(this)}/>
                    <Form.Label>No WA</Form.Label>
                    <Form.Control type="text" name="NoWA" value={this.state.NoWA} onChange={this.onChange.bind(this)}/>
                    <Form.Label>ID User</Form.Label>
                    <Form.Control type="text" name="IDuser" value={this.state.IDuser} onChange={this.onChange.bind(this)}/>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="Password" value={this.state.Password} onChange={this.onChange.bind(this)}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="Submit" className="p-0 w-100" disabled={this.state.isGetData}>{this.state.isGetData ? "Loading..." : "Save"}</Button>
                </Modal.Footer>
                </Form>
            </Modal>
            </div>
        );
    }
}
 
export default MasterEksEdit;