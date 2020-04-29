import React, { Component } from 'react';
import {Card, Button, Col, Container, Row} from 'react-bootstrap';
import Axios from 'axios';
import Config from '../Config/Config';
import moment from 'moment';
import ModalYesNo from '../Config/ModalYesNo';
class Batal extends Component {
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
        Axios.get(Config.api+"/getdocbatal/"+this.state.DC).then(res=>{
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
    }
    showModalYesNo(index, e){
        let data = index
        this.setState({
            ModalYesNo : true,
            dataModalYesNo : data,
            textModalYesNo : <>Apakah ingin batalkan penundaan <br/> No Antrian : {this.state.listDockCheck[index].NoAntrian}</>
        });
    }
    closeModalYesNo(){
        this.setState({
            ModalYesNo : false,
            dataModalYesNo : ''
        })
    }
    handleBatal(index){
        this.setState({
            isLoadingModalYesNo : true
        })
        let Data = {
            DC : this.state.DC,
            User : this.state.User,
            NoAntrian : this.state.listDockCheck[index].NoAntrian,
            Flag : '20',
            FlagStat : '90'
        }
        //console.log(Data);
        Axios.post(Config.api+"/checkdoc", {
            data : Data
        }).then(res =>{
            console.log(res);
            if(res.data === true){
                let filteredArray = this.state.listDockCheck.filter((item, i) => i !== index);
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
                                    <Button variant="success" className="w-100 m-1" onClick={this.showModalYesNo.bind(this, index)}>Batalkan Penundaan</Button>
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
                    yesClick={this.handleBatal.bind(this)}
                    text={this.state.textModalYesNo}
                    data = {this.state.dataModalYesNo}
                    isLoading = {this.state.isLoadingModalYesNo}
                />
            </Container>
        </>);
    }
}
 
export default Batal;