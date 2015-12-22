(function(exports){
    validateLength = function (validator, input, fieldName, length) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      if (!validator.isLength(input.trim(), length)){
        result.status = false;
        result.errMsg = fieldName + " is required and must be at least " + length + " characters."
      }
      return result;
    },

    validateEmail = function (validator, input, fieldName) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      if (!validator.isEmail(input.trim())){
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
        if (!googleResponse){
          result.status = false;
          result.errMsg = "For security, please verify you are a real person below.";
        }
      }
      else {
          console.log("Skipping reCaptcha validation.");
      }

      return result;
    },

    exports.name = function (validator, input, fieldName) {
      var result = validateLength(validator, input, fieldName, 2);
      return result;
    },

    exports.street = function (validator, input, fieldName) {
      var result = validateLength(validator, input, fieldName, 5);

      return result;
    },

    exports.city = function (validator, input, fieldName) {
      var result = validateLength(validator, input, fieldName, 3);
      return result;
    },

    exports.email = function (validator, input, fieldName) {
      var result = validateEmail(validator, input, fieldName);
      return result;
    };
})(typeof exports === 'undefined'? this['validations']={}: exports);
