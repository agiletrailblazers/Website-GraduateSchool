var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var async = require('async');
var prune = require('underscore.string/prune');
var logger = require('../../logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  data = {};
  async.parallel([
    function(callback) {
      contentful.getHomepageSlider(function(content) {
        data.slider = content;
        callback();
      });
    },
    function(callback) {
      contentful.getNewsRecent(function(response) {
        data.news = response;
        callback();
     });
   }
 ], function(results) {
   res.render('index', { title: 'Graduate School', name: 'Home Page', slider: data.slider, news: data.news, ​prune:prune, homepage:true });
 });
});

module.exports = router;
