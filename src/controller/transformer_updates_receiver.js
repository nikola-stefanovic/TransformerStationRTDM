var ioClient = require('socket.io-client');
var db = require('../models/db_access.js');
var realTimeDataProvider = require('../models/real_time_data_provider.js');


var transformers_simulator = 'http://localhost:4000';
var socketClient = ioClient.connect(transformers_simulator, {reconnect: true});

//TODO: Učitaj lokacije iz baze
var transformer_locations = ['41', '42', '61', '90'];

/**
 * Funkcija koja se poziva kada se ova aplikacija kao klijent konektuje
 * na server, drugu NodeJS aplikaciju koja simulira mrežne uređaje.
 */
socketClient.on('connect', function(socket) {
    console.log('Connected to ' + transformers_simulator);
});

/**
 * Funkcija za prihvatanje podataka o merenjima u realnom vremenu. Podatke
 * prima od drugog NodeJS programa koji simulira merne urđaje u trafo stanicama.
 */
transformer_locations.forEach(function(location){
  socketClient.on(location, function(data){
  	var row = data[0];
  	console.log("Received update for transformer: " + location + "," + " row id: " + row.ID);
    insertRandomValues(row);
    realTimeDataProvider.addData(location, data);
    if(db.isReady()){
      //TODO: Preimenuj f-ju insertRow
      db.insertRow(row, function(err){
        if(err) return console.log("Could not insert row into database:" + err);
      });
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

  row.READ_TIME = new Date();
}
