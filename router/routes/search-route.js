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
  params.partial = (req.query["partial"] == "true");
  params.searchCriteria = (typeof(req.query["search"])!='undefined' ? req.query["search"] : null);
  params.numRequested = (typeof(req.query["numRequested"])!='undefined' ? req.query["numRequested"] : null);
  params.cityState = (typeof(req.query["cityState"])!='undefined' ? req.query["cityState"] : null);
  params.selectedG2G = (typeof(req.query["selectedG2G"])!='undefined' ? req.query["selectedG2G"] : null);
  params.page = (typeof(req.query["page"])!='undefined' ? req.query["page"] : null);
  var courseResult;
  var content;

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
    }
    ], function(results) {
      if (courseResult && courseResult.exactMatch && !params.partial) {
        //redirect to course details
        logger.debug("Exact course match found for " + courseResult.courses[0].id + " - Redirecting.")
        res.redirect('courses/' + courseResult.courses[0].id);
      }
      else {
        //no search criteria given, this is a special case
        var noSearch = false;
        if (typeof(courseResult) == 'undefined') {
          noSearch = true;
        }
        //update title of page
        var topTitle = "Search";
        if (params.searchCriteria != null) {
          topTitle = 'Results for ' + params.searchCriteria;
        }
        //display search results page
        var render = { courseResult: courseResult,
          tab: params.tab,
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
