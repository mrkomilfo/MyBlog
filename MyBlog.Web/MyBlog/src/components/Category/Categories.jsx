import React, { Component } from 'react';
import Button from '../Common/Button';
import Portal from '../Common/Portal';
import Modal from '../Common/Modal';
import './Categories.css';
import '../Common/Modal.css';
import AuthHelper from '../../Utils/authHelper.js'

export default class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true, 
            error: false,
            categories: [],
            
            newCategory: '',
            newCategoryModal: false,

            editCategoryId: 0,
            editCategoryName: '',
            editCategoryModal: false,

            deleteCategoryId: 0,
            deleteCategoryModal: false,
        };
        this.toggleNewCategoryModal = this.toggleNewCategoryModal.bind(this);
        this.toggleEditCategoryModal = this.toggleEditCategoryModal.bind(this);
        this.toggleDeleteCategoryModal = this.toggleDeleteCategoryModal.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    componentDidMount() {
        this.loadCategories();
    }

    toggleNewCategoryModal() {
        this.setState({
            newCategoryModal: !this.state.newCategoryModal
        })
    }

    toggleEditCategoryModal(id=0, value='') {
        this.setState({
            editCategoryId: id,
            editCategoryName: value,
            editCategoryModal: !this.state.editCategoryModal
        })
    }

    toggleDeleteCategoryModal(id=0) {
        this.setState({
            deleteCategoryId: id,
            deleteCategoryModal: !this.state.deleteCategoryModal
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;

        this.setState({
          [name]: value}
        );
    }

    renderNewCategoryModal(){
        return(
            <Portal>
                <div className="modalOverlay">
                    <div className="modalWindow">
                        <div className="modalHeader">
                            New category
                        </div>
                        <div className="modalBody">
                            <label>Category name:</label>
                            <input name="newCategory" type="text" value={this.state.newCategory} onChange={e => this.handleInputChange(e)}/>
                        </div>
                        <div className="modalFooter">
                            <Button disabled={!this.state.newCategory} onClick={this.createCategory}>Create</Button>
                            <Button onClick={this.toggleNewCategoryModal} className="secondary">Cancel</Button>
                        </div>
                    </div>
                </div>
            </Portal>
        )
    }

    renderEditCategoryModal(){
        return(
            <Portal>
                <div className="modalOverlay">
                    <div className="modalWindow">
                        <div className="modalHeader">
                            Edit category
                        </div>
                        <div className="modalBody">
                            <label>Category name:</label>
                            <input name="editCategoryName" type="text" value={this.state.editCategoryName} onChange={e => this.handleInputChange(e)}/>
                        </div>
                        <div className="modalFooter">
                            <Button disabled={!this.state.editCategoryName} onClick={this.editCategory}>Save</Button>
                            <Button onClick={this.toggleEditCategoryModal} className="secondary">Cancel</Button>
                        </div>
                    </div>
                </div>
            </Portal>
        )
    }

    renderDeleteCategoryModal(){
        return(
            <Portal>
                <div className="modalOverlay">
                    <div className="modalWindow">
                        <div className="modalHeader">
                            Delete confirmation
                        </div>
                        <div className="modalBody">
                            Are you sure you want to delete this category?
                        </div>
                        <div className="modalFooter">
                            <Button onClick={this.deleteCategory}>Yes</Button>
                            <Button onClick={this.toggleDeleteCategoryModal} className="secondary">Cancel</Button>
                        </div>
                    </div>
                </div>
            </Portal>
        )
    }

    renderCategoriesList() {
        return(
            <table className="table form">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Category name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.categories.map((c, index) => 
                        <tr key={c.id.toString()}>
                            <th scope="row">{index+1}</th>
                            <td>{c.name}</td>
                            <td>
                                <span className="textShadow" role="img" aria-label="edit" onClick={()=>this.toggleEditCategoryModal(c.id, c.name)}>✏️</span>{' '}
                                <span className="textShadow" onClick={()=>this.toggleDeleteCategoryModal(c.id)}>✖</span>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>          
        )
    }

    render() {
        const content = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCategoriesList(this.state.categories);

        const newCategoryModal = this.state.newCategoryModal ? this.renderNewCategoryModal() : null
        const editCategoryModal = this.state.editCategoryModal ? this.renderEditCategoryModal() : null
        const deleteCategoryModal = this.state.deleteCategoryModal ? this.renderDeleteCategoryModal() : null

        return (
            <div className="categoriesPage">
                <div className="categoriesHeader">
                    <h2>Categories</h2>
                    <Button className="addCategoryButton secondary"><span role="img" aria-label="add category" onClick={this.toggleNewCategoryModal}>➕</span></Button>
                </div>               
                {content}
                {newCategoryModal}
                {editCategoryModal}
                {deleteCategoryModal}
            </div>
        );
    }

    async loadCategories() {
        fetch('api/Category', {
            method: 'GET',
        })
        .then((response) => {
            this.setState({
                error: !response.ok
            });
            return response.json();
        }).then((data) => {
            if (this.state.error){
                console.log(data);
            }
            else {
                this.setState({ 
                    categories: data
                });
            }
        }).catch((ex) => {
            console.log(ex.toString());
        }).finally(() => {
            this.setState({ 
                loading: false 
            });
        })
    }

    async createCategory() {
        let category = {
            name: this.state.newCategory,
        }
        const token = AuthHelper.getToken();
        fetch('api/Category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(category)
        }).then((response) => {
            if (response.ok){
                this.setState({
                    newCategory: ''
                }, () => {
                    this.toggleNewCategoryModal(); 
                    this.loadCategories()
                })
            }
            else {
                this.setState({
                    error: true
                });
                return response.json();
            }
        }).then((data) => {
            if(this.state.error) {
                console.log(data);
            }
        }).catch((ex) => {
            console.log(ex.toString());
        });
    }

    async editCategory() {
        let category = {
            id: this.state.editCategoryId,
            name: this.state.editCategoryName
        }
        const token = AuthHelper.getToken();
        fetch('api/Category', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(category)
        }).then((response) => {
            if (response.ok){
                this.toggleEditCategoryModal()
                this.loadCategories()
            }
            else {
                this.setState({
                    error: true
                });
                return response.json();
            }
        }).then((data) => {
            if(this.state.error) {
                console.log(data);
            }
        }).catch((ex) => {
            console.log(ex.toString());
        });
    }

    async deleteCategory() {
        const token = AuthHelper.getToken();
        fetch('api/Category/' + this.state.deleteCategoryId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then((response) => {
            if (response.ok) {
                this.toggleDeleteCategoryModal();
                this.loadCategories();                   
            }
            else {
                this.setState({
                    error: true
                });
                return response.json()
            }
        }).then((data) => {
            if (this.state.error) {
                console.log(data);
            }
        }).catch((ex) => {
            console.log(ex.toString());
        });
    }
}