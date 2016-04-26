var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + '/../config');
var common = require("../helpers/common.js");

module.exports = {

  getTimezones: function(callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/common/timezones';
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
