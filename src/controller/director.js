var express = require('express');
var router = express.Router();
var db = require('../models/db_access.js');



//check autorzation before processing a request
router.use(function(req, res, next){
  var sess = req.session;
  //if user isn't logged or does not have a permission
  if(!sess.username || sess.role!="director"){
    //redirect to the home page
    res.redirect("/");
    return;
  }
  next();
});

router.get("/", function(req, res){
  res.render('director/home');
});

router.get("/login-config", function(req, res){
  var username = req.session.username;
  res.render("director/login_config",{username:username});
});


router.post("/login-config", function(req, res){
  var old_username = req.session.username;
  var new_username = req.body.username;
  var new_password = req.body.password;
  db.updateUser(old_username, new_username, new_password, function(err){
    if(err){
      console.log(err);
      res.render("error",{errMsg:"Neuspešna promena šifre."});
    }
  });
  res.redirect("/logout");
});
module.exports = router;
