var app = require("../app");
var io = app.io;

/**
 * Vrši komunikaciju sa klijentima preko soketa.
 * Predstavlja server u komunikaciji.
 */

io.on('connection', function(socket){
  console.log('Client connected');
});

io.on('disconnect', function (socket) {
  console.log("Client disconnected!");
});

/**
 * Omogućuje dodavanje podataka koji se trebaju proslediti klijentima.
 * Podaci se prosleđuju trenutno.
 * @param {String} locationId podaci se šalju samo klijentima koji su
 * pretplaćeni no  navedenu lokaciju
 * @param {[type]} data       podaci koji se prosleđuju klijentima
 */
exports.addData = function(locationId, data){
  //prosleđuje podatke klijentima koji su pretplaćengine na locationId
  io.emit(locationId, data);
  console.log("Poslati podaci za lokaciju " + locationId);
};
