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

      // add empty string to avoid exception in case courseData.class.objective is null
      courseData.class.description.formatted = striptags(courseData.class.description.formatted + "", '<br><a><p><i><u><ul><li><strong>');

      // add empty string to avoid exception in case courseData.class.objective is null
      courseData.class.objective = striptags(courseData.class.objective + "", '<br><a><p><i><u><ul><li><strong>');

      // add empty string to avoid exception in case courseData.class.objective is null
      courseData.class.outcomes.forEach(function(outcome) {
        courseData.class.outcomes[courseData.class.outcomes.indexOf(outcome)] = striptags(outcome + "", '<br><a><p><i><u><ul><li><strong>');
      });

      // add empty string to avoid exception in case courseData.class.objective is null
      courseData.syllabus.fields.syllabusContent = striptags(courseData.syllabus.fields.syllabusContent + "", '<br><a><p><i><u><ul><li><strong>');

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
