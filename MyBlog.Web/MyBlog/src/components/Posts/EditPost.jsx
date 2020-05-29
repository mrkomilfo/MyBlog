import React, { Component } from 'react';
import queryString from 'query-string';

import Alert from '../Common/Alert';
import Button from '../Common/Button';

import AuthHelper from '../../Utils/authHelper'

export default class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '', 
            category: 0, 
            shortDescription: '',
            description: '',
            tags: '',
            imagePath: '', 
            imageFile: null,
            fileName: '',
            hasImage: false,
            formErrors: { 
                name: '', 
                category: '', 
                shortDescription: '',
                description: '', 
                tags: '',
                imageFile: ''
            },
            formValid: true,
            nameValid: true, 
            categoryValid: true, 
            shortDescriptionValid: true,
            descriptionValid: true, 
            tagsValid: true,
            imageFileValid: true,

            error: false,
            errorMessage: '',
            categories: [],
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.editPost = this.editPost.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        const parsed = queryString.parse(window.location.search);
        if (parsed) {
            this.loadPost(parsed['id']);
        }
        this.loadCategories();
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        if (name === 'imageFile')
        {
            this.setState({
                fileName: value,
                imageFile: target.files[0],
                hasImage: true
            }, 
                () => { this.validateField(name, target.files[0]) 
            }); 
        }

        else{
            this.setState({
                [name]: value
            }, 
                () => { this.validateField(name, value) 
            });
        }        
    }

    validateField(fieldName, value){
        let fieldValidationErrors = this.state.formErrors;

        let nameValid = this.state.nameValid;
        let categoryValid = this.state.categoryValid;
        let descriptionValid = this.state.descriptionValid;
        let shortDescriptionValid = this.state.descriptionValid; 
        let tagsValid = this.state.tagsValid;
        let imageFileValid = this.state.imageFileValid;

        switch(fieldName){
            case 'name':
                nameValid = !!value;
                fieldValidationErrors.name = nameValid ? '' : 'Post must have name';
                break;
            case 'category':
                debugger;
                categoryValid = !!value && value !== "0";
                fieldValidationErrors.category = categoryValid ? '' : 'Category is not specified';
                break;
            case 'shortDescription':
                shortDescriptionValid = !!value;
                fieldValidationErrors.shortDescription = shortDescriptionValid ? '' : 'Post must have short description';
                break;
            case 'description':
                descriptionValid = !!value;
                fieldValidationErrors.description = descriptionValid ? '' : 'Post must have description';
                break;
            case 'tags':
                tagsValid = value.match(/^[\d\s\w,а-я]*$/ui)
                fieldValidationErrors.tags = tagsValid ? '' : 'Only letters, numbers, spaces, underscores, and commas to separate tags are allowed';
                break;
            case 'imageFile':
                imageFileValid = value.size <= 8388608 //8 Mb
                fieldValidationErrors.imageFile = imageFileValid ? '' : 'Image max size - 8 Mb';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            nameValid: nameValid,
            categoryValid: categoryValid,
            shortDescriptionValid: shortDescriptionValid,
            descriptionValid: descriptionValid,
            tagsValid: tagsValid,
            imageFileValid: imageFileValid,
          }, this.validateForm);
    }

    validateForm() {
        debugger;
        this.setState({
            formValid: 
                this.state.nameValid &&
                this.state.categoryValid &&
                this.state.shortDescriptionValid &&
                this.state.descriptionValid &&
                this.state.tagsValid &&
                this.state.imageFileValid
        });
    }

    removeImage()
    {
        this.setState({
            imageFile: null,
            hasImage: false,
            fileName: '',
            imagePath: '',
            imageFileValid: true,
        }, this.validateForm)
    }

    cancel()
    {
        this.props.history.push(`/post?id=${this.state.id}`);
    }

    renderPost(){
        const categoriesSelect = this.state.categories.map(c => <option key={c.id.toString()} value={c.id}>{c.name}</option>)
        
        let imageBlock;
        if (this.state.imageFile)
        {
            imageBlock = <img className="newPostImage" src={URL.createObjectURL(this.state.imageFile)} alt="post image" onClick={(e) => this.removeImage()}/>
        }
        else if (this.state.imagePath)
        {
            imageBlock = <img className="newPostImage" src={this.state.imagePath} alt="post image" onClick={(e) => this.removeImage()}/>
        }
        else imageBlock = null

        return(
            <div className="form newPost">
                <h2>Edit post</h2>
                <div className="formContent">
                    <div className="formGroup">
                        <label>Post name</label>
                        <input required type="text" name="name" value={this.state.name} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.name}</div>
                    </div>
                    <div className="formGroup"> 
                        <label>Category</label>
                        <select name="category" value={this.state.category} onChange={this.handleInputChange}>
                            {categoriesSelect}
                        </select>
                        <div className="formFeedback">{this.state.formErrors.category}</div>
                    </div>
                    <div className="formGroup">
                        <label>Short description</label>
                        <textarea required name="shortDescription" value={this.state.shortDescription} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.shortDescription}</div>
                    </div>
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea required name="description" value={this.state.description} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.description}</div>
                    </div>
                    <div className="formGroup">
                        <label>Tags</label>
                        <input type="text" name="tags" value={this.state.tags} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.tags}</div>
                    </div>
                    <div className="formGroup">
                        <label>Image</label>
                        <input type="file" name="imageFile" accept=".jpg,.png,.jpeg" value={this.state.fileName} onChange={this.handleInputChange}/>
                        <div className="formFeedback">{this.state.formErrors.imageFile}</div>
                        {imageBlock}
                    </div>
                    <div className="newPostButtonPanel">
                        <Button disabled = {!this.state.formValid} onClick={() => this.editPost()}>Save</Button>{' '}
                        <Button className="secondary" onClick={() => this.cancel()}>Cancel</Button>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        const errorBaner = this.state.errorMessage ?
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;

        const content = this.state.loading
            ? <p className="loading">Loading</p>
            : this.renderPost();

        return(
        <>
            {errorBaner}
            {content}
        </>
        )
    }

    loadCategories() {
        fetch('api/Category')
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
                    data.unshift({
                        id: 0, 
                        name: 'Not specified'
                    })
                    this.setState({ 
                        categories: data 
                    });
                }
            }).catch((ex) => {
                this.setState({
                    errorMessage: ex.toString()
                });
            });
    }

    async loadPost(postId) {
        const token = AuthHelper.getToken();
        fetch('api/Post/' + postId + '/update', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then((response) => {
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
                    category: data.categoryId,
                    shortDescription: data.shortDescription,
                    description: data.description,
                    tags: data.tags,
                    imagePath: data.image,
                    hasImage: !!data.image,
                    loading: false
                });
            }
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }

    editPost()
    {
        if (!this.state.formValid)
        {
            this.setState({
                errorMessage: 'Form is not valid'
            })
            return;
        }
        let formdata = new FormData();
        formdata.append('name', this.state.name);
        formdata.append('categoryId', this.state.category);
        formdata.append('shortDescription', this.state.shortDescription);
        formdata.append('description', this.state.description);
        formdata.append('hasImage', this.state.hasImage);
        if (this.state.tags) {
            formdata.append('tags', this.state.tags);
        }
        if (this.state.imageFile)
        {
            formdata.append('image', this.state.imageFile);
        }
        const token = AuthHelper.getToken();
        fetch('api/Post', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formdata
        }).then((response) => {
            if (response.ok){
                this.props.history.push(`/post?id=${this.state.id}`);
            }
            else {
                return response.json();
            }
        }).then((data) => {
            this.setState({
                errorMessage: data.message
            });
        }).catch((ex) => {
            this.setState({
                errorMessage: ex.toString()
            });
        });
    }
}