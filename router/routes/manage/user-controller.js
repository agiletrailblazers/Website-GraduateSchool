var async = require('async');
var logger = require('../../../logger');
var contentful = require("../../../API/contentful.js");
var user = require("../../../API/manage/user-api.js");
var common = require("../../../helpers/common.js");
var session = require('../../../API/manage/session-api.js');
var authentication = require("../../../API/authentication-api.js");
var moment = require('moment');

// handlers for the user management routes
module.exports = {

  // Display the create user form
  displayRegistrationLoginCreate: function(req, res, next) {

    var sessionData = req.app.get('sessionData');

    async.series({
      sessionId: function(callback) {
        if (!sessionData.cart) {
          return callback(new Error("No session ID exists"), null);
        }

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
      timezones: function(callback) {
        //get a list of timezones
        user.getTimezones(function (error, timezones){
          if(error){
            return callback(error);
          }
          else {
            return callback(null, timezones);
          }
        }, req.query["authToken"])
      },
      loginError: function(callback) {
        var loginError = sessionData.loginError;
        if (loginError) {
          logger.debug("Error logging in, displaying alert and clearing the warning from session");
          sessionData.loginError = null;
        }
        return callback(null, loginError);
      },
      nextpage: function(callback) {
        var nextPage = "/manage/cart/payment";
        logger.debug("Newly created user coming from cart and will be redirected to: " + nextPage);
        return callback(null, nextPage);
      }
    }, function(err, content) {
      session.setSessionData(req, res, sessionData);

      if (err) {
        logger.error("Error rendering createuser", err);
        common.redirectToError(res);
        return;
      }

      res.render('manage/user/registration_login_create', {
        title: 'Course Registration',
        states: content.states,
        sessionId: content.sessionId,
        loginError: content.loginError,
        timezones: content.timezones,
        nextpage: content.nextpage
      });
    });
  },

  displayCreateUser: function(req, res, next) {

    async.series({
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
      timezones: function(callback) {
        //get a list of timezones
        user.getTimezones(function (error, timezones){
          if(error){
            return callback(error);
          }
          else {
            return callback(null, timezones);
          }
        }, req.query["authToken"])
      },
      nextpage: function(callback) {
        var nextPage = common.isNotEmpty(req.body.nextpage_after_create) ?  req.body.nextpage_after_create : "/";
        logger.debug("Newly created user will be redirected to: " + nextPage);
        return callback(null, nextPage);
      }
    }, function(err, content) {

      if (err) {
        logger.error("Error rendering createuser", err);
        common.redirectToError(res);
        return;
      }

      res.render('manage/user/user_create', {
        title: 'Create Account',
        states: content.states,
        timezones: content.timezones,
        nextpage: content.nextpage
      });
    });
  },

  // Handle request to create the user; this is an AJAX call.
  createUser: function(req, res, next) {

    async.waterfall([
      function(callback) {
        var dateOfBirthString = null;
        // get the form data from the body of the request
        var formData = req.body;
        logger.info("Creating user: " + formData.firstName + " " + formData.middleName + " " + formData.lastName);

        var userData = {
          "username" : ((formData.email === "") ? null : formData.email),
          "password" : ((formData.password === "") ? null : authentication.encryptPassword(formData.password)),
          "lastFourSSN" : ((formData.lastFourSSN === "") ? null : formData.lastFourSSN),
          "person" :
           {
             "firstName" : ((formData.firstName === "") ? null : formData.firstName),
             "middleName" : ((formData.middleName === "") ? null : formData.middleName),
             "lastName" : ((formData.lastName === "") ? null : formData.lastName),
             "emailAddress" : ((formData.email === "") ? null : formData.email),
             "primaryPhone" : ((formData.phone === "") ? null : formData.phone),
             "secondaryPhone" : null,
             "primaryAddress" :
               {
                 "address1" : ((formData.street === "") ? null : formData.street),
                 "address2" : ((formData.suite === "") ? null : formData.suite),
                 "city" : ((formData.city === "") ? null : formData.city),
                 "state" : ((formData.state === "") ? null : formData.state),
                 "postalCode" : ((formData.zip === "") ? null : formData.zip)
               },
             "secondaryAddress" : null,
             "dateOfBirth" : ((formData.dateOfBirth == "" ) ? null : moment(new Date(formData.dateOfBirth)).format("YYYYMMDD"))
           },
          "timezoneId" : ((formData.timezoneId === "") ? null : formData.timezoneId)
        }
        user.createUser(userData, function(error, createdUser, validationErrors) {
          // callback with the error, this will cause async module to stop executing remaining
          // functions and jump immediately to the final function, it is important to return
          // so that the task callback isn't called twice
          if (error) return callback(error, null, validationErrors);

          // user created successfully
          logger.info("Created user: " + createdUser.id + " - " + formData.firstName + " " + formData.middleName + " " + formData.lastName);

          logger.debug("Authenticate the newly created user: " + userData.username);
          var authCredentials = {
            "username": userData.username,
            "password": userData.password  // don't re-encrypt the password, it is already encrypted from the user creation
          };
          authentication.loginUser(req, res, authCredentials, function (error, authUser) {
            if (error) return callback(error);
            // the login user API call will set the authenticated token, we don't need to do anything with the response
            return callback(null, null, authUser);
          });
        }, req.query["authToken"]);
      },
      function(createdUser, validationErrors, callback) {
        if (createdUser) {
          session.setGuestSessionToUserSession(req, res, createdUser.user, function () {
            callback(createdUser, validationErrors);
          });
        }
        callback(createdUser, validationErrors);
      }
    ], function(error, createdUser, validationErrors) {
      if (error) {
        logger.error("Failed during user creation", error);
        if (validationErrors){
          res.status(400).send({"error": "We have experienced a problem creating your account. Please correct the information an try again.", "validationErrors" : valdationErrors});
        }
        else {
          res.status(500).send({"error": "We have experienced a problem processing your request, please try again later."});
        }
        return;
      }
      // send success to client
      res.status(201).send();
    });
  },

  login: function(req, res, next) {
    // get the form data from the body of the request
    var formData = req.body;

    logger.debug("Logging in user: " + formData.username);
    var authCredentials = {
      "username": formData.username,
      "password": authentication.encryptPassword(formData.password)
    };
    authentication.loginUser(req, res, authCredentials, function (error, authorizedUser, statusCode) {
      if (error) {
          if (statusCode == 401) {
            logger.debug("User failed log in", error);
            res.status(statusCode).send({"error": "Login failed, please try again"});
            return;
          }
          else {
            logger.error("User failed to log in with a different issue", error);
            res.status(statusCode).send({"error": "There was an issue with your request. Please try again in a few minutes"});
            return;
          }
      }
      session.setGuestSessionToUserSession(req, res, authorizedUser.user, function() {
        res.status(200).send();
      });
    });
  },

  registrationLogin: function(req, res, next) {
    // get the form data from the body of the request
    var formData = req.body;

    logger.debug("Registration login for user: " + formData.username);

    var authCredentials = {
      "username": formData.username,
      "password": authentication.encryptPassword(formData.password)
    };

    authentication.loginUser(req, res, authCredentials, function (error, authorizedUser, statusCode) {
      var sessionData = req.app.get('sessionData');

      if (error) {
        if (statusCode == 401) {
          sessionData.loginError = "Login failed, please try again";
          session.setSessionData(req, res, sessionData);

          logger.debug("Failed during registration login for user", error);
          res.redirect('registration_login_create');
          return;
        }
        else {
          sessionData.loginError = "There was an issue with your request. Please try again in a few minutes";
          session.setSessionData(req, res, sessionData);

          logger.error("User failed to log in with a different issue", error);
          res.redirect('registration_login_create');
          return;
        }
      }
      session.setGuestSessionToUserSession(req, res, authorizedUser.user, function() {
        res.redirect("/manage/cart/payment");
      });
    });
  },

  logout: function (req, res, next) {
    var sessionData = req.app.get('sessionData');
    logger.info("Logging out user " + sessionData.userId);

    authentication.logoutUser(req, res);
    sessionData = {};
    session.setSessionData(req, res, sessionData);
    req.query["authToken"] = null;

    res.redirect("/")
  }

} // end module.exports
