var express = require('express');
var async = require('async');
var router = express.Router();
var logger = require('../../../logger');
var contentful = require("../../../API/contentful.js");
var user = require("../../../API/manage/user-api.js");
var authentication = require("../../../API/authentication-api.js");
var common = require("../../../helpers/common.js");
var session = require('../../../API/manage/session-api.js');

// Routes related to user management

// Display the create user form
router.get('/loginCreate', function(req, res, next) {

  var sessionData = session.getSessionData(req);

  async.series({
    sessionId: function(callback) {
      var sessionId = sessionData.cart.sessionId;
      return callback(null, sessionId);
    },
    states: function(callback) {
      // get the list of states required by the form
      contentful.getReferenceData('us-states', function(states, error) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        return callback(null, states);
      });
    },
    loginError: function(callback) {
      var loginError = sessionData.loginError;
      if (loginError) {
        logger.debug("Error logging in, displaying alert and clearing the warning from session");
        sessionData.loginError = null;
      }
      return callback(null, loginError);
    }
  }, function(err, content) {
    session.setSessionData(res, sessionData);

    if (err) {
      logger.error("Error rendering createuser", err);
      common.redirectToError(res);
      return;
    }

    res.render('manage/user/loginCreate', {
      title: 'Login',
      states: content.states,
      sessionId: content.sessionId,
      loginError: content.loginError
    });
  });
});

// Handle request to create the user; this is an AJAX call.
router.post('/create', function (req, res, next) {

  async.series({
    createdUser: function(callback) {
      // get the form data from the body of the request
      var formData = req.body;
      logger.info("Creating user: " + formData.firstName + " " + formData.middleName + " " + formData.lastName);

      var userData = {
        "username" : formData.email,
        "password" : formData.password,
        "lastFourSSN" : formData.lastFourSSN,
        "person" :
         {
           "firstName" : formData.firstName,
           "middleName" : formData.middleName,
           "lastName" : formData.lastName,
           "emailAddress" : formData.email,
           "primaryPhone" : formData.phone,
           "secondaryPhone" : null,
           "primaryAddress" :
             {
               "address1" : formData.street,
               "address2" : formData.suite,
               "city" : formData.city,
               "state" : formData.state,
               "postalCode" : formData.zip
             },
           "secondaryAddress" : null,
           "dateOfBirth" : formData.birthMonth + '/' + formData.birthDay + '/' + formData.birthYear
         }
      };

      // get the list of states required by the form
      user.createUser(userData, function(error, createdUser) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // user created successfully
        logger.info("Created user: " + createdUser.id + " - " + formData.firstName + " " + formData.middleName + " " + formData.lastName);
        return callback(null, createdUser);
      }, req.query["authToken"]);
    }
  }, function(err, content) {
    if (err) {
      logger.error("Failed during user creation", err);
      res.status(500).send({"error": "We have experienced a problem processing your request, please try again later."});
      return;
    }

    // add the created user id to the session data
    var sessionData = session.getSessionData(req);
    sessionData.userId = content.createdUser.id;
    session.setSessionData(res, sessionData);

    // send success to client
    res.status(201).send();
  });
});

// Handle request to login as a user
router.post('/login', function (req, res, next) {
  var authorizedUser = {};
  async.waterfall([
        function (callback) {
          // get the form data from the body of the request
          var formData = req.body;

          logger.debug("Logging in user: " + formData.username);
          var authCredentials = {
            "username": formData.username,
            "password": formData.credentials
          };
          authentication.loginUser(req, res, authCredentials, function (error, authUser) {
            if (error) return callback(error);
            authorizedUser = authUser;


            return callback(null, authorizedUser);

          });
        }
      ], function (err, content) {
        var sessionData = session.getSessionData(req);

        if (err) {
          sessionData.loginError = "Login failed, please try again";
          session.setSessionData(res, sessionData);

          logger.debug("Failed during user login", err);
          res.redirect('loginCreate');
          return;
        }
        sessionData.userId = content.user.id;
        session.setSessionData(res, sessionData);
        res.redirect("/manage/cart/payment");
      }
  )
});

module.exports = router;
