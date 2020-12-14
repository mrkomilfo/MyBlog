import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthHelper from '../../Utils/authHelper.js';

import Button from '../Common/Button';

import './CommentForm.css';

export default class CommentForm extends Component {

    constructor (props) {
        super(props);

        this.state = {
            comment: '',
            userId: AuthHelper.getId()
        };

        this.comment = this.comment.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            comment: event.target.value
        })
    }

    render(){
        return(
            <div className="form commentForm">
                <h2 className="commentFormHeader">Left your comment</h2>
                <hr className="commentFormHr"/>
                <div className="commentFormBody">
                    <textarea className="commentFormInput" type="text" placeholder="Your comment..." value={this.state.comment} onChange={this.handleInputChange}/>
                    <Button disabled={!this.state.comment} className="commentFormButton" onClick={this.comment}>Send</Button>
                </div>
            </div>
        )
    }

    comment() {
        const data = {
            value: this.state.comment,
            authorId: parseInt(this.state.userId),
            postId: this.props.postId
        };
        const token = AuthHelper.getToken();
        fetch('api/Comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok) {
                this.setState({comment: ''}, 
                    ()=>this.props.onComment()
                )
            } 
        })
    }
}

CommentForm.propTypes = {
    postId: PropTypes.number.isRequired
};