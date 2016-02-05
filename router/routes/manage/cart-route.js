var express = require('express');
var async = require('async');
var router = express.Router();
var logger = require('../../../logger');
var courseAPI = require("../../../API/course.js");
var common = require("../../../helpers/common.js");

// Routes related to the registration shopping cart

// Display the shopping cart
router.get('/', function(req, res, next) {

  async.parallel({
    course: function(callback) {
      var courseId = req.query.courseId ? req.query.courseId : null;
      if (!courseId) {
        return callback(new Error("Missing courseId request parameter"));
      }

      logger.debug("Looking up course " + courseId + " for shopping cart");
      courseAPI.performExactCourseSearch(function(response, error, course) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        return callback(null, course);
      }, courseId);
    },
    session: function(callback) {
      var sessionId = req.query.sessionId ? req.query.sessionId : null;
      if (!sessionId) {
        return callback(new Error("Missing sessionId request parameter"));
      }

      logger.debug("Looking up course session " + sessionId + " for shopping cart");
      courseAPI.getSession(sessionId, function(error, session) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // Change date format in the session.
        session["startDate"] = session["startDate"].date('MMM DD, YYYY');
        if (common.isNotEmpty(session["endDate"])) {
          session["endDate"] = session["endDate"].date('MMM DD, YYYY');
        }

        return callback(null, session);
      });
    }
  }, function(err, content) {
    if (err) {
      logger.error("Error rendering shopping cart", err);
      common.redirectToError(res);
      return;
    }
    res.render('manage/cart/cart', {
        title: "Course Registration",
        course: content.course,
        session: content.session
    });
  });
});

module.exports = router;
