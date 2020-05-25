import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Common/Modal';
import AuthHelper from '../../Utils/authHelper.js';
import Portal from '../Common/Portal';

import './NavMenu.css'


export default class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor (props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.toggleLogoutModal = this.toggleLogoutModal.bind(this);
        this.logout = this.logout.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.state = {
            collapsed: false,
            logoutModal: false,
            role: AuthHelper.getRole(),
            id: AuthHelper.getId(),
            width: 0,
            height: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ 
            role: AuthHelper.getRole(),
            id: AuthHelper.getId(),
            collapsed: false,
        });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
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
                <Link className="navBarItem logo" to="/feed">MYBLOG</Link>
            </div>

        const feed = 
            <div className="navBarItemWrapper">
                <Link className="navBarItem" to="/feed">Feed</Link>
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

        const headerContent =
            this.state.width > 694 ?
            <>
                <div className="leftMenu">
                    {brand}
                    {feed}
                    {newPost}
                    {users}
                    {categories}
                </div>
                <div className="rightMenu">
                    {identity}
                </div>
            </> :
            <div className="leftMenu">
                <img className="menuIcon" src="/icons/menu.png" onClick={this.toggleNavbar}/>
                {brand}
            </div>

        const listMenu = this.state.collapsed && this.state.width <= 694 ?
            <Portal>
                <div className="listMenuOverlay">
                    <div className="listMenu">
                        {feed}
                        {newPost}
                        {users}
                        {categories}
                        {identity}
                    </div>
                </div>
            </Portal> :
            null      
        
        return (
            <>
            <header className="navBar">
                {headerContent}
            </header>
            {listMenu}
            <Modal isOpen={this.state.logoutModal} title="Confirm action" onCancel={this.toggleLogoutModal} onSubmit={this.logout}>Are you sure you want to log out?</Modal>
            </>
        );
    }
}