var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var course = require("../../API/course.js");
var striptags = require('striptags');
var dateformat = require('date-format-lite');
var prune = require('underscore.string/prune');
var router = express.Router();
var logger = require('../../logger');

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
        console.log("printed results");
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

      courseData.isLeaderShipCourse = false;
      content.leadershipCourseCodes.forEach(function (currCode) {
        if (courseData.class.code === currCode) {
          courseData.isLeaderShipCourse = true;
          courseData.leadershipCourseScheduleLinkText = content.leadershipCourseScheduleLinkText;
          courseData.leadershipCourseScheduleLink = content.leadershipCourseScheduleLink;
        }
      });

	    res.render('course_detail', { content: content,
        courseData: courseData,
        title: 'Course Details',
        topTitle: courseData.class.title });
    }
    else {
    	//handle error
      logger.error("Course not found: " + courseId)
    	res.render('error', { message: 'Sorry, course not found.', error: null });
    }
  });
});
module.exports = router;
