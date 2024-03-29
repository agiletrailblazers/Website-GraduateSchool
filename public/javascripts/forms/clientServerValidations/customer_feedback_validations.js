(function(exports){

    exports.typeOfPerson = function (validator, input) {
      var result ={};
      result.status = true;
      result.errMsg = null;


      if (!validator.isLength(input.trim(), 1)){
        result.status = false;
        result.errMsg = "Please select Which Best Describes You?";
      }
      return result;
    },
    exports.feedbackCategory = function (validator, input) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      if (0 == input.length) {
        result.status = false;
        result.errMsg = "Please select or enter Area Of Feedback.";
      }
      return result;
    },
    exports.feedbackText = function (validator, input) {
      var result ={};
      result.status = true;
      result.errMsg = null;

      if (!validator.isLength(input.trim(), 3)){
        result.status = false;
        result.errMsg = "Please enter your Feedback.";
      }
      return result;
    };
})(typeof exports === 'undefined'? this['customer_feedback_validations']={}: exports);
