var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var prune = require('underscore.string/prune');
var striptags = require('striptags');
var router = express.Router();
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
        data.news = response.items;
        callback();
     });
   },
   function(callback) {
     contentful.getTestimonial(function(response) {
       data.testimonial = response;
       callback();
    });
   },
 ], function(results) {
   res.render('index', { title: 'Graduate School',
    name: 'Home Page',
    slider: data.slider,
    news: data.news,
    testimonial: data.testimonial,
    striptags: striptags,
    prune: prune,
    homepage:true });
 });
});

module.exports = router;
