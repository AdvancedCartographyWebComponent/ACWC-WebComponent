/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux'
import actions from '../../action/action';
import { bindActionCreators } from 'redux';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

class Table extends React.Component {
  constructor(props) {
    super(props);
    ////console.log("this.props.data",this.props.data,this.props.data.length);
    ////console.log("this.props",this.props);
    this.iconFormatter = this.iconFormatter.bind(this);
    this.createCustomButtonGroup = this.createCustomButtonGroup.bind(this);
  }
  createCustomButtonGroup = props => {
    const style = {
      left:"65%"
    };
    if(this.props.isExit){
      return (
        <ButtonGroup style={style} sizeClass='btn-group-md'>
          <button type='button'
            className={ `btn btn-primary` }
            onClick={()=>this.props.actions.toggleTable(false,"2")}>
            Back to Map
          </button>
        </ButtonGroup>
      );
    }else {
      return null;
    }

  }
  iconFormatter(cell){
    ////console.log("iconFormatter cell",cell);
    let iconString = '';
    cell?cell.map((value,index)=>{
      ////console.log('map cell value',value);
      iconString = iconString.concat(`<i class='fa fa-${value.icon}' style='color :${value.color};font-size:18px'></i>`);
    }):iconString='No Icons Info in the Data Set!'
    return iconString;
  }
  render() {
    //console.log("render table",this.props.infoKeyForTable);
    const options = {
      page: 1,  // which page you want to show as default
      sizePerPageList: this.props.isExit?[ {
        text: '15 Record Per Page', value: 15
      },{
        text: 'All', value: this.props.tableData.length
      }]:[ {
        text: '5 Record Per Page', value: 5
      },{
        text: 'All', value: this.props.tableData.length
      }], // you can change the dropdown list for size per page
      sizePerPage: this.props.isExit?15:5,  // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 5,  // the pagination bar size.
      prePage: '<', // Previous page button text
      nextPage: '>', // Next page button text
      firstPage: '<<', // First page button text
      lastPage: '>>', // Last page button text
      prePageTitle: 'Previous', // Previous page button title
      nextPageTitle: 'Next', // Next page button title
      firstPageTitle: 'First', // First page button title
      lastPageTitle: 'Last', // Last page button title
      paginationPosition: 'bottom',  // default is bottom, top and both is all available
      btnGroup: this.createCustomButtonGroup
    }
    return (
      <div>
        <BootstrapTable
          data={ this.props.tableData }
          pagination
          options={ options }
          maxHeight={this.props.isExit?"645px":"260px"}>
          {
            this.props.infoKeyForTable?this.props.infoKeyForTable.map((value,index)=>{
              ////console.log("value",value,"index",index);
              if(value.key==="markerAndIcons"){
                return (
                  <TableHeaderColumn
                    dataField={value.key}
                    isKey={index===0?true:false}
                    dataSort
                    dataFormat={this.iconFormatter}>
                    {value.displayValue}
                  </TableHeaderColumn>);
              }else{
                return (
                  <TableHeaderColumn
                    dataField={value.key}
                    isKey={index===0?true:false}
                    filter={ { type: 'TextFilter', placeholder: 'Please enter a value' } }
                    dataSort>
                    {value.displayValue}
                  </TableHeaderColumn>);
              }
            })
            :null
          }
        </BootstrapTable>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  tableData : state.tableData,
  mapRef : state.mapRef
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
