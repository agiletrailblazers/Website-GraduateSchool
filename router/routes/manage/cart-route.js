var express = require('express');
var async = require('async');
var router = express.Router();
var logger = require('../../../logger');
var courseAPI = require("../../../API/course.js");
var common = require("../../../helpers/common.js");
var config = require('konphyg')(__dirname + '/../../../config');
var crypto = require("crypto-js");
var uuid = require('uuid');

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

// Display the payment page
router.get('/payment/user/:userId/session/:sessionId', function(req, res, next) {

  logger.debug("Initiating payment processing for user " + req.params.userId);

  // payment related configuration properties
  var paymentConfig = config("properties").manage.payment;

  async.waterfall([
    function(callback) {
      var sessionId = req.params.sessionId ? req.params.sessionId : null;
      if (!sessionId) {
        return callback(new Error("Missing sessionId request parameter"));
      }

      logger.debug("Looking up course session " + sessionId + " for shopping cart");
      courseAPI.getSession(sessionId, function(error, session) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // pass the session to the next function in the waterfall
        return callback(null, session);
      });
    },
    function(session, callback) {

        logger.debug("Building and signing payment request data");

        // TODO do we need to store these for subsequent "sale" and research?
        // TODO should we make the tranaction uid a multipart key consisting of userId and other info?

        var transaction_uuid = uuid.v4();
        var now = new Date();
        var signed_date_time = now.toISOString().slice(0, 19) + 'Z'; // must remove millis
        var reference_number = now.getTime();

        var parameters = new Map();
        parameters.set("access_key", paymentConfig.accessKey);
        parameters.set("profile_id", paymentConfig.profileId);
        parameters.set("transaction_uuid", transaction_uuid);
        parameters.set("signed_field_names", "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,line_item_count,item_0_name,item_0_unit_price,item_0_quantity");
        parameters.set("unsigned_field_names", "");
        parameters.set("signed_date_time", signed_date_time);
        parameters.set("locale", "en");
        parameters.set("transaction_type", "authorization");
        parameters.set("reference_number", reference_number);
        parameters.set("amount", session["tuition"]);
        parameters.set("currency", "USD");
        // add line item info
        parameters.set("line_item_count", 1);
        parameters.set("item_0_name", session["classNumber"]);
        parameters.set("item_0_unit_price", session["tuition"]);
        parameters.set("item_0_quantity", 1);

        var signatureStr = "";
        var i = 0;
        parameters.forEach(function(value, key) {
          if (i != 0) {
            signatureStr = signatureStr + ",";
          }
          signatureStr = signatureStr + key + "=" + value;
          i++;
        });

        // encode the signature string
        var hash = crypto.HmacSHA256(signatureStr, paymentConfig.secretKey);
        var signature = crypto.enc.Base64.stringify(hash);

        return callback(null, parameters, signature, signatureStr);
    }
  ], function(err, parameters, signature, signatureStr) {
    if (err) {
      logger.error("Error rendering payment page", err);
      common.redirectToError(res);
      return;
    }

    res.render('manage/cart/payment', {
        parameters: parameters,
        signature: signature,
        paymentUrl: paymentConfig.url
    });
  });
});


module.exports = router;
