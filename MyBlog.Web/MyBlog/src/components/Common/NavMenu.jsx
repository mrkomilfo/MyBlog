import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthHelper from '../../Utils/authHelper.js';

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
        return (
            <header>

            </header>
        );
    }
}