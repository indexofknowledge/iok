/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Connect } from '@blockstack/connect';
import App from './App';
import Log from './log';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from '././redux/reducers/index'

// Require Sass file so webpack can build it
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import './styles/style.css';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

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

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter><App /></BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
