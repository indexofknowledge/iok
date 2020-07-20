/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Log from './log';

// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';

// set up the logger
// Don't remove this!
if (process.env.NODE_ENV !== 'production') {
    localStorage.setItem('debug', 'iok:*');
    // test the logs
    Log.info('Non-production... logging!');
    Log.trace('Non-production... logging!');
    Log.warn('Non-production... logging!');
    Log.error('Non-production... logging!');
}

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
