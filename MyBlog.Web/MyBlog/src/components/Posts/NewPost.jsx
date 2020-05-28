import React, { Component } from 'react';

import Alert from '../Common/Alert';
import Button from '../Common/Button';

import AuthHelper from '../../Utils/authHelper'

import './NewPost.css'

export default class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '', 
            category: 0, 
            shortDescription: '',
            description: '',
            tags: '',
            imageFile: null,
            fileName: '',
            formErrors: { 
                name: '', 
                category: '', 
                shortDescription: '',
                description: '', 
                tags: '',
                imageFile: ''
            },
            formValid: false,
            nameValid: false, 
            categoryValid: false, 
            shortDescriptionValid: false,
            descriptionValid: false, 
            tagsValid: true,
            imageFileValid: true,

            error: false,
            errorMessage: '',
            categories: [],
        };
        this.handleinputChange = this.handleinputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.createPost = this.createPost.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    handleinputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        if (name === 'imageFile')
        {
            this.setState({
                fileName: value,
                imageFile: target.files[0],
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
                descriptionValid = !!value;
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
            fileName: '',
            imageFileValid: true,
        }, this.validateForm)
    }

    cancel()
    {
        this.props.history.push(`/feed`);
    }

    componentDidMount() {
        this.loadCategories();
    }

    render(){

        const errorBaner = this.state.errorMessage ?
        <Alert>
            {this.state.errorMessage}
        </Alert> : null;

        const categoriesSelect = this.state.categories.map(c => <option key={c.id.toString()} value={c.id}>{c.name}</option>)
        const imageBlock = this.state.imageFile ? <img className="newPostImage" src={URL.createObjectURL(this.state.imageFile)} alt="post image" onClick={(e) => this.removeImage()}/> : null;

        return(
            <>
            {errorBaner}
            <div className="form newPost">
                <h2>New post</h2>
                <div className="formContent">
                    <div className="formGroup">
                        <label>Post name</label>
                        <input required type="text" name="name" value={this.state.name} onChange={this.handleinputChange}/>
                        <div className="formFeedback">{this.state.formErrors.name}</div>
                    </div>
                    <div className="formGroup"> 
                        <label>Category</label>
                        <select name="category" value={this.state.category} onChange={this.handleinputChange}>
                            {categoriesSelect}
                        </select>
                        <div className="formFeedback">{this.state.formErrors.category}</div>
                    </div>
                    <div className="formGroup">
                        <label>Short description</label>
                        <textarea required name="shortDescription" value={this.state.shortDescription} onChange={this.handleinputChange}/>
                        <div className="formFeedback">{this.state.formErrors.shortDescription}</div>
                    </div>
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea required name="description" value={this.state.description} onChange={this.handleinputChange}/>
                        <div className="formFeedback">{this.state.formErrors.description}</div>
                    </div>
                    <div className="formGroup">
                        <label>Tags</label>
                        <input type="text" name="tags" value={this.state.tags} onChange={this.handleinputChange}/>
                        <div className="formFeedback">{this.state.formErrors.tags}</div>
                    </div>
                    <div className="formGroup">
                        <label>Image</label>
                        <input type="file" name="imageFile" accept=".jpg,.png,.jpeg" value={this.state.fileName} onChange={this.handleinputChange}/>
                        <div className="formFeedback">{this.state.formErrors.imageFile}</div>
                        {imageBlock}
                    </div>
                    <div className="newPostButtonPanel">
                        <Button disabled = {!this.state.formValid} onClick={() => this.createPost()}>Post</Button>{' '}
                        <Button className="secondary" onClick={() => this.cancel()}>Cancel</Button>
                    </div>
                </div>
            </div>
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

    createPost()
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
        formdata.append('authorId', AuthHelper.getId());
        if (this.state.tags) {
            formdata.append('tags', this.state.tags);
        }
        if (this.state.imageFile)
        {
            formdata.append('image', this.state.imageFile);
        }
        const token = AuthHelper.getToken();
        fetch('api/Post', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formdata
        }).then((response) => {
            if (response.ok){
                this.props.history.push("/feed");
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