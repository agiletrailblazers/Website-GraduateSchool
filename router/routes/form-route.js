var express = require('express');
var contentfulForms = require('../../API/contentful_forms.js');
var contentful = require('../../API/contentful.js');
var course = require('../../API/course.js');
var async = require('async');
var router = express.Router();
var logger = require('../../logger');

// Bring this Course to Your Location
router.get('/forms/onsite-inquiry', function(req, res, next) {
	var fields;
	var courses;
	var locations;
	var states;
	async.parallel([
        function(callback) {
        	logger.debug('Get contentful fields');
        	contentfulForms.getInquiryForm(function(response) {
        		fields = response.fields;
        		callback();
        	});
        },
        function(callback) {
        	logger.debug('Get list of all courses');
        	course.getCourses(function(response, error, result) {
        		courses = result;
        		callback();
        	});
        },
        function(callback) {
        	logger.debug('Get list of all locations');
        	course.getLocations(function(response, error, result) {
        		locations = result;
        		callback();
        	});
        },
        function(callback) {
        	logger.debug("Get us states");
        	contentful.getReferenceData('us-states', function(result) {
        		states = result;
        		callback();
        	});
        }
    ], function(results) {
		res.render('forms/onsite_inquiry', {title: fields.title,
			topParagraph: fields.topParagraph,
			highlightedParagraph: fields.highlightedParagraph,
			hearAboutTraining: fields.howDidYouHearAboutTraining,
			relatedLinks: fields.relatedLinks,
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
    	  logger.debug(response);
    	  logger.debug("Subject Line:", response.cmsEntry.fields.subjectLine);
          res.render('forms/contact_us', {title: response.cmsEntry.fields.title,
        	  subjectLine: response.cmsEntry.fields.subjectLine,
						topParagraph: response.cmsEntry.fields.topParagraph,
						relatedLinks: response.cmsEntry.fields.relatedLinks
        	  });
        });
    });

//Get Request duplicate Form Page
router.get('/forms/request-duplicate-form', function (req, res, next) {
  var fields, states;
	var entryId	= "mlBs5OCiQgW84oiMm4k2s";
  async.parallel([
    function (callback) {
      logger.debug('Get contentful fields');
      contentfulForms.getFormWithHeaderAndFooter(function (response, entryId) {
        fields = response;
        callback();
      });
    },
    function (callback) {
      logger.debug("Get us states");
      contentful.getReferenceData('us-states', function (result) {
        states = result;
        callback();
      });
    }
  ], function (results) {
    res.render('forms/request_course_completion_certificate', {
      sectionTitle: fields.sectionTitle,
      sectionHeaderDescription: fields.sectionHeaderDescription,
      sectionFooterDescription: fields.sectionFooterDescription,
      title: fields.sectionTitle,
			relatedLinks: fields.relatedLinks,
      states: states
    });
  });
});

//Get Request duplicate Form Page
router.get('/forms/proctor-request-form', function (req, res, next) {
  var fields, states;
	var entryId = "JgpDPSNoe4kQGWIkImKAM";
  async.parallel([
    function (callback) {
      logger.debug('Get contentful fields');
      contentfulForms.getFormWithHeaderAndFooter(function(response, entryId) {
        fields = response;
        callback();
      });
    },
    function (callback) {
      logger.debug("Get us states");
      contentful.getReferenceData('us-states', function (result) {
        states = result;
        callback();
      });
    }
  ], function (results) {
    res.render('forms/proctor_request_form', {
      sectionTitle: fields.sectionTitle,
      sectionHeaderDescription: fields.sectionHeaderDescription,
      sectionFooterDescription: fields.sectionFooterDescription,
      title: "Proctor Request Form",
			relatedLinks: fields.relatedLinks,
      states: states
    });
  });
});

router.get('/forms/certificate-program-application', function (req, res, next) {
  var fields, states;
	var entryId = "KbQb89jHMWceeoKIGsSgw";
  async.parallel([
    function (callback) {
      logger.debug('Get contentful fields:');
      contentfulForms.getFormWithHeaderAndFooter(entryId, function(response) {
        fields = response;
				console.log(fields);
        callback();
      });
    },
    function (callback) {
      logger.debug("Get us states");
      contentful.getReferenceData('us-states', function (result) {
        states = result;
        callback();
      });
    }
  ], function (results) {
    res.render('forms/certificate_program_application', {
      sectionTitle: fields.sectionTitle,
      sectionHeaderDescription: fields.sectionHeaderDescription,
      sectionFooterDescription: fields.sectionFooterDescription,
      title: fields.sectionTitle,
			relatedLinks: fields.relatedLinks,
      states: states
    });
  });
});

module.exports = router;
