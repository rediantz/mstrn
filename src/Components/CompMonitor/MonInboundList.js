import React, { Component } from 'react';
import {Image} from 'react-bootstrap';
import moment from 'moment';
import AgungGumilarIlham from '../../Icons/Agung Gumilar Ilham.png';
import AkhmadDayani from '../../Icons/Akhmad Dayani.png';
import BowoLeksonoSPV from '../../Icons/Bowo Leksono SPV.png';
import HaerulAnwar from '../../Icons/Haerul Anwar.png';
import ImamWahyudi from '../../Icons/Imam Wahyudi.png';
import NurdinLubisRCVCord from '../../Icons/Nurdin Lubis RCV Cord.png';
import Nurholis from '../../Icons/Nurholis.png';
import RidwanSaidi from '../../Icons/Ridwan Saidi.png';
class MonInboundList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            listInbound : props.data,
            DC : localStorage.getItem('dc')
        }
    }
    componentDidUpdate(){ 
        if(this.state.listInbound !== this.props.data){
            this.setState({
                listInbound : this.props.data
            })
        }
    }
    componentDidMount(){
        console.log("didmount")
    }
    formatDate(data){
        let datas;
        if(data !== null){
            datas = moment(data).format("DD-MMM HH:mm");
            return(datas);
        }
        return(null);
    }
    handlePic(data){
        if(data === 'Agung Gumilar Ilham'){
            return(<Image style={{width:50}} src={AgungGumilarIlham} />);
        }else if(data === 'Akhmad Dayani'){
            return(<Image style={{width:50}} src={AkhmadDayani} />);
        }else if(data === 'Bowo Leksono'){
            return(<Image style={{width:50}} src={BowoLeksonoSPV} />);
        }else if(data === 'Haerul Anwar'){
            return(<Image style={{width:50}} src={HaerulAnwar} />);
        }else if(data === 'Imam Wahyudi'){
            return(<Image style={{width:50}} src={ImamWahyudi} />);
        }else if(data === 'Nurdin Lubis'){
            return(<Image style={{width:50}} src={NurdinLubisRCVCord} />);
        }else if(data === 'Nurholis'){
            return(<Image style={{width:50}} src={Nurholis} />);
        }else if(data === 'Ridwan Saidi'){
            return(<Image style={{width:50}} src={RidwanSaidi}/>);
        }else{
            return(null);
        }
    }
    render() { 
        return (  
            <>
            {this.state.listInbound.map((list) => (
                    <tr key={list.noantrian}>
                        <td className="align-middle"><b>{list.noantrian}</b></td>
                        <td className="align-middle"><b>{list.expname}</b></td>
                        <td className="align-middle"><b>{list.jeniskend}</b></td>
                        <td className="align-middle"><b>{list.nokend}</b></td>
                        <td className="align-middle"><b>{this.formatDate(list.kedatangan)}</b></td>
                        <td className="align-middle">
                            <div className="p-0 mx-auto">
                                {this.handlePic(list.dc_petugas)}
                            </div>
                        </td>
                        <td className="align-middle"><b>{this.formatDate(list.startunload)}</b></td>
                        <td className="align-middle"><b>{this.formatDate(list.finunload)}</b></td>
                        <td className="align-middle"><b>{list.flgstatus}</b></td>
                        <td className="align-middle"><b>{list.tipeantrian}</b></td>
                    </tr>
                ))}
            </>
        );
    }
}
 
export default MonInboundList;