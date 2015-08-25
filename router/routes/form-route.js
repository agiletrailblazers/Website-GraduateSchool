var express = require('express');
var contentfulForms = require('../../API/contentful_forms.js');
var contentful = require('../../API/contentful.js');
var course = require('../../API/course.js');
var async = require('async');
var router = express.Router();

// Bring this Course to Your Location
router.get('/forms/onsite-inquiry', function(req, res, next) {
	var fields;
	var courses;
	var locations;
	var states;
	async.series([
        function(callback) {
        	console.log('Get contentful fields');
        	contentfulForms.getInquiryForm(function(response) {
        		fields = response.fields;
        		callback();
        	});
        },
        function(callback) {
        	console.log('Get list of all courses'); 
        	course.getCourses(function(response, error, result) {
        		courses = result;
        		callback();
        	});
        },
        function(callback) {
        	console.log('Get list of all locations'); 
        	course.getLocations(function(response, error, result) {
        		locations = result;
        		callback();
        	});
        },
        function(callback) {
        	console.log("Get us states");
        	contentful.getReferenceData('us-states', function(result) {
        		states = result;
        		callback();
        	});
        }
    ], function(results) {
		res.render('forms/courses/onsite_inquiry', {title: fields.title, 
			topParagraph: fields.topParagraph,
			highlightedParagraph: fields.highlightedParagraph,
			gsReference: fields.howDidYouHearAboutTraining,
			prefix: fields.namePrefix,
			courses: courses, 
			locations: locations, 
			states: states});
	});
});

//Get Contact Us page.
router.get('/forms/contact-us', function(req, res, next) {
  var spaceId = "tz32dajhh9bn";
  contentfulForms.getContactUs(function(response) {
    	  console.log(response);
    	  console.log("Subject Line:", response.cmsEntry.fields.subjectLine);
          res.render('forms/contact_us', {title: response.cmsEntry.fields.title,
        	  subjectLine: response.cmsEntry.fields.subjectLine
        	  });
        });
    });

module.exports = router;
