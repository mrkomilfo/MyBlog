import React, { Component } from 'react';
import queryString from 'query-string';
import AuthHelper from '../../Utils/authHelper.js';

import Alert from '../Common/Alert';
import Button from '../Common/Button';

import './EditProfile.css';

export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,

            error: false, 
            errorMessage: '',

            id: '', 
            userName: '', 
            email: '',
            hasImage: false, 
            imagePath: '', 
            imageFile: null, 
            fileName: '',
            formErrors: { 
                userName: '', 
                email: '', 
                imageFile: ''
            },
            formValid: true,
            userNameValid: true, 
            emailValid: true, 
            imageFileValid: true,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.cancel = this.cancel.bind(this);
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

        if (name === 'imageFile')
        {
            this.setState({
                fileName: value,
                imageFile: target.files[0],
                hasImage: true
            }, 
                () => { this.validateField(name, target.files[0]) }
            )
        }
        else{
            this.setState({
                [name]: value
            }, 
                () => { this.validateField(name, value) }
            );
        }
    }

    validateField(fieldName, value){
        let fieldValidationErrors = this.state.formErrors;

        let userNameValid = this.state.userNameValid;
        let emailValid = this.state.emailValid;
        let imageFileValid = this.state.imageFileValid;

        switch(fieldName){
            case 'userName':
                userNameValid = value.length >= 4;
                fieldValidationErrors.userName = userNameValid ? '' : 'Минимальная длина - 4';
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || value.length === 0;
                fieldValidationErrors.email = emailValid ? '' : 'Неверный формат';
                break;
            case 'imageFile':
                imageFileValid = value.size <= 8388608 //8 Mb
                fieldValidationErrors.imageFile = imageFileValid ? '' : 'Размер изображения не должен превышать 8 Mb';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            userNameValid: userNameValid,
            emailValid: emailValid,
            imageFileValid: imageFileValid,
          }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: 
            this.state.userNameValid &&
            this.state.emailValid
        });
    }

    removeImage()
    {
        this.setState({
            imageFile: null,
            hasImage: false,
            fileName: '',
            imagePath: '',
            imageFileValid: true,
        }, this.validateForm)
    }

    cancel()
    {
        this.props.history.push(`/user?id=${this.state.id}`);
    }

    renderProfile(){        
        let imageBlock;
        if (this.state.imageFile)
        {
            imageBlock = <img className="editProfileImage" src={URL.createObjectURL(this.state.imageFile)} alt="profile image" onClick={(e) => this.removeImage()}/>
        }
        else if (this.state.imagePath)
        {
            imageBlock = <img className="editProfileImage" src={this.state.imagePath} alt="profile image" onClick={(e) => this.removeImage()}/>
        }
        else imageBlock = null

        return(   
            <div className="form editProfile">
                <h2>Edit profile</h2>
                <div className="formContent">
                    <div className="formGroup">
                        <label>Username</label>
                        <input required type="text" name="userName" value={this.state.userName} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.userName}</div>
                    </div>
                    <div className="formGroup">
                        <label>Email</label>
                        <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.email}</div>
                    </div>
                    <div className="formGroup">
                        <label>Photo</label>
                        <input type="file" name="imageFile" accept=".jpg,.png,.jpeg" value={this.state.fileName} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.imageFile}</div>
                        {imageBlock}
                    </div>
                    <div className="editProfileButtonPanel">
                        <Button disabled = {!this.state.formValid} onClick={() => this.editProfile()}>Save</Button>{' '}
                        <Button className="secondary" onClick={() => this.cancel()}>Cancel</Button>
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
            : this.renderProfile();

        return(
            <>
                {errorBaner}
                {content}
            </>
        )
    }

    async loadUser(userId) {
        const token = AuthHelper.getToken();
        fetch(`api/User/${userId}/update`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
        .then((response) => {
            this.setState({error: !response.ok});
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
                    email: data.email,
                    hasImage: data.hasPhoto,
                    imagePath: data.photo,
                    loading: false
                });
            }
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }

    editProfile(){
        if (!this.state.formValid)
        {
            this.setState({
                errorMessage: 'Form is not valid'
            })
            return;
        }
        let formdata = new FormData();
        formdata.append('id', this.state.id);
        formdata.append('userName', this.state.userName);
        formdata.append('email', this.state.email);
        formdata.append('hasPhoto', this.state.hasImage);
        if (this.state.imageFile)
        {
            formdata.append('photo', this.state.imageFile);
        }
        const token = AuthHelper.getToken();
        fetch('api/Users', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formdata
        }).then((response) => {
            if (response.ok){
                this.props.history.push(`/user?id=${this.state.id}`);
            }
            else {
                this.setState({error: true})
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