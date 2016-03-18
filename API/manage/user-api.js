var request = require('request');
var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");

module.exports = {
  createUser: function(userData, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/user';
    request({
      method: 'POST',
      url: targetURL,
      json: userData,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occrured creating user"), null);
      }
      return callback(null, body);
    });
  },

  // registrationRequest is an object containing a List of Registration objects and a List of Payment objects
  registerUser: function(userId, registrationRequest, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/registration/user/' + userId;
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
    var targetURL = config("properties").apiServer + '/api/user/' + userId;
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
    var targetURL = config("properties").apiServer + '/api/registration/user/' + userId + '/session/' + sessionId;
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

  getTimezones: function(callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/user/timezones';
    request({
      method: 'GET',
      url: targetURL,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occurred getting timezones"), null);
      }
      return callback(null, JSON.parse(body));
    });
  }
};
