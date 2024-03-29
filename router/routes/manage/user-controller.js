var async = require('async');
var logger = require('../../../logger');
var contentful = require("../../../API/contentful.js");
var user = require("../../../API/manage/user-api.js");
var common = require("../../../helpers/common.js");
var session = require('../../../API/manage/session-api.js');
var authentication = require("../../../API/authentication-api.js");
var moment = require('moment');
var commonAPI = require("../../../API/common-api.js");

// handlers for the user management routes
module.exports = {

  // Display the create user form
  displayRegistrationLoginCreate: function(req, res, next) {
    async.series({
      sessionId: function(callback) {
        if (!session.getSessionData(req,"cart")) {
          return callback(new Error("No session ID exists"), null);
        }

        var sessionId = session.getSessionData(req,"cart").sessionId;
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
        commonAPI.getTimezones(function (error, timezones){
          if(error){
            return callback(error);
          }
          else {
            return callback(null, timezones);
          }
        }, session.getSessionData(req, "authToken"))
      },
      loginError: function(callback) {
        var loginError = session.getSessionData(req, "loginError");
        if (loginError) {
          logger.debug("Error logging in, displaying alert and clearing the warning from session");
          session.setSessionData(req, "loginError", null);
        }
        return callback(null, loginError);
      },
      nextpage: function(callback) {
        var nextPage = "/manage/cart/payment";
        logger.debug("Newly created user coming from cart and will be redirected to: " + nextPage);
        return callback(null, nextPage);
      }
    }, function(err, content) {

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
        commonAPI.getTimezones(function (error, timezones){
          if(error){
            return callback(error);
          }
          else {
            return callback(null, timezones);
          }
        }, session.getSessionData(req, "authToken"))
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
             "dateOfBirth" : ((formData.dateOfBirth == "" ) ? null : formData.dateOfBirth)
           },
          "timezoneId" : ((formData.timezoneId === "") ? null : formData.timezoneId)
        }
        user.createUser(userData, function(error, result) {
          // callback with the error, to cause async to exit out and send error
          if (error) {
            return callback(error, null, result);
          }

          // user created successfully
          logger.info("Created user: " + result.createdUser.id + " - " + formData.firstName + " " + formData.middleName + " " + formData.lastName);

          logger.debug("Authenticate the newly created user: " + userData.username);
          var authCredentials = {
            "username": userData.username,
            "password": userData.password  // don't re-encrypt the password, it is already encrypted from the user creation
          };
          authentication.loginUser(req, res, authCredentials, function (error, authUser) {
            if (error) return callback(error);
            // the login user API call will set the authenticated token, we don't need to do anything with the response
            callback(null, authUser);
          });
        }, session.getSessionData(req, "authToken"));
      }
    ], function(error, createdUser, creationErrorDetails) {
      if (error) {
        if (creationErrorDetails) {
          if (creationErrorDetails.validationErrors) {
            res.status(400).send({
              "error": "We have experienced a problem creating your account. Please correct the information and try again.",
              "validationErrors": creationErrorDetails.validationErrors
            });
          }
          else if (creationErrorDetails.duplicateUserError) {
            res.status(409).send({
              "error": "The email address you specified is already in use. If you forgot your password, you can reset it ​<a href='/manage/user/password/forgot'>here</a>.",
            });
          }
        }
        else {
          logger.error("There was an error during user creation", error);
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

      session.setSessionData(req, "passwordChangeAuthUserId", authorizedUser.user.id);
      session.setSessionData(req, "passwordChangeAuthUsername", authorizedUser.user.username);
      if (authorizedUser.passwordChangeRequired){
        logger.debug("User "+ authorizedUser.user.id +" must reset password");
        session.setSessionData(req, "passwordResetRequired", authorizedUser.passwordChangeRequired);
        res.status(401).send({"passwordChangeRequired": true});
      } else {
        res.status(200).send();
      }
    });
  },

  // Display the standalone login page
  displayLogin: function(req, res, next) {

    // see if there is a login message to display
    var loginMessage = session.getSessionData(req, "loginMessage");
    if (loginMessage) {
      // remove the message from session
      session.setSessionData(req, "loginMessage", null);
    }

    res.render('manage/user/standalone_login', {
      title: 'Login',
      loginMessage: loginMessage
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

      if (error) {
        if (statusCode == 401) {
          session.setSessionData(req, "loginError", "Login failed, please try again");

          logger.debug("Failed during registration login for user", error);
          res.redirect('registration_login_create');
          return;
        }
        else {
          session.setSessionData(req, "loginError", "There was an issue with your request. Please try again in a few minutes");

          logger.error("User failed to log in with a different issue", error);
          res.redirect('registration_login_create');
          return;
        }
      }

      session.setSessionData(req, "passwordChangeAuthUserId", authorizedUser.user.id);
      session.setSessionData(req, "passwordChangeAuthUsername", authorizedUser.user.username);
      if (authorizedUser.passwordChangeRequired){
        logger.debug("User "+ authorizedUser.user.id +" must reset password");
        session.setSessionData(req, "passwordResetRequired", authorizedUser.passwordChangeRequired);
        res.redirect("/manage/user/password/change");
      } else {
        res.redirect("/manage/cart/payment");
      }
    });
  },

  logout: function (req, res, next) {
    doLogout(req, res);
    res.redirect("/")
  },

  logoutAsync: function (req, res, next) {
    doLogout(req, res);
    res.status(200).send();
  },

  displayForgotPassword: function (req, res, next) {

    logger.debug("Displaying forgot password page");

    res.render('manage/user/forgot_password', {
      title: "Forgot Password"
    });
  },

  forgotPassword : function(req, res, next) {

    var authCredentials = {
      "username": req.body.email
    };

    logger.debug("Forgot password, resetting password for user: " + authCredentials.username);

    // reset the password
    user.forgotPassword(req, authCredentials, function(error, passwordReset, userNotFound) {

      if (error) {
        logger.error("Error resetting password", error);
        common.redirectToError(res);
        return;
      }

      res.render('manage/user/forgot_password', {
        title: "Forgot Password",
        passwordReset: passwordReset,
        userNotFound: userNotFound
      });
    });
  },

  //Display the change password form
  displayChangePassword: function(req, res) {
    var passwordResetRequired = session.getSessionData(req, "passwordResetRequired");
    var pwChangeResult = session.getSessionData(req, "pwChangeResult");
    if (passwordResetRequired) {
      // remove the message from session
      session.setSessionData(req, "passwordResetRequired", null);
    }

    if (pwChangeResult) {
      // remove the change result from session
      session.setSessionData(req, "pwChangeResult", null);
    }

    res.render('manage/user/change_password', {
      title: 'Update Your Password',
      passwordResetRequired: passwordResetRequired,
      pwChangeResult: pwChangeResult
    });
  },

  changePassword: function(req, res, next) {
    // get the form data from the body of the request
    var formData = req.body;
    var pwChangeCredentials = {
      "username": session.getSessionData(req, "passwordChangeAuthUsername"),
      "password": authentication.encryptPassword(formData.oldPassword),
      "newPassword": authentication.encryptPassword(formData.newPassword)
    };

    var userId = session.getSessionData(req, "passwordChangeAuthUserId");

    user.changeUserPassword(req, pwChangeCredentials, userId, function (error, statusCode) {
      if (error) {
        if (statusCode == 401) {
          logger.debug("User could not be authenticated", error);
          res.status(statusCode).send({"error": "Username or password incorrect, please try again"});
          return;
        } else if (statusCode == 409) {
          logger.debug("Cannot Reuse password", error);
          res.status(statusCode).send({"error": "Previously used passwords cannot be reused, please try again"});
          return;
        } else {
          logger.error("Password change failed with a different issue", error);
          res.status(statusCode).send({"error": "There was an issue with your request. Please try again in a few minutes"});
          return;
        }
      }

      //Login User after changing password
      var authCredentials = {
        "username": pwChangeCredentials.username,
        "password": pwChangeCredentials.newPassword
      }
      authentication.loginUser(req, res, authCredentials, function (error, authorizedUser, statusCode) {
        if (error) {
          if (statusCode == 401) {
            logger.debug("User failed log in", error);
            res.status(statusCode).send({"error": "Password changed but could not login"});
            return;
          }
          else {
            logger.error("User failed to log in with a different issue", error);
            res.status(statusCode).send({"error": "There was an issue with your request. Please try again in a few minutes"});
            return;
          }
        }
        session.setSessionData(req, "pwChangeResult", "success");
        res.status(200).send();
      });

    });
  },

  displayMyAccount: function (req, res, next) {

    if (!session.getSessionData(req, "user")) {
      logger.debug("User navigated to MyAccount page but is not logged in");
      common.redirectToError(res);
      return;
    }

    async.parallel({

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
        commonAPI.getTimezones(function (error, timezones){
          if(error){
            return callback(error);
          }
          else {
            return callback(null, timezones);
          }
        }, session.getSessionData(req, "authToken"))
      },
      registrations: function (callback) {
        var userId = session.getSessionData(req, "user").id;
        user.getUserRegistrations(req, userId, function (error, registrations){
          if(error){
            return callback(error, null);
          }
          else {
            return callback(null, registrations);
          }
        });
      }
    }, function(err, content) {

      if (err) {
        logger.error("Error rendering my account", err);
        common.redirectToError(res);
        return;
      }

      //Gets the status for display on the registrations page
      var getSessionStatus = function (startDate, endDate){
            var currentDate = new Date();

            if (endDate < startDate){
              return "Session start date cannot be before the end date";
            } else if (currentDate < startDate){
              return "pending";
            } else if (currentDate >= startDate && currentDate <=endDate){
              return "in progress";
            } else if (currentDate > endDate){
              return "ended";
            } else {
              logger.error("An error occurred converting status");
              return "something went wrong";
            }
          }

      var tabToShow = (typeof(req.query["tab"])!='undefined' ? req.query["tab"] : "my-profile");
      logger.debug("Displaying MyAccount page with tab " + tabToShow);

      // get success flag from update attempt, remove after
      var isSuccessfulUserUpdate = session.getSessionData(req, "isSuccessfulUserUpdate");
      if (isSuccessfulUserUpdate) {
        session.setSessionData(req, "isSuccessfulUserUpdate", null);
      }

      res.render('manage/user/account', {
        title: 'My Account',
        activeTab: tabToShow,
        states: content.states,
        timezones: content.timezones,
        user: session.getSessionData(req, "user"),
        moment: moment,
        registrations: content.registrations,
        getSessionStatus: getSessionStatus,
        isSuccessfulUserUpdate: isSuccessfulUserUpdate
      });
    });
  },

  // Handle request to update the user; this is an AJAX call.
  updateUser: function(req, res, next) {

    async.series({

      updateUserResult: function(callback) {

        // get the original user information from session
        var originalUser = session.getSessionData(req, "user");

        logger.info("Updating user id " + originalUser.id);

        // get the form data from the body of the request
        var formData = req.body;

        // copy/clone the original user
        var updatedUser = JSON.parse(JSON.stringify(originalUser));

        // update the copy/clone with the form data (updated user info)
        updatedUser.person.firstName = ((formData.firstName === "") ? null : formData.firstName);
        updatedUser.person.middleName = ((formData.middleName === "") ? null : formData.middleName);
        updatedUser.person.lastName = ((formData.lastName === "") ? null : formData.lastName);
        // TODO leaving this for next sprint
        updatedUser.username = ((formData.email === "") ? null : formData.email);
        updatedUser.person.emailAddress = ((formData.email === "") ? null : formData.email);
        updatedUser.person.primaryPhone = ((formData.phone === "") ? null : formData.phone);
        updatedUser.person.dateOfBirth = ((formData.dateOfBirth === "") ? null: formData.dateOfBirth);
        updatedUser.person.primaryAddress.address1 =
            ((formData.street === "") ? null : formData.street);
        updatedUser.person.primaryAddress.address2 =
            ((formData.suite === "") ? null : formData.suite);
        updatedUser.person.primaryAddress.city = ((formData.city === "") ? null : formData.city);
        updatedUser.person.primaryAddress.state = ((formData.state === "") ? null : formData.state);
        updatedUser.person.primaryAddress.postalCode = ((formData.zip === "") ? null : formData.zip);
        updatedUser.timezoneId = ((formData.timezoneId === "") ? null : formData.timezoneId);

        // update the user
        user.updateUser(req, updatedUser, function (error, result) {
          // callback with the error, to cause async to exit out and send error
          if (error) {
            return callback(error, result);
          }

          // user updated successfully
          logger.info("Successfully updated user id " + result.updatedUser.id);

          // update the user in session so that session has updated user information
          session.setSessionData(req, "user", result.updatedUser);

          // set flag in session for success
          session.setSessionData(req, "isSuccessfulUserUpdate", true);

          return callback(null, result);
        });
      }
    }, function(error, content) {
      if (error) {
        if (content.updateUserResult.validationErrors != null) {
          res.status(400).send({
            "validationErrors": content.updateUserResult.validationErrors
          });
        }
        else {
          logger.error("There was an error during user update", error);
          res.status(500).send({"error": "We have experienced a problem processing your request, please try again later."});
        }
        return;
      }
      // send success to client
      res.status(200).send();
    });
  }

} // end module.exports

function doLogout(req, res) {
  logger.info("Logging out user " + session.getSessionData(req, "user").id);
  session.clearSessionData(req);
}