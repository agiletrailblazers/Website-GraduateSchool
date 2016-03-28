var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var course = require("../../API/course.js");
var striptags = require('striptags');
var dateformat = require('date-format-lite');
var momentTz = require('moment-timezone');;
var prune = require('underscore.string/prune');
var router = express.Router();
var logger = require('../../logger');
var common = require("../../helpers/common.js");
var config = require('konphyg')(__dirname + '/../../config');

// Get course details based off course code.
router.get('/courses/:course_id_or_code', function(req, res, next){
  var courseIdOrCode = req.params.course_id_or_code;
  var courseId;
  var courseData = {};
  var content;
  var courseOnlineTypes = ['Instructor-Supported WBT','Web Based Training','Video On Demand','Distance Education'];
  var location = (typeof(req.query["location"])!='undefined' ? req.query["location"] : null);
  //waterfall is important here as we need to get the course data (and the real FULL course id)
  //  first before getting sessions and the syllabus
  async.waterfall([
    function(callback) {
      course.performExactCourseSearch(function(response, error, result) {
    	if (result == null && error) { //expected 404 - not an error
          if (response.statusCode == 404) {
            logger.warn("No courses found for " + courseIdOrCode + " redirecting to page not found");
            courseData = null;
            //The line below tells waterfall to go to the last method if a course is not found
            callback(true);
            return;
          }
          else {
            logger.error("Encountered exception when loading course " + courseIdOrCode + " redirecting to error page", error);
            common.redirectToError(res);
          }
    	}
    	else if (result) {
          courseData.class = result;
          //set course id to the FULL course id (since it's possible to start with a code or id)
          if (common.isNotEmpty(courseData.class.id)) {
            courseId = courseData.class.id;
          } else {
            courseId = courseIdOrCode;   //this really should not happen
          }
          callback();
    	}
      }, courseIdOrCode, req.query["authToken"]);
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
            // maintain the format of 'YYYY MM DD' in origStartDate. moment.tz needs it.
            // See https://github.com/moment/moment/issues/1407
            var tempFormat = courseData.session[i]["startDate"];
            courseData.session[i]["origStartDate"] = tempFormat.replace("-", " ");
            iSession["startDate"] = courseData.session[i]["startDate"].date('MMM DD, YYYY');

            if (common.isNotEmpty(courseData.session[i]["endDate"])) {
              iSession["endDate"] = courseData.session[i]["endDate"].date('MMM DD, YYYY');
            }
            // set the session specific registration link
            var tmpRegistrationUrl = config("properties").registrationUrl;
            tmpRegistrationUrl = tmpRegistrationUrl.replace("[courseId]", courseData.class.id);
            tmpRegistrationUrl = tmpRegistrationUrl.replace("[sessionId]", courseData.session[i].classNumber);
            courseData.session[i].registrationUrl = tmpRegistrationUrl;
          }
          callback();
        }
        else {
          if (error  && response.statusCode != 404) { //404s may be expected
            logger.warn("Error finding course sessions for course: " + courseId + ", displaying page anyways", error);
          }

          courseData.session = []; //return empty array
          callback();
        }
      }, courseId, req.query["authToken"]);
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
        if (error && response.statusCode != 404) { //404 may be expected
          logger.warn("Error retrieving syllabus for course: " + courseId + " displaying page anyways", error);
        }
        else {
          courseData.syllabus = response;
        }
        callback();
      });
    },
    function(callback) {
      contentful.getCourseDetails(function(fields, error) {
        if (error) {
          logger.error("Error retrieving generic course details from Contentful, redirecting to error page", error);
          common.redirectToError(res);
        }
        else {
          content = fields;
          callback();
        }

      });
    }
  ], function(results) {
    if (courseData && courseData.class) {
    	if (courseData.class.code === null) {
    		var code = courseData.class.id.slice(0,-3);
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

      // Determine if EP registration dealine has ellapsed
      var classTypes = config("properties").classTypes;
      if (courseData.class.type.indexOf(classTypes.evening) > -1) {
          courseData.session.epPastRegDeadline = false;
          courseData.session.forEach(function(session) {
            var epRegDeadline = momentTz.tz(session.origStartDate, 'YYYY MM DD', "America/New_York").add(14, 'days').add(18, 'hours');
            if (epRegDeadline.isBefore(momentTz().tz("America/New_York"))) {
              session.status = 'C';
              session.epPastRegDeadline = true;
            }
          })
      };
      content.linksSection.forEach(function(link) {
        link.url = link.url.replace('[courseCode]', courseData.class.code);
      });
      courseData.isLeadershipCourse = false;
      if (common.isNotEmpty(content.leadershipCoursesScheduleLinks)) {
        if (common.isNotEmpty(content.leadershipCoursesScheduleLinks[courseData.class.code])) {
          courseData.isLeadershipCourse = true;
          courseData.leadershipCourseScheduleLinkText = content.leadershipCourseScheduleLinkText;
          courseData.leadershipCourseScheduleLink = content.leadershipCoursesScheduleLinks[courseData.class.code];
        }
      }
      courseData.isOnlineCourse = false;
      if (common.isNotEmpty(courseData.class.type) && (courseOnlineTypes.indexOf(courseData.class.type) >= 0)) {
        courseData.isOnlineCourse  = true;
      }

      var allowedHtmlTags = config("properties").allowedHtmlTags;
      if (common.isNotEmpty(courseData.class.description)) {
        // add empty string to avoid exception
        courseData.class.description.formatted = striptags(courseData.class.description.formatted + "", allowedHtmlTags);
        // replace old urls specified within course overview  with new ones provided by graduate school
        courseData.class.description.formatted = replaceUrl(courseData.class.description.formatted);
      }

      // add empty string to avoid exception
      if (courseData && courseData.class && common.isNotEmpty(courseData.class.objective)) {
        courseData.class.objective = striptags(courseData.class.objective, allowedHtmlTags);
        courseData.class.objective = replaceUrl(courseData.class.objective);
      }

      if (common.isNotEmpty(courseData.class.outcomes)) {
        courseData.class.outcomes.forEach(function(outcome) {
          if (outcome) {
            courseData.class.outcomes[courseData.class.outcomes.indexOf(outcome)] = striptags(outcome, allowedHtmlTags);
          }
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
    	logger.warn("Course not found: " + courseIdOrCode);
    	res.redirect('/pagenotfound');
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

router.get('/registration/policy', function(req, res, next) {
  res.render('course-related-info/registration_policy');
});

router.get('/course_details.php', function(req, res, next) {
  var courseCode = req.query["cid"];
  if (common.isNotEmpty(courseCode)) {
    res.redirect('/courses/'+courseCode);
  } else {
    res.redirect('/pagenotfound');
  }
});

module.exports = router;
