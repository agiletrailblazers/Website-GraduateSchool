var logger = require('../logger');

checkForErrorAndLogExceptCodes = function(error, response, url, httpCodesNotToLog) {
  // all 2xx status codes should be considered successful, not just 200
  if (error || !response || response.statusCode < 200 || response.statusCode > 299) {
    var logError = true;
    var i = 0;
    if (isNotEmpty(httpCodesNotToLog)) {
      for (i; i < httpCodesNotToLog.length; i++) {
        if (response.statusCode == httpCodesNotToLog[i]) {
          logError = false;
        }
      }
    }
    if (logError) {
      var message = "Error calling service";
      if (response) {
        message = message + ", status code: " + response.statusCode;
      }
      if (error) {
        message = message + ", error message: " + error.message;
      }
      logger.error(message + ", url: " + url);
    }
    return true;
  }
  return false;
};

checkForErrorAndLog = function(error, response, url) {
  var httpCodesNotToLog = [];
  var failed = checkForErrorAndLogExceptCodes(error, response, url, httpCodesNotToLog);
  return failed
};

//-- check if value is NOT empty
var isNotEmpty = function (val) {
  if (val != '' && val != null && typeof(val) != 'undefined') {
    return true;
  }
  return false;
};

//-- check if value is empty
isEmpty = function (val) {
  return !isNotEmpty(val);
};

//-- check if value is NOT empty or not 'all'
isNotEmptyOrAll = function (val) {
  if (val != '' && val != null && typeof(val) != 'undefined' && val != 'all') {
    return true;
  }
  return false;
};

//-- returns string of specified length or empty string
createTruncatedString = function (val, maxLength) {
  var truncatedValue = "";
  if(isNotEmpty(val)) {
    if (typeof val === 'string') {
      truncatedValue = val.substr(0, maxLength);
    }
  }
  return truncatedValue;
};

redirectToError = function (res) {
  res.writeHead(302, { 'Location': '/error_page.html' });
  res.end();
};

module.exports = {
  isNotEmpty: isNotEmpty,
  isEmpty: isEmpty,
  isNotEmptyOrAll: isNotEmptyOrAll,
  createTruncatedString: createTruncatedString,
  checkForErrorAndLog: checkForErrorAndLog,
  checkForErrorAndLogExceptCodes: checkForErrorAndLogExceptCodes,
  redirectToError: redirectToError
};
