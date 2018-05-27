const express = require('express');

const app = express();
const port = 5000;
var request = require('request-promise');
var async = require('async');
var Client = require('node-rest-client').Client;
var client = new Client();
app.get('/', function(req, resp){
  resp.send("Welcome!")
})

app.get('/api/hello', (req, res) => {
console.log("reached nodejs code!!!" + req.query.prio);
var queryString = '';
if(req.query.prio) {
  queryString+="prio="+req.query.prio+'&'
}
if(req.query.cat) {
  queryString+="cat="+req.query.cat+'&'
}
if(req.query.action) {
  queryString+="action="+req.query.action+'&'
}
if(req.query.event) {
  queryString+="event="+req.query.event+'&'
}
if(req.query.ip) {
  queryString+="ip="+req.query.ip+'&'
}
var servers = [ 'two'] ;
//get data
serviceCall(queryString, servers, function (data) {
     res.send(data);
});

// direct way
// client.get("http://localhost:4003/log", function (data, response) {
//     res.send(data)
//});


});

function serviceCall(queryParams, servers, callbackFunction) {

   var callers = {};
   if(servers.indexOf('one') != -1) {
     callers["one"] = function (callback) {
         request('http://localhost:4001/log?'+queryParams, function (error, response, body) {
             if (!error && response.statusCode == 200) {
                 callback(null, body);
             } else {
                 callback(true, {});
             }
         });
     };
   }
   if(servers.indexOf('two') != -1) {
     callers["two"] = function (callback) {
         request('http://localhost:4002/log?'+queryParams, function (error, response, body) {
             if (!error && response.statusCode == 200) {
                 callback(null, body);
             } else {
                 callback(true, {});
             }
         });
     };
   }
   async.parallel(callers, function (err, results) {
       // results is now equals to: {one: 1, two: 2}
       var response = null;
      //this is lame code.
       var count = Object.keys(results).length;
       var i=0;

       Object.keys(results).forEach((key) => {
        if(response==null){
          response=JSON.parse(results[key]);
        }else{
          console.log('here')
          response.concat(JSON.parse(results[key]));
        }
        i++;
        if(i === count){
          console.log(response.length);
          callbackFunction(response);
        }
      });
   });
}


app.listen(port, () => console.log("Listening on port "+port));
