var io = require('socket.io-client');
var db = require('../models/db_access.js');

var transformer_stations = 'http://localhost:4000';
var socket = io.connect(transformer_stations, {reconnect: true});

var transformer_locations = ['41', '42', '61', '90'];

// add a connect listener
socket.on('connect', function(socket) {
    console.log('Connected to ' + transformer_stations);
});

//set listener for each location
transformer_locations.forEach(function(location){
  socket.on(location,function(data){
  	var row = data[0];
  	console.log("Received update for location: " + location + "," + " row id: " + row.ID);

    if(db.isReady()){
      insertRandomValues(row);
      db.insertRow(row, function(err){if(err) console.log("Greska prilikom upisa:" + err);});
      console.log("Row inserted in database.")
    }else{
      console.log("Could not insert row!");
    }

  });
});


function insertRandomValues(row){
  row.IPAL = Math.random() * 100 + 1;
  row.IPAA = row.IPAL + Math.random()*10;
  row.IPAH = row.IPAA + Math.random()*10;

  row.IPBL = Math.random() * 100 + 1;
  row.IPBA = row.IPBL + Math.random()*10;
  row.IPBH = row.IPBA + Math.random()*10;

  row.IPCL = Math.random() * 100 + 1;
  row.IPCA = row.IPCL + Math.random()*10;
  row.IPCH = row.IPCA + Math.random()*10;
}
