import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import AuthHelper from '../../Utils/authHelper.js';
import './Users.css';

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,

            error: false,

            query: window.location.search, 
            users: [], 
            currentPage: 0, 
            pageSize: 20, 
            totalRecords: 0,  
            userName: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
    }

    componentDidMount() {
        this.loadUsers();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.query !== window.location.search) {
            this.setState({ query: window.location.search });
            this.loadUsers();
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;
        
        this.setState({
          [name]: value
        });
    }

    getQuerryTrailer() {
        let isFirst = true
        let queryTrailer = '';
        if (this.state.userName)
        {
            queryTrailer += isFirst ? '?' : '&';
            queryTrailer += `search=${this.state.userName}`;
            isFirst = false;
        }
        return queryTrailer;
    }

    renderUsersList(users) {
        return(
            <div className="form">
                <p>{`Found ${this.state.totalRecords} users`}</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User name</th>
                            <th>Role</th>
                            <th>Block status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((u, index) => 
                        <tr key={u.id}>
                            <th scope="row">{this.state.currentPage*this.state.pageSize+index+1}</th>
                            <td><Link className="textShadow" to={`user?id=${u.id}`}>{u.userName}</Link></td>
                            <td>{u.roleName}</td>
                            <td>{u.status || 'Unblocked'}</td>
                        </tr>)}
                    </tbody>
                </table>  
            </div> 
        )
    }

    render() {
        const filter = 
            <div class="input-group mb-3">
                <input type="text" class="form-control" name="userName" 
                    placeholder="Search" aria-label="Search" aria-describedby="basic-addon2" 
                    value={this.state.userName} onChange={(e)=>this.handleInputChange(e)}/>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onClick={this.loadUsers}>Search</button>
                </div>
            </div>

        const content = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUsersList(this.state.users);

        const headerStyle = {
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between'
        }

        return(
            <div className="usersPage">
                <h2>Users</h2>
                {filter}
                {content}
            </div>
        );
    }

    async loadUsers() {
        let queryObj = {};
        if (this.state.userName)
        {
            queryObj = {...queryObj, search: this.state.userName}
        }
        const query = new URLSearchParams(queryObj).toString();
        const token = AuthHelper.getToken();
        debugger;
        fetch(`api/User?${query}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then((response) => {
            this.setState({error: !response.ok});
            return response.json();
        }).then((data) => {
            if (this.state.error){
                console.log(data);
            }
            else {
                this.setState({ 
                    users: data.records, 
                    currentPage: data.currentPage, 
                    pageSize: data.pageSize, 
                    totalRecords: data.totalRecords
                });
            }
        }).catch((ex) => {
            console.log(ex.toString());
        }).finally(() => {
            this.setState({
                loading: false
            });
        });
            
    }
}