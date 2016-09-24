var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var body_parser = require('body-parser');

var db = require('./models/db_access.js');
var MeasurementController = require('./controller/measurement.js');
var UpdateReceiverController = require('./controller/update_receiver.js');
var HomeController = require('./controller/home');
var MonitoringController = require('./controller/monitoring');

//prepare objecc for accessing database
db.init(function(err){
  console.log(err);
});

//parse body inside post request
app.use(body_parser.json());

//define controllers
app.use('/',HomeController);
app.use('/monitoring',MonitoringController);
app.use('/measurement',MeasurementController);

//set template engine
app.set('views', __dirname + '/views')
app.set('view engine', 'pug');

//serve static files
app.use(express.static('public'));


app.get("/", function(res,req){
    res.sendFile(__dirname+'zoom.html');
});


http.listen(3000, function(){
  console.log("TransformerStationRTDM is listening on port 3000!");
});
