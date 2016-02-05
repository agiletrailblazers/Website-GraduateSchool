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
        return callback(null, new Error("Exception occured creating user"));
      }
      return callback(body, null);
    });
  }
};
