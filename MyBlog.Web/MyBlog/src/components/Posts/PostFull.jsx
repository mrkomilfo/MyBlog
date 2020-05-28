import React, { Component } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import AuthHelper from '../../Utils/authHelper.js';

import Alert from '../Common/Alert';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import AuthorDate from './AuthorDate';
import Comment from './Comment';

import './PostFull.css';
import '../Common/Form.css';

export default class PostFull extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errorMessage: '',
            id: null,
            name: '',
            category: {},
            description: '',
            authorId: '',
            authorName: '',
            participants: [],
            tags: [],
            comments: [],
            publicationTime: '',
            image: '',
            deleteModal: false,
            userRole: AuthHelper.getRole(),
            userId: AuthHelper.getId()
        }
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    }

    componentDidMount() {
        const parsed = queryString.parse(window.location.search);
        if (parsed) {
            this.loadData(parsed['id']);
        }
    }

    toggleDeleteModal(){
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

    renderPost() {
        const image = this.state.image ? 
            <img className="postFullImage" src={this.state.image} alt={`Post ${this.state.id} image`}/> : 
            null;

        const editDelete = this.state.userId == this.state.authorId || this.state.userRole === 'Admin' ?
            <div className="postFullEditDelete">
                <span className="postFullEdit">Edit</span>
                |
                <span className="postFullDelete" onClick={this.toggleDeleteModal}>Delete</span>
            </div> :
            null

        const tags = Object.keys(this.state.tags).map((key) => {
            return (
                <Link className="postFullTag" to={"/feed?t ags=" + this.state.tags[key]} key={key}>#{this.state.tags[key]} </Link>
            );
        });

        const commentForm = this.state.userRole !== 'Guest' ? 
        <div className="form commentForm">
            <h2 className="commentFormHeader">Left your comment</h2>
            <hr className="commentFormHr"/>
            <div className="commentFormBody">
                <textarea className="commentFormInput" type="text" placeholder="Your comment..."/>
                <Button className="commentFormButton">Send</Button>
            </div>
        </div> : null

        const comments = this.state.comments.map((currentValue)=>{
            const canDelete = currentValue.authorId == this.state.userId 
                || this.state.userId == this.state.authorId 
                || this.state.userRole === 'Admin' ;
            return (
                <Comment key={currentValue.id} authorId={currentValue.authorId} authorPhoto={currentValue.authorPhoto} 
                    authorName={currentValue.authorName} publicationDate={currentValue.publicationDate} value={currentValue.value} canDelete={canDelete}/>
            );
        })
                
        return(
            <div className="postFullPage">
                <div className="form postFull">
                    <div className="postFullHeader">
                        <Link className="postFullName" to={`/post?id=${this.state.id}`}>{this.state.name}</Link>
                        {editDelete}
                    </div>
                    <Link className="postFullCategory" to={`/feed?categoryId=${this.state.category.id}`}>{this.state.category.name}</Link>
                    <hr className="postFullHr"/>
                    {image}
                    <p className="postFullDescription">{this.state.description}</p>
                    <div className="postFullTags">{tags}</div>
                    <hr className="postFullHr"/>
                    <div className="postFullFooter">
                        <div className="postFullFooterLeft">
                            <img className="commentIcon" src="/icons/comment.png"/>
                            <span className="postFullCommentsQuantity">{this.state.comments.length}</span>
                        </div>
                        <AuthorDate authorId={this.state.authorId} authorPhoto={this.state.authorPhoto} 
                            authorName={this.state.authorName} publicationDate={this.state.publicationDate}/>
                    </div>
                    <Modal isOpen={this.state.deleteModal} title="Confirm action" onCancel={this.toggleDeleteModal}>Are you sure you want to delete post?</Modal>
                </div>
                {commentForm}
                <div className="comments">
                    {comments}
                </div>
            </div>
        )
    }

    render()
    {
        const errorBaner = this.state.errorMessage ? 
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;

        const content = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderPost();

        return(
            <>
                {errorBaner}
                {content}
            </>
        )
    }

    async loadData(postId) {
        fetch('api/Post/' + postId)
        .then((response) => {
            this.setState({error: !response.ok});
            return response.json();
        }).then((data) => {
            if (this.state.error){
                this.setState({ 
                    errorMessage: data.message 
                });
            }
            else {
                this.setState({ 
                    id: data.id,
                    name: data.name,
                    category: data.category,
                    description: data.description,
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorPhoto: data.authorPhoto,
                    comments: data.comments,
                    tags: data.tags,
                    publicationDate: data.publicationDate,
                    image: data.image,
                    loading: false
                });
            }
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }
}