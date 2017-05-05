import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './app.css';
import './tree-view.css';
import Reducer from '../reducer/reducer'
const Provider=require('react-redux').Provider;
const createStore=require('redux').createStore;

var store=createStore(Reducer);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
