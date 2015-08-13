var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var router = express.Router();

router.get('/news/:news_slug', function(req, res, next){
  slug = req.params.news_slug;
  contentful.getNewsDetail(function(response){
    console.log("Made it here.");
  }, slug)
});

module.exports = router;
