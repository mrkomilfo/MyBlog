import React, { Component } from 'react';

import AuthHelper from '../../Utils/authHelper.js';

import Alert from '../Common/Alert';
import Button from '../Common/Button';

import './ChangePassword.css';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: AuthHelper.getId(), 
            oldPassword: '', 
            newPassword: '', 
            newPasswordConfirm: '',
            formErrors: { 
                oldPassword: '', 
                newPassword: '', 
                newPasswordConfirm: '' 
            },
            formValid: false, 
            oldPasswordValid: false, 
            newPasswordValid: false, 
            newPasswordConfirmValid: false,   
            error: false, 
            errorMessage: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.cancel = this.cancel.bind(this);
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

        let oldPasswordValid = this.state.oldPasswordValid;
        let newPasswordValid = this.state.newPasswordValid;
        let newPasswordConfirmValid = this.state.newPasswordConfirmValid;

        switch(fieldName){
            case 'oldPassword':
                oldPasswordValid = value.length >= 0;
                fieldValidationErrors.oldPassword = oldPasswordValid ? '' : 'Enter your old password';
                break;
            case 'newPassword':
                newPasswordValid = value.length >= 6;
                fieldValidationErrors.newPassword = newPasswordValid ? '' : 'Min length - 6';
                break;
            case 'newPasswordConfirm':
                newPasswordConfirmValid = value === this.state.newPassword;
                fieldValidationErrors.newPasswordConfirm = newPasswordConfirmValid ? '' : 'Password mismatch';
                break;
            default:
                break;
        }
        this.setState({
            oldPasswordValid: oldPasswordValid,
            newPasswordValid: newPasswordValid,
            newPasswordConfirmValid: newPasswordConfirmValid
          }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: 
            this.state.oldPasswordValid &&
            this.state.newPasswordValid &&
            this.state.newPasswordConfirmValid
        });
    }

    cancel()
    {
        this.props.history.push(`/user?id=${this.state.id}`);
    }

    render(){
        const errorBaner = this.state.errorMessage ? 
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;
        
        return(
            <>
            {errorBaner}
            <div className="form changePassword">
                <h2>Password changing</h2>
                <div className="formContent">
                    <div className="formGroup">
                        <label>Old password</label>
                        <input required type="password" name="oldPassword" value={this.state.oldPassword} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.oldPassword}</div>
                    </div>
                    <div className="formGroup">
                        <label>New password</label>
                        <input required type="password" name="newPassword"value={this.state.newPassword} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.newPassword}</div>
                    </div>
                    <div className="formGroup">
                        <label>Confirm new password</label>
                        <input required type="password" name="newPasswordConfirm" value={this.state.newPasswordConfirm} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.newPasswordConfirm}</div>
                    </div>
                    <div className="changePasswordButtonPanel">
                        <Button disabled = {!this.state.formValid} onClick={this.changePassword}>Save</Button>{' '}
                        <Button className="secondary" onClick={this.cancel}>Cancel</Button>
                    </div>
                </div>
            </div>
            </>
        )
    }

    changePassword(){
        debugger;
        if (!this.state.formValid)
        {
            this.setState({
                errorMessage: 'Form is not valid'
            })
            return;
        }
        var data = {
            id: parseInt(this.state.id),
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword, 
            newPasswordConfirm: this.state.newPasswordConfirm
        };

        const token = AuthHelper.getToken();
        fetch('api/User/changePassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok){
                AuthHelper.clearAuth();
                this.props.history.push("/signIn");
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