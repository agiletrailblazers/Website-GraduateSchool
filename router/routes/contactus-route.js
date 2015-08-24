var express = require('express');
var contentful = require("../../API/contentful.js");
var async = require('async');
var router = express.Router();

// Get Contact Us page.
router.get('/forms/contact-us', function(req, res, next) {
  var spaceId = "tz32dajhh9bn";
  contentful.getContactUs(function(response) {
    res.render('forms/contact_us', {title: response.cmsEntry.fields.title});
  });
});

module.exports = router;
