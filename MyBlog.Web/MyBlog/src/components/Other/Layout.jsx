import React, { Component } from 'react';
import NavMenu from './NavMenu';

import './Layout.css';

export default class Layout extends Component {
  render () {
    return ( 
      <>
        <NavMenu />
        <main>
          {this.props.children}
        </main>
      </>
    );
  }
}