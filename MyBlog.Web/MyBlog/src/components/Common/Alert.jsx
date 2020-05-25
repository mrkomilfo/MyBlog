import React, { Component }  from 'react';
import PropTypes from 'prop-types';

import './Alert.css'

export default class Alert extends Component {
    render() {
        return <div className="alert">{this.props.children}</div>
    }
}

Alert.propTypes = {
    children: PropTypes.node,
};

Alert.defaultProps = {
    children: null,
};