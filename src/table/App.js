import React, { Component } from 'react';
import Table from './table';
import { connect } from 'react-redux'
import actions from '../../action/action';
import { bindActionCreators } from 'redux';
import {
  Panel
}from 'react-bootstrap'

// App component
class App extends Component {
  render() {
    ////console.log("this.props.isTable",this.props.isTable,this.props.tableData);
    var paramsString = this.props.location.search.split("?params=");
    paramsString = paramsString.length>1?paramsString[1]:null;
    var paramsObject = JSON.parse(decodeURIComponent(paramsString));
    var params = paramsObject?Object.keys(paramsObject):null;
    const infoKeyForTable = params&&params.indexOf('infoKeyForTable')!=="-1"?paramsObject['infoKeyForTable']:window.infoKeyForTable;
    //console.log("infoKeyForTable",infoKeyForTable);
    if(this.props.isTable){
      //console.log("this.props.isTable",this.props.tableType);
      document.getElementById('table').style.display="inline-block";
      if(this.props.tableType==="1"){
        document.getElementById('table').style.top=null;
        document.getElementById('table').style.bottom="29px";
        document.getElementById('table').style.height="43vh";
        document.getElementById('carte').style.display="inline-block";
        document.getElementById('carte').style.height="51vh";
        document.getElementById('sidebar').style.height="51vh";
      }else {
        document.getElementById('table').style.bottom=null;
        document.getElementById('table').style.top="10px";
        document.getElementById('table').style.height="95vh";
        document.getElementById('carte').style.display="none";
      }
      return <Table
              isExit={this.props.tableType==="2"?true:false}
              actions = {this.props.actions}
              infoKeyForTable = {infoKeyForTable}
            />;
    }else {
      document.getElementById('carte').style.height="95vh";
      document.getElementById('carte').style.display="inline-block";
      document.getElementById('sidebar').style.height="95vh";
      document.getElementById('table').style.display="none";
      return null;
    }
  }
}
const mapStateToProps = state => ({
  isTable : state.isTable,
  tableData : state.tableData,
  tableType : state.tableType,
  mapRef : state.mapRef
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
