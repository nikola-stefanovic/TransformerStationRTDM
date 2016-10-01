var express = require('express');
var router = express.Router();
var db = require('../models/db_access.js');



//check autorzation before processing request
router.use(function(req, res, next){
  var sess = req.session;
  //if user isn't logged or does not have permission
  if(!sess.username || sess.role!="director"){
    //redirect to home page
    res.redirect("/");
    return;
  }
  next();
});

router.get("/", function(req, res){
  res.render('director');
});

module.exports = router;
