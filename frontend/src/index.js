import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from "./components/AppWrapper";
//import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './ScrollToTop';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

if (localStorage.getItem('token')) {
    const {exp} = jwtDecode(localStorage.getItem('token'));
    const dateNow = Date.now();
    if (exp < dateNow / 1000) {
        localStorage.removeItem('token');
    } else {
        setTimeout(() => {
        localStorage.removeItem('token')
      }, exp * 1000 - dateNow);
    }
}

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'

axios.interceptors.request.use(config => {
    let prefix = '?'
    if (config.url.includes(prefix)) {
        prefix = '&'
    }
    config.url += prefix+'token='+localStorage.getItem('token')
    return config
})

ReactDOM.render(
    <BrowserRouter>
        <ScrollToTop>
            <AppWrapper />
        </ScrollToTop>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();