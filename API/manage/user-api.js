var request = require('request');
var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");
var session = require("./session-api.js");

module.exports = {
  createUser: function(userData, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/users';
    request({
      method: 'POST',
      url: targetURL,
      json: userData,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      var result = {
        validationErrors: null,
        duplicateUserError: false,
        generalError: false,
        createdUser: null
      };
      var errorMessage;
      if (error || !response) {
        // some other error
        result.generalError = true;
        errorMessage = "Failed during user creation due to other error"
      }
      else if (response.statusCode == 201) {
        // creation of user successful
        result.createdUser = body;
      }
      else if (response.statusCode == 400 && body && body.validationErrors) {
        // user not created and validation errors exist
        errorMessage = "Failed during user creation due to validation errors";
        result.validationErrors = body.validationErrors;
      }
      else if (response.statusCode == 409) {
        // user already exists
        errorMessage = "Failed during user creation due to username already in use";
        result.duplicateUserError = true;
      }
      else {
        // some other error
        result.generalError = true;

      }

      return callback((errorMessage ? new Error(errorMessage) : null), result);
    });
  },

  // registrationRequest is an object containing a List of Registration objects and a List of Payment objects
  registerUser: function(userId, registrationRequest, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/registrations/users/' + userId;
    request({
      method: 'POST',
      url: targetURL,
      json: registrationRequest,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {

      var result = {
        paymentAcceptedError: false,
        paymentDeclinedError: false,
        generalError: false,
        registrationResponse: null
      };

      if (error || !response) {
        // some other error
        result.generalError = true;
      }
      else if (response.statusCode == 201) {
        // payment and registration were successful
        result.registrationResponse = body;
      }
      else if (response.statusCode == 202) {
        // payment was accepted but registration not guaranteed
        result.paymentAcceptedError = true;
      }
      else if (response.statusCode == 402) {
        // payment was declined
        result.paymentDeclinedError = true;
      }
      else {
        // some other error
        result.generalError = true;
      }

      return callback(null, result);
    });
  },

  getUser: function(userId, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/users/' + userId;
    request({
      method: 'GET',
      url: targetURL,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occurred getting user" + userId), null);
      }
      return callback(null, JSON.parse(body));
    });
  },

  getRegistration: function(userId, sessionId, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/registrations/users/' + userId + '/sessions/' + sessionId;
    request({
      method: 'GET',
      url: targetURL,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (error || !response) {
        return callback(new Error("Exception occurred getting registration for user " + userId), null);
      }
      else if (response.statusCode == 404) {
        // no registrations found for this user and courseSession which is a normal case
        return callback(null, null);
      }
      else if (response.statusCode == 200) {
        // successfully found registration(s)
        return callback(null, JSON.parse(body));
      }
      else {
        // other error
        return callback(new Error("Exception occurred getting registration for user " + userId), null);
      }
    });
  },

  forgotPassword: function(req, authCredentials, callback) {

    var targetURL = config("properties").apiServer + '/api/users/password/forgot';
    var authToken = session.getSessionData(req, "authToken");
    var passwordReset = null;
    var userNotFound = null;
    var exception = null;

    request({
      method: 'POST',
      url: targetURL,
      json: authCredentials,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      var httpCodesNotToLog = [404];
      if (common.checkForErrorAndLogExceptCodes(error, response, targetURL, httpCodesNotToLog)) {
        if (response.statusCode == 404) {
          logger.debug("Password has not been reset for user: " + authCredentials.username + ", because user does not exist");
          passwordReset = false;
          userNotFound = true;
        }
        else {
          exception = new Error("Exception occurred resetting user password");
        }
      }

      if (response.statusCode == 204) {
        logger.info("Password has been reset for user: " + authCredentials.username);
        passwordReset = true;
        userNotFound = false;
      }

      return callback(exception, passwordReset, userNotFound);
    });
  },

  changeUserPassword: function(req, pwChangeCredentials, userId, callback) {
    var targetURL = config("properties").apiServer + '/api/users/' + userId + '/password';
    var currentAuthToken = session.getSessionData(req, "authToken");

    request({
      method: 'POST',
      url: targetURL,
      json: pwChangeCredentials,
      headers: {
        'Authorization': currentAuthToken
      }
    }, function (error, response) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occurred changing user password"), response.statusCode);
      }

      return callback(null, response.statusCode);
    });
  }

};
