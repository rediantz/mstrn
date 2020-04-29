import React, { Component } from 'react';
import {Form, Modal, Button} from 'react-bootstrap';
import moment from 'moment';
import Axios from 'axios';
import Config from '../Config/Config';
class OutboundAdd extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            listCabangTujuan : [],
            listNamaEkspedisi : [],
            listJenisKendaraan : [],
            CabangTujuan : '',
            NamaEkspedisi : '',
            JenisKendaraan : '',
            ListPickingNo : '',
            Kedatangan : null,
            Picking : null,
            Packing : null,
            Consol : null,
            LoadingStart : null,
            LoadingFinish : null,
            SuratJalanStart : null,
            SuratJalanFinish : null,
            DC : localStorage.getItem('dc'),
            User : localStorage.getItem('username'),
            formRef : null,
            type : "add",
            isLoading : false
        }
    }
    onSubmit(e){
        e.preventDefault();
        this.setState({
            isLoading : true
        })
        //console.log(e.target.name);
        let Data = ({
            CabangTujuan : this.state.CabangTujuan,
            NamaEkspedisi : this.state.NamaEkspedisi,
            JenisKendaraan : this.state.JenisKendaraan,
            ListPickingNo : this.state.ListPickingNo,
            Kedatangan : moment(this.state.Kedatangan).format("YYYY-MM-DD HH:mm:ss"),
            Picking : moment(this.state.Picking).format("YYYY-MM-DD HH:mm:ss"),
            Packing : moment(this.state.Packing).format("YYYY-MM-DD HH:mm:ss"),
            Consol : moment(this.state.Consol).format("YYYY-MM-DD HH:mm:ss"),
            LoadingStart : moment(this.state.LoadingStart).format("YYYY-MM-DD HH:mm:ss"),
            LoadingFinish : moment(this.state.LoadingFinish).format("YYYY-MM-DD HH:mm:ss"),
            SuratJalanStart : moment(this.state.SuratJalanStart).format("YYYY-MM-DD HH:mm:ss"),
            SuratJalanFinish : moment(this.state.SuratJalanFinish).format("YYYY-MM-DD HH:mm:ss"),
            DC : this.state.DC,
            User : this.state.User,
            Type : e.target.name
        })
        console.log(Data);
        let api = '/addperencanaan';
        Axios.post(Config.api+api, {
            data : Data
        }).then(res =>{
            //console.log(res);
            if(res.data === true){
                this.setState({
                    CabangTujuan : '',
                    NamaEkspedisi : '',
                    JenisKendaraan : '',
                    ListPickingNo : '',
                    Kedatangan : '',
                    Picking : '',
                    Packing : '',
                    Consol : '',
                    LoadingStart : '',
                    LoadingFinish : '',
                    SuratJalanStart : '',
                    SuratJalanFinish : ''
                })
                this.formRef.reset();
            }
            this.setState({
                isLoading : false
            })
            window.location.reload(true);
        })
    }
    onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        });
    }
    componentWillReceiveProps(nextProps){
        //console.log(moment(nextProps.datas.DatePlan).format("YYYY-MM-DDTHH:mm:ss"));
        //console.log(this.state);
        //console.log(nextProps.datas);
        //console.log(nextProps);
        this.setState({
            listNamaEkspedisi : nextProps.ekspedisi,
            listCabangTujuan : nextProps.cabTj,
            listJenisKendaraan : nextProps.kend,
            type : nextProps.type
        })
        if(nextProps.datas !== ""){
            this.setState({     
                CabangTujuan : nextProps.datas.kodecabt,
                NamaEkspedisi : nextProps.datas.expcode,
                JenisKendaraan : nextProps.datas.kodekend,
                ListPickingNo : nextProps.datas.listpick,
                Kedatangan : nextProps.datas.dateplan,
                Picking : nextProps.datas.planpicking,
                Packing : nextProps.datas.planpacking,
                Consol : nextProps.datas.plankonsol,
                LoadingStart : nextProps.datas.splanload,
                LoadingFinish : nextProps.datas.fplanload,
                SuratJalanStart : nextProps.datas.splan_sj,
                SuratJalanFinish : nextProps.datas.fplan_sj
            })
        }else{
            this.setState({
                CabangTujuan : '',
                NamaEkspedisi : '',
                JenisKendaraan : '',
                ListPickingNo : '',
                Kedatangan : null,
                Picking : null,
                Packing : null,
                Consol : null,
                LoadingStart : null,
                LoadingFinish : null,
                SuratJalanStart : null,
                SuratJalanFinish : null,
            });
        }
    }
    onChangeTime(e){
        let time = moment(e.target.value).format("YYYY-MM-DD HH:mm:ss");
        //console.log(time);
        this.setState({
            [e.target.name] : time
        })
    }
    formatDate(date){
        //console.log(date);
        let time = moment(date).format("YYYY-MM-DDTHH:mm:ss");
        return(time);
    }
    render() { 
        return (
            <>
            <Modal
                show = {this.props.show}
                onHide = {this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop = 'static'
                keyboard = {!this.state.isLoading}
                >
                <Form autoComplete="off" ref={(ref) => this.formRef = ref} name={this.props.type} onSubmit={this.onSubmit.bind(this)}>
                <Modal.Header closeButton={!this.state.isLoading}>
                    <Modal.Title id="contained-modal-title-vcenter">
                    {this.props.type}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>List Picking No</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="List Picking No" 
                        name="ListPickingNo" 
                        value={this.state.ListPickingNo}
                        onChange={this.onChange.bind(this)}
                        disabled={this.state.isLoading || this.props.textListPickNo}
                        required/>
                    <Form.Label>Cabang Tujuan</Form.Label>
                    <Form.Control 
                        as="select" 
                        name="CabangTujuan" 
                        value={this.state.CabangTujuan} 
                        onChange={this.onChange.bind(this)} 
                        disabled={this.state.isLoading}
                        required>
                        <option value="">---Pilih---</option>
                        {this.state.listCabangTujuan.map((list, index)=>(
                            <option key={index} value={list.kodecab}>{list.namacab}</option>
                        ))}
                    </Form.Control>
                    <Form.Label>Nama Ekspedisi</Form.Label>
                    <Form.Control 
                        as="select" 
                        name="NamaEkspedisi" 
                        value={this.state.NamaEkspedisi} 
                        onChange={this.onChange.bind(this)} 
                        disabled={this.state.isLoading}
                        required>
                        <option value="">---Pilih---</option>
                        {this.state.listNamaEkspedisi.map((list, index)=>(
                            <option key={index} value={list.expcode}>{list.expname}</option>
                        ))}
                    </Form.Control>
                    <Form.Label>Jenis Kendaraan</Form.Label>
                    <Form.Control 
                        as="select" 
                        name="JenisKendaraan" 
                        value={this.state.JenisKendaraan} 
                        onChange={this.onChange.bind(this)} 
                        disabled={this.state.isLoading}
                        required>
                        <option value="">---Pilih---</option>
                        {this.state.listJenisKendaraan.map((list, index)=>(
                            <option key={index} value={list.kodekend}>{list.jeniskend}</option>
                        ))}
                    </Form.Control>
                    <Form.Label>Rencana Kedatangan</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="Kedatangan" 
                        value={this.formatDate(this.state.Kedatangan)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Rencana Picking</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="Picking" 
                        value={this.formatDate(this.state.Picking)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Rencana Packing</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="Packing" 
                        value={this.formatDate(this.state.Packing)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Rencana Consol</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="Consol" 
                        value={this.formatDate(this.state.Consol)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Rencana Loading Start</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="LoadingStart" 
                        value={this.formatDate(this.state.LoadingStart)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Rencana Loading Finish</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="LoadingFinish" 
                        value={this.formatDate(this.state.LoadingFinish)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Rencana Surat Jalan Start</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="SuratJalanStart" 
                        value={this.formatDate(this.state.SuratJalanStart)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Rencana Surat Jalan Finish</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        name="SuratJalanFinish" 
                        value={this.formatDate(this.state.SuratJalanFinish)} 
                        onChange={this.onChangeTime.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        type="Submit" 
                        className="p-0 w-100 btn-success"
                        disabled = {this.state.isLoading}>
                        {this.state.isLoading ? "Loading..." : "Simpan"}</Button>
                </Modal.Footer>
                </Form>
            </Modal>
            </>
        );
    }
}
 
export default OutboundAdd;