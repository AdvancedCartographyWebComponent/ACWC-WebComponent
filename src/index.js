import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './app.css';
import './tree-view.css';
import Reducer from '../reducer/reducer'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Provider=require('react-redux').Provider;
const createStore=require('redux').createStore;

var store=createStore(Reducer);


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route component={App}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
