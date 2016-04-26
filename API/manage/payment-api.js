var request = require('request');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");

module.exports = {
  sendAuthReversal: function(payments, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/payments/reversals';
    request({
      method: 'POST',
      url: targetURL,
      json: payments,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(new Error("Exception occurred sending payment auth reversal"), null);
      }
      // response has no content
      return callback(null, null);
    });
  }
};
