import React, { Component } from 'react';
import Alert from '../Common/Alert';
import Button from '../Common/Button';
import AuthHelper from '../../Utils/authHelper';

import './SignIn.css';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { login: '', password: '', errorMessage: '', error: false };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.logIn = this.logIn.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;

        this.setState({
          [name]: value
        });
    }

    render(){
        const errorBaner = this.state.errorMessage ? 
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;

        return( 
            <>
            {errorBaner}
            <div className="form signIn">
                <h2>Sign in</h2>  
                <div className="formContent">    
                    <div className="formGroup">
                        <label>Login</label>
                        <input required type="text" name="login" id="login" value={this.state.login} onChange={this.handleInputChange}/>
                    </div>
                    <div className="formGroup">
                        <label>Password</label>
                        <input required type="password" name="password" id="password" value={this.state.password} onChange={this.handleInputChange}/>
                    </div>
                    <Button className="signInButton" color="primary" onClick={this.logIn}>Log in</Button>
                </div>
            </div>
            </>
        )
    }

    logIn() {
        let data = {
            login: this.state.login,
            password: this.state.password
        };
        fetch('api/User/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            this.setState({error: !response.ok});
            return response.json();
        }).then((data) => {
            if (this.state.error){
                this.setState({
                    errorMessage: data.message
                });
            }
            else {
                debugger;
                AuthHelper.saveAuth(data.name, data.accessToken, data.role, data.login, data.password);
                this.props.history.push("/feed");
            }
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }
}