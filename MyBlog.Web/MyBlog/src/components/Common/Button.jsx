import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Button.css';

export default class Button extends Component {

    render(){
        const classes = classNames(
            'btn',
            this.props.className
        );

        const onClickAction = e => {
            if (this.props.disabled) {
                return () => {}
            } else {
                return this.props.onClick(e);
            }
        };

        const Tag = 'button';

        return (
            <Tag
                className={classes}
                disabled={this.props.disabled}
                onClick={onClickAction}
            >
                {this.props.children}
            </Tag>
        );
    }
};

Button.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};
  
Button.defaultProps = {
    children: 'Button',
    onClick: () => {},
    className: '',
    disabled: false
};