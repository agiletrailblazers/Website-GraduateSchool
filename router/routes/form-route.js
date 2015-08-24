var express = require('express');
var contentfulForms = require('../../API/contentful_forms.js');
var course = require('../../API/course.js');
var async = require('async');
var router = express.Router();

// Bring this Course to Your Location
router.get('/forms/onsite-inquiry', function(req, res, next) {
	var fields;
	var courses;
	var locations;
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
        }
    ], function(results) {
		res.render('forms/courses/onsite_inquiry', {topParagraph: fields.topParagraph,
			highlightedParagraph: fields.highlightedParagraph,
			gsReference: fields.howDidYouHearAboutTraining,
			prefix: fields.namePrefix,
			courses: courses, 
			locations: locations});
	});
});

module.exports = router;
