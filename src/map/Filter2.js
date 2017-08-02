import React, {Component} from 'react';

class Filter2 extends Component{

  constructor(props){
    super(props);
    this.state = {
      filterUsers : props.filterUsers,
      curState : props.curState,
      userList : []
    };
    this.userNames=[];
    this.userNum = null;
    this.updateName = this.updateName.bind(this);
  }
  componentDidMount(){
    ////console.log("filter mounts, curState:",this.state.curState);
    this.updateName(this.state.curState);
  }
  componentWillReceiveProps(nextProps){
    this.updateName(nextProps.curState);
  }
  componentDidUpdate(prevProps, prevState){

  }
  updateName(e){
    this.userNames=[];
    this.userNum = e.features.length;
    if(this.userNum>0){
      for(var obj in e.features){
        if (e.features[obj].properties && e.features[obj].properties.NAME) {

          // if the array for unique subway line names has not been made, create it
          // there are ?? unique names total

          if (this.userNames.indexOf(e.features[obj].properties.NAME) === -1){
            this.userNames.push(e.features[obj].properties.NAME);
            if (e.features.indexOf(e.features[obj]) === this.userNum - 1) {
              // use sort() to put our values in alphanumeric order
              this.userNames.sort();
              // finally add a value to represent all of the subway lines
              this.userNames.unshift('All Info');
            }
          }
        }
      }
    }
    else{
      this.userNames.unshift('All Info');
    }
    this.setState({userList:this.userNames});
    ////console.log("updated userNames",this.userNames);
  }
  componentWillUnmount(){

  }
  render(){
    ////console.log("render filter");
    ////console.log("lines:",this.state.userList);
    ////console.log("state:",this.state.curState);
    var template = (<div className="filterUserLines">
        <hr/>
        <h3>User Search</h3>
        <p>Filter User by Name</p>
        <select defaultValue="*"
          type="select"
          name="filterUsers"
          onChange={(e) => {/*//console.log(e);*/ this.state.filterUsers(e)}}>
            { /* We render the select's option elements by maping each of the values of subwayLines array to option elements */ }
            {
              this.userNames.map((user, i) => {
                return (
                    <option value={user} key={i}>{user}</option>
                  );
              }, this)
            }
        </select>
      </div>);
    return template;
  }
}


export default Filter2;
