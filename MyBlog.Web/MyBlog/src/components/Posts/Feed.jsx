import React, { Component } from 'react';
import queryString from 'query-string';

import Alert from '../Common/Alert';
import PostMini from './PostMini';

import './Feed.css'

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,
            query: window.location.search, 
            posts: [], 
            currentPage: 0, 
            pageSize: 8, 
            totalRecords: 0,  
            error: false, 
            errorMessage: '' 
        };
    }

    componentDidMount() {
        this.loadFeed();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.query !== window.location.search) {
            this.setState({ query: window.location.search });
            this.loadFeed();
        }
    }

    renderFeed(posts){
        return(
            <div>
                <ul className="feedList">
                    {posts.map(p => <li className="feedListItem" key={p.id}><PostMini post={p}/></li>)}
                </ul>
                {/*<FeedPaginator currentPage={this.state.currentPage} totalPages={Math.ceil(this.state.totalRecords / this.state.pageSize)}/>*/}
            </div>             
        )
    }

    render() {
        const errorBaner = this.state.errorMessage ? 
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;

        const content = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderFeed(this.state.posts);
    
        return (
            <>
            {errorBaner}
            <div>
                <div>
                    {content}
                </div>
                {/*<div style={filterStyle}>
                    <EventsSideBar />
                </div>*/}
            </div>
            </>
        );
    }

    async loadFeed() {
        let page; let search; let categoryId; let tags; let from; let to; let author;
        const parsed = queryString.parse(window.location.search);
        if (parsed) {
            page = parsed['page'] || 0;
            search = parsed['search'];
            categoryId = parsed['categoryId'];
            tags = parsed['tags'];
            from = parsed['from'];
            to = parsed['to'];
            author = parsed['author'];
        }

        let queryTrailer = '?page=' + page;
        if (search) {
            queryTrailer += `&search=${search}`
        }
        if (categoryId) {
            queryTrailer += `&categoryId=${categoryId}`
        }
        if (tags) {
            queryTrailer += `&tags=${tags}`
        }
        if (from) {
            queryTrailer += `&from=${from}`
        }
        if (to) {
            queryTrailer += `&to=${to}`
        }
        if (author) {
            queryTrailer += `&author=${author}`
        }

        fetch(`api/Post${queryTrailer}`)
            .then((response) => {
                this.setState({error: !response.ok});
                return response.json();
            }).then((data) => {
                if (this.state.error){
                    this.setState({errorMessage: data.message});
                }
                else {
                    this.setState({ 
                        posts: data.records, 
                        currentPage: data.currentPage, 
                        pageSize: data.pageSize, 
                        totalRecords: data.totalRecords, 
                        loading: false 
                    });
                }
            }).catch((ex) => {
                this.setState({errorMessage: ex.toString()});
            });
    }
}