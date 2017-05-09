var React = require('react'),
  TreeMenu = require('../tree'),
  Immutable = require('immutable'),
  _ = require('lodash');
var ReactRedux = require('react-redux');
var actions = require('../action/action');
//import * as actions from '../action/action'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
var CSSTransitionGroup = require('react-addons-css-transition-group');

var App = React.createClass({

  getInitialState: function() {
    console.log("app initial state called");
    return {
    };
  },

  render: function() {
    console.log("test router",this.props.location);
    var dynamicExample = this._getExamplePanel("Dynamic Thésaurus", this._getDynamicTreeExample());
    //console.log(content);
    return <div className="container">

      <div className="row">
        <div className="col-lg-12 hero">
          <h1><code>{"<Thésaurus/>"}</code></h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 hero">
          <h3>Check out the code for this demo <a href="https://github.com/AdvancedCartographyWebComponent/ACWC-WebComponent">here</a>.</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3">
          {dynamicExample}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3">
          <CSSTransitionGroup transitionEnterTimeout={500} transitionName="last-action" transitionLeave={false}>
            {this._getLastActionNode()}
          </CSSTransitionGroup>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3">
          <CSSTransitionGroup transitionEnterTimeout={500} transitionName="last-search" transitionLeave={false}>
            {this._getUrlSearch()}
          </CSSTransitionGroup>
        </div>
      </div>

    </div>;

  },

  _getLastActionNode: function () {

    var lastActionNode = <div className="text-center alert alert-success tree-event-alert">{"Waiting for interaction"}</div>;


    var action = this.props.lastChange;
    console.log("lastchange",this.props);
    if (action) {
      lastActionNode = (
        <div className="text-center alert alert-success tree-event-alert" key={"lastAction_" + "_" + action.time}>
          <h3>Event Received:</h3>
          <div><strong>{action.event}</strong></div>
          <h3><code>{"<TreeNode/>"}</code> Affected: </h3>
          <div><strong>{action.node}</strong></div>
        </div>);
    } else {

    }

    return lastActionNode;

  },

  _getUrlSearch: function () {

    var lastUrlSearchNode = <div className="text-center alert alert-success tree-event-alert">{"Waiting for search. Add ?url = xxxx to the url"}</div>;


    var search = this.props.location.search;
    console.log("lastSearch",search);
    if (search) {
      var decodeURI = decodeURIComponent(search);
      console.log("decodedUrl",decodeURI);
      lastUrlSearchNode = (
        <div className="text-center alert alert-success tree-event-alert" key={"lastSearch"}>
          <h3>Search Received:</h3>
          <h3>decodedURL: </h3>
          <div><strong>{decodeURI.slice(5)}</strong></div>
        </div>);
    } else {

    }

    return lastUrlSearchNode;

  },



  _getDynamicTreeExample: function () {

    return  (
      <TreeMenu
        expandIconClass="fa fa-chevron-right"
        collapseIconClass="fa fa-chevron-down"
        onTreeNodeClick={this._setLastActionState.bind(this, "clicked")}
        onTreeNodeCollapseChange={this._handleDynamicObjectTreeNodePropChange.bind(this,"collapsed")}
        onTreeNodeCheckChange={this._handleDynamicObjectTreeNodePropChange.bind(this,"checked")}
        data={this.props.treeData} />
    );

  },



  _getExamplePanel: function (title, treeMenuNode) {
    return <div>
      <div className="panel-thesaurus">
        <div className="panel-heading">{title + " Menu"}</div>
        <div className="panel-body">
          {treeMenuNode}
        </div>
      </div>
    </div>;
  },


  _handleDynamicObjectTreeNodePropChange: function (propName, lineage) {

    this._setLastActionState(propName, lineage);

    //Get a node path that includes children, given a key
    function getNodePath(nodeKey) {

      if (nodeKey.length === 1) return nodeKey;
      return _(nodeKey).zip(nodeKey.map(function () {
        return "children";
      })).flatten().initial().value();

    }
    function getSiblingNodePath(nodeKey) {
      if (nodeKey.length === 1) return [];
      return _(nodeKey).zip(nodeKey.map(function () {
        return "children";
      })).flatten().initial().initial().initial().value();

    }
    var oldState = Immutable.fromJS(this.props.treeData);
    var nodePath = getNodePath(lineage),
      nodeSiblingPath = getSiblingNodePath(lineage),
      keyPaths = [nodePath.concat([propName])],
      keySiblingPaths = [nodeSiblingPath.concat([propName])];

    //Build a list of key paths for all children
    function addChildKeys(state, parentPath) {

      var childrenPath = parentPath.concat('children'),
        children = state.getIn(childrenPath);

      //console.log({children});
      if (!children || children.size === 0) return;

      children.map(function (value, key) {
        keyPaths.push(childrenPath.concat([key, propName]))
        addChildKeys(state, childrenPath.concat([key]));
      });
    }


    //Build a list of key paths for all siblings
    function findSiblingKeys(state, parentPath) {

      var siblingPath = parentPath.concat('children'),
        sibling = state.getIn(siblingPath);
      //console.log({sibling});
      if(!sibling) return;
      sibling.map(function (value, key) {
        keySiblingPaths.push(siblingPath.concat([key, propName]))
      });
    }

    //get new keySiblingPaths
    //keySiblingPaths[0] is parent node
    findSiblingKeys(oldState,nodeSiblingPath);

    //get new keyPaths
    //keyPaths[0] is the parent node and change all the children nodes with the parent's value
    addChildKeys(oldState, nodePath);
    //console.log({keySiblingPaths});

    function getParentPropState(keySiblingPaths){
      var state = !oldState.getIn(keyPaths[0]);
      keySiblingPaths.forEach((val,index)=>{
        /*console.log(val);
        console.log(keyPaths[0]);
        console.log(val[val.length-2]=== keyPaths[0][keyPaths[0].length-2]);
        */
        if(index >0&&val[val.length-2]!== keyPaths[0][keyPaths[0].length-2]) {
          //console.log(oldState.getIn(keyPaths[0]));
          state = state && oldState.getIn(val);

        }
      });
      //console.log(state);
      return state;

    }
    //Get the new prop state
    var newPropState = !oldState.getIn(keyPaths[0]);
    //Get the new prop state for parent's node
    var newParentPropState = getParentPropState(keySiblingPaths);
    //console.log("newParentPropState:");
    //console.log(newParentPropState);


    //Now create a new map w/ all the changes
    var newState = oldState.withMutations(function(state) {
      keyPaths.forEach(function (keyPath) {
        state.setIn(keyPath, newPropState);
      });
      if(keySiblingPaths.length>1){state.setIn(keySiblingPaths[0], newParentPropState);}
    });

    //var mutation = {};

    //mutation[stateKey]
    newState.toJS();
    //console.log("newState",newState);
    //console.log("change node state",mutation);
    this.props.actions.updateTreeData(newState.toJS());
    //this.setState(mutation);

  },

  _setLastActionState: function (action, node) {

    var toggleEvents = ["collapsed", "checked", "selected"];

    if (toggleEvents.indexOf(action) >= 0) {
      action += "Changed";
    }

    console.log("Controller View received tree menu " + action + " action: " + node.join(" > "));

    var key = "lastAction";

    var mutation = {
      event: action,
      node: node.join(" > "),
      time: new Date().getTime()
    };
    console.log("set last state",mutation);
    //call redux
    this.props.actions.setLastChangeState(mutation);
  }
});

const mapStateToProps = state => ({
  treeData:state.treeData,
  lastChange:state.lastChange,
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})
module.exports = withRouter(ReactRedux.connect(
mapStateToProps,mapDispatchToProps
)(App));
