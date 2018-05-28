import React, { Component } from 'react';
import './App.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from './Modal';


var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;


let order = 'desc';
class App extends Component {
  constructor(){
  super();
  // default State object
  this.state = {
    logs: [], startDate: moment(), endDate: moment(), prio:'', cat:'',
    event:'', action:'', ip:'', isModalOpen:false,
    options:{'one':true, 'two':false, 'three':false}
  };

}

//modal open and close
  openModal = ()=> {
      this.setState({ isModalOpen: true })
    }

    closeModal =()=> {
      this.setState({ isModalOpen: false })
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

   //checkbox event handlers for modal window checkboxes
   handleCheck =(event)=> {
     console.log("just came in: "+this.state.options+" props value:: "+event.target.value)
     const options = this.state.options;
     let index
     options[event.target.value]=event.target.checked;
     console.log(options)
     // update the state with the new array of server options
     this.setState({ options: options });
   }


   //the "find" button call
   handleServiceCall =()=> {

    //call service
    this.getDataFromService('startDate='+this.state.startDate.format('YYYY-MM-DD[T]HH:mm:ss')+'Z'
  +'&endDate='+this.state.endDate.format('YYYY-MM-DD[T]HH:mm:ss')+'Z'
  +'&prio='+this.state.prio
  +'&cat='+this.state.cat
  +'&event='+this.state.event
  +'&action='+this.state.action
  +'&ip='+this.state.ip
  +'&servers='+this.state.options['one']+','+this.state.options['two']+','+this.state.options['three'])
}

    //calling the nodejs server with query params
    getDataFromService=(query)=>{
      return fetch('/api/getData?'+query)
      .then((response) => response.json())
      .then(responseJson => {
          // create an array of logs only with relevant data
          const newlogs =responseJson.map(c => {
            return (
              {"prio":c.prio, "time":c.time, "event":c.event, "cat":c.cat,
                "ip": c.ip, "message":c.message, "action":c.action}
            );
          });
          this.setState({logs:newlogs});
        })
        .catch(error => console.log(error));
    }


    //first time load.
  componentWillMount() {
    this.getDataFromService();
  }

  render() {
    //options configured for pagination
    const options={
      sizePerPage: 50,
      paginationPosition: 'top',
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
      <div className="row">
      <div className="col-sm-2" style={{'marginTop':'15px'}}><button className="btn btn-default" onClick={this.openModal}>Log Sources</button> </div>

      </div>
      <br/>
      <div className="form-group">
            {/* definition for  button "Log Sources" and modal component*/}

            <Modal isOpen={this.state.isModalOpen} onClose={this.closeModal}>
              <h1>Log Sources</h1>
              <form style={{"padding":"5px"}}>
              <div className="checkbox">
                <label><input type="checkbox" value="one"  onChange={this.handleCheck} defaultChecked={this.state.options['one']}/>Server 1</label><br/>
                <label><input type="checkbox" value="two"  onChange={this.handleCheck} defaultChecked={this.state.options['two']}/>Server 2</label><br/>
                <label><input type="checkbox" value="three"  onChange={this.handleCheck} defaultChecked={this.state.options['three']}/>Server 3</label>
                </div>
              </form>
              <p><button onClick={this.closeModal}>Close</button></p>
            </Modal>
          </div>


          {  /* definition for search criteria*/}
      <div id="searchBar">
      <div style={{'display': 'inline-block'}} >
        <DatePicker selected={this.state.startDate} onChange={this.handleStartDateChange}/>
        </div>
        <div style={{'display': 'inline-block','padding':'2px'}} >
          <label>to</label>
          </div>
        <div style={{'display': 'inline-block', 'padding':'5px'}} >
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
        <button className="btn btn-default" onClick={this.handleServiceCall}>Find</button>
        </div>
      </div>
      <br/><br/>

      {/* results table with pagination controls and sorting*/}
      <BootstrapTable ref='table' data={this.state.logs} striped hover condensed pagination options={options} >
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
