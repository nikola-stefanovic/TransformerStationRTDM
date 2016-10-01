var express = require('express');
var router = express.Router();

var diagramCount = 1;
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Monitoring request.');
  next();
});


router.get("/", function(req, res){
  res.render('monitoring', { title: 'Hey', dgContainer: 'diagram'+diagramCount});
  diagramCount++;
});




module.exports = router;
