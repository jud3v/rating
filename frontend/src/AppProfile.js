import React, { Component } from 'react';
import classNames from 'classnames';
import {withRouter} from "react-router-dom";
import jwtDecode from 'jwt-decode';

class AppProfile extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }

    onClickHandler = () => {
        localStorage.removeItem('token')
        this.props.history.push('/login')
    }

    render() {
        const {name} = jwtDecode(localStorage.getItem('token'))
        return  (
            <div className="layout-profile">
                <button className="p-link layout-profile-link" onClick={this.onClick}>
                    <span className="username">{name}</span>
                    <i className="pi pi-fw pi-cog"/>
                </button>
                <ul className={classNames({'layout-profile-expanded': this.state.expanded})}>
                    <li><button className="p-link"><i className="pi pi-fw pi-user"/><span>Account</span></button></li>
                    <li><button className="p-link"><i className="pi pi-fw pi-inbox"/><span>Notifications</span><span className="menuitem-badge">2</span></button></li>
                    <li><button onClick={this.onClickHandler} className="p-link"><i className="pi pi-fw pi-power-off"/><span>Logout</span></button></li>
                </ul>
            </div>
        );
    }
}

export default withRouter(AppProfile)