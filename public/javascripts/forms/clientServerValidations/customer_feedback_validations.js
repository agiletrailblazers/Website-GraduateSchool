(function(exports){

    exports.comments = function (server, input) {
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
