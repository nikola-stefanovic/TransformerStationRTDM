var express = require('express');
var router = express.Router();
var db = require('../models/db_access.js');


//show page with details about operators
router.get("/list", function(req, res){
  //TODO: paginacija
  var offset = 0;
  var limit = 100;
  db.getOperators(offset, limit, function(err, operators, hasMore){
    if(err){
      console.log(err);
      return res.render("error",{errMsg:"Nije moguće pronaći operatore."});
    }

    res.render('operator/list',{operators:operators});
  });
});

//show 'create' page
router.get("/create", function(req, res){
  res.render("operator/create");
});

//show 'edit' page
router.get("/edit/:name", function(req, res){

  var operator_name = req.params.name;//sesija
  db.getUserByName(operator_name, function(err,operators){
    if(err){
      console.log(err);
      return res.render("error",{errMsg:"Nije moguća izmena operatora."});
    }

    if(operators.length != 1)
      res.render("error",{errMsg:"Nije pronađen operator."});
    else
      res.render('operator/edit',{operator:operators[0]});
  });
});



//insert operator in database
router.post("/create", function(req, res){
  var body = req.body;
  var username = body.username;
  var password = body.password;
  db.getUserByName(username, function(err, user){
    if(err){
      console.log("Greška!" + err);
      return res.render("error",{errMsg:"Neuspešno dodavanje operatora."});
    }
    console.log("Users:" + JSON.stringify(user));
    if(user.length != 0)
      return res.render("error",{errMsg:"Operator postoji."});
    //if operator doesn't exist
    //add new operator to database
    db.addUser(username, password, "operator", function(err){
        if(err){
          console.log("Greška!" + err);
          return res.render("error",{errMsg:"Neuspešno dodavanje operatora."});
        }
        res.redirect("/director/operator/list");
    });
  });

});

//update operator in database
router.post("/edit", function(req, res){
  var body = req.body;
  var newusername = body.username;
  var oldusername = body.oldusername;
  var password = body.password;

  db.updateUser(oldusername, newusername, password, function(err){
    if(err){
      console.log("Greška!" + err);
      return res.redirect("error",{errMsg:"Neuspešna izmena transformatora."});
    }
    console.log("korisnik apdejtovan!");
    res.redirect("/director/operator/list");
  });

});

//delete transformer in database
router.get("/delete/:username", function(req, res){
  //delete transformer from database
  var username = req.params.username;
  db.deleteUser(username, function(err){
    if(err){
      console.log(err);
      return res.render("error",{errMsg:"Neuspešno brisanje transformatora."});
    }
    res.redirect("/director/operator/list");
  });
});


module.exports = router;
