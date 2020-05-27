import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './PostMini.css';
import '../Common/Form.css';

export default class PostMini extends Component {
    render() {
        const image = this.props.post.image ? 
            <img className="postMiniImage" src={this.props.post.image} alt={`Post ${this.props.post.id} image`}/> : 
            null;

        const tags = Object.keys(this.props.post.tags).map((key, index) => {
            return (
                <Link className="tag" to={"/feed?tags=" + this.props.post.tags[key]} key={key}>#{this.props.post.tags[key]} </Link>
            );
        });
                
        return(
        <div className="form postMini">
            <Link className="postMiniHeader" to={`/post?id=${this.props.post.id}`}>{this.props.post.name}</Link>
            <br/>
            <Link className="postMiniCategory" to={`/feed?categoryId=${this.props.post.category.id}`}>{this.props.post.category.name}</Link>
            <hr className="postMiniHr"/>
            {image}
            <p className="postMinishortDescription">{this.props.post.shortDescription}</p>
            <div className="postMiniTags">{tags}</div>
            <hr className="postMiniHr"/>
            <div className="postMiniFooter">
                <Link className="postMiniFooterLeft" to={`/post?id=${this.props.post.id}`}>
                    <img className="commentIcon" src="/icons/comment.png"/>
                    <span className="commentsQuantity">{this.props.post.comments}</span>
                </Link>
                <Link className="postMiniFooterRight" to={`/user?id=${this.props.post.authorId}`}>
                    <img className="authorIcon" src={this.props.post.authorPhoto}/>
                    <div className="authorDateWrapper">
                        <p className="postMiniAuthorName">{this.props.post.authorName}</p>
                        <p className="postMiniDate">{this.props.post.publicationDate}</p>
                    </div>
                </Link>
            </div>
        </div>)
    }
}