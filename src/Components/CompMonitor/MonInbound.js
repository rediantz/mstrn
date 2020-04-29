import React, { Component } from 'react';
import {Container, Table} from 'react-bootstrap';
import MonInboundList from './MonInboundList';
import Config from '../Config/Config';
import axios from 'axios';
class MonInbound extends Component {
    constructor(props){
        super(props);
        this.state = { 
            listInbound : [],
            DC : localStorage.getItem('dc'),
            activePage : 0,
            showPage : 5
        }
    }
    getData(){
        console.log("req data");
        axios.get(Config.api+"/getinbound/"+this.state.DC).then(res => {
            console.log(res.data);
            this.setState({
                listInbound : res.data,
                activePage : 1
            });
            if(this.intervalPage){
                clearInterval(this.intervalPage);
            }
            if(res.data !== false){
                console.log("exekusi")
                this.intervalPage = setInterval(() => this.changePage(), 30000);
            }
        })
    } 
    changePage(){
        console.log("Change Page")
        let activePage = this.state.activePage;
        let maxPage = Math.ceil(this.state.listInbound.length/this.state.showPage);
        if(activePage === maxPage){
            activePage = 1;
        }else{
            activePage++
        }
        this.setState({
            activePage
        })
    }
    componentDidMount() {
        this.getData();
        this.interval = setInterval(() => this.getData(), 300000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.intervalPage);
    }
    viewPagination(){
        return(
            <>
            <div className="ml-2 my-2">
                Page : {this.state.activePage ? this.state.activePage : "..."} from {this.state.listInbound.length ? Math.ceil(this.state.listInbound.length/this.state.showPage) : "..." } | {this.state.listInbound.length ? this.state.listInbound.length : "..."} Data
            </div>
            </>
        )
    }
    render() { 
        return (
            <Container fluid>
                <div className="col-12 row p-0">
                    {this.viewPagination()}
                </div>
                <Table responsive className="text-center">
                    <thead>
                        <tr>
                        <th rowSpan="2" className="align-middle">Queue Number</th>
                        <th rowSpan="2" className="align-middle">Expedition</th>
                        <th rowSpan="2" className="align-middle">Vehicle Type</th>
                        <th rowSpan="2" className="align-middle">Vehicle Number</th>
                        <th rowSpan="2" className="align-middle">Arrival Time</th>
                        <th colSpan="3" className="align-middle">Unloading</th>
                        <th rowSpan="2" className="align-middle">Information</th>
                        <th rowSpan="2" className="align-middle">Status</th>
                        </tr>
                        <tr>
                        <th>PIC</th>
                        <th>Start</th>
                        <th>Finish</th>
                        </tr>
                    </thead>
                    <tbody>
                        <MonInboundList
                            data = {this.state.listInbound.slice(this.state.showPage*(this.state.activePage-1), (this.state.showPage*this.state.activePage))}
                        />
                    </tbody>
                </Table>
            </Container>
        );
    }
}
 
export default MonInbound;