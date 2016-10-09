var router = require('express').Router();
var db = require('../models/db_access.js');

maxNumOfRows = 1000;
//TODO: iskomentariši i izbaci višak

router.get("/history", function(req, res){
  //TODO:učitaj listu transformatora za korisnika i prosledi je
  db.getAllTransformers(function(err, transformers){
    if(err){
      console.log(err);
      res.render('error',{errMsg:"Neuspešno učitanvanje liste transformatora!"});
    }
    console.log("Lista transformers: " + JSON.stringify(transformers));
    res.render("monitoring/history",{'transformers':transformers});
  });

});

router.get("/real_time", function(req, res){
  res.render("monitoring/real_time")
});

//find rows by location id and read time interval
router.get("/loc-read-time/:location_id/:read_after/:read_before", function(req, res, next){
  var locationId = req.params.location_id;
  var readAfter = new Date(req.params.read_after);
  var readBefore = new Date(req.params.read_before);

  if(isNaN(readAfter) || isNaN(readBefore)){
    res.send(JSON.stringify({error:"Date format is not valid."}));
    return;
  }

  db.getByLocationAndReadTime(locationId,readAfter, readBefore, maxNumOfRows, function(err,data){
    if(err) return next(err);
    res.json(data);
  });
});

//find rows by location id and read time interval
router.post("/", function(req, res, next){
  var body = req.body;
  var location_id = body.location_id;
  var read_after = new Date(body.read_after);
  var read_before = new Date(body.read_before);
  var columns = body.columns;

  console.log("Body: " + JSON.stringify(body));

  if(isNaN(read_after) || isNaN(read_before)){
    res.send(JSON.stringify({error:"Date format is not valid."}));
    return;
  }

  if(!columns){
    columns = [];
  }

  db.getByLocationAndReadTimeCol(location_id,read_after, read_before, columns, maxNumOfRows, function(err,data){
    if(err) return next(err);
    res.json(data);
  });

});





module.exports = router;
