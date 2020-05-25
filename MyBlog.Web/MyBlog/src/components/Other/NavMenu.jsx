import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Common/Modal';
import AuthHelper from '../../Utils/authHelper.js';

import './NavMenu.css'

export default class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor (props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.toggleLogoutModal = this.toggleLogoutModal.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            collapsed: true,
            logoutModal: false,
            role: AuthHelper.getRole(),
            id: AuthHelper.getId()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ 
            role: AuthHelper.getRole(),
            id: AuthHelper.getId()
        });
    }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    toggleLogoutModal(){
        this.setState({
            logoutModal: !this.state.logoutModal
        });
    }

    logout(){
        AuthHelper.clearAuth();
        this.setState({
            role: 'Guest',
            logoutModal: false
        });
    }

    render () {
        const brand = 
            <div className="navBarItemWrapper">
                <Link className="navBarItem logo" to="/posts">MYBLOG</Link>
            </div>

        const newPost = this.state.role !== 'Guest' ?
            <div className="navBarItemWrapper">
                <Link className="navBarItem" to="/newPost">New post</Link>
            </div> : null

        const users = (this.state.role === 'Admin' || this.state.role === 'Account manager') ?
            <div className="navBarItemWrapper">
                <Link className="navBarItem" to="/users">Users</Link>
            </div> : null

        const categories = this.state.role === 'Admin' ?
            <div className="navBarItemWrapper">
                <Link className="navBarItem" to="/categories">Categories</Link>
            </div> : null

        const identity = this.state.role === 'Guest' ?
            <>
                <div className="navBarItemWrapper">
                    <Link className="navBarItem" to="/signUp">Sign up</Link>
                </div>
                <div className="navBarItemWrapper">
                    <Link className="navBarItem" to="/signIn">Sign in</Link>
                </div>
            </> :
            <>
                <div className="navBarItemWrapper">
                    <Link className="navBarItem" to={`/user?id=${this.state.id}`}>My profile</Link>
                </div>
                <div className="navBarItemWrapper">  
                    <Link className="navBarItem" to="" onClick={this.toggleLogoutModal}>Log out</Link>
                </div>
            </>
        
        return (
            <>
            <header className="navBar">
                <div className="leftMenu">
                    {brand}
                    {newPost}
                    {users}
                    {categories}
                </div>
                <div className="rightMenu">
                    {identity}
                </div>
            </header>
            <Modal isOpen={this.state.logoutModal} title="Confirm action" onCancel={this.toggleLogoutModal} onSubmit={this.logout}>Are you sure you want to log out?</Modal>
            </>
        );
    }
}