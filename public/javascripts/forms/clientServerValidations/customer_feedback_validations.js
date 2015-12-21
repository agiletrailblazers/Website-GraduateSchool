(function(exports){

    exports.typeOfPerson = function (server, input) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      if (!input) {
        result.status = false;
        result.errMsg = "Please select Which Best Describes You?";
      }
      console.log('kj '+result);
      return result;
    },

    exports.feedback = function (server, input) {
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
