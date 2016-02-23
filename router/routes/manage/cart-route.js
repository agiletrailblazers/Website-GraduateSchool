var express = require('express');
var async = require('async');
var router = express.Router();
var logger = require('../../../logger');
var courseAPI = require('../../../API/course.js');
var common = require("../../../helpers/common.js");
var config = require('konphyg')(__dirname + '/../../../config');
var crypto = require("crypto-js");
var uuid = require('uuid');
var session = require('../../../API/manage/session-api.js');
var user = require("../../../API/manage/user-api.js");

// Routes related to the registration shopping cart

// Display the shopping cart. This is entry point into cart from course search, in which case the
// session id and course id will be passed in as query parameters.  It is also the landing page
// for a user if they cancel out of the payment flow, in which case the course id and session id will
// already be contained in the session data
router.get('/', function(req, res, next) {

  var sessionData = session.getSessionData(req);
  if (!sessionData.cart) {
    // no cart in session, initialize it
    sessionData.cart = {};
  }

  // update the course and session ids in the cart if they were passed in as query parameters,
  // this is how they will be initially passed in from the course details page. They may also already
  // be in the session data if we are getting back to the cart by some other means
  if (req.query.courseId) {
    sessionData.cart.courseId = req.query.courseId;
  }
  if (req.query.sessionId) {
    sessionData.cart.sessionId = req.query.sessionId;
  }

  async.parallel({
    course: function(callback) {
      var courseId = sessionData.cart.courseId;
      if (!courseId) {
        return callback(new Error("Missing courseId parameter"));
      }

      logger.debug("Looking up course " + courseId + " for shopping cart");
      courseAPI.performExactCourseSearch(function(response, error, course) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        return callback(null, course);
      }, courseId, req.query["authToken"]);
    },
    session: function(callback) {
      var sessionId = sessionData.cart.sessionId;
      if (!sessionId) {
        return callback(new Error("Missing sessionId parameter"));
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
      }, req.query["authToken"]);
    },
    nextpage: function(callback) {
      // if the user is already logged in then they should go from the cart directly into payment,
      // if they are not logged in then they should go from the cart to login/create user
      if (sessionData.userId) {
        callback(null, "/manage/cart/payment");
      }
      else {
        callback(null, "/manage/user/create");
      }
      return;
    }
  }, function(err, content) {
    if (err) {
      logger.error("Error rendering shopping cart", err);
      common.redirectToError(res);
      return;
    }

    // update the session data
    session.setSessionData(res, sessionData);

    res.render('manage/cart/cart', {
        title: "Course Registration",
        course: content.course,
        session: content.session,
        nextpage: content.nextpage
    });
  });
});

// Display the payment page.  All necessary information about the cart must be in the session data.
router.get('/payment', function(req, res, next) {

  // get the session data, it contains the cart data
  var sessionData = session.getSessionData(req);

  // payment related configuration properties
  var paymentConfig = config("properties").manage.payment;

  async.waterfall([
    function(callback) {

      // while we don't use the user id in the payment page, we don't want to send someone into
      // payment if we don't know who they are, so this is more of sanity check / safety precaution
      if (!sessionData.userId) {
        return callback(new Error("No user id in session"));
      }

      logger.debug("Initiating payment processing for user " + sessionData.userId);

      if (!sessionData.cart || !sessionData.cart.sessionId) {
        return callback(new Error("No session id in the cart"));
      }
      var sessionId = sessionData.cart.sessionId;

      logger.debug("Looking up course session " + sessionId + " for shopping cart");
      courseAPI.getSession(sessionId, function(error, session) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // pass the session to the next function in the waterfall
        return callback(null, session);
      }, req.query["authToken"]);
    },
    function(session, callback) {

        logger.debug("Building and signing payment request data");

        var transaction_uuid = uuid.v4();
        var reference_number = uuid.v4();
        var now = new Date();
        var signed_date_time = now.toISOString().slice(0, 19) + 'Z'; // must remove millis

        // initialize payment data in cart
        if (!sessionData.cart.payment) {
          sessionData.cart.payment = {};
        }
        sessionData.cart.payment.transaction_uuid = transaction_uuid;
        sessionData.cart.payment.reference_number = reference_number;

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

    // update the session data
    session.setSessionData(res, sessionData);

    res.render('manage/cart/payment', {
        parameters: parameters,
        signature: signature,
        paymentUrl: paymentConfig.url
    });
  });
});

// handle the payment canceled post from Cybersource payment
router.post('/payment/cancel', function(req, res, next) {

  logger.debug("Processing payment canceled");

  // remove the payment data from the cart
  var sessionData = session.getSessionData(req);
  sessionData.cart.payment = {};
  session.setSessionData(res, sessionData);

  // redirect back to the cart
  res.redirect('/manage/cart');
});

// handle the payment confirm post from Cybersource payment
router.post('/payment/confirm', function(req, res, next) {

  logger.debug("Processing payment confirm");

  var sessionData = session.getSessionData(req);

  async.parallel({
    course: function(callback) {
      var courseId = sessionData.cart.courseId;
      if (!courseId) {
        return callback(new Error("Missing courseId parameter"));
      }

      logger.debug("Looking up course " + courseId + " for shopping cart");
      courseAPI.performExactCourseSearch(function(response, error, course) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        return callback(null, course);
      }, courseId, req.query["authToken"]);
    },
    session: function(callback) {
      var sessionId = sessionData.cart.sessionId;
      if (!sessionId) {
        return callback(new Error("Missing sessionId parameter"));
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
      }, req.query["authToken"]);
    },
    authorization: function(callback) {
      // this is more of sanity check / safety precaution
      if (!sessionData.userId) {
        return callback(new Error("No user id in session"));
      }

      // get the cybersource response
      var cybersourceResponse = req.body;

      // ensure that request was not tampered with by re-building the signature and comparing to the one set by cybersource
      var cybersourceSignedFields = (cybersourceResponse.signed_field_names).split(',');
      var parameters = new Map();
      cybersourceSignedFields.forEach(function(field) {
          parameters.set(field, cybersourceResponse[field]);
      });

      // generate the signature string
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
      var hash = crypto.HmacSHA256(signatureStr, config("properties").manage.payment.secretKey);
      var signature = crypto.enc.Base64.stringify(hash);

      logger.debug("Generated signed signature string: " + signature);
      logger.debug("Cybersrc  signed signature string: " + cybersourceResponse.signature);
      // compare the generated signature string with the one provided by cybersource
      if (signature !== cybersourceResponse.signature) {
        // signature strings don't match, data may have been altered
        return callback(new Error("Generated signature string does not match cybersource signature"));
      }

      // populate the payment authorization data from the cybersource response
      var authorization = {
        approved: (cybersourceResponse.decision === "ACCEPT") ? true : false,
        cardNumber: cybersourceResponse.req_card_number,
        cardExpiry: cybersourceResponse.req_card_expiry_date
      };

      // add required fields to session for completing the sale after confirmation
      sessionData.cart.payment.authorization = authorization;

      return callback(null, authorization);
    }
  }, function(err, content) {
    if (err) {
      logger.error("Error rendering payment confirmation", err);
      common.redirectToError(res);
      return;
    }

    // update the session data
    session.setSessionData(res, sessionData);

    res.render('manage/cart/confirmation', {
        title: "Course Registration - Confirmation",
        course: content.course,
        session: content.session,
        authorization: content.authorization
    });
  });
});

// handle the payment receipt
router.post('/payment/complete', function(req, res, next) {

  logger.debug("Processing payment complete");

  var sessionData = session.getSessionData(req);

  async.series({
      course: function(callback) {
        var courseId = sessionData.cart.courseId;
        if (!courseId) {
          return callback(new Error("Missing courseId parameter"));
        }

        logger.debug("Looking up course " + courseId + " for shopping cart");
        courseAPI.performExactCourseSearch(function(response, error, course) {
          // callback with the error, this will cause async module to stop executing remaining
          // functions and jump immediately to the final function, it is important to return
          // so that the task callback isn't called twice
          if (error) return callback(error);

          return callback(null, course);
        }, courseId, req.query["authToken"]);
      },
      session: function(callback) {
        var sessionId = sessionData.cart.sessionId;
        if (!sessionId) {
          return callback(new Error("Missing sessionId parameter"));
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
        }, req.query["authToken"]);
      },
      completedRegistrations: function(callback) {

        // currently only support a single registration
        var registration = {
          orderNumber: null,
          studentId: sessionData.userId,
          sessionId: sessionData.cart.sessionId
        };

        // register the user
        user.registerUser(sessionData.userId, [registration], function(error, completedRegistrations) {
          // callback with the error, this will cause async module to stop executing remaining
          // functions and jump immediately to the final function, it is important to return
          // so that the task callback isn't called twice
          if (error) return callback(error);

          return callback(null, completedRegistrations);
        }, req.query["authToken"]);
      },
      payment: function(callback) {

        // TODO make the API call to cybersource to complete the sale
        var payment = sessionData.cart.payment.authorization;
        return callback(null, payment);
      }
    }, function(err, content) {

      if (err) {
        logger.error("Error rendering payment receipt", err);
        common.redirectToError(res);
        return;
      }

      // clear out the cart after successful registration and payment
      sessionData.cart = {};

      // update the session data
      session.setSessionData(res, sessionData);

      res.render('manage/cart/receipt', {
          title: "Course Registration - Receipt",
          course: content.course,
          session: content.session,
          completedRegistrations: content.completedRegistrations,
          payment: content.payment
        });
  });
});


module.exports = router;
