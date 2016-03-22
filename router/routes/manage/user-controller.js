var async = require('async');
var logger = require('../../../logger');
var contentful = require("../../../API/contentful.js");
var user = require("../../../API/manage/user-api.js");
var common = require("../../../helpers/common.js");
var session = require('../../../API/manage/session-api.js');
var authentication = require("../../../API/authentication-api.js");

// handlers for the user management routes
module.exports = {

  // Display the create user form
  displayRegistrationLoginCreate: function(req, res, next) {

    var sessionData = session.getSessionData(req);

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
      }
    }, function(err, content) {
      session.setSessionData(res, sessionData);

      if (err) {
        logger.error("Error rendering createuser", err);
        common.redirectToError(res);
        return;
      }

      res.render('manage/user/registration_login_create', {
        title: 'Login',
        states: content.states,
        sessionId: content.sessionId,
        loginError: content.loginError,
        timezones: content.timezones
      });
    });
  },

  // Handle request to create the user; this is an AJAX call.
  createUser: function(req, res, next) {

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
           },
          "timezoneId" : formData.timezoneId
        };

        // get the list of states required by the form
        user.createUser(userData, function(error, createdUser) {
          // callback with the error, this will cause async module to stop executing remaining
          // functions and jump immediately to the final function, it is important to return
          // so that the task callback isn't called twice
          if (error) return callback(error);

          // user created successfully
          logger.info("Created user: " + createdUser.id + " - " + formData.firstName + " " + formData.middleName + " " + formData.lastName);

          logger.debug("Authenticate the newly created user: " + userData.username);
          var authCredentials = {
            "username": userData.username,
            "password": userData.password
          };
          authentication.loginUser(req, res, authCredentials, function (error, authUser) {
            if (error) return callback(error);
            // the login user API call will set the authenticated token, we don't need to do anything with the response
            return callback(null, createdUser);
          });
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
  },

  login: function(req, res, next) {
    // get the form data from the body of the request
    var formData = req.body;

    logger.debug("Logging in user: " + formData.username);
    var authCredentials = {
      "username": formData.username,
      "password": formData.password
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
      // add the logged in user id to the session data
      var sessionData = session.getSessionData(req);
      sessionData.userId = authorizedUser.user.id;
      sessionData.userFirstName = authorizedUser.user.person.firstName;
      session.setSessionData(res, sessionData);

      logger.error("This is after setSessionData");
      // send success to client
      res.status(200).send();

      logger.error("This is before return");
      return;
    });
  },

  registrationLogin: function(req, res, next) {
    // get the form data from the body of the request
    var formData = req.body;

    logger.debug("Registration login for user: " + formData.username);

    var authCredentials = {
      "username": formData.username,
      "password": formData.password
    };

    authentication.loginUser(req, res, authCredentials, function (error, authorizedUser, statusCode) {
      var sessionData = session.getSessionData(req);

      if (error) {
        if (statusCode == 401) {
          sessionData.loginError = "Login failed, please try again";
          session.setSessionData(res, sessionData);

          logger.debug("Failed during registration login for user", error);
          res.redirect('registration_login_create');
          return;
        }
        else {
          sessionData.loginError = "There was an issue with your request. Please try again in a few minutes";
          session.setSessionData(res, sessionData);

          logger.error("User failed to log in with a different issue", error);
          res.redirect('registration_login_create');
          return;
        }
      }
      // add the logged in user id to the session data
      var sessionData = session.getSessionData(req);
      sessionData.userId = authorizedUser.user.id;
      sessionData.userFirstName = authorizedUser.user.person.firstName;
      session.setSessionData(res, sessionData);

      res.redirect("/manage/cart/payment");
    });
  }

} // end module.exports
