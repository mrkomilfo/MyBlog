import React, { Component } from 'react';

import Alert from '../Common/Alert';
import Button from '../Common/Button';

import './SignUp.css';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            error: false,
            errorMessage: '',

            userName: '', 
            email: '',
            login: '', 
            password: '', 
            passwordConfirm: '',
            formErrors: { 
                userName: '', 
                email: '',
                login: '', 
                password: '',
                passwordConfirm: '' 
            },
            formValid: false, 
            userNameValid: false, 
            emailValid: true, 
            loginValid: false, 
            passwordValid: false, 
            passwordConfirmValid: false,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.register = this.register.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;

        this.setState({
          [name]: value}, 
          () => { this.validateField(name, value) }
        );
    }

    validateField(fieldName, value){
        let fieldValidationErrors = this.state.formErrors;

        let userNameValid = this.state.userNameValid;
        let emailValid = this.state.emailValid;
        let loginValid = this.state.loginValid;
        let passwordValid = this.state.passwordValid;
        let passwordConfirmValid = this.state.passwordConfirmValid;

        switch(fieldName){
            case 'userName':
                userNameValid = value.length >= 4;
                fieldValidationErrors.userName = userNameValid ? '' : 'Min length - 4';
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || value.length === 0;
                fieldValidationErrors.email = emailValid ? '' : 'Wrong format';
                break;
            case 'login':
                loginValid = value.length >= 4;
                fieldValidationErrors.login = loginValid ? '' : 'Min length - 4';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '' : 'Min length - 6';
                break;
            case 'passwordConfirm':
                passwordConfirmValid = value === this.state.password;
                fieldValidationErrors.passwordConfirm = passwordConfirmValid ? '' : 'Password mismatch';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            userNameValid: userNameValid,
            emailValid: emailValid,
            loginValid: loginValid,
            passwordValid: passwordValid,
            passwordConfirmValid: passwordConfirmValid
          }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: 
            this.state.userNameValid &&
            this.state.emailValid &&
            this.state.loginValid &&
            this.state.passwordValid &&
            this.state.passwordConfirmValid
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
            <div className="form signUp">
                <h2>Registration</h2>
                <div className="formContent">
                    <div className="formGroup">
                        <label>Username</label>
                        <input required type="text" name="userName" value={this.state.userName} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.name}</div>
                    </div>
                    <div className="formGroup">
                        <label>Email</label>
                        <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.email}</div>
                    </div>
                    <div className="formGroup">
                        <label>Login</label>
                        <input required type="text" name="login" value={this.state.login} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.login}</div>
                    </div>
                    <div className="formGroup">
                        <label>Password</label>
                        <input required type="password" name="password" id="password" value={this.state.password} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.password}</div>
                    </div>
                    <div className="formGroup">
                        <label>Confirm password</label>
                        <input required type="password" name="passwordConfirm" id="passwordConfirm" value={this.state.passwordConfirm} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.passwordConfirm}</div>
                    </div>
                    <Button className="signUpButton" disabled = {!this.state.formValid} onClick={() => this.register()}>Sign Up</Button>
                </div>
            </div>
            </>
        )
    }

    register(){
        if (!this.state.formValid)
        {
            this.setState({
                errorMessage: 'Form is not valid'
            })
            return;
        }
        let data = {
            userName: this.state.userName,
            email: this.state.email,
            login: this.state.login, 
            password: this.state.password, 
            passwordConfirm: this.state.passwordConfirm
        };

        fetch('api/User', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok){
                this.props.history.push("/signUp");
            }
            else {
                this.setState({error: true});
                return response.json();
            }
        }).then((data) => {
            if(this.state.error)
            {
                this.setState({
                    errorMessage: data.message
                });
            }
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }
}