import React, { Component } from 'react';
import NavMenu from './NavMenu';

export default class Layout extends Component {
  render () {
    return ( 
      <div>
        <NavMenu />
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}