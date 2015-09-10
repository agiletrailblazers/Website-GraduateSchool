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
router.get('/course-search', function(req, res, next){
    var params={};
    params.searchCriteria = req.query["search"];
    params.numRequested   = req.query["numRequested"] ;
    params.cityState      = req.query["cityState"] ;
  var searchResult;
  var content;
  var locationFacets={};

  async.parallel([
    function(callback) {
      course.performCourseSearch(function(response, error, result){
        searchResult = result;
        locationFacets = result.locationFacets;
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
      if (result && result.exactMatch) {
        //redirect to course details
        logger.debug("Exact course match found for " + result.courses[0].id + " - Redirecting.")
        res.redirect('courses/' + result.courses[0].id);
      }
      else {
        //display course search page
        logger.debug(content);
        res.render('course_search', { result: result, striptags: striptags, prune: prune, content: content, locationFacets: locationFacets, title: 'Search Results' });
      }
    });
});
// Get course details based off course code.
router.get('/courses/:course_id', function(req, res, next){
  var courseId = req.params.course_id;
  var courseData = {};
  var content;
  async.parallel([
    function(callback) {
      course.performExactCourseSearch(function(response, error, result) {
    	if (error || result == null) {
    		logger.error("Course not found")
    		courseData.session = {status: 404, text: "No courses found."}
    	}
    	else {
    		logger.debug(result);
    		courseData.class = result;
    	}
        callback();
      }, courseId);
    },
    function(callback) {
      function compare(a,b) {
        if (a.startDate < b.startDate)
          return -1;
        if (a.startDate > b.startDate)
          return 1;
        return 0;
      }
      course.getSchedule(function(response, error, result) {
        if (result != null) {
          courseData.session = result.sort(compare);
          // Changing dateFormat for all sessions.
          for (var i = 0; i < courseData.session.length; i++) {
            var iSession = courseData.session[i];
            iSession["startDate"] = courseData.session[i]["startDate"].date('MMM DD, YYYY');
            iSession["endDate"] = courseData.session[i]["endDate"].date('MMM DD, YYYY');
          }
          callback();
        } else {
          logger.error("No course sessions found for course: " + courseId);
          courseData.session = {status: 404, text: "No courses found."}
          callback();
        }
      }, courseId);
    },
    function(callback) {
      var entryName = courseId.toLowerCase().slice(0,-3);
      contentful.getSyllabus(entryName, function(response, error, result) {
        courseData.syllabus = response;
        callback();
      });
    },
    function(callback) {
      contentful.getCourseDetails(function(fields) {
        content = fields;
        callback();
      });
    }
  ], function(results) {
    if (courseData && courseData.class) {
    	if (courseData.class.code === null) {
    		code = courseData.class.id.slice(0,-3);
    		courseData.class.code = code;
    	}
      content.linksSection.forEach(function(link) {
        link.url = link.url.replace('[courseCode]', courseData.class.code);
      });
	    res.render('course_detail', { content: content, courseData: courseData, title: courseData.class.title });
    }
    else {
    	//handle error
      logger.error("Course not found: " + courseId)
    	res.render('error', { message: 'Sorry, course not found.', error: null });
    }
  });
});
module.exports = router;
