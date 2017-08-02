import React, { Component } from 'react';
import './leaflet-sidebar.css'
import './info.css'
import { CSSTransitionGroup } from 'react-transition-group'
import { connect } from 'react-redux'
import actions from '../../action/action';
import { bindActionCreators } from 'redux';

class Info extends Component {
  constructor(props){
    super(props);
  }
  render(){
    var classNameParent = "test";
    if(this.props.isInfo){
      classNameParent = classNameParent.concat(" show");
      document.getElementById('sidebar').style.zIndex=1;
    }else{
      document.getElementById('carte').style.width="71%";
      document.getElementById('sidebar').style.zIndex=-1;
    }
    return (
      (
        <div className={classNameParent}>
            <div className="sidebar-content sidebar-right">
                <div className="sidebar-pane" id="home">
                    <h1 className="sidebar-header">
                        Info of POI
                        <span className="sidebar-close"  onClick={()=>this.props.actions.closeSideBar()}><i className="fa fa-caret-right"></i></span>
                    </h1>
                    <div>
                    {
                      !this.props.infoKeyForPanel?
                      (
                        !window.infoKeyForPanel?
                          (this.props.Info?Object.keys(this.props.Info.properties).map((key, index)=>{
                            if(key!=="markerAndIcons") return (<p key={key+index}>{key+"\t:\t"+this.props.Info.properties[key]}</p>)
                          }):null)
                          :
                          (this.props.Info?window.infoKeyForPanel.map((value,index)=>{
                            return (<p key={value.key+index}>{value.displayValue+"\t:\t"+this.props.Info.properties[value.key]}</p>)
                          }):null)
                      )
                      :
                      (this.props.Info?this.props.infoKeyForPanel.map((value,index)=>{
                        return (<p key={value.key+index}>{value.displayValue+"\t:\t"+this.props.Info.properties[value.key]}</p>)
                      }):null)

                    }
                    </div>
                </div>
            </div>
      </div>):null

      );
  };
}
const mapStateToProps = state => ({
  isInfo:state.isInfo,
  Info:state.Info,
  mapRef : state.mapRef
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Info)
