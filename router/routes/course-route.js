var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var course = require("../../API/course.js");
var striptags = require('striptags');
var dateformat = require('date-format-lite');
var router = express.Router();


// Search for a course.  If there is only one exact match redirect to the course details page
//  otherwise show the search results page.
router.get('/course-search', function(req, res, next){
  var searchCriteria = req.query["search"];
  course.performCourseSearch(function(response, error, result){
    //TODO: how do we globally handle error's and send to an error page?
    if (result && result.exactMatch) {
      //redirect to course details
      console.log("Exact course match found for " + result.courses[0].id + " - Redirecting.")
      res.redirect('courses/' + result.courses[0].id);
    }
    else {
      //display course search page
      res.render('course_search', { title: 'Course Search', result: result });
    }
  }, searchCriteria);
});

// Get the course details page
router.get('/course-detail', function(req, res, next){
  var courseId = req.query["id"];
  console.log("Getting course details for course " + courseId);
  //TODO - make a call to get course details and pass it to the view
  res.render('course_detail', { title: 'Course Details', courseId : courseId });
});

// Get course details based off course code.
router.get('/courses/:course_id', function(req, res, next){
  courseId = req.params.course_id;
  content = {};
  var spaceId = "jzmztwi1xqvn";
  async.series([
    function(callback) {
      course.performExactCourseSearch(function(response, error, result) {
        if (result) {
          console.log(result);
          content.class = result;
          callback();
        }
      }, courseId);
    },
    function(callback) {
      course.getSchedule(function(response, error, result) {
        if (result != null) {
          content.session = result;
          console.log(content.session.length);
          // Changing dateFormat for all sessions.
          for (var i = 0; i < content.session.length; i++) {
            var iSession = content.session[i];
            iSession["startDate"] = content.session[i]["startDate"].date('MMM DD, YYYY');
            iSession["endDate"] = content.session[i]["endDate"].date('MMM DD, YYYY');
          }
          callback();
        } else {
          content.session = {status: 404, text: "No courses found."}
          callback();
        }
      }, courseId);
    },
    function(callback) {
      var entryName = courseId.toLowerCase().slice(0,-3);
      contentful.getSyllabus(entryName, function(response, error, result) {
        content.syllabus = response;
        callback();
      });
    }
  ], function(results) {
    if (content.class.code === null) {
      code = content.class.id.slice(0,-3);
      content.class.code = code;
    }
    res.render('course_detail', { courseTitle: content.class.title,
    courseId: content.class.id, courseCode: content.class.code, courseType: content.class.type,
    courseDescription: striptags(content.class.description.text), courseCredit: content.class.credit,
    courseLength: content.class.length.value, courseInterval: content.class.length.interval,
    courseSchedule: content.class.schedule, sessions: content.session, courseOutline: content.syllabus});
  });
});
module.exports = router;
