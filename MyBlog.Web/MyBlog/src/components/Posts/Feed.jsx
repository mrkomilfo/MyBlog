import React, { Component } from 'react';
import queryString from 'query-string';

import Alert from '../Common/Alert';
import PostMini from './PostMini';
import Filter from './Filter';
import Portal from '../Common/Portal';

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
            errorMessage: '',
            width: '',
            filterExpanded: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        this.loadFeed();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.query !== window.location.search) {
            this.setState({ query: window.location.search, filterExpanded: false });
            this.loadFeed();
        }
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
      }
    
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.toggleFilter();
        }
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth });
    }

    toggleFilter(){
        this.setState({
            filterExpanded: !this.state.filterExpanded
        });
    }

    renderFeed(posts){
        return(
            posts.length < 1 ?
            <div className="feedMain">
                <p className="nothingFound">Nothing found</p>
            </div> :
            <div className="feedMain">
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
    
        if(this.state.width > 694)
        {
            const sideBar = 
                <div className="sideBar">
                    <Filter />
                </div>

            return(
                <>
                {errorBaner}
                <div className="feed">
                    {content}
                    {sideBar}
                </div>
                </>
            )
        }
        else{
            const filter = <Portal><img className="filterIcon" src="/icons/filter.png" onClick={this.toggleFilter}/></Portal>

            const sideBar = this.state.filterExpanded ?
                <Portal>
                    <div className="modalOverlay">
                        <div className="collapsedFilter">
                            <div className="whiteBackground" ref={this.setWrapperRef}>
                                <Filter />
                            </div>
                        </div>
                    </div>
                </Portal> : 
                null

            return(
                <>
                    {errorBaner}
                    {filter}
                    <div className="feed">
                        {content}
                        {sideBar}
                    </div>
                </>
            );
        }
        
    }

    async loadFeed() {
        let page; let name; let categoryId; let tags; let from; let to; let author;
        const parsed = queryString.parse(window.location.search);
        if (parsed) {
            page = parsed['page'] || 0;
            name = parsed['name'];
            categoryId = parsed['categoryId'];
            tags = parsed['tags'];
            from = parsed['from'];
            to = parsed['to'];
            author = parsed['author'];
        }

        let queryTrailer = '?page=' + page;
        if (name) {
            queryTrailer += `&name=${name}`
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