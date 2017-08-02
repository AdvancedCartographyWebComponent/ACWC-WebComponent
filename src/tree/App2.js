import React, { Component } from 'react';
import Tree from './App';
import md5 from 'MD5';


// App component
class App2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeDataUrl : null
    };
  }
  componentDidMount() {
    this.checkDataSource = setInterval(
      () => {
        ////console.log("window.testValue",window.testValue);
        if(window.treeDataUrl&&(!this.state.treeDataUrl||md5(JSON.stringify(window.treeDataUrl))!==md5(JSON.stringify(this.state.treeDataUrl)))){
          //console.log("differ");
          this.setState({treeDataUrl : window.treeDataUrl});
          delete window.treeDataUrl;
          //this.getDataFromUrl(window.treeDataUrl);
        }
      },
      100
    );
  }
  render() {
    var paramsString = this.props.location.search.split("?params=");
    paramsString = paramsString.length>1?paramsString[1]:null;
    var paramsObject = JSON.parse(decodeURIComponent(paramsString));
    //console.log("paramsObject",paramsObject);
    var params = paramsObject?Object.keys(paramsObject):null;
    var urlForTree = [];
    if(params&&params.indexOf("treeDataUrl")!==-1){
      urlForTree.push(paramsObject["treeDataUrl"]);
      if(window.treeDataUrl) delete window.treeDataUrl;
    }
    var url = urlForTree.length>0?urlForTree[0]:(window.treeDataUrl?window.treeDataUrl:null);
    //console.log("tree url",url);
    return <Tree urlQuery={url}/>;
  }
}
export default App2;
