import React, { Component } from 'react';
import {Button, Col, Row, Form, Container} from 'react-bootstrap';
import axios from 'axios';
import Config from '../Config/Config';
class KedKenOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formRef : null,
            listEkspedisi : [],
            listJenisKendaraan : [],
            Ekspedisi : '',
            ListPickingNo : '',
            NomorKendaraan : '',
            JenisKendaraan : '',
            NamaDriver : '',
            btnSubmit : false,
            DC : localStorage.getItem('dc'),
            User : localStorage.getItem('username'),
        }
    }
    getDataMasterEkspedisi(){
        axios.get(Config.api+"/getmasterekspedisi/").then(res => {
            let Data = this.state.listEkspedisi;
            let newData = [];
            //console.log(res.data);
            for(let i = 0 ; i < res.data.length ; i++){
                newData = {
                    KodeEkspedisi : res.data[i].expcode,
                    NamaEkspedisi : res.data[i].expname,
                    SpellingNamaEkspedisi : res.data[i].expnamespell,
                    Email : res.data[i].hpwa,
                    NoWA : res.data[i].email,
                    IDuser : res.data[i].userid,
                    Password : res.data[i].userpass
                }
                //console.log(newData);
                Data.push(newData);
            }
            this.setState({
                listEkspedisi : Data
            })
            this.getDataJenisKend();
        }).catch(err => {
            console.log(err);
        })
    }
    getDataJenisKend(){
        axios.get(Config.api+"/getjeniskend/").then(res => {
            let Data = this.state.listJenisKendaraan;
            let newData = [];
            //console.log(res.data);
            for(let i = 0 ; i < res.data.length ; i++){
                newData = {
                    kodekend: res.data[i].kodekend,
                    jeniskend: res.data[i].jeniskend,
                    kubikasi: res.data[i].kubikasi,
                    tonase: res.data[i].tonase,
                }
                //console.log(newData);
                Data.push(newData);
            }
            this.setState({
                listJenisKendaraan : Data
            })
            console.log(this.state.JenisKendaraan);
        }).catch(err => {
            console.log(err);
        })
    }
    componentDidMount() {
        this.getDataMasterEkspedisi();
    }
    onChangeHandler(e){
        this.setState({
            [e.target.name] : e.target.value
        });
    }
    submitHandler(e){
        e.preventDefault();
        console.log(this.state);
        this.setState({btnSubmit : true});
        let Data = {
            ListPickingNo : this.state.ListPickingNo,
            JenisKendaraan : this.state.JenisKendaraan,
            NomorKendaraan : this.state.NomorKendaraan,
            NamaDriver : this.state.NamaDriver,
            DC : this.state.DC,
            Expedisi : this.state.Ekspedisi,
            User : this.state.User
        }
        axios.post(Config.api+'/addkedatanganoutbound', {
            data : Data
        }).then(res=>{
            console.log(res);
            if(res.data === true){
                this.setState({Ekspedisi : '',
                    ListPickingNo : '',
                    JenisKendaraan : '',
                    NomorKendaraan : '',
                    NamaDriver : '',
                });
                this.formRef.reset();
            }else{
                alert(res.data);
            }
            this.setState({btnSubmit : false});
        })
    }
    render() { 
        return (
            <>
            <Container className="mt-2">
                <h2 className="text-center">KEDATANGAN KENDARAAN - OUTBOUND</h2>
                <Row className="justify-content-center">
                    <Col xs={12} lg={8} className="bg-success text-white" style={{borderRadius: "15px"}}>
                        <Row className="my-1 justify-content-center">
                            <Col xs={9}>
                                <Form ref={(ref) => this.formRef = ref} autoComplete="off" onSubmit={this.submitHandler.bind(this)}>
                                    <Row className="my-1">
                                        <Col xs={4} className="my-auto text-right">
                                            <Form.Label>List Picking No</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="List Picking No" 
                                                name="ListPickingNo" 
                                                onChange={this.onChangeHandler.bind(this)} 
                                                readOnly={this.state.btnSubmit}
                                                required/>
                                        </Col>
                                    </Row>
                                    <Row className="my-1">
                                        <Col xs={4} className="my-auto text-right">
                                            <Form.Label>Ekspedisi</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                        <Form.Control 
                                            as="select" 
                                            name="Ekspedisi" 
                                            onChange={this.onChangeHandler.bind(this)} 
                                            disabled={this.state.btnSubmit}
                                            required>
                                        <option value="">---Pilih---</option>
                                            {this.state.listEkspedisi.map((list, index) => (
                                                <option key={index} value={list.KodeEkspedisi}>{list.NamaEkspedisi}</option>
                                            ))}
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="my-1">
                                        <Col xs={4} className="my-auto text-right">
                                            <Form.Label>Jenis Kendaraan</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                        <Form.Control 
                                            as="select" 
                                            name="JenisKendaraan" 
                                            onChange={this.onChangeHandler.bind(this)} 
                                            disabled={this.state.btnSubmit}
                                            required>
                                        <option value="">---Pilih---</option>
                                        {this.state.listJenisKendaraan.map((list, index) => (
                                                <option key={index} value={list.kodekend}>{list.jeniskend}</option>
                                            ))}
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="my-1">
                                        <Col xs={4} className="mt-1 text-right">
                                            <Form.Label>Nomor Kendaraan</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Nomor Kendaraan" 
                                                name="NomorKendaraan" 
                                                onChange={this.onChangeHandler.bind(this)} 
                                                readOnly={this.state.btnSubmit}
                                                pattern='[A-Z]{1}[ ][0-9]{4}[ ][A-Z]{1,3}'
                                                required/>
                                                <Form.Text className="text-white">
                                                    Cth Nomor Kendaraan A 1234 BCD
                                                </Form.Text>
                                        </Col>
                                    </Row>
                                    <Row className="my-1">
                                        <Col xs={4} className="my-auto text-right">
                                            <Form.Label>Nama Driver</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Nama Driver" 
                                                name="NamaDriver" 
                                                onChange={this.onChangeHandler.bind(this)} 
                                                readOnly={this.state.btnSubmit}
                                                required/>
                                        </Col>
                                    </Row>
                                    <Button disabled={this.state.btnSubmit} variant="light" className="text-success mx-1" type="submit">
                                    {this.state.btnSubmit ? "Loading..." : "Simpan"}
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            </>
        );
    }
}
 
export default KedKenOut;