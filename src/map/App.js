import React, { Component } from 'react';
import Map from './Map';
import { connect } from 'react-redux'
import actions from '../../action/action';
import { bindActionCreators } from 'redux';

// App component
class App extends Component {
  render() {
    var paramsString = this.props.location.search.split("?params=");
    paramsString = paramsString.length>1?paramsString[1]:null;
    var paramsObject = JSON.parse(decodeURIComponent(paramsString));
    //console.log("paramsObject",paramsObject);
    var params = paramsObject?Object.keys(paramsObject):null;
    if(params&&params.indexOf("view")!=="-1"){
      switch (paramsObject["view"]) {
        case "points":
          this.props.actions.isTrajet(false);
          break;
        case "path":
          this.props.actions.isTrajet(true);
          break;
        default:
          this.props.actions.isTrajet(false);
      }
    }
    var urlForMap = [];
    if(params&&params.indexOf("mapDataUrl")!=="-1"){
      urlForMap.push(paramsObject["mapDataUrl"])
    }
    return <Map isServer={this.props.isServer} mapDataUrl={urlForMap.length>0?urlForMap[0]:null}/>;
  }
}
const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
