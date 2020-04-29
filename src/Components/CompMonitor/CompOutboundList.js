import React, { Component } from 'react';
import truckok from '../../Icons/truckok.png';
import trucknotok from '../../Icons/trucknotok.png';
import atruckok from '../../Icons/greentruck.png';
import atrucknotok from '../../Icons/redtruck.png';
import truckempty from '../../Icons/truckempty.png';
import moment from 'moment';
class CompInboundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOutbound : [],
            DC : localStorage.getItem('dc')
        }
    }
    componentDidUpdate(){ 
        //console.log(this.props.data)
        if(this.state.listOutbound !== this.props.data){
            this.setState({
                listOutbound : this.props.data
            })
        }
    }
    handlePic(pln, actl, pic, last){
        let hpic;
        if(pic === "NOK" && last === 'Z'){
            hpic = trucknotok;
        }
        else if(pic === "NOK" && last === 'N'){
            hpic = atrucknotok;
        }
        else if(pic === "OK" && last === 'H'){
            hpic = atruckok;
        }
        else if(pic === "OK" && last === 'Z'){
            hpic = truckok;
        }else{
            hpic = truckempty;
        }
        return(
            <b>
            <img src={hpic} alt="info"/><br></br>
            PLN : {moment(pln).format("HH:mm")} <br/>
            {actl ? `ACTL : `+moment(actl).format("HH:mm") : "ACTL : -"}
            </b>
        )
    }
    render() {
        return ( 
            <>
                {this.state.listOutbound.map((list) => (
                    <tr key={list.listpick}>
                        <td className="align-middle"><b>{list.listpick}</b></td>
                        <td className="align-middle"><b>{list.namacab}</b></td>
                        <td className="align-middle"><b>{list.dock_no}</b></td>
                        <td className="align-middle"><b>{list.nokend}</b></td>
                        <td className="align-middle" style={{fontSize:14}}>{this.handlePic(list.dateplan, list.dateactual, list.parrival, list.warrival)}</td>
                        <td className="align-middle" style={{fontSize:14}}>{this.handlePic(list.plankonsol, list.actualkonsol, list.pconsol, list.wconsol)}</td>
                        <td className="align-middle" style={{fontSize:14}}>{this.handlePic(list.splanload, list.sactualload, list.pls, list.wsload)}</td>
                        <td className="align-middle" style={{fontSize:14}}>{this.handlePic(list.fplanload, list.factualload, list.plf, list.wfload)}</td>
                        <td className="align-middle" style={{fontSize:14}}>{this.handlePic(list.splan_sj, list.sactual_sj, list.pssj, list.wssj)}</td>
                        <td className="align-middle" style={{fontSize:14}}>{this.handlePic(list.fplan_sj, list.factual_sj, list.pfsj, list.wfsj)}</td>
                    </tr>
                ))}
            </>     
        );
    }
}
 
export default CompInboundList;