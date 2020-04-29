import React, { Component } from 'react';
import {Container, Row, Col, Button, Card} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Config from '../Config/Config';
import moment from 'moment';
class Call extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCall : [],
            DC : localStorage.getItem('dc'),
            isLoading : false
        }
    }
    getDatas(){
        axios.get(Config.api+"/getoubound/"+this.state.DC).then(res=>{
            console.log(res);
            if(res.data !== false){
                this.setState({
                    listCall : res.data
                })
            }
        })
    }
    componentDidMount(){
        this.getDatas();
    }
    updateDockDoor(index, e){
        e.preventDefault();
        this.setState({
            isLoading : true
        });
        let data = this.state.listCall;
        let dock = ReactDOM.findDOMNode(e.target).childNodes[0].value;
        let door = ReactDOM.findDOMNode(e.target).childNodes[1].value;
        let Data = {
            dock : dock,
            stag : door,
            listpick : data[index].listpick
        }
        axios.post(Config.api+"/updatdock", {
            data : Data
        }).then(res=>{
            console.log(res);
            if(res !== false){
                if(dock !== '' && door !== ''){
                    data[index].dock_no = dock;
                    data[index].staging_line = door;
                    this.setState({listCall : data});
                }
            }
            this.setState({
                isLoading : true
            })
        })
    }
    handleButtonDock(index, doc, dor){
        if(doc === '' && dor === ''){
            return(
                <form autoComplete="false" onSubmit={this.updateDockDoor.bind(this, index)}>
                <input type="text" placeholder="Dock" className="col-5 form-control my-1" required/>
                <input type="text" placeholder="Door" className="col-5 form-control my-1" required/>
                <button disabled={this.state.isLoading} className="btn btn-success text-white" type="submit">Simpan</button>
                </form>
            )
        }
        else{
            return(
                <>Dock / Door : {doc} {dor}<br/>
                    <Button variant="success" onClick={this.calling.bind(this, index)}>Call</Button>
                </>
            )
        }
    }
    calling(index){
        let synth = window.speechSynthesis;
        let str = "Panggilan untuk ";
        str += "Nomor List Picking : " + this.state.listCall[index].listpick;
        str += " Ekspedisi " + (this.state.listCall[index].expname).toString().toLowerCase();
        str += " Nomor Kendaraan "+ (this.state.listCall[index].nokend).toString().replace(/ /g, '');
        str += " segera memasuki gerbang dan menuju ke Pintu Dock "+ this.state.listCall[index].dock_no;
        str += " untuk melakukan proses Muat Barang."
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
                    {this.state.listCall.map((list, index)=>(
                        <Col xs={12} md={6} lg={4} key={index}>
                        <Card>
                        <Card.Header as="h5">List Picking No {list.listpick}</Card.Header>
                        <Card.Body>
                            <Card.Title>Nama Ekspedisi : {list.expname}</Card.Title>
                            No Kendaraan : {list.nokend}<br/>
                            Jenis Kendaraan : {list.jeniskend}<br/>
                            Waktu Kedatangan : {moment(list.kedatangan).format("MM/DD HH:mm")}<br/>
                            {this.handleButtonDock(index, list.dock_no, list.staging_line)}
                        </Card.Body>
                        </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>);
    }
}
 
export default Call;