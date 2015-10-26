var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var course = require("../../API/course.js");
var striptags = require('striptags');
var dateformat = require('date-format-lite');
var prune = require('underscore.string/prune');
var router = express.Router();
var logger = require('../../logger');

// Search for a course.  If there is only one exact match redirect to the course details page
//  otherwise show the search results page.
router.get('/search', function(req, res, next){
  var params = {};
  params.page = {};
  params.partial = (req.query["partial"] == "true");
  params.searchCriteria = (typeof(req.query["search"])!='undefined' ? req.query["search"] : null);
  params.numRequested = (typeof(req.query["numRequested"])!='undefined' ? req.query["numRequested"] : null);
  params.cityState = (typeof(req.query["cityState"])!='undefined' ? req.query["cityState"] : null);
  params.categorySubject = (typeof(req.query["categorySubject"])!='undefined' ? req.query["categorySubject"] : null);
  params.selectedG2G = (typeof(req.query["selectedG2G"])!='undefined' ? req.query["selectedG2G"] : null);
  params.page.course = (typeof(req.query["page-course"])!='undefined' ? req.query["page-course"] : null);
  params.page.site = (typeof(req.query["page-site"])!='undefined' ? req.query["page-site"] : null);
  params.tab = (typeof(req.query["tab"])!='undefined' ? req.query["tab"] : null);
  var courseResult = {};
  var siteResult = {};
  var content = {};
  async.parallel([
    function(callback) {
      //if no search criteria param included, skip search
      if (params.searchCriteria === null) {
        callback();
        return;
      }
      course.performCourseSearch(function(response, error, result){
        courseResult = result;
        callback();
      }, params);
    },
    function(callback) {
      contentful.getCourseSearch(function(fields) {
        content = fields;
        callback();
      });
    },
    function(callback) {
    //if no search criteria param included, skip search
      if (params.searchCriteria === null) {
        callback();
          return;
      }
      course.performSiteSearch(function(response, error, result){
        siteResult = result;
        callback();
      }, params);
    }
    ], function(results) {
      if (courseResult && courseResult.exactMatch && !params.partial) {
        //redirect to course details
        logger.debug("Exact course match found for " + courseResult.courses[0].id + " - Redirecting.")
        var courseUrl = 'courses/' + courseResult.courses[0].id;
        if (params.cityState != null) {
          courseUrl = courseUrl + '?location=' + params.cityState
        }
        res.redirect(courseUrl);
      }
      else {
        //no search criteria given, this is a special case
        var noSearch = false;
        if (typeof(courseResult.numFound) == 'undefined' && typeof(siteResult.numFound) == 'undefined') {
          noSearch = true;
        }
        //update title of page
        var topTitle = "Search";
        if (params.searchCriteria != null) {
          topTitle = 'Results for ' + params.searchCriteria;
        }
        //handle current tab scenarios
        if ((courseResult.numFound == 0 || typeof(courseResult.numFound) == 'undefined') && siteResult.numFound > 0) {
          params.tab = 'site';
        } else if (params.tab == 'site' && siteResult && typeof(siteResult.numFound) == 'undefined') {
          params.tab = 'course';
        } else if (params.tab == null || params.tab == '') {
          params.tab = 'course';
        }
        //display search results page
        var render = { courseResult: courseResult,
          siteResult: siteResult,
          noSearch: noSearch,
          striptags: striptags,
          prune: prune,
          content: content,
          params: params,
          title: 'Search Results',
          topTitle: topTitle};
        if (params.partial && params.partial === true) {
          res.render('search/search_detail', render);
        }
        else {
          res.render('search/search', render);
        }
      }
    });
});
module.exports = router;
