import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import './FeedPaginator.css';

export default class FeedPaginator extends Component {
    render() {
        let pagePath = '/feed?page='

        let params = queryString.parse(window.location.search);
        let queryTrailer = '';
        if (params.pageSize){
            queryTrailer += `&pageSize=${params.pageSize}`
        }
        if (params.name){
            queryTrailer += `&name=${params.name}`
        }
        if (params.categoryId){
            queryTrailer += `&categoryId=${params.categoryId}`
        }
        if (params.tags){
            queryTrailer += `&tags=${params.tags}`
        }
        if (params.from){
            queryTrailer += `&from=${params.from}`
        }
        if (params.to){
            queryTrailer += `&to=${params.to}`
        }
        if (params.author){
            queryTrailer += `&author=${params.author}`
        }

        let leftArrows = this.props.currentPage === 0 ? 
        <>
            <div className="paginationElement disabled">
                <span>«</span>
            </div>
            <div className="paginationElement disabled">
                <span>‹</span>
            </div>
        </> :
        <>           
            <Link className="paginationElement available" to={`${pagePath}${0}${queryTrailer}`}>«</Link>
            <Link className="paginationElement available" to={`${pagePath}${this.props.currentPage - 1}${queryTrailer}`}>‹</Link>
        </>;
        let prevprev = this.props.currentPage - 2 >= 0 ?   
            <Link className="paginationElement available" to={`${pagePath}${this.props.currentPage - 2}${queryTrailer}`}>
            {this.props.currentPage-1}
            </Link>
          : null;
        let prev = this.props.currentPage - 1 >= 0 ?  
            <Link className="paginationElement available" to={`${pagePath}${this.props.currentPage - 1}${queryTrailer}`}>
            {this.props.currentPage}
            </Link>
          : null;
        let current = 
            <Link className="paginationElement active" to={`${pagePath}${this.props.currentPage}${queryTrailer}`}>
            {this.props.currentPage + 1}
            </Link>
         let next = this.props.currentPage + 2 <= this.props.totalPages ?
         
             <Link className="paginationElement available" to={`${pagePath}${this.props.currentPage + 1}${queryTrailer}`}>
             {this.props.currentPage + 2}
             </Link>
          : null;
        let nextnext = this.props.currentPage + 3 <= this.props.totalPages ?
        
            <Link className="paginationElement available" to={`${pagePath}${this.props.currentPage + 2}${queryTrailer}`}>
            {this.props.currentPage + 3}
            </Link>
         : null;
        let rightArrows = this.props.currentPage >= this.props.totalPages-1 ? 
        <>
            <div className="paginationElement disabled">
                <span>›</span>
            </div>
            <div className="paginationElement disabled">
                <span>»</span>
            </div>
        </> :
        <>
            <Link className="paginationElement available" to={`${pagePath}${this.props.currentPage + 1}${queryTrailer}`}>›</Link>
            <Link className="paginationElement available" to={`${pagePath}${this.props.totalPages - 1}${queryTrailer}`}>»</Link>
        </>
        return (
            <div className="feedPaginator">
                {leftArrows}
                {prevprev}
                {prev}
                {current}
                {next}
                {nextnext}
                {rightArrows}
            </div>
            )
    }
}

FeedPaginator.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
};