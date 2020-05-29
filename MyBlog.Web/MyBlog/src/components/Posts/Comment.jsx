import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthorDate from './AuthorDate';
import Modal from '../Common/Modal';

import './Comment.css';

export default class Comment extends Component {

    constructor (props) {
        super(props);

        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);

        this.state = {
            deleteModal: false,
        };
    }

    toggleDeleteModal(){
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

    render(){
        const deleteButton = this.props.canDelete ? <p className="deleteButton" onClick={this.toggleDeleteModal}>Delete</p> : null
        return(
            <div className="form comment">
                <div className="commentHeader">
                    <AuthorDate authorId={this.props.authorId} authorPhoto={this.props.authorPhoto} 
                        authorName={this.props.authorName} publicationDate={this.props.publicationDate}/>
                    {deleteButton}
                </div>
                <hr/>
                <p className="commentBody">{this.props.value}</p>
                <Modal isOpen={this.state.deleteModal} title="Confirm action" onCancel={this.toggleDeleteModal}>Are you sure you want to delete comment?</Modal>
            </div>
        )
    }
}

Comment.propTypes = {
    canDelete: PropTypes.bool,
    value: PropTypes.string,
    authorId: PropTypes.number,
    authorPhoto: PropTypes.string,
    authorName: PropTypes.string,
    publicationDate: PropTypes.string,
};
  
Comment.defaultProps = {
    canDelete: false,
    value: '',
    authorId: null,
    authorPhoto: '',
    authorName: '',
    publicationDate: '',
};