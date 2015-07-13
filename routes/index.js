var express = require('express');
var contentful = require("../API/contentful.js");
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Graduate School', name: 'Home Page'});
});

// GET demo home page
router.get('/demo', function(req, res, next){
  res.render('demo_index', { });
});

// Get What's new page.
router.get('/whats-new', function(req, res, next){
  contentful.getWhatsNew(function(response){
    res.render('whats_new', { entry: response.fields });
  });
});

module.exports = router;
