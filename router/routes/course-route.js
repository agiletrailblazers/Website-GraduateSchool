var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var course = require("../../API/course.js");
var striptags = require('striptags');
var dateformat = require('date-format-lite');
var prune = require('underscore.string/prune');
var router = express.Router();
var logger = require('../../logger');
var striptags = require('striptags');
var common = require("../../helpers/common.js");
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");

// Get course details based off course code.
router.get('/courses/:course_id', function(req, res, next){
  var courseId = req.params.course_id;
  var courseData = {};
  var content;
  var location = (typeof(req.query["location"])!='undefined' ? req.query["location"] : null);
  async.parallel([
    function(callback) {
      course.performExactCourseSearch(function(response, error, result) {
    	if (error || result == null) {
    		logger.error("Course not found")
    		courseData.session = {status: 404, text: "No courses found."}
    	}
    	else {
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
          courseData.session = []; //return empty array
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
      //check if we should initially filter courses by location
      courseData.session.forEach(function(session) {
        if (location == null || location === "" || location === 'all' || location === session.location["city"] + ', ' + session.location["state"]) {
          session.hide = false;
        }
        else {
          session.hide = true;
        }
      });
      content.linksSection.forEach(function(link) {
        link.url = link.url.replace('[courseCode]', courseData.class.code);
      });

      courseData.isLeadershipCourse = false;
      content.leadershipCourseCodes.forEach(function (currCode) {
        if (courseData.class.code === currCode) {
          courseData.isLeadershipCourse = true;
          courseData.leadershipCourseScheduleLinkText = content.leadershipCourseScheduleLinkText;
          courseData.leadershipCourseScheduleLink = content.leadershipCourseScheduleLink;
        }
      });

      var allowedHtmlTags = config("properties").allowedHtmlTags;
      if (common.isNotEmpty(courseData.class.description)) {
        // add empty string to avoid exception
        courseData.class.description.formatted = striptags(courseData.class.description.formatted + "", allowedHtmlTags);
      }

      // replace old urls specified within course overview  with new ones provided by graduate school
      var filter = new RegExp(config("urlMapping").filter,"g");
      courseData.class.description.formatted = courseData.class.description.formatted.replace(filter, '');
      var hrefURLs = [];
      courseData.class.description.formatted.replace(/href=("|')(.*?)("|')/g, function(a, b, hrefURL) {
        hrefURLs.push(hrefURL);
      });
      var urlMap = config("urlMapping").courseOverviewURLMappings;
      var codeIdURL = config("urlMapping").codeIdURL;
      hrefURLs.forEach(function(singleURL) {
        singleURL = singleURL.trim();
        if (common.isNotEmpty(urlMap[singleURL])) {
          courseData.class.description.formatted = courseData.class.description.formatted.replace(singleURL,urlMap[singleURL]);
        }else if ( common.isNotEmpty(singleURL) && singleURL.indexOf(codeIdURL)> -1 ) {
          courseData.class.description.formatted =
            courseData.class.description.formatted.replace(codeIdURL,urlMap[codeIdURL]);
        }
      });

      // add empty string to avoid exception
      courseData.class.objective = striptags(courseData.class.objective + "", allowedHtmlTags);
      // replace old urls specified within course objective  with new ones provided by graduate school
      courseData.class.objective = courseData.class.objective.replace(filter, '');
      urls = [];
      courseData.class.objective.replace(/href=("|')(.*?)("|')/g, function(a, b, singleUrl) {
        urls.push(singleUrl);
      });
      var objectiveUrlMap = config("urlMapping").courseObjectiveURLMappings;
      urls.forEach(function(singleURL) {
        singleURL = singleURL.trim();
        if (common.isNotEmpty(objectiveUrlMap[singleURL])) {
          courseData.class.objective = courseData.class.objective.replace(singleURL,objectiveUrlMap[singleURL]);
        }else if ( common.isNotEmpty(singleURL) && singleURL.indexOf(codeIdURL)> -1 ) {
          courseData.class.objective =
            courseData.class.objective.replace(codeIdURL,objectiveUrlMap[codeIdURL]);
        }
      });

      if (common.isNotEmpty(courseData.class.outcomes)) {
        courseData.class.outcomes.forEach(function(outcome) {
          // add empty string to avoid exception
          courseData.class.outcomes[courseData.class.outcomes.indexOf(outcome)] = striptags(outcome + "", allowedHtmlTags);
        });
      }

      if (common.isNotEmpty(courseData.syllabus)) {
        if (common.isNotEmpty(courseData.syllabus.fields)) {
          if (common.isNotEmpty(courseData.syllabus.fields.syllabusContent)) {
            // add empty string to avoid exception in case courseData.class.objective is null
            courseData.syllabus.fields.syllabusContent = striptags(courseData.syllabus.fields.syllabusContent + "", allowedHtmlTags);
          }
        }
      }

      res.render('course_detail', { content: content,
        courseData: courseData,
        title: 'Course Details',
        topTitle: courseData.class.title ,
        location: location
      });
    }
    else {
    	//handle error
      logger.error("Course not found: " + courseId)
    	res.render('error', { message: 'Sorry, course not found.', error: null });
    }
  });
});
module.exports = router;
