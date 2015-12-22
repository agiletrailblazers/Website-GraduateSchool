var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var prune = require('underscore.string/prune');
var striptags = require('striptags');
var moment = require('moment');
var router = express.Router();
var logger = require('../../logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  data = {};
  async.parallel([
    function(callback) {
      contentful.getHomepageSlider(function(content, error) {
        if (error) {
            logger.warn(error);
            logger.warn('Ignoring error retrieving the Homepage Slider, displaying page anyways');
        }
        else {
            data.slider = content;
        }
        callback();
      });
    },
    function(callback) {
      contentful.getNewsRecent(function(response, error) {
        if (error) {
            logger.warn(error);
            logger.warn('Ignoring error retrieving the Homepage News, displaying page anyways');
        }
        else {
            data.news = response.items;
        }
        callback();
     });
   },
   function(callback) {
     contentful.getTestimonial(function(response, error) {
       if (error) {
         logger.warn(error);
         logger.warn('Ignoring error retrieving the Homepage Testimonials, displaying page anyways');
       }
       else {
         data.testimonial = response;
       }
       callback();
    });
  },
  function(callback) {
    contentful.getAlerts(function(items, error) {
      if (error) {
          logger.warn(error);
          logger.warn('Ignoring error retrieving the Homepage Alerts, displaying page anyways');
      }
      else {
          data.alert = null;
          var alertCookie = req.cookies.gsalert;
          if (items) {
              items.forEach(function (item) {
                  //check if this alerts has been dismissed by the user this session
                  if (alertCookie != item.fields.slug) {
                      if (moment().isBetween(new Date(item.fields.startDateTime), new Date(item.fields.endDateTime))) {
                          data.alert = item.fields;
                      }
                  }
              });
          }
      }
      callback();
   });
  }
 ], function(results) {
   res.render('index', { title: 'Graduate School',
    name: 'Home Page',
    slider: data.slider,
    news: data.news,
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

router.get('/pagenotfound', function(req, res, next) {
  res.render('404', {title: 'Page Not Found'});
});

router.get('/error', function(req, res, next) {
    res.render('ErrorPage', {title: 'Error retrieving page'});
});

router.get('/under-construction', function(req, res, next) {
  res.render('misc/under_construction', {title: 'Under Construction'});
});

module.exports = router;
