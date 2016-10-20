var express = require('express');
var router = express.Router();
var db = require('../models/db_access.js');

/**
 * Prikazuje stranu za logovanje ukoliko korisnik nije logovan
 * ili odgovarajuću početnu stranicu, u zavisnosti od autorizacije.
 */
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

/**
 * Obrađuje zahtev za logovanje.
 */
router.post("/login",function(req, res){
  //get variables from body of post request
  var name = req.body.username;
  var password = req.body.password;
  var sess = req.session;

  //find user in database
  db.getUserByName(name, function(err, user){
    if(err){
      //databse error
      console.log(err);
      return res.render('home', { errorMsg: 'Greška na serveru!', username: ""});
    }

    //check if login is correct
    if(user && user.PASSWORD == password){
      //set session
      sess.username = name;
      sess.role = user.ROLE;
      sess.user_id = user.ID;
      //redirect to another page
      if(user.ROLE == 'director')
        res.redirect("/director");
      else
        res.redirect("/monitoring");
    }else {
      //invalid login
      res.render('home', { errorMsg: 'Korisničko ime ili šifra nije validna!', username: name});
    }

  });
});

/**
 * Odjavljuje korisnika.
 */
router.get("/logout", function(req, res){
  var sess = req.session;
  if(sess.username){
    //clear session
    sess.destroy();
  }
  res.redirect("/");
});

module.exports = router;
