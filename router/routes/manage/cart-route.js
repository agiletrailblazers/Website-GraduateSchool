var express = require('express');
var async = require('async');
var router = express.Router();
var logger = require('../../../logger');
var course = require("../../../API/course.js");
var common = require("../../../helpers/common.js");

// Routes related to the registration shopping cart

// Display the shopping cart
router.get('/', function(req, res, next) {

  // for now, we are only supporting 1 course, which is passed in when clicking on register
  var content = {
    title: "Course Registration",
    course: null,
    session: null
  };
  async.parallel([
    function(callback) {
      var courseId = req.query.courseId ? req.query.courseId : null;
      if (!courseId) {
        callback(new Error("Missing courseId request parameter"));
        return;
      }

      logger.debug("Looking up course " + courseId + " for shopping cart");
      course.performExactCourseSearch(function(response, error, course) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // got the course, place it in the data model
        content.course = course;
        return callback(null);
      }, courseId);
    },
    function(callback) {
      var sessionId = req.query.sessionId ? req.query.sessionId : null;
      if (!sessionId) {
        return callback(new Error("Missing sessionId request parameter"));
      }

      logger.debug("Looking up course session " + sessionId + " for shopping cart");
      course.getSession(sessionId, function(error, session) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // Change date format in the session.
        session["startDate"] = session["startDate"].date('MMM DD, YYYY');
        if (common.isNotEmpty(session["endDate"])) {
          session["endDate"] = session["endDate"].date('MMM DD, YYYY');
        }

        // set the session in the data model
        content.session = session;
        return callback(null);
      });
    }
  ], function(err) {
    if (err) {
      logger.error("Error rendering shopping cart", err);
      common.redirectToError(res);
      return;
    }
    res.render('manage/cart/cart', {
        title: content.title,
        course: content.course,
        session: content.session
    });
  });
});

module.exports = router;
