var express = require('express');
var contentful = require("../API/contentful.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: 'Arti'});
});

// GET demo home page
router.get('/demo', function(req, res, next){
  res.render('demo_index', { });
});

// Get What's new page.
router.get('/whats-new', function(req, res, next){
  contentful.getWhatsNew(function(response){
    console.log(response.fields)
    res.render('whats_new', { values: response.fields });
  });
});

module.exports = router;
