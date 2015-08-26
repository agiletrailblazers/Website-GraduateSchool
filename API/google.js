var request = require('request');
var async = require('async');

module.exports = {
  verifyCaptcha: function(callback, captchaResponse) {
    console.log("started captcha");
    request({
      method: 'POST',
      url: 'https://www.google1.com/recaptcha/api/siteverify?secret=6Lfj4AsTAAAAAE0Bpvzcdxdg-dRvfAaS6ZI8_Duc&response=' + captchaResponse + ''
    }, function (error, response, body) {
      console.log("got captcha response");
      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured verifying captcha: " + error);
        return callback(response, new Error("Exception occured verifying captcha"), null);
      }
      console.log('Captcha Status: ' + response.statusCode);
      return callback(response);
    })
  }
};
