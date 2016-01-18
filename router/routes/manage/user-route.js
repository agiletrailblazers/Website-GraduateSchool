var express = require('express');
var async = require('async');
var router = express.Router();
var logger = require('../../../logger');
var contentful = require("../../../API/contentful.js");
var user = require("../../../API/manage/user-api.js");
var common = require("../../../helpers/common.js");

// Routes related to user management

// Display the create user form
router.get('/create', function(req, res, next) {

  content = {
    title: "Account Setup",
    states: {},
    offeringId: null
  };
  async.series([
    function(callback) {
      content.offeringId = req.query.offeringId ? req.query.offeringId : null;

      // TODO lookup the course/session info by session ID
      callback();
    },
    function(callback) {
      // get the list of states required by the form
      contentful.getReferenceData('us-states', function(result, error) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // got our data, set it up
        content.states = result;
        callback(null);
      });
    }
  ], function(err) {
    if (err) {
      logger.error("Error rendering createuser", err);
      common.redirectToError(res);
      return;
    }
    res.render('manage/user/create', content);
  });
});

// Handle request to create the user; this is an AJAX call.
router.post('/create', function (req, res, next) {

  // get the form data from the body of the request
  var formData = req.body;
  var content = {
    "createdUser" : null
  };

  async.series([
    function(callback) {
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
      user.createUser(userData, function(createdUser, error) {
        // callback with the error, this will cause async module to stop executing remaining
        // functions and jump immediately to the final function, it is important to return
        // so that the task callback isn't called twice
        if (error) return callback(error);

        // user created successfully
        logger.info("Created user: " + createdUser.id);
        logger.info("Created user: " + createdUser.id + " - " + formData.firstName + " " + formData.middleName + " " + formData.lastName);
        content.createdUser = createdUser;
        callback(null);
      });
    }
  ], function(err) {
    if (err) {
      logger.error("Failed during user creation", err);
      res.status(500).send({"error": "We have experienced a problem processing your request, please try again later."});
      return;
    }
    // send success to client
    res.status(200).send({"id" : content.createdUser.id});
  });
});

// Display the register user form
router.get('/:userId/register/:offeringId', function(req, res, next) {

  content = {
    title: "Course Registration",
    user: {
      id: req.params.userId
    },
    offeringId: req.params.offeringId
  };

  logger.info("Registering student, " + JSON.stringify(content));
  res.render('manage/user/register', content);
});


module.exports = router;
