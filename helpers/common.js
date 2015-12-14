var logger = require('../logger');

//-- check for errors and log the details
checkForErrorAndLog = function(error, response, url) {
  if (error || !response || (response.statusCode != 200)) {
    var message = "Error calling service";
    if (response) {
      message = message + ", status code: " + response.statusCode;
    }
    if (error) {
      message = message + ", error message: " + error.message;
    }
    logger.error(message + ", url: " + url);
    return true;
  }
  return false;
}


//-- check if value is NOT empty
var isNotEmpty = function (val) {
  if (val != '' && val != null && typeof(val) != 'undefined') {
    return true;
  }
  return false;
}

//-- check if value is empty
isEmpty = function (val) {
  return !isNotEmpty(val);
},

//-- check if value is NOT empty or not 'all'
isNotEmptyOrAll = function (val) {
  if (val != '' && val != null && typeof(val) != 'undefined' && val != 'all') {
    return true;
  }
  return false;
}

module.exports = {
  isNotEmpty: isNotEmpty,
  isEmpty: isEmpty,
  isNotEmptyOrAll: isNotEmptyOrAll,
  checkForErrorAndLog: checkForErrorAndLog
};
