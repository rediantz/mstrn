import React, { Component } from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import {Enc, Dec} from '../Config/EncDec';
import axios from 'axios';
import Config from '../Config/Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignInAlt} from '@fortawesome/free-solid-svg-icons';
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username : '',
            password : '',
            isLoading : false
        }
        if(localStorage.getItem('username')){
            window.location.href = '/';
        }
    }
    onChangeHandler(e){
        this.setState({
            [e.target.name] : e.target.value
        });
    }
    onSubmitHandler(e){
        e.preventDefault();
        let user = Enc(this.state.username);
        let pass = Enc(this.state.password);
        this.setState({
            isLoading : true
        })
        let Data = {
            username : user,
            password : pass
        }
        axios.post(Config.api+"/login", {
            data : Data
        }).then(res =>{
            if(res.data !== false && res.data.length !== 0){
                localStorage.setItem('username', Dec(res.data[0].manp01));
                localStorage.setItem('dc', res.data[0].rdc);
                window.location.href = '/';
            }else{
                alert("Username / Password Salah!")
            }
            this.setState({
                isLoading : false
            })
        })
    }
    render() { 
        return (
            <>
            <Container fluid className="bg-light" style={{height:"100vh"}} >
                <Form disabled className="col-lg-4 col-md-6 mx-auto my-auto" onSubmit={this.onSubmitHandler.bind(this)} autoComplete="off">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="username" 
                        onChange={this.onChangeHandler.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="password" 
                        onChange={this.onChangeHandler.bind(this)} 
                        readOnly={this.state.isLoading}
                        required/>
                    <Button 
                        type="Submit" 
                        className="w-100 my-2 bg-success"
                        disabled={this.state.isLoading}
                    >{this.state.isLoading ? "Loading..." : <><FontAwesomeIcon icon={faSignInAlt}/> Login</>}</Button>
                </Form>
            </Container>
            </>
        );
    }
}
 
export default LoginForm;