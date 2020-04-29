import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap';
import CompNavbar from './Components/CompNavbar/CompNavbar';
import MonInbound from './Components/CompMonitor/MonInbound';
import KedKenIn from './Components/CompKedKend/KedKendIn';
import KedKenOut from './Components/CompKedKend/KedKenOut';
import Call from './Components/ProsesOutBound/Call';
import DockCheck from './Components/ProsesInBound/DockCheck';
import Batal from './Components/ProsesInBound/Batal';
import StartUnload from './Components/ProsesInBound/StartUnload';
import MasterEks from './Components/Perencanaan/MasterEks';
import Outbound from './Components/Perencanaan/Outbound';
import FinishUnload from './Components/ProsesInBound/FinishUnload';
import MonOutbound from './Components/CompMonitor/CompOutbound';
import Login from './Components/CompNavbar/Login';
import DashB from './Components/DashBoard/DashBoard';
import Test from './Components/Test';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  if(localStorage.getItem('username')){
    return (
      <>
        <CompNavbar/>
        <Router>
          <Switch>
            <Route path="/ProsesInBound/FinishUnload">
              <><FinishUnload/></>
            </Route>
            <Route path="/ProsesInBound/StartUnload">
              <><StartUnload/></>
            </Route>
            <Route path="/ProsesInBound/Batal">
              <><Batal/></>
            </Route>
            <Route path="/ProsesInBound/DocCheck">
              <><DockCheck/></>
            </Route>
            <Route path="/Kedatangan/Outbound">
              <><KedKenOut/></>
            </Route>
            <Route path="/Kedatangan/Inbound">
              <><KedKenIn/></>
            </Route>
            <Route path="/Perencanaan/MasterEks">
              <><MasterEks/></>
            </Route>
            <Route path="/Perencanaan/Outbound">
              <><Outbound/></>
            </Route>
            <Route path="/Monitoring/Inbound">
              <><MonInbound/></>
            </Route>
            <Route path="/Monitoring/Outbound">
              <><MonOutbound/></>
            </Route>
            <Route path="/ProsesOutBound/Call">
              <><Call/></>
            </Route>
            <Route path="/test">
              <><Test/></>
            </Route>
            <Route path="/">
              <><DashB/></>
            </Route>
          </Switch>
        </Router>
      </>
    );
  }else{
    return(
      <>
        <Login/>
      </>
    )
  }
}

export default App;
