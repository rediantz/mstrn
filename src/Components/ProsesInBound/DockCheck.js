import React, { Component } from 'react';
import {Card, Button, Col, Container, Row} from 'react-bootstrap';
import Axios from 'axios';
import Config from '../Config/Config';
import moment from 'moment';
import ModalYesNo from '../Config/ModalYesNo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle, faExclamationCircle, faCheckCircle, faBullhorn} from '@fortawesome/free-solid-svg-icons';
class DockCheck extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            listDockCheck : [],
            DC : localStorage.getItem('dc'),
            User : localStorage.getItem('username'),
            ModalYesNo : false,
            dataModalYesNo : '',
            textModalYesNo : '',
            isLoadingModalYesNo : ''
        }
    }
    getListDock(){
        Axios.get(Config.api+"/getdoccheck/"+this.state.DC).then(res=>{
            console.log(res);
            if(res.data === false){
                console.log("Error Getting Data");
            }else{
                let Data = [];
                for(let i = 0 ; i < res.data.length ; i++){
                    let Datas = {
                        NoAntrian : res.data[i].noantrian,
                        NamaEkspedisi : res.data[i].expname,
                        JenisKendaraan : res.data[i].jeniskend,
                        NoKendaraan : res.data[i].nokend,
                        WaktuKedatangan : res.data[i].kedatangan,
                        JenisAntrian : res.data[i].tipeantrian,
                        NamaDriver : res.data[i].namadriver
                    }
                    Data.push(Datas);
                }
                this.setState({
                    listDockCheck : Data
                });
            }
        })
    }
    componentDidMount(){
        this.getListDock();
        /*this.setState({
            listDockCheck : [{
                NoAntrian : '0C738',
                NamaEkspedisi : 'PCP EXPRESS',
                JenisKendaraan : 'COLT L-300',
                NoKendaraan : 'B 6973 ULB',
                WaktuKedatangan : '24-Mar-20 09.45',
                JenisAntrian : 'Queue',
                NamaDriver : 'Vanny'
            },
            {
                NoAntrian : '0C744',
                NamaEkspedisi : 'WADHIKA KARYA SEJAHTERA (EXP)',
                JenisKendaraan : 'C.DIESEL 4.5T/12M3',
                NoKendaraan : 'B 9230 TXS',
                WaktuKedatangan : '24-Mar-20 10.22',
                JenisAntrian : 'Non Queue',
                NamaDriver : 'Elora'
            }]
        })*/
    }
    closeModalYesNo(){
        this.setState({
            ModalYesNo : false,
            dataModalYesNo : ''
        })
    }
    calling(index){
        let synth = window.speechSynthesis;
        let str = "Panggilan untuk ";
        str += "Pengemudi dengan nama "+ this.state.listDockCheck[index].NamaDriver;
        str += " No Antrian " + this.state.listDockCheck[index].NoAntrian;
        str += " Ekspedisi " + (this.state.listDockCheck[index].NamaEkspedisi).toString().toLowerCase();
        str += " Nomor Kendaraan " + (this.state.listDockCheck[index].NoKendaraan).toString().replace(/ /g, '');
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
    handleBtn(index, e){
        let data = this.state.listDockCheck[index];
        data.type = e.target.name;
        data.index = index;
        this.setState({
            ModalYesNo : true,
            dataModalYesNo : data,
            textModalYesNo : <>Apakah ingin {e.target.name.toLowerCase()} <br/> No Antrian : {data.NoAntrian}</>
        });
    }
    yesModalYesNo(data){
        console.log(data);
        this.setState({
            isLoadingModalYesNo : true
        })
        let Data = {
            DC : this.state.DC,
            User : this.state.User,
            NoAntrian : data.NoAntrian,
            Flag : '',
            FlagStat : '20'
        }
        if(data.type === "Terima"){
            Data.Flag = '15';
        }else if(data.type === "Tunda"){
            Data.Flag = '90';
        }else if(data.type === "Batalkan"){
            Data.Flag = '95';
        }
        Axios.post(Config.api+"/checkdoc", {
            data : Data
        }).then(res =>{
            console.log(res);
            if(res.data === true){
                let filteredArray = this.state.listDockCheck.filter((item, i) => i !== data.index);
                this.setState({listDockCheck: filteredArray});
            }
            this.setState({
                isLoadingModalYesNo : false,
                ModalYesNo : false
            })
        })
    }
    render() { 
        return (
        <>
            <Container fluid className="mt-2">
                <Row>
                    {this.state.listDockCheck.map((list, index)=>(
                        <Col xs={12} md={6} lg={4} key={index}>
                        <Card>
                        <Card.Header as="h5">List Picking No - {list.NoAntrian}</Card.Header>
                        <Card.Body>
                            <Card.Title>Nama Ekspedisi : {list.NamaEkspedisi}</Card.Title>
                            No Kendaraan : {list.NoKendaraan}<br/>
                            Jenis Kendaraan : {list.JenisKendaraan}<br/>
                            Waktu Kedatangan : {moment(list.WaktuKedatangan).format("YYYY-MM-DD HH:mm")}<br/>
                            Jenis Antrian : {list.JenisAntrian}<br/>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Button variant="success" className="w-100 m-1" name="Panggil" 
                                    onClick={this.calling.bind(this, index)}>
                                        <FontAwesomeIcon icon={faBullhorn}/> Panggil
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="success" className="w-100 m-1" name="Terima" 
                                    onClick={this.handleBtn.bind(this, index)}>
                                        <FontAwesomeIcon icon={faCheckCircle}/> Terima Dokumen
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="success" className="w-100 m-1" name="Tunda" 
                                    onClick={this.handleBtn.bind(this, index)}>
                                        <FontAwesomeIcon icon={faExclamationCircle}/> Tunda
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="success" className="w-100 m-1" name="Batalkan" 
                                    onClick={this.handleBtn.bind(this, index)}>
                                        <FontAwesomeIcon icon={faTimesCircle}/> Batalkan
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                        </Col>
                    ))}
                </Row>
                <ModalYesNo 
                    show={this.state.ModalYesNo} 
                    onHide={this.closeModalYesNo.bind(this)}
                    yesClick={this.yesModalYesNo.bind(this)}
                    text={this.state.textModalYesNo}
                    data = {this.state.dataModalYesNo}
                    isLoading = {this.state.isLoadingModalYesNo}
                />
            </Container>
        </>);
    }
}
 
export default DockCheck;