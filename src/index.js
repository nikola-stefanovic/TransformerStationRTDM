var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get("/", function(req, res, next){
  res.send("Pozdrav!");
});


http.listen(3000, function(){
  console.log("TransformerStationRTDM is listening on port 3000!");
});
