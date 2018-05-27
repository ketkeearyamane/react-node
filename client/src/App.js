import React, { Component } from 'react';
import './App.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;


let order = 'desc';
class App extends Component {
  constructor(){
  super();
  // default State object
  this.state = {
    contacts: [], startDate: moment(), endDate: moment(), prio:'', cat:'',
    event:'', action:'', ip:''
  };
  this.handlePrioChange = this.handlePrioChange.bind(this);
}

handleBtnClick = () => {
   if (order === 'desc') {
     this.refs.table.handleSort('asc', 'prio');
     order = 'asc';
   } else {
     this.refs.table.handleSort('desc', 'prio');
     order = 'desc';
   }
 }

  handleStartDateChange =(value)=> {
    console.log(value)
    this.setState({startDate:value});
  }
  handleEndDateChange =(value)=> {
     this.setState({endDate:value});
  }
  handlePrioChange =(event)=> {
    this.setState({prio:event.target.value});
   }
  handleCatChange =(event)=> {
    this.setState({cat:event.target.value});
   }
   handleEventChange =(event)=> {
     this.setState({event:event.target.value});
   }
   handleActionChange =(event)=> {
     this.setState({action:event.target.value});
   }
   handleIPChange =(event)=> {
     this.setState({ip:event.target.value});
   }
   //find
   handleServiceCall =()=> {
      console.log(this.state.endDate.format())
      console.log(this.state.endDate.format())
      console.log(this.state.prio)
      console.log(this.state.event)
      console.log(this.state.action)
      console.log(this.state.ip)
    //call service
    this.getDataFromService('startDate='+this.state.startDate.format()
  +'&endDate='+this.state.endDate.format()
  +'&prio='+this.state.prio
  +'&cat='+this.state.cat
  +'&event='+this.state.event
  +'&action='+this.state.action
  +'&ip='+this.state.ip)
     }
    getDataFromService=(query)=>{
      return fetch('/api/hello?'+query)
      .then((response) => response.json())
      .then(responseJson => {

          // create an array of contacts only with relevant data
          const newContacts =responseJson.map(c => {
            return (
              {"prio":c.prio, "time":c.time, "event":c.event, "cat":c.cat,
                "ip": c.ip, "message":c.message, "action":c.action}
            );
          });
          this.setState({contacts:newContacts});
        })
        .catch(error => console.log(error));
    }

    //first time load.
  componentWillMount() {
    this.getDataFromService();
  }

  render() {
    const options={
      sizePerPage: 50,
      sizePerPageList: [ {
        text: '30', value: 30
      }, {
        text: '50', value: 50
      },
      {
        text: '100', value: 100
      }],
      defaultSortName: 'time',  // default sort column name
      defaultSortOrder: 'desc'  // default sort order
    }

    return (

      <div className="App">


      <table className="table table-dark">
      <thead>
      <tr>
      <th scope="col"><button>Log Sources</button></th>

      </tr>
      </thead>
      </table>



      <div id="searchBar"  >
      <div style={{'display': 'inline-block'}}>
        <DatePicker  selected={this.state.startDate} onChange={this.handleStartDateChange}/>
        </div>
        <div style={{'display': 'inline-block','padding':'2px'}}>
          <label>to</label>
          </div>
        <div style={{'display': 'inline-block', 'padding':'5px'}}>
        <DatePicker selected={this.state.endDate} onChange={this.handleEndDateChange}/>
        </div>
        <div style={{'display': 'inline-block', 'padding':'5px'}}>
        <input type="text" size="10" name="logprio" placeholder="Log Severity"
        value={this.state.prio} onChange={this.handlePrioChange}/>
        </div>
        <div style={{'display': 'inline-block', 'padding':'5px'}}>
        <input type="text" size="10" name="logcat" placeholder="Log Category"
        value={this.state.cat} onChange={this.handleCatChange}/>
        </div>
        <div style={{'display': 'inline-block', 'padding':'5px'}}>
        <input type="text" size="10" name="logevent" placeholder="Log Event"
        value={this.state.event} onChange={this.handleEventChange}/>
        </div>
        <div style={{'display': 'inline-block', 'padding':'5px'}}>
        <input type="text" size="10" name="logaction" placeholder="Log Action"
        value={this.state.action} onChange={this.handleActionChange}/>
        </div>
        <div style={{'display': 'inline-block', 'padding':'5px'}}>
        <input type="text" size="10" name="logip" placeholder="Log IP"
        value={this.state.ip} onChange={this.handleIPChange}/>
        </div>
        <div style={{'display': 'inline-block','padding':'2px'}}>
        <button onClick={this.handleServiceCall}>Find</button>
        </div>
      </div>
      <br/><br/>


      <BootstrapTable ref='table' data={this.state.contacts} striped hover condensed pagination options={options} >
      <TableHeaderColumn dataField='time' dataSort={ true } >Time</TableHeaderColumn>
      <TableHeaderColumn dataSort={ true }  dataField='ip'  isKey>IP</TableHeaderColumn>
       <TableHeaderColumn dataSort={ true }  dataField='prio'  >Priority</TableHeaderColumn>
      <TableHeaderColumn dataSort={ true }  dataField='cat' >Category</TableHeaderColumn>
       <TableHeaderColumn  dataField='event' dataSort={ true }  >Event</TableHeaderColumn>
        <TableHeaderColumn dataField='action' dataSort={ true }  >Action</TableHeaderColumn>
      <TableHeaderColumn dataSort={ true }  dataField='message'  >Message</TableHeaderColumn>

      </BootstrapTable>

      </div>

    );
  }
}

export default App;
