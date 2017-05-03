var React = require('react'),
  TreeMenu = require('../tree'),
  TreeNode = require('../tree').TreeNode,
  TreeMenuUtils = require('../tree').Utils,
  Immutable = require('immutable'),
  _ = require('lodash');

var CSSTransitionGroup = require('react-addons-css-transition-group');

var App = React.createClass({

  getInitialState: function() {
    return {
      lastAction1: null,
      lastAction2: null,
      lastAction3: null,

      dynamicTreeDataMap: {
        "Option 1" : {
          checked: false,
          checkbox: true,
          children: {
            "Sub Option 1" : {
              checked: false,
              checkbox: true,
            },
            "Sub Option 2" : {
              checked: false,
              checkbox: true,
              children: {
                "Sub-Sub Option 1" : {
                  checked: false,
                  checkbox: true
                },
                "Sub-Sub Option 2" : {
                  checked: false,
                  checkbox: true
                }
              }
            }
          }
        },
        "Option 2" : {
          checked: false,
          checkbox: true
        }
      },


    };
  },

  render: function() {

    var dynamicExample = this._getExamplePanel("Dynamic Thésaurus", this._getDynamicTreeExample());


    return <div className="container">

      <div className="row">
        <div className="col-lg-12 hero">
          <h1><code>{"<Thésaurus/>"}</code></h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 hero">
          <h3>Check out the code for this demo <a href="https://github.com/">here</a>.</h3>
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
            {this._getLastActionNode("5")}
          </CSSTransitionGroup>
        </div>
      </div>

    </div>;

  },

  _getLastActionNode: function (col) {

    var lastActionNode = <div className="text-center alert alert-success tree-event-alert">{"Waiting for interaction"}</div>,
      key = "lastAction" + col;

    var action = this.state[key];

    if (action) {
      lastActionNode = (
        <div className="text-center alert alert-success tree-event-alert" key={"lastAction_" + col + "_" + action.time}>
          <h3>Event Received:</h3>
          <div><strong>{action.event}</strong></div>
          <h3><code>{"<TreeNode/>"}</code> Affected: </h3>
          <div><strong>{action.node}</strong></div>
        </div>);
    } else {

    }

    return lastActionNode;

  },





  _getDynamicTreeExample: function () {

    return  (
      <TreeMenu
        expandIconClass="fa fa-chevron-right"
        collapseIconClass="fa fa-chevron-down"
        onTreeNodeClick={this._setLastActionState.bind(this, "5", "clicked")}
        onTreeNodeCollapseChange={this._handleDynamicObjectTreeNodePropChange.bind(this, 5, "dynamicTreeDataMap","collapsed")}
        onTreeNodeCheckChange={this._handleDynamicObjectTreeNodePropChange.bind(this, 5, "dynamicTreeDataMap","checked")}
        data={this.state.dynamicTreeDataMap} />
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


  _handleDynamicObjectTreeNodePropChange: function (messageWindowKey, stateKey, propName, lineage) {

    this._setLastActionState(propName, messageWindowKey, lineage);

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
    var oldState = Immutable.fromJS(this.state[stateKey]);
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

    var mutation = {};

    mutation[stateKey] = newState.toJS();

    this.setState(mutation);

  },

  _setLastActionState: function (action, col, node) {

    var toggleEvents = ["collapsed", "checked", "selected"];

    if (toggleEvents.indexOf(action) >= 0) {
      action += "Changed";
    }

    console.log("Controller View received tree menu " + action + " action: " + node.join(" > "));

    var key = "lastAction" + col;

    var mutation = {};
    mutation[key] = {
      event: action,
      node: node.join(" > "),
      time: new Date().getTime()
    };

    this.setState(mutation)
  }
});


module.exports = App;
