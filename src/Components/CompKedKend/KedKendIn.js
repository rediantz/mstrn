import React, { Component } from 'react';
import {Row, Col, Container, Button, Form} from 'react-bootstrap';
import ModalTambahEks from './ModalTambahEks';
import Config from '../Config/Config';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
class KedKendIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listEkspedisi : [],
            listJenisKendaraan : [],
            listAntrian : [{id : 'Q', name : 'Queue'}, {id : 'N', name : 'Non Queue'}],
            Ekspedisi : '',
            JenisKendaraan : '',
            NomorKendaraan : '',
            NamaDriver : '',
            Antrian : '',
            btnSubmit : false,
            formRef : null,
            addModalShow : false,
            DC : localStorage.getItem('dc'),
            User : localStorage.getItem('username')
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
        console.log("get jenis kendaraan");
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
            console.log(this.state.listJenisKendaraan);
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
        this.setState({Ekspedisi : '',
        JenisKendaraan : '',
        NomorKendaraan : '',
        NamaDriver : '',
        Antrian : ''});
        let Data = {
            Ekspedisi : this.state.Ekspedisi,
            JenisKendaraan : this.state.JenisKendaraan,
            NomorKendaraan : this.state.NomorKendaraan,
            NamaDriver : this.state.NamaDriver,
            Antrian : this.state.Antrian,
            DC : this.state.DC,
            User : this.state.User
        };
        axios.post(Config.api+"/addkedinbound", {
            data : Data
        }).then(res=>{
            console.log(res);
            if(res.data === true){
                this.formRef.reset();
            }
            this.setState({btnSubmit : false});
        })
        /*let myprd = moment(new Date()).format('YY').toString().charAt(1) + String.fromCharCode(65 + parseInt(moment(new Date()).format('M'))-1); 
        console.log(myprd);
        let status;
        let sequence;
        axios.get(Config.api+"/getnoAntrian/"+myprd).then(res =>{
            if(res.data === true){
                status = "upt";
            };
            axios.get(Config.api+"/getnoAntrian/"+myprd+"/"+status).then(res =>{
                sequence = res.data[0].seq;
                let Data = {
                    Ekspedisi : this.state.Ekspedisi,
                    JenisKendaraan : this.state.JenisKendaraan,
                    NomorKendaraan : this.state.NomorKendaraan,
                    NamaDriver : this.state.NamaDriver,
                    Antrian : this.state.Antrian,
                    Seq : sequence,
                }
                axios.post(Config.api+"/addKedIn", {
                    data : Data
                }).then((response) => {
                    console.log(response.data);
                })
            });
        });*/
    }
    closeModal(){
        this.setState({addModalShow : false});
    }
    showingModal(){
        this.setState({addModalShow : true});
    }
    addListEkspedisi(str, evnt){
        let eks = this.state.listEkspedisi;
        eks.push(str);
        this.setState({listEkspedisi : eks});
    }
    render() { 
        return (
            <>
            <Container className="mt-2">
                <h2 className="text-center">KEDATANGAN KENDARAAN - INBOUND</h2>
                <Row className="justify-content-center">
                    <Col xs={12} lg={8} className="bg-success text-white" style={{borderRadius: "15px"}}>
                        <Row className="my-1">
                            <Col xs={9}>
                                <Form ref={(ref) => this.formRef = ref} autoComplete="off" onSubmit={this.submitHandler.bind(this)}>
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
                                    <Row className="my-1">
                                        <Col xs={4} className="my-auto text-right">
                                            <Form.Label>Jenis Antrian</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                        <Form.Control 
                                            disabled={this.state.btnSubmit}
                                            as="select" 
                                            name="Antrian" 
                                            onChange={this.onChangeHandler.bind(this)} 
                                            required>
                                            <option value="">---Pilih---</option>
                                            {this.state.listAntrian.map((list, index) => (
                                                <option key={index} value={list.id}>{list.name}</option>
                                            ))}
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                    <Button disabled={this.state.btnSubmit} variant="light" className="text-success mx-1" type="submit">
                                        {this.state.btnSubmit ? "Loading..." : <><FontAwesomeIcon icon={faPaperPlane}/> Submit</>}
                                    </Button>
                                </Form>
                            </Col>
                            <Col xs={3}>
                                <Button variant="light" className="w-100 my-1 text-success" onClick={this.showingModal.bind(this)}>Tambah Expedisi</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <ModalTambahEks 
                show={this.state.addModalShow} 
                onHide={this.closeModal.bind(this)} 
                listEkspedisi={this.state.listEkspedisi} 
                addListEkspedisi={this.addListEkspedisi.bind(this)} />
            </>
        );
    }
}
 
export default KedKendIn;