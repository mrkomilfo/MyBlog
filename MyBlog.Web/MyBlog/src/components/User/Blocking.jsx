import React, { Component } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

import AuthHelper from '../../Utils/authHelper.js';

import Alert from '../Common/Alert';
import Button from '../Common/Button';

import './Blocking.css';

export default class Blocking extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,
            id: null,
            userName: '',
            isBanned: false,
            days: 0, 
            hours: 0,
            formErrors: { 
                days: '', 
                hours: '' 
            },
            formValid: true, 
            daysValid: true, 
            hoursValid: true,

            errorMessage: '', 
            error: false
            
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.cancel = this.cancel.bind(this);
        this.ban = this.ban.bind(this);
        this.unban = this.unban.bind(this);
    }

    componentDidMount() {
        const parsed = queryString.parse(window.location.search);
        if (parsed) {
            this.loadUser(parsed['id']);
        }
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

        let daysValid = this.state.daysValid;
        let hoursValid = this.state.hoursValid;

        switch(fieldName){
            case 'days':
                daysValid = value.match(/^((0|([1-9][0-9]{0,9})))$/i)
                fieldValidationErrors.days = daysValid ? '' : 'Wrong number of days';
                break;
            case 'hours':
                hoursValid = value.match(/^((0|([1-9][0-9]{0,9})))$/i)
                fieldValidationErrors.hours = hoursValid ? '' : 'Wrong number of hours';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            daysValid: daysValid,
            hoursValid: hoursValid
          }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: 
            this.state.daysValid &&
            this.state.hoursValid 
        });
    }

    cancel()
    {
        this.props.history.push(`/user?id=${this.state.id}`);
    }

    renderContent(){
        return(
            <div className="form blocking">
                <h2>Blocking of <Link to={`/user?id=${this.state.id}`} className="blockingUserName">{this.state.userName}</Link></h2>
                <div className="formContent">
                    <div className="formGroup">
                        <label for="days">Number of days</label>
                        <input invalid={!this.state.daysValid} required type="number" name="days" value={this.state.days} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.days}</div>
                    </div>
                    <div className="formGroup">
                        <label for="hours">Number of hours</label>
                        <input invalid={!this.state.hoursValid} required type="number" name="hours" value={this.state.hours} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.hours}</div>
                    </div>
                    <div className="blockingButtonPanel">
                        {this.state.isBanned ? <Button onClick={this.unban}>Unban</Button> : null}{' '}
                        <Button disabled = {!this.state.formValid} className="danger" onClick={this.ban}>Ban</Button>{' '}
                        <Button className="secondary" onClick={this.cancel}>Cancel</Button>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        const errorBaner = this.state.errorMessage ? 
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;

        const content = this.state.loading
            ? <p className="loading">Loading</p>
            : this.renderContent();

        return(
            <>
            {errorBaner}
            {content}
            </>
        )
    }

    async loadUser(userId) {
        const token = AuthHelper.getToken();
        fetch(`api/User/${userId}/ban`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
        .then((response) => {
            if (!response.ok) {
                this.setState({
                    error: true
                });
            }
            return response.json();
        }).then((data) => {
            if (this.state.error){
                this.setState({ 
                    errorMessage: data.message,
                });
            }
            else {
                this.setState({ 
                    id: data.id,
                    userName: data.userName,
                    isBanned: data.isBanned,
                    loading: false
                });
            }
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }

    ban(){
        if (!this.state.formValid)
        {
            this.setState({
                errorMessage: 'Form is not valid'
            })
            return;
        }
        let data = {
            id: this.state.id,
            days: parseInt(this.state.days),
            hours: parseInt(this.state.hours),
        }
        const token = AuthHelper.getToken();
        fetch('api/User/ban', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + token     
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok){
                this.props.history.push(`/user?id=${this.state.id}`);
            }
            else {
                this.setState({error: true});
                return response.json();
            }
        }).then((data) => {
            debugger;
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

    unban(){
        const token = AuthHelper.getToken();
        fetch(`api/User/${this.state.id}/unban`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then((response) => {
            if (response.ok){
                this.props.history.push(`/user?id=${this.state.id}`);
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
