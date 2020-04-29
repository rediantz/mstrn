import React, { Component } from 'react';
import axios from 'axios';
import Config from '../Config/Config';
import {Card, Button, Col, Container, Row} from 'react-bootstrap';
import moment from 'moment';
import ModalYesNo from '../Config/ModalYesNo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn} from '@fortawesome/free-solid-svg-icons';
class StartUnload extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            listStartUnload : [],
            listChecker : [],
            Checker : [],
            DC : localStorage.getItem('dc'),
            User : localStorage.getItem('username'),
            ModalYesNo : false,
            dataModalYesNo : '',
            textModalYesNo : '',
            isLoadingModalYesNo : ''
        }
    }
    getListChecker(){
        axios.get(Config.api+"/getpetugas/"+this.state.DC).then(res=>{
            if(res.data !== false){
                this.setState({
                    listChecker : res.data
                });
            }
        })
    }
    getList(){
        axios.get(Config.api+"/getsunload/"+this.state.DC).then(res=>{
            if(res.data !== false){
                console.log(res.data);
                //console.log(Data);
                //console.log(res.data);
                this.setState({
                    listStartUnload : res.data,
                })
            }
        })
    }
    componentDidMount(){
        this.getListChecker();
        this.getList();
    }
    onSelectHandler(index, e){
        let Data = this.state.listStartUnload;
        Data[index].dc_petugas = e.target.value;
        this.setState({
            listStartUnload : Data
        });
    }
    showModalYesNo(index, e){
        e.preventDefault();
        let data = index;
        this.setState({
            ModalYesNo : true,
            dataModalYesNo : data,
            textModalYesNo : <>Start Loading <br/> No Antrian : {this.state.listStartUnload[index].noantrian}</>
        });
    }
    closeModalYesNo(){
        this.setState({
            ModalYesNo : false,
            dataModalYesNo : ''
        })
    }
    onSubmit(index){
        this.setState({
            isLoadingModalYesNo : true
        })
        let Data = {
            Flag : '10',
            FlagStat : '15',
            Petugas : this.state.listStartUnload[index].dc_petugas,
            User : this.state.User,
            DC : this.state.DC,
            Antrian : this.state.listStartUnload[index].noantrian
        }
        axios.post(Config.api+'/addsunload',{
            data : Data
        }).then(res=>{
            console.log(res);
            if(res.data === true){
                let filteredArray = this.state.listStartUnload.filter(item => item.noantrian !== this.state.listStartUnload[index].noantrian);
                this.setState({listStartUnload: filteredArray});
            }else{
                console.log("Error");
            }
            this.setState({
                ModalYesNo : false,
                dataModalYesNo : '',
                isLoadingModalYesNo : false
            });
        })
    }
    calling(index){
        let synth = window.speechSynthesis;
        let str = "Panggilan untuk ";
        str += "Pengemudi dengan nama "+ this.state.listStartUnload[index].namadriver;
        str += " No Antrian " + this.state.listStartUnload[index].noantrian;
        str += " Ekspedisi " + (this.state.listStartUnload[index].expname).toString().toLowerCase();
        str += " Nomor Kendaraan " + (this.state.listStartUnload[index].nokend).toString().replace(/ /g, '');
        str += " segera memasuki gerbang untuk proses bongkar barang."
        if(synth.speaking === true){
            synth.cancel();
        }
        console.log(str);
        let msg = new SpeechSynthesisUtterance(str)
        msg.lang = 'id';
        msg.voiceURI = "native";
        synth.speak(msg);
    }
    render() { 
        return (
        <>
            <Container fluid className="mt-2">
                <Row>
                    {this.state.listStartUnload.map((list, index)=>(
                        <Col xs={12} md={6} lg={4} key={index}>
                        <Card>
                        <Card.Header as="h5">List Picking No - {list.noantrian}</Card.Header>
                        <Card.Body>
                            <Card.Title>Nama Ekspedisi : {list.expname}</Card.Title>
                            No Kendaraan : {list.nokend}<br/>
                            Jenis Kendaraan : {list.jeniskend}<br/>
                            Waktu Kedatangan : {moment(list.kedatangan).format("YYYY-MM-DD HH:mm")}<br/>
                            Jenis Antrian : {list.tipeantrian}<br/>
                            <form autoComplete="off" onSubmit={this.showModalYesNo.bind(this, index)}>
                                <select className="form-control" required name="Checker" onChange={this.onSelectHandler.bind(this, index)}>
                                    <option value = ''>---Pilih---</option>
                                    {this.state.listChecker.map((list, ind)=>(
                                        <option key={ind} value={list.dc_petugas}>{list.dc_petugas}</option>
                                    ))}
                                </select>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <Button type="submit" variant="success" className="w-100 m-1" >Start Unload</Button>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Button variant="success" className="w-100 m-1" onClick={this.calling.bind(this, index)}>
                                            <FontAwesomeIcon icon={faBullhorn}/> Call
                                        </Button>
                                    </Col>
                                </Row>
                            </form>
                        </Card.Body>
                        </Card>
                        </Col>
                    ))}
                </Row>
                <ModalYesNo 
                    show={this.state.ModalYesNo} 
                    onHide={this.closeModalYesNo.bind(this)}
                    yesClick={this.onSubmit.bind(this)}
                    text={this.state.textModalYesNo}
                    data = {this.state.dataModalYesNo}
                    isLoading = {this.state.isLoadingModalYesNo}
                />
            </Container>
        </>);
    }
}
 
export default StartUnload;