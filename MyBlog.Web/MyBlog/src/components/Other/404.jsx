import React, { Component } from 'react';
import './404.css';

export default class Page404 extends Component
{
    render(){
        return(
            <div>
                <p className="top">404</p>
                <p className="body">Страница не найдена</p>
            </div>
        )
    }
}