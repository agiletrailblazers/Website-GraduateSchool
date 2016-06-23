var express = require('express');
var contentfulForms = require('../../API/contentful_forms.js');
var contentful = require('../../API/contentful.js');
var session = require("../../API/manage/session-api.js");
var course = require('../../API/course.js');
var async = require('async');
var router = express.Router();
var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");

// Bring this Course to Your Location
router.get('/forms/onsite-inquiry', function(req, res, next) {
  var fields, courses, states;
  async.parallel([
    function(callback) {
      logger.debug('Get contentful fields');
      contentfulForms.getInquiryForm(function(response, error) {
        if(error){
          logger.error('Could not get inquiry form fields. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          fields = response.fields;
          callback();
        }
      });
    },
    function(callback) {
      logger.debug('Get list of all courses');
      course.getCourses(function(response, error, result) {
        if(error){
          logger.error('Could not get list of courses for inquiry form. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          courses = result;
          callback();
        }
      }, session.getSessionData(req, "authToken"));
    },
    function(callback) {
      logger.debug("Get us states");
      contentful.getReferenceData('us-states', function(result, error) {
        if(error){
          logger.error('Could not get list of U.S states for inquiry form. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          states = result;
          callback();
        }
      });
    }
  ], function(results) {
    res.render('forms/onsite_inquiry', {
      pageSearchPriority: convertPageSearchPriorityToString(config("pageSearchPriority").forms),
      title: fields.title,
      topParagraph: fields.topParagraph,
      highlightedParagraph: fields.highlightedParagraph,
      hearAboutTraining: fields.howDidYouHearAboutTraining,
      relatedLinks: fields.relatedLinks,
      prefix: fields.namePrefix,
      courses: courses,
      states: states,
      skipReCaptcha : config("properties").skipReCaptchaVerification
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
      contentfulForms.getFormWithHeaderAndFooter(entryId, function(response, error) {
        if(error){
          logger.error('Could not get section title, description and related links for request-duplicate-form. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          cmsEntry = response;
          callback();
        }
      });
    },
    function(callback) {
      logger.debug("Get us states");
      contentful.getReferenceData('us-states', function(result, error) {
        if(error){
          logger.error('Could not get list of U.S states for request-duplicate-form. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          states = result;
          callback();
        }
      });
    }
  ], function(results) {
    //add error handling
    res.render('forms/request_course_completion_certificate', {
      pageSearchPriority: convertPageSearchPriorityToString(config("pageSearchPriority").forms),
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
      contentfulForms.getFormWithHeaderAndFooter(entryId, function(response, error) {
        if(error){
          logger.error('Could not get section title, description and related links for proctor-request-form. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          cmsEntry = response;
          callback();
        }
      });
    },
    function(callback) {
      logger.debug("Get us states");
      contentful.getReferenceData('us-states', function(result, error) {
        if(error){
          logger.error('Could not get list of U.S states for proctor_request_form. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          states = result;
          callback();
        }
      });
    }
  ], function(results) {
    res.render('forms/proctor_request_form', {
      pageSearchPriority: convertPageSearchPriorityToString(config("pageSearchPriority").forms),
      sectionHeaderDescription: cmsEntry.fields.sectionHeaderDescription,
      sectionFooterDescription: cmsEntry.fields.sectionFooterDescription,
      title: cmsEntry.fields.sectionTitle,
      relatedLinks: cmsEntry.fields.relatedLinks,
      states: states
    });
  });
});

router.get(
  ['/forms/feedback', '/forms/contact-us'],
  function(req, res, next) {
  var fields, whichForm;
  if (req.url.indexOf("/forms/feedback") > -1 ) {
    whichForm = "feedback";
  } else {
    whichForm = "contact-us";
  }
  async.parallel([
    function(callback) {
      contentfulForms.getContactUs(function(response, error) {
        if(error){
          logger.error('Could not get feedback form details like title, description and related links. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          fields = response.fields;
          callback();
        }

      });
    }
  ], function(results) {
    res.render('forms/customer_form', {
      pageSearchPriority: convertPageSearchPriorityToString(config("pageSearchPriority").forms),
      title: fields.title,
      subjectLine: fields.subjectLine,
      topParagraph: fields.topParagraph,
      selectedForm: whichForm,
      relatedLinks: fields.relatedLinks,
      skipReCaptcha : config("properties").skipReCaptchaVerification
    });
  });
});

router.get(
  ['/forms/certificate-program-application', '/forms/certificate-program-progress-report',
    '/forms/certificate-completion', '/forms/certificate-program-waiver-request'
  ],
  function(req, res, next) {
    var entryId, fields, states;
    var dataGroupId = '6bC5G37EOssooK4K2woUyg';
    if (req.url.indexOf("/forms/certificate-program-application") > -1 ) {
      entryId = "3GzxTDiq5WEGguqwIou2O2";
    } else if (req.url.indexOf("/forms/certificate-program-progress-report") > -1 ) {
      entryId = "344ZZC7odi62ouoyOg4s6I";
    } else if (req.url.indexOf("/forms/certificate-completion") > -1 ) {
      entryId = "fxHBffYYx2ekiYkIEu8WK";
    } else if (req.url.indexOf("/forms/certificate-program-waiver-request") > -1 ) {
      entryId = "2M0BN2PEn6YyU0YWoimikI";
    }
    async.parallel([
      function(callback) {
        contentfulForms.getFormWithHeaderAndFooter(entryId, function(response, error) {
          if(error){
            logger.error('Could not get section title, description and related links for certificate_program_forms. Redirecting to error page', error);
            common.redirectToError(res);
          }
          else{
            fields = response.fields;
            callback();
          }
        });
      },
      function(callback) {
        logger.debug("Get us states");
        contentful.getReferenceData('us-states', function(result, error) {
          if(error){
            logger.error('Could not get list of U.S states for certificate_program_forms. Redirecting to error page', error);
            common.redirectToError(res);
          }
          else{
            states = result;
            callback();
          }
        });
      },
      function(callback) {
        logger.debug("Getting certificate program information");
        contentful.getDataGrouping(dataGroupId, function(response, error) {
          if(error){
            logger.error('Could not get list of certificate program information and its a mandatory field too. Redirecting to error page', error);
            common.redirectToError(res);
          }
          else{
            selectBoxData = response;
            callback();
          }

        });
      }
    ], function(results) {
      res.render('forms/certificate_program_forms', {
        pageSearchPriority: convertPageSearchPriorityToString(config("pageSearchPriority").tainingAndDevForms),
        title: fields.sectionTitle,
        sectionHeaderDescription: fields.sectionHeaderDescription,
        states: states,
        selectBox: selectBoxData,
        url: req.url
      });
    });
  });

module.exports = router;
