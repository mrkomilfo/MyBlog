import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal';
import Button from './Button';

import { Link } from 'react-router-dom';

import './Modal.css';

export default class Modal extends Component {

    render(){
        return(
            <>
                { this.props.isOpen &&
                    <Portal>
                        <div className="modalOverlay">
                            <div className="modalWindow">
                                <div className="modalHeader">
                                    {this.props.title}
                                </div>
                                <div className="modalBody">
                                    {this.props.children}
                                </div>
                                <div className="modalFooter">
                                    <Button onClick={this.props.onCancel} className="secondary">Cancel</Button>
                                    <Link to={this.props.path}><Button onClick={this.props.onSubmit}>Confirm</Button></Link>    
                                </div>
                            </div>
                        </div>
                    </Portal>
                }
            </>
        )
    }
}

Modal.propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    children: PropTypes.node,
    path: PropTypes.string
};

Modal.defaultProps = {
    title: 'Title',
    isOpen: false,
    onCancel: () => {},
    onSubmit: () => {},
    children: null,
    path: '#'
};