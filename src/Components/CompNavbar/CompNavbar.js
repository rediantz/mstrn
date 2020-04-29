import React, { Component } from 'react';
import {Navbar, Nav, NavDropdown, Image} from 'react-bootstrap';
import Logos from '../../Icons/Mostrans.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTruck, faCalendarAlt, faTruckLoading, faChartArea, faDesktop, faDatabase, faBullhorn, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
class CompNavbar extends Component {
    handleLogout(){
        //localStorage.removeItem('username');
        localStorage.clear('username');
        window.location.href = '/Login';
    }
    handleLogin(){
        if(localStorage.getItem('username')){
            return(
                <>
                    <Nav.Link onClick={this.handleLogout.bind(this)} className="text-white"><FontAwesomeIcon icon={faSignOutAlt}/> Logout</Nav.Link>
                </>
            )
        }
        /*else{
            return(
                <Nav.Link href="/Login" className="text-white"><FontAwesomeIcon icon={faSignInAlt}/> Login</Nav.Link>
            );
        }*/
    }
    render() { 
        return (
            <>
                <Navbar bg="success" expand="md" variant="dark">
                    <Navbar.Brand href="/"><Image src={Logos} style={{width: 50}}/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <NavDropdown title={<><FontAwesomeIcon icon={faDesktop}/> Monitoring</>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/Monitoring/Inbound">Inbound</NavDropdown.Item>
                            <NavDropdown.Item href="/Monitoring/Outbound">Outbound</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><FontAwesomeIcon icon={faCalendarAlt}/> Perencaan</>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/Perencanaan/Outbound"><FontAwesomeIcon icon={faCalendarAlt}/> Outbound</NavDropdown.Item>
                            <NavDropdown.Item href="/Perencanaan/MasterEks"><FontAwesomeIcon icon={faDatabase}/> Master Ekspedisi</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><FontAwesomeIcon icon={faTruck}/> Kedatangan</>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/Kedatangan/Inbound">Inbound</NavDropdown.Item>
                            <NavDropdown.Item href="/Kedatangan/Outbound">Outbound</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><FontAwesomeIcon icon={faTruckLoading}/> Proses-InBound</>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/ProsesInBound/DocCheck">Documen Check</NavDropdown.Item>
                            <NavDropdown.Item href="/ProsesInBound/Batal">Batalkan Penundaan</NavDropdown.Item>
                            <NavDropdown.Item href="/ProsesInBound/StartUnload">Start Unload</NavDropdown.Item>
                            <NavDropdown.Item href="/ProsesInBound/FinishUnload">Finish Unload</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><FontAwesomeIcon icon={faTruckLoading}/> Proses-OutBound</>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/ProsesOutBound/Call"><FontAwesomeIcon icon={faBullhorn}/> Call / Panggil</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><FontAwesomeIcon icon={faChartArea}/> Dashboard</>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">Outbound</NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                        {this.handleLogin()}
                    </Navbar.Collapse>
                </Navbar>
            </>
        );
    }
}
 
export default CompNavbar;