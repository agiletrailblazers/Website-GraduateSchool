(function(exports){
    validateLength = function (server, input, fieldName, length) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      var currValidator;
      if (server) {
        currValidator = require('validator');
      } else {
        currValidator = validator;
      }

      if (!currValidator.isLength(input.trim(), length)){
        result.status = false;
        result.errMsg = fieldName + " is required and must be at least " + length + " characters."
      }
      return result;
    },

    validateEmail = function (server, input, fieldName) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      var currValidator;
      if (server) {
        currValidator = require('validator');
      } else {
        currValidator = validator;
      }

      if (!currValidator.isEmail(input.trim())){
        result.status = false;
        result.errMsg = fieldName + " is required and must be a properly formatted email address."
      }
      return result;
    },


    exports.captcha = function(googleResponse, skipReCaptcha) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      if (!skipReCaptcha) {
        console.log("Performing reCaptcha validation");
        if (!googleResponse){
          result.status = false;
          result.errMsg = "For security, please verify you are a real person below.";
        }
      }
      else {
        console.log("Skipping reCaptcha validation");
      }

      return result;
    },
    
    exports.name = function (server, input, fieldName) {
      var result = validateLength(server, input, fieldName, 2);
      return result;
    },

    exports.street = function (server, input, fieldName) {
      var result = validateLength(server, input, fieldName, 5);

      return result;
    },

    exports.city = function (server, input, fieldName) {
      var result = validateLength(server, input, fieldName, 3);
      return result;
    },

    exports.email = function (server, input, fieldName) {
      var result = validateEmail(server, input, fieldName);
      return result;
    };
})(typeof exports === 'undefined'? this['validations']={}: exports);
