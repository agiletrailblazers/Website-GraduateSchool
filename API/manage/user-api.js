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
        return callback(new Error("Exception occured creating user"), null);
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
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occured registering user"), null);
      }
      return callback(null, body);
    });
  }

};
