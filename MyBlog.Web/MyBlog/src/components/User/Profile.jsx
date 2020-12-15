import React, { Component } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import AuthHelper from '../../Utils/authHelper.js';

import Modal from '../Common/Modal';
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
            myRole: AuthHelper.getRole(),
            myId: AuthHelper.getId(),

            changeRoleModal: false,
            newRole: '',
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.toggleChangeRoleModal = this.toggleChangeRoleModal.bind(this);
        this.changeRole = this.changeRole.bind(this);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth });
    }

    isInt(value) {
        return !isNaN(value) && 
               parseInt(Number(value)) == value && 
               !isNaN(parseInt(value, 10));
      }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    
        const parsed = queryString.parse(window.location.search);
        if (parsed && this.isInt(parsed['id'])) {
            this.loadData(parsed['id']);
        }
        else {
            this.props.history.push('/404')
        }
    }

    toggleChangeRoleModal(){
        this.setState({changeRoleModal: !this.state.changeRoleModal});
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;

        this.setState({
          [name]: value
        });
    }

    renderChangeRoleModal() {
        return(
            <Modal isOpen={this.state.changeRoleModal} title="Change role" path={`/user?id=${this.state.id}`} 
                onSubmit={()=>this.changeRole()} onCancel={this.toggleChangeRoleModal}>
                <div>
                    <label>New role</label>
                    <select className="width" name="newRole" defaultValue={this.state.role} onChange={e => this.handleInputChange(e)}>
                        <option key="User">User</option>
                        <option key="Admin">Admin</option>
                        <option key="Account manager">Account manager</option>
                    </select>
                </div>
            </Modal>
        )
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
                    <Button onClick={this.toggleChangeRoleModal}>Change role</Button>
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
        const changeRoleModal = this.renderChangeRoleModal();

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
                            <tr><td><b>Writed posts:</b></td><td><Link className="writedPosts" to={`/feed?author=${this.state.id}`}>{this.state.writedPosts + (this.state.writedPosts > 1 ? " posts" : " post")}</Link></td></tr>
                        </tbody>
                    </table>
                    {buttonPanel}
                </div>
                {changeRoleModal}
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
            ? <p className="loading">Loading</p>
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

    async changeRole() {
        const data = {
            roleName: this.state.newRole
        }
        const token = AuthHelper.getToken();
        fetch(`api/User/${this.state.id}/role`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (!response.ok)
            {
                this.setState({error: !response.ok});
                return response.json();
            }
            else {
                this.setState({
                    role: this.state.newRole 
                }, this.toggleChangeRoleModal)
            }
        }).then((data) => {
            if (this.state.error){
                this.setState({ 
                    errorMessage: data.message 
                });
            }
            
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        })
    }
}