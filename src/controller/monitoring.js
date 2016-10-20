var router = require('express').Router();
var db = require('../models/db_access.js');

//check autorzation before processing a request
router.use(function(req, res, next){
  var sess = req.session;
  //if user isn't logged or does not have a permission
  if(!sess.username || sess.role!="operator"){
    //redirect to the home page
    res.redirect("/");
    return;
  }
  next();
});

/**
 * Prikazuje početnu stranicu operatora.
 */
router.get("/", function(req, res){
  res.render("operator/home");
});

/**
 * Prikaz stranice za pregled istorije merenja.
 */
router.get("/history", function(req, res){
  var operator_id = req.session.user_id;
  db.getOperatorsTransformers(operator_id, function(err, transformers){
    if(err){
      console.log(err);
      res.render('error',{errMsg:"Neuspešno učitanvanje liste transformatora!"});
    }
    var transformerDescription =[];
    for(var i=0; i<transformers.length; i++)
    {
      transformerDescription[i] = {name:transformers[i].ADDRESS, id:transformers[i].ID };
    }
    res.render("monitoring/history",{transfDesc:JSON.stringify(transformerDescription)});
  });
});

/**
 * Prikaz strane za prećenje u realnom vremenu.
 */
router.get("/real_time", function(req, res){
  //res.render("monitoring/real_time");
  var operator_id = req.session.user_id;
  db.getOperatorsTransformers(operator_id, function(err, transformers){
    if(err){
      console.log(err);
      res.render('error',{errMsg:"Neuspešno učitanvanje liste transformatora!"});
    }
    var transformerDescription =[];
    for(var i=0; i<transformers.length; i++)
    {
      transformerDescription[i] = {name:transformers[i].ADDRESS, id:transformers[i].ID };
    }
    res.render("monitoring/real_time",{transfDesc:JSON.stringify(transformerDescription)});
  });
});

//TODO: mislim da je ovo višak jer koristim samo POST metod
router.get("/loc-read-time/:location_id/:read_after/:read_before", function(req, res, next){
  var locationId = req.params.location_id;
  var readAfter = new Date(req.params.read_after);
  var readBefore = new Date(req.params.read_before);

  if(isNaN(readAfter) || isNaN(readBefore)){
    res.send(JSON.stringify({error:"Date format is not valid."}));
    return;
  }

  db.getByLocationAndReadTime(locationId,readAfter, readBefore, -1, function(err,data){
    if(err) return next(err);
    res.json(data);
  });
});

/**
 * Na POST zahtev vraća redove iz baze o izmerenim veličinama,
 * za određenu lokaciju i određeni vremenski interval.
 */
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

  db.getByLocationAndReadTimeCol(location_id,read_after, read_before, columns, -1, function(err,data){
    if(err) return next(err);
    res.json(data);
  });

});


/**
 * Prikazuje stranicu za promenu šifre.
 */
router.get("/login-config", function(req, res){
  var old_username = req.session.username;
  res.render("operator/login_config");
});

/**
 * Obrađuje zahtev za promenu šifre.
 */
router.post("/login-config", function(req, res){
  var username = req.session.username;
  var oldPassword = req.body.old_password;
  var newPassword = req.body.new_password;
  db.getUserByName(username, function(err, user){
    if(err || !user){
      console.log(err);
      return res.render("error",{errMsg:"Greška prilikom promene šifre."});
    }

    if(oldPassword != user.PASSWORD)
      return res.render("operator/login_config", {errorMsg:"Nevalidna stara šifra."});

    db.updateUser(username, username, newPassword, function(err){
      if(err){
        console.log(err);
        res.render("error",{errorMsg:"Nije moguće promeniti šifru."});
      }
      res.redirect("/logout");
    });
  });
});

module.exports = router;
