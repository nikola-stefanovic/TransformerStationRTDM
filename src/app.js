var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var body_parser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require("cookie-parser");

var db = require('./models/db_access.js');
var MeasurementController = require('./controller/measurement.js');
var UpdateReceiverController = require('./controller/update_receiver.js');
var HomeController = require('./controller/home');
var OperatorController = require('./controller/operator.js');
var DirectorController = require('./controller/director.js');
var TransformerController = require('./controller/transformer.js');
var OperatorController = require('./controller/operator.js');
var MonitoringController = require('./controller/monitoring.js');


//prepare object for accessing database
db.init(function(err){
  console.log(err);
});

//body parser middleware
//it parses body inside post request
app.use(body_parser.json());
app.use(body_parser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//set session middleware
app.use(cookieParser());
app.use(expressSession({secret:'somesecrettokenhere', resave: true, saveUninitialized: true}));

//define controllers
app.use('/', HomeController);
app.use('/operator', OperatorController);
app.use('/measurement', MeasurementController);
app.use('/director', DirectorController);
app.use('/director/transformer', TransformerController);
app.use('/director/operator', OperatorController);
app.use('/monitoring', MonitoringController);

//set template engine
app.set('views', __dirname + '/views') //templates folder
app.set('view engine', 'pug');  //templates extension

//disable template caching - for debugging
app.disable('view cache');

//serve static files
app.use(express.static('public'));


http.listen(3000, function(){
  console.log("TransformerStationRTDM is listening on port 3000!");
});
