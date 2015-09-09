var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  contentful.getHomepageSlider(function(content) {
    res.render('index', { title: 'Graduate School', name: 'Home Page', slider: content });
  });
});

module.exports = router;
