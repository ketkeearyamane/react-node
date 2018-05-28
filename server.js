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

app.get('/api/getData', (req, res) => {
console.log("reached nodejs code!!!");
var servers=[];
var queryString = '';
if(req.query.startDate) {
  queryString+="startTime="+req.query.startDate+'&'
}

if(req.query.endDate) {
  queryString+="endTime="+req.query.endDate+'&'
}

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
if(req.query.servers) {
  servers=req.query.servers.split(',');
  servers[0]=  (servers[0] === 'true');
  servers[1]=  (servers[1] === 'true');
  servers[2]=  (servers[2] === 'true');
}
else{
  servers =[true, true, true]
}
console.log("getting data from servers "+servers)
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
console.log("Query: "+queryParams)
// queryParams=encodeURIComponent(queryParams);
// console.log("Query: "+queryParams)

   var callers = {};
   if(servers[0]) {
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
   if(servers[1]) {
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
   if(servers[2]) {
     callers["three"] = function (callback) {
         request('http://localhost:4003/log?'+queryParams, function (error, response, body) {
             if (!error && response.statusCode == 200) {
                 callback(null, body);
             } else {
                 callback(true, {});
             }
         });
     };
   }
   async.parallel(callers, function (err, results) {
      var response=[];
      console.log(results)
      async.forEach(Object.keys(results), function(key, callback){
        response=response.concat(JSON.parse(results[key]))
        callback();
      }, function(){
        callbackFunction(response);
      })
   });
}


app.listen(port, () => console.log("Listening on port "+port));
