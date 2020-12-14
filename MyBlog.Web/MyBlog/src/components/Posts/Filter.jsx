import React, { Component } from 'react';
import Button from '../Common/Button';

import './Filter.css';

export default class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            categories: [], 
            name: '', 
            category: 0, 
            tags: '', 
            from: '',
            to: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.loadCategories();
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;
        
        this.setState({
          [name]: value
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ 
            name: '', 
            category: 0, 
            tags: '', 
            from: '',
            to: '',
        });
    }

    getQuerryTrailer(){
        let isFirst = true
        let queryTrailer = '';
        if (this.state.name)
        {
            queryTrailer += isFirst ? '?' : '&';
            queryTrailer += `name=${this.state.name}`;
            isFirst = false;
        }
        if (this.state.category != 0)
        {
            queryTrailer += isFirst ? '?' : '&';
            queryTrailer += `categoryId=${this.state.category}`;
            isFirst = false;
        }
        if (this.state.tags)
        {
            queryTrailer += isFirst ? '?' : '&';
            queryTrailer += `tags=${this.state.tags}`;
            isFirst = false;
        }
        if (this.state.from)
        {
            const dateFrom = new Date(this.state.from);
            const from = `${dateFrom.getDate()}/${dateFrom.getMonth()+1}/${dateFrom.getFullYear()}`
        
            queryTrailer += isFirst ? '?' : '&';
            queryTrailer += `from=${from}`;
            isFirst = false;
        }
        if (this.state.to)
        {
            const dateTo = new Date(this.state.to);
            const to = `${dateTo.getDate()}/${dateTo.getMonth()+1}/${dateTo.getFullYear()}`

            queryTrailer += isFirst ? '?' : '&';
            queryTrailer += `to=${to}`;
            isFirst = false;
        }

        return queryTrailer;
    }

    render(){
        const categoriesSelect = this.state.categories.map(c => <option key={c.id.toString()}value={c.id}>{c.name}</option>)
        return(
            <div className="form filter">
                <div className="formGroup">
                    <label>Name</label>
                    <input type="text" value={this.state.name} name="name" onChange={this.handleInputChange}/>
                </div>
                <div className="formGroup">
                    <label>Category</label>
                    <select value={this.state.category} name="category" onChange={this.handleInputChange}>
                        {categoriesSelect}
                    </select>
                </div>
                <div className="formGroup">
                    <label>Tags</label>
                    <input type="text" value={this.state.tags} name="tags" onChange={this.handleInputChange}/>
                </div>
                <div className="formGroup">
                    <label>From</label>
                    <input type="date" value={this.state.from} name="from" onChange={this.handleInputChange}/>
                </div>
                <div className="formGroup">
                    <label>To</label>
                    <input type="date" value={this.state.to} name="to" onChange={this.handleInputChange}/>
                </div>
                <div className="filterButtonWrapper">
                    <Button className="filterButton" color="primary" onClick={this.search}>Search</Button>
                </div>               
            </div>
        )
    }

    search() {
        const query = `/feed${this.getQuerryTrailer()}`
        this.props.history.push(query)
    }

    async loadCategories() {
        const response = await fetch('api/Category');
        const data = await response.json();
        data.unshift({id: 0, name: '--'})
        this.setState({ categories: data });
    }
}