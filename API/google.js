var request = require('request');
var async = require('async');
var logger = require('../logger');
var common = require("../helpers/common.js");

module.exports = {
  verifyCaptcha: function(callback, captchaResponse) {
    var targetURL = 'https://www.google.com/recaptcha/api/siteverify?secret=6Lfj4AsTAAAAAE0Bpvzcdxdg-dRvfAaS6ZI8_Duc&response=' + captchaResponse;
    logger.debug("Started captcha");
    request({
      method: 'POST',
      url: targetURL
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        // the google response might have something we need, even if an error, so pass it back to caller
        return callback(response, new Error("Exception occured verifying captcha"));
      }
      logger.debug('Got captcha response: ' + response.statusCode);
      return callback(response, null);
    })
  }
};
