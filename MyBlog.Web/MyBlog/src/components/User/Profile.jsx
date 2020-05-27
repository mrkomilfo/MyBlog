import React, { Component } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import AuthHelper from '../../Utils/authHelper.js';

import Alert from '../Common/Alert';
import Button from '../Common/Button';

import './Profile.css';
import '../Common/Form.css';

export default class Profile extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errorMessage: '',
            id: '',
            userName: '',
            role: '',
            status: '',
            email: '',
            registrationDate: '',
            writedPosts: 0,
            photo: '',
            width: 0,
            height: 0,
            myRole: AuthHelper.getRole(),
            myId: AuthHelper.getId()
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    
        const parsed = queryString.parse(window.location.search);
        if (parsed) {
            this.loadData(parsed['id']);
        }
    }

    renderButtonPanel() {

        if (this.state.myId == this.state.id)
        {
            return(
                <div className="profileButtonPanel">
                    <Button><Link to={`/editProfile?id=${this.state.id}`}>Edit profile</Link></Button>{' '}
                    <Button><Link to={`/changePassword?id=${this.state.id}`}>Change password</Link></Button>
                </div>
            )
        }
        else if (this.state.myRole === 'Admin' && this.state.role === 'User')
        {
            return(
                <div className="profileButtonPanel">
                    <Button><Link to={`/blocking?id=${this.state.id}`}>Blocking</Link></Button>
                </div>
            )
        }
        else if (this.state.myRole === 'Account manager')
        {
            return(
                <div className="profileButtonPanel">
                    <Button><Link to={`/blocking?id=${this.state.id}`}>Blocking</Link></Button>{' '}
                    <Button><Link to={`/changeRole?id=${this.state.id}`}>Change role</Link></Button>
                </div>
            )
        }
        else{
            return null;
        }
    }

    renderProfile()
    {
        let badge;
        switch(this.state.role)
        {
            case 'Account manager':
                badge = <span className="badge green">Account manager</span>
                break;
            case 'Admin': 
                badge = <span className="badge red">Admin</span>
                break;
            default:
                badge = null;
        }

        const status = (this.state.myRole === 'Admin' || this.state.myRole === 'Account manager') && this.state.status
            ? <p className="status">{this.state.status}</p> : null

        const buttonPanel = this.renderButtonPanel();

        return(
            <div className={`form profile ${this.state.width <= 700 ? 'collapsed' : ''}`}>
                <img className="profilePhoto" src={this.state.photo} alt="user photo"/>
                <div className="profileData">
                    <h3 className="profileHeader">{this.state.userName}{badge}</h3>
                    {status}
                    <table className="profileTable" cellPadding='8px'>
                        <tbody>
                            <tr><td><b>Registration date:</b></td><td>{this.state.registrationDate}</td></tr>
                            <tr><td><b>Email:</b></td><td>{this.state.email}</td></tr>
                            <tr><td><b>Writed posts:</b></td><td><Link to={`/feed?author=${this.state.id}`}>{this.state.writedPosts + (this.state.writedPosts > 1 ? " posts" : " post")}</Link></td></tr>
                        </tbody>
                    </table>
                    {buttonPanel}
                </div>
            </div>
        )
    }

    render()
    {
        const errorBaner = this.state.errorMessage ? 
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;

        const content = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderProfile();

        return(
            <>
                {errorBaner}
                {content}
            </>
        )
    }

    async loadData(userId) {
        fetch('api/User/' + userId)
        .then((response) => {
            this.setState({error: !response.ok});
            return response.json();
        }).then((data) => {
            if (this.state.error){
                this.setState({ 
                    errorMessage: data.message 
                });
            }
            else {
                this.setState({ 
                    id: data.id,
                    userName: data.userName,
                    role: data.role,
                    status: data.status,
                    email: data.email || 'Not specified',
                    registrationDate: data.registrationDate,
                    writedPosts: data.writedPosts,
                    photo: data.photo,
                    loading: false
                });
            }
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }
}