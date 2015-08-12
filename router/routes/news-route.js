var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var router = express.Router();

router.get('/news/:news_id', function(req, res, next){
  newsId = req.params.new_id;
  contentful.getNewsDetail(function(response){
    console.log("Made it here.");
  }, newsId)
});

module.exports = router;
