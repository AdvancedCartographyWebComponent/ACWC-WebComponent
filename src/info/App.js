import React, { Component } from 'react';
import Info from './Info';

// App component
export default class App extends Component {
  render() {
    var paramsString = this.props.location.search.split("?params=");
    paramsString = paramsString.length>1?paramsString[1]:null;
    var paramsObject = JSON.parse(decodeURIComponent(paramsString));
    //console.log("paramsObject in Info app",paramsObject);
    var params = paramsObject?Object.keys(paramsObject):null;
    const infoKeyForPanel = params&&params.indexOf('infoKeyForPanel')!=="-1"?paramsObject['infoKeyForPanel']:null;
    //console.log("infoKeyForPanel",infoKeyForPanel);
    return <Info infoKeyForPanel={infoKeyForPanel}/>;
  }
}
