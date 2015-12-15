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
  var courseDataId ;
  var courseData = {};
  var content;
  var location = (typeof(req.query["location"])!='undefined' ? req.query["location"] : null);
  //waterfall is important here as we need to get the course data (and the real FULL course id)
  //  first before getting sessions and the syllabus
  async.waterfall([
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
          if (common.isNotEmpty(courseData.class.id)) {
            courseDataId = courseData.class.id;
          } else {
            courseDataId = courseId;
          }
          courseData.session = result.sort(compare);
          // Changing dateFormat for all sessions.
          for (var i = 0; i < courseData.session.length; i++) {
            var iSession = courseData.session[i];
            iSession["startDate"] = courseData.session[i]["startDate"].date('MMM DD, YYYY');
            iSession["endDate"] = courseData.session[i]["endDate"].date('MMM DD, YYYY');
          }
          callback();
        } else {
          logger.debug("No course sessions found for course: " + courseId);
          courseData.session = []; //return empty array
          callback();
        }
      }, courseDataId);
    },
    function(callback) {
      //use the courseData as returned from the 1st call (this is important)
      var entryName ;
      if (common.isNotEmpty(courseData.class)) {
        entryName = courseData.class.id.toLowerCase().slice(0,-3);
      } else {
        entryName = courseId.toLowerCase().slice(0,-3);
      }

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
      if (common.isNotEmpty(content.leadershipCoursesScheduleLinks)) {
        if(common.isNotEmpty(content.leadershipCoursesScheduleLinks[courseData.class.code])) {
          courseData.isLeadershipCourse = true;
          courseData.leadershipCourseScheduleLinkText = content.leadershipCourseScheduleLinkText;
          courseData.leadershipCourseScheduleLink = content.leadershipCoursesScheduleLinks[courseData.class.code];
        }
      }

      var allowedHtmlTags = config("properties").allowedHtmlTags;
      if (common.isNotEmpty(courseData.class.description)) {
        // add empty string to avoid exception
        courseData.class.description.formatted = striptags(courseData.class.description.formatted + "", allowedHtmlTags);
        // replace old urls specified within course overview  with new ones provided by graduate school
        courseData.class.description.formatted = replaceUrl(courseData.class.description.formatted);
      }

      // add empty string to avoid exception
      courseData.class.objective = striptags(courseData.class.objective + "", allowedHtmlTags);
      // replace old urls specified within course objective  with new ones provided by graduate school
      courseData.class.objective = replaceUrl(courseData.class.objective);

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

function replaceUrl(string) {
  var filter = new RegExp(config("urlMapping").filternowww,"g");
  string = string.replace(filter, '');
  var filterwithwww = new RegExp(config("urlMapping").filterwithwww,"g");
  string = string.replace(filterwithwww, '');
  // find the values of href and store them in an array
  var hrefURLs = [];
  string.replace(/href=("|')(.*?)("|')/g, function(a, b, hrefURL) {
    hrefURLs.push(hrefURL);
  });

  // replace only those url that are found in the urlMapping file.
  var urlMap = config("urlMapping").courseOverviewURLMappings;
  var codeIdURL = config("urlMapping").codeIdURL;
  hrefURLs.forEach(function(singleURL) {
    singleURL = singleURL.trim();
    if (common.isNotEmpty(urlMap[singleURL])) {
      string = string.replace(singleURL,urlMap[singleURL]);
    }else if ( common.isNotEmpty(singleURL) && singleURL.indexOf(codeIdURL)> -1 ) {
      string = string.replace(codeIdURL,urlMap[codeIdURL]);
    }
  });

  return string;
}

module.exports = router;
