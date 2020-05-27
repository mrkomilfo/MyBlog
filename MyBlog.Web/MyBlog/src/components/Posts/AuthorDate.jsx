import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './AuthorDate.css';

export default class AuthorDate extends Component {
    render(){
        return(
            <Link className="authorDate" to={`/user?id=${this.props.authorId}`}>
                <img className="authorIcon" src={this.props.authorPhoto}/>
                <div className="authorDateWrapper">
                    <p className="postAuthorName">{this.props.authorName}</p>
                    <p className="postDate">{this.props.publicationDate}</p>
                </div>
            </Link>
        )
    }
}

AuthorDate.propTypes = {
    authorId: PropTypes.number,
    authorPhoto: PropTypes.string,
    authorName: PropTypes.string,
    publicationDate: PropTypes.string,
};
  
AuthorDate.defaultProps = {
    authorId: null,
    authorPhoto: '',
    authorName: '',
    publicationDate: '',
};