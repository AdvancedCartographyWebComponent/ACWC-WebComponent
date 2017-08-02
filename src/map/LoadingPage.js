import React, {Component} from 'react';

class LoadingPage extends Component{

  constructor(props){
    super(props);
  }
  render(){
    var template = (<div className="LoadingPage">
        <h3>Reloading Your Data...</h3>
      </div>);
    return template;
  }
}
export default LoadingPage;
