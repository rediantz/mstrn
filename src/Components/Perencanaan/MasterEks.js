import React, { Component } from 'react';
import {Button, Row} from 'react-bootstrap';
import Config from '../Config/Config';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import MasterEksEdit from './MasterEksEdit';
import memoize from 'memoize-one';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
const tableColumns = memoize(actions =>[
  {
    name: 'Action',
    cell: (row) => <Button className="btn-success mx-auto" onClick={actions.bind(this, row)}><FontAwesomeIcon icon={faEdit}/></Button>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name: 'Kode Ekspedisi',
    selector: 'KodeEkspedisi',
    sortable: true,
    center: true,
  },
  {
    name: 'Nama Ekspedisi',
    selector: 'NamaEkspedisi',
    sortable: true,
  },
  {
    name: 'Spell Nama Ekspedisi',
    selector: 'SpellingNamaEkspedisi',
    sortable: true,
  },
  {
    name: 'Nomor WA',
    selector: 'noWA',
    sortable: true,
  },
  {
    name: 'ID User',
    selector: 'IDuser',
    sortable: true,
  },
  {
    name: 'Password',
    selector: 'Password',
    sortable: true,
  }
]);
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initlistEkspedisi : [],
      listEkspedisi : [],
      selectEkspedisi : {},
      isGetData : false,
      progressPending : true,
      addModalShow : false,
      search : ''
    }
  }
  onSearch(e){
    //console.log(e.target.value);
    let updateList = this.state.initlistEkspedisi;
    updateList = updateList.filter(function(item){
        /*return item.NamaEkspedisi.toLowerCase().search(
          e.target.value.toLowerCase()) !== -1;*/
        return(
            item.NamaEkspedisi.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.KodeEkspedisi.toLowerCase().includes(e.target.value.toLowerCase())
        )
    });
    this.setState({
        listEkspedisi : updateList,
        search : e.target.value
    });
  }
  onChangePage(page, totalRows){
    console.log(page, totalRows);
  }
  onChangeRowsPerPage(currentRowsPerPage, currentPage){
    console.log(currentPage, currentRowsPerPage);
  }
  getData(){
    //console.log(this.state.isGetData);
    if(this.state.isGetData === false){
        this.setState({
            isGetData : true
        });
        let Data = [];
        axios.get(Config.api+"/getmasterekspedisi/").then(res => {
          console.log(res.data);
          this.setState({
            progressPending : false
          })
          let newData = [];
            //console.log(res.data);
            for(let i = 0 ; i < res.data.length ; i++){
                newData = {
                    KodeEkspedisi : res.data[i].expcode,
                    NamaEkspedisi : res.data[i].expname,
                    SpellingNamaEkspedisi : res.data[i].expnamespell,
                    Email : res.data[i].hpwa,
                    NoWA : res.data[i].email,
                    IDuser : res.data[i].userid,
                    Password : res.data[i].userpass
                }
                //console.log(newData);
                Data.push(newData);
            }
            this.setState({
                isGetData : false,
                listEkspedisi : Data,
                initlistEkspedisi : Data
            })
        }).catch(err => {
            console.log(err);
        })
    }
}  
closeModal(){
  this.setState({
    addModalShow : false,
    selectEkspedisi : {}
  });
}
showModal(ekspedisi){
  console.log(ekspedisi);
  this.setState({
    addModalShow : true,
    selectEkspedisi : ekspedisi
  });
}
editMasterEks(data){
  let index;
  let listData = this.state.listEkspedisi;
  index = listData.findIndex(indx => indx.KodeEkspedisi === data.KodeEkspedisi);
  listData[index] = data;
  let initlistData = this.state.initlistEkspedisi;
  index = initlistData.findIndex(indx => indx.KodeEkspedisi === data.KodeEkspedisi);
  initlistData[index] = data;
  this.setState({
      listEkspedisi : listData,
      initlistEkspedisi : initlistData
  });
  let search = this.state.search;
  let updateList = this.state.initlistEkspedisi;
  updateList = updateList.filter(function(item){
      /*return item.NamaEkspedisi.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;*/
      return(
          item.NamaEkspedisi.toLowerCase().includes(search.toLowerCase()) ||
          item.KodeEkspedisi.toLowerCase().includes(search.toLowerCase())
      )
  });
  this.setState({
      listEkspedisi : updateList
  });
}
componentDidUpdate(){
  console.log("componentDidUpdate");
}
componentDidMount(){
    this.getData();
}
render() { 
    return (
      <>
      <Row className="my-2 ml-2">
          <input readOnly={this.state.progressPending} className="form-control col-12 col-xs-6 col-lg-4" placeholder="Search" onChange={this.onSearch.bind(this)}/>
      </Row>
        <DataTable
          keyField = 'KodeEkspedisi'
          columns={tableColumns(this.showModal.bind(this))}
          data={this.state.listEkspedisi}
          pagination={true}
          noHeader={true}
          responsive={true}
          striped={true}
          highlightOnHover={true}
          progressPending={this.state.progressPending}
          persistTableHead={true}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage = {this.onChangeRowsPerPage}
        />
      <MasterEksEdit
      show={this.state.addModalShow} 
      onHide={this.closeModal.bind(this)} 
      Ekspedisi={this.state.selectEkspedisi}
      editMasterEks = {this.editMasterEks.bind(this)}/>
      </>
    );
  }
}
 
export default Test;