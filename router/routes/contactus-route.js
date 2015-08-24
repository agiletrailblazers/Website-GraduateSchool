var express = require('express');
var contentful = require("../../API/contentful_forms.js");
var async = require('async');
var router = express.Router();

// Get Contact Us page.
router.get('/forms/contact-us', function(req, res, next) {
  var spaceId = "tz32dajhh9bn";
      contentful.getContactUs(function(response) {
    	  console.log(response);
    	  console.log("Subject Line:", response.cmsEntry.fields.subjectLine);
          res.render('forms/contact_us', {title: response.cmsEntry.fields.title,
        	  subjectLine: response.cmsEntry.fields.subjectLine
        	  });
        });
    });

module.exports = router;
