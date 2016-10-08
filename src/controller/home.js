var express = require('express');
var router = express.Router();
var db = require('../models/db_access.js');

//request to http://localhost:3000/
router.get("/", function(req, res){
  var sess = req.session;
  //check if the session exist
  if(sess.username){
    //user is logged, redirect to the main page
    if(sess.username && sess.role == "director"){
      res.redirect('/director');
    }else if(sess.role == "operator") {
      res.redirect('/monitoring');
    }else{
      console.log("HomeController: "+ sess.username + " " + sess.role);
    }
  }else{
    //show login page
    res.render('home', { errorMsg: '', username: ''});
  }
});


router.post("/login",function(req, res){
  //get variables from body of post request
  var name = req.body.username;
  var password = req.body.password;
  var sess = req.session;

  //find user in database
  db.getUserByName(name, function(err, users){
    if(err){
      //databse error
      console.log(err);
      return res.render('home', { errorMsg: 'Greška na serveru!', username: ""});
    }

    //check if login is correct
    if(users.length == 1 && users[0].PASSWORD == password){
      //set session
      sess.username = name;
      sess.role = users[0].ROLE;
      //redirect to another page
      if(users[0].ROLE == 'director')
        res.redirect("/director");
      else
        res.redirect("/monitoring");
    }else {
      //invalid login
      res.render('home', { errorMsg: 'Korisničko ime ili šifra nije validna!', username: name});
    }

  });
});

//request to http://localhost:3000/logout
router.get("/logout", function(req, res){
  var sess = req.session;
  if(sess.username){
    //clear session
    sess.destroy();
  }
  res.redirect("/");
});

module.exports = router;
