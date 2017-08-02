import React from 'react';
import ReactDOM from 'react-dom';
import App_tree from './tree/App2'
import App_map from './map/App'
import App_Info from './info/App'
import App_Table from './table/App'
import './tree/index.css';
import './tree/app.css';
import './tree/tree-view.css';
import Reducer from '../reducer/reducer'
import './map/index.css'; // postCSS import of CSS module

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

const Provider=require('react-redux').Provider;
const createStore=require('redux').createStore;

var store=createStore(Reducer);



ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route component={App_tree}/>
    </Router>
  </Provider>,
  document.getElementById('tree')
);
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route component={(props) => <App_map isServer={'false'} {...props}/>}/>
    </Router>
  </Provider>,
  document.getElementById('carte')
);
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route component={(props) => <App_Info {...props}/>}/>
    </Router>
  </Provider>,
  document.getElementById('sidebar')
);
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route component={(props) => <App_Table {...props}/>}/>
    </Router>
  </Provider>,
  document.getElementById('table')
);
