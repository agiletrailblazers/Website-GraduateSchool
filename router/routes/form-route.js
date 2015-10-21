var express = require('express');
var contentfulForms = require('../../API/contentful_forms.js');
var contentful = require('../../API/contentful.js');
var course = require('../../API/course.js');
var async = require('async');
var router = express.Router();
var logger = require('../../logger');

// Bring this Course to Your Location
router.get('/forms/onsite-inquiry', function(req, res, next) {
  var fields, courses, locations, states;
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
    res.render('forms/onsite_inquiry', {
      title: fields.title,
      topParagraph: fields.topParagraph,
      highlightedParagraph: fields.highlightedParagraph,
      hearAboutTraining: fields.howDidYouHearAboutTraining,
      relatedLinks: fields.relatedLinks,
      prefix: fields.namePrefix,
      courses: courses,
      locations: locations,
      states: states
    });
  });
});

//Get Contact Us page.
router.get('/forms/contact-us', function(req, res, next) {
  contentfulForms.getContactUs(function(response) {
    res.render('forms/contact_us', {
      title: response.fields.title,
      subjectLine: response.fields.subjectLine,
      topParagraph: response.fields.topParagraph,
      relatedLinks: response.fields.relatedLinks
    });
  });
});

//Get Request duplicate Form Page
router.get('/forms/request-duplicate-form', function(req, res, next) {
  var cmsEntry, states;
  var entryId = "mlBs5OCiQgW84oiMm4k2s";
  async.parallel([
    function(callback) {
      logger.debug('Get contentful fields');
      contentfulForms.getFormWithHeaderAndFooter(entryId, function(response) {
        cmsEntry = response;
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
    //add error handling
    res.render('forms/request_course_completion_certificate', {
      sectionTitle: cmsEntry.fields.sectionTitle,
      sectionHeaderDescription: cmsEntry.fields.sectionHeaderDescription,
      sectionFooterDescription: cmsEntry.fields.sectionFooterDescription,
      title: cmsEntry.fields.sectionTitle,
      relatedLinks: cmsEntry.fields.relatedLinks,
      states: states
    });
  });
});

//Get Proctor Request Form Page
router.get('/forms/proctor-request-form', function(req, res, next) {
  var cmsEntry, states;
  var entryId = "JgpDPSNoe4kQGWIkImKAM";
  async.parallel([
    function(callback) {
      logger.debug('Get contentful fields');
      contentfulForms.getFormWithHeaderAndFooter(entryId, function(response) {
        cmsEntry = response;
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
    res.render('forms/proctor_request_form', {
      sectionTitle: cmsEntry.fields.sectionTitle,
      sectionHeaderDescription: cmsEntry.fields.sectionHeaderDescription,
      sectionFooterDescription: cmsEntry.fields.sectionFooterDescription,
      title: "Proctor Request Form",
      relatedLinks: cmsEntry.fields.relatedLinks,
      states: states
    });
  });
});

router.get('/forms/feedback', function(req, res, next) {
  var fields;
  async.parallel([
    function(callback) {
      contentfulForms.getContactUs(function(response) {
        fields = response.fields;
        callback();
      });
    }
  ], function(results) {
    res.render('forms/customer_form', {
      title: fields.title,
      subjectLine: fields.subjectLine,
      topParagraph: fields.topParagraph,
      relatedLinks: fields.relatedLinks
    });
  });
});

router.get(
  ['/forms/certificate-program-application', '/forms/certificate-program-progress-report',
    '/forms/certificate-completion', '/forms/certificate-program-waiver-request'
  ],
  function(req, res, next) {
    var entryId, fields, states;
    var dataGroupID = '6bC5G37EOssooK4K2woUyg';
    if (req.url === '/forms/certificate-program-application') {
      entryId = "3GzxTDiq5WEGguqwIou2O2";
    } else if (req.url === '/forms/certificate-program-progress-report') {
      entryId = "344ZZC7odi62ouoyOg4s6I";
    } else if (req.url === '/forms/certificate-completion') {
      entryId = "fxHBffYYx2ekiYkIEu8WK";
    } else if (req.url === '/forms/certificate-program-waiver-request') {
      entryId = "2M0BN2PEn6YyU0YWoimikI";
    }
    async.parallel([
      function(callback) {
        contentfulForms.getFormWithHeaderAndFooter(entryId, function(response) {
          fields = response.fields;
          callback();
        });
      },
      function(callback) {
        logger.debug("Get us states");
        contentful.getReferenceData('us-states', function(result) {
          states = result;
          callback();
        });
      },
      function(callback) {
        logger.debug("Getting certificate program information");
        var entryId = "6bC5G37EOssooK4K2woUyg";
        contentful.getDataGrouping(entryId, function(response) {
          selectBoxData = response;
          callback();
        });
      }
      // TODO: Unit testing for new forms (is this really needed since it uses a previous funtion?)
      // TODO: Unit testing for data grouping function.
    ], function(results) {
      res.render('forms/certificate_program_forms', {
        title: fields.sectionTitle,
        sectionHeaderDescription: fields.sectionHeaderDescription,
        states: states,
        selectBox: selectBoxData,
        url: req.url
      });
    });
  });

module.exports = router;
