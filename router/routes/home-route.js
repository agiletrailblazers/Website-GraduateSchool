var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var prune = require('underscore.string/prune');
var striptags = require('striptags');
var moment = require('moment');
var router = express.Router();
var logger = require('../../logger');
var facebook = require('../../API/facebook.js');
var twitter = require('../../API/twitter.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  data = {};
  async.parallel([
    function(callback) {
      facebook.getFacebookPosts(function(posts) {
        data.facebookPosts = posts;
        console.log(posts);
        callback();
      });
    },
    function(callback) {
      twitter.getTwitterTweets(function(tweets) {
        data.tweets = tweets;
        callback();
      });
    },
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
  function(callback) {
    contentful.getAlerts(function(items) {
      data.alert = null;
      var alertCookie = req.cookies.gsalert;
      if (items) {
        items.forEach(function(item) {
          //check if this alerts has been dismissed by the user this session
          if (alertCookie != item.fields.slug) {
            if(moment().isBetween(new Date(item.fields.startDateTime), new Date(item.fields.endDateTime))) {
              data.alert = item.fields;
            }
          }
        });
      }
      callback();
   });
  }
 ], function(results) {
   res.render('index', { title: 'Graduate School',
    name: 'Home Page',
    slider: data.slider,
    news: data.news,
    facebook: data.facebookPosts,
    tweets: data.tweets,
    testimonial: data.testimonial,
    alert: data.alert,
    striptags: striptags,
    prune: prune,
    homepage:true });
 });
});

//used to write a cookie to prevent the alert from showing again
router.get('/alert-dismiss', function(req, res, next) {
  var slug = req.query["slug"];
  if (typeof(slug) != 'undefined') {
    //write cookie so we don't show it for the rest of the session
    res.cookie('gsalert', slug, {});
    res.status(200).send();
  }
  else {
    res.status(404).send('{"error":"parameter of slug not provided"}');
  }
});

//show a page not found page
router.get('/pagenotfound', function(req, res, next) {
  logger.error("Page not found");
  res.render('404', {title: 'Page Not Found'});
});

module.exports = router;
