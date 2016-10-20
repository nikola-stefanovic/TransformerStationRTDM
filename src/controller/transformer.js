var express = require('express');
var router = express.Router();
var db = require('../models/db_access.js');

/**
 * Prikazuje stranicu listom svih transformatora.
 */
router.get("/list", function(req, res){
  //TODO: paginacija
  var offset = 1;
  var limit = 100;
  db.getTransformers(offset, limit, function(err, transformers, hasMore){
    if(err){
      console.log(err);
      return res.render("error",{errMsg:"Nije moguće pronaći transformatore."});
    }
    res.render('transformer/list',{transformers:transformers});
  });
});

/**
 * Prikazuje stranicu za dodavanje transformatora.
 */
router.get("/create", function(req, res){
  res.render("transformer/create");
});

/**
 * Prikazuje stranicu za izmenu informacija o transformatoru.
 */
router.get("/edit/:id", function(req, res){
  var trafo_id = req.params.id;
  db.getTransformerById(trafo_id, function(err,transformer){
    if(err){
      console.log(err);
      return res.render("error",{errMsg:"Nije moguća izmena transformatora."});
    }

    if(transformer.length != 1)
      res.render("error",{errMsg:"Nije pronađen transformator."});
    else
      res.render('transformer/edit',{transformer:transformer[0]});
  });
});


/**
 * Dodaje novi transformator.
 */
router.post("/create", function(req, res){
  var body = req.body;
  var location = body.location;
  var description = body.description;
  var transformer_id = body.transformer_id;
  var allowMonitoring = (body.monitoring == "on" ? 1 : 0);
  db.addTransformer(transformer_id, location, description, allowMonitoring, function(err){
      if(err){
        console.log("Greška!" + err);
        return res.render("error",{errMsg:"Neuspešno dodavanje transformatora."});
      }
      res.redirect("/director/transformer/list");
  });
});

/**
 * Apdejtuje transformator.
 */
router.post("/edit/:id", function(req, res){
  var body = req.body;
  var transformerId = req.params.id;
  var location = body.location;
  var description = body.description;
  var allowMonitoring = (body.monitoring == "on" ? 1 : 0);

  db.updateTransformer(transformerId, location, description, allowMonitoring, function(err){
    if(err){
      console.log("Greška!" + err);
      return res.redirect("error",{errMsg:"Neuspešna izmena transformatora."});
    }
    res.redirect("/director/transformer/list");
  });

});

/**
 * Briše transformator.
 */
router.get("/delete/:id", function(req, res){
  //delete transformer from database
  var trafo_id = req.params.id;
  db.deleteTransformer(trafo_id, function(err){
    if(err){
      console.log(err);
      return res.render("error",{errMsg:"Neuspešno brisanje transformatora."});
    }
    res.redirect("/director/transformer/list");
  });
});


module.exports = router;
