var request = require('request');
var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");

module.exports = {
  createUser: function(userData, callback) {
    var targetURL = config("properties").apiServer + '/api/user';
    request({
      method: 'POST',
      url: targetURL,
      json: userData
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occured creating user"), null);
      }
      return callback(null, body);
    });
  },

  // registrationList is an array of registration objects
  registerUser: function(userId, registrationList, callback) {
    var targetURL = config("properties").apiServer + '/api/registration/user/' + userId;
    request({
      method: 'POST',
      url: targetURL,
      json: registrationList
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occured registering user"), null);
      }
      return callback(null, body);
    });
  }

};
