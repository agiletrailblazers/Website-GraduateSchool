(function(exports){

    exports.typeOfPerson = function (server, input) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      var currValidator;
      if (server) {
        currValidator = require('validator');
      } else {
        currValidator = validator;
      }

      if (!currValidator.isLength(input.trim(), 1)){
        result.status = false;
        result.errMsg = "Please select Which Best Describes You?";
      }
      return result;
    },

    exports.feedbackCategory = function (server, input) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      if (!input) {
        result.status = false;
        result.errMsg = "Please select or enter Area Of Feedback.";
      }
      return result;
    },

    exports.feedbackText = function (server, input) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      var currValidator;
      if (server) {
        currValidator = require('validator');
      } else {
        currValidator = validator;
      }

      if (!currValidator.isLength(input.trim(), 3)){
        result.status = false;
        result.errMsg = "Please enter your Feedback.";
      }
      return result;
    };
})(typeof exports === 'undefined'? this['customer_feedback_validations']={}: exports);
