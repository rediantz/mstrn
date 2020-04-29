import React, { Component } from 'react';
import {Table} from 'react-bootstrap';
import CompOutboundList from './CompOutboundList';
import axios from 'axios';
import Config from '../Config/Config';
class CompOutbound extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOutbound : [],
            DC : localStorage.getItem('dc'),
            activePage : 0,
            showPage : 5,
            updates: false
        }
    }
    getData(){
        console.log("req data");
        axios.get(Config.api+"/getmonoutbound/"+this.state.DC+"/"+this.state.updates).then(res => {
            if(res.data !== false){
                this.setState({
                    listOutbound : res.data,
                    activePage : Math.ceil(res.data.length/this.state.showPage)
                });
                this.intervalPage = setInterval(() => this.changePage(), 30000);
            }
            console.log(res.data);
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
    changePage(){
        console.log("Change Page")
        let activePage = this.state.activePage;
        let maxPage = Math.ceil(this.state.listOutbound.length/this.state.showPage);
        if(activePage === 1){
            activePage = maxPage;
        }else{
            activePage--
        }
        this.setState({
            activePage
        })
    }
    render() { 
        return (
            <div className="fluid-container">
                <div className="col-12 p-0 d-flex flex-row my-2">
                <div className="ml-2">
                Page : {this.state.activePage ? this.state.activePage : "..."} from {this.state.listOutbound.length ? Math.ceil(this.state.listOutbound.length/this.state.showPage) : "..." } | {this.state.listOutbound.length ? this.state.listOutbound.length : "..."} Data
                </div>
                <div className="ml-auto mr-2">
                    <input type="checkbox" name="update" className="form-check-input" value="true" checked={this.state.updates} onChange={()=>{this.setState({updates : !this.state.updates})}}/> Update Data
                </div>
                </div>
                
                <Table responsive className="text-center">
                    <thead>
                        <tr>
                        <th rowSpan="2" className="align-middle">List Picking No</th>
                        <th rowSpan="2" className="align-middle">Destination</th>
                        <th rowSpan="2" className="align-middle">Dock Door / Staging Line</th>
                        <th rowSpan="2" className="align-middle">Vehicle No</th>
                        <th rowSpan="2" className="align-middle">Arrival</th>
                        <th rowSpan="2" className="align-middle">Consol</th>
                        <th colSpan="2" className="align-middle">Loading</th>
                        <th colSpan="2" className="align-middle">Surat Jalan</th>
                        </tr>
                        <tr>
                        <th>Start</th>
                        <th>Finish</th>
                        <th>Start</th>
                        <th>Finish</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CompOutboundList data = {this.state.listOutbound.slice(this.state.showPage*(this.state.activePage-1), (this.state.showPage*this.state.activePage))}
                        />
                    </tbody>
                </Table>
            </div>
        )
    }
}
export default CompOutbound;