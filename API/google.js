var request = require('request');
var async = require('async');
var logger = require('../logger');

module.exports = {
  verifyCaptcha: function(callback, captchaResponse) {
    logger.debug("Started captcha");
    request({
      method: 'POST',
      url: 'https://www.google.com/recaptcha/api/siteverify?secret=6Lfj4AsTAAAAAE0Bpvzcdxdg-dRvfAaS6ZI8_Duc&response=' + captchaResponse + ''
    }, function (error, response, body) {
      logger.debug('Got captcha response: ' + response.statusCode);
      if (error != null || response.statusCode != 200) {
        logger.error("Exception occured verifying captcha: " + error);
        return callback(response, new Error("Exception occured verifying captcha"), null);
      }
      return callback(response);
    })
  }
};
