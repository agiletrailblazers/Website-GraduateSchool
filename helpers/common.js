var logger = require('../logger');
var config = require('konphyg')(__dirname + '/../config');
var request = require('request');
var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');

var cacheEnvPrefix = config("properties").env + "-";

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

redirectToError = function (res) {
  res.writeHead(302, { 'Location': '/error_page.html' });
  res.end();
};

// execute an http 'request' and cache the response and use cached responses before calling
cachedRequest = function (reqParams, callback) {
  if (config("properties").contentfulCache.turnOn == true) {
    var contentCache = cacheManager.caching({
      store: redisStore,
      host: config("properties").contentfulCache.redis.host,
      port: config("properties").contentfulCache.redis.port,
      db: config("properties").contentfulCache.redis.db,
      ttl: config("properties").contentfulCache.ttl,
      max_attempts: config("properties").contentfulCache.redis.max_attempts
    });

    // listen for redis connection error event
    contentCache.store.events.on('redisError', function (error) {
      // handle error here
      logger.error(error);
    });

    contentCache.get(cacheEnvPrefix + reqParams.url, function(err, result) {
      if (result != undefined) {
        callback(null, result.response, result.body);
        if (config("properties").contentfulCache.loggerOn) logger.info('Using cached content for: ' + reqParams.url);
        return;
      }
      request(reqParams, function(error, response, body) {
        if (config("properties").contentfulCache.loggerOn) logger.info('Fetching new content for: ' + reqParams.url);
        if (!error && response && (response.statusCode >= 200 && response.statusCode < 300)) {
          obj = { response: JSON.stringify(response), body: body };
          contentCache.set(cacheEnvPrefix + reqParams.url, obj);
        }
        callback(error, response, body);
      });
    });
  } else {
    request(reqParams, function(error, response, body) {
      callback(error, response, body);
    });
  }
};

// Contentful API uses pagination, by default it returns 100 elements in one page.
// If there are more than 100 elements then we need to call the API multiple times.
// skip parameter is used to specify the offset. With skip one should always use order
// parameter. The total number of elements is read from total field.
// Rather than loops with callback function, we will be using recursive function
requestWithPagination = function (reqParams, callback) {
  if (config("properties").contentfulCache.loggerOn) {
    logger.info('Fetching new content for: ' + reqParams.url);
  }

  // make the request
  request(reqParams, function(error, response, body) {
    if (!error && response && (response.statusCode >= 200 && response.statusCode < 300)) {
      var bodyJson = JSON.parse(body);
      if (bodyJson.items && bodyJson.items.length && bodyJson.total){
        if (bodyJson.items.length < bodyJson.total) {
          // we need pagination. The request above was not necessarily
          // made with order parameter. We will need to reset the length
          // of array first
          bodyJson.items = [];
          //make recursive call. bodyJson is passed as reference so will get updated in the
          // called function.
          requestRecursive(reqParams, bodyJson, function (error, response){
            callback(error, response, JSON.stringify(bodyJson));
          });
        } else {
          callback(error, response, body);
        }
      } else {
        callback(error, response, body);
      }
    }
    else {
      callback(error, response, body);
    }
  });
};

requestRecursive = function (reqParams, bodyJson, callback) {
  // make a copy so that the original url is preserved for caching purposes
  var req = JSON.parse(JSON.stringify(reqParams));

  // specify the right offset and the order
  req.url = req.url + '&skip=' + bodyJson.items.length + '&order=sys.createdAt';

  // make the request
  request(req, function(err, resp, bodyString) {
    if (!err && resp && (resp.statusCode >= 200 && resp.statusCode < 300)){
      // append the new array into the old one
      Array.prototype.push.apply(bodyJson.items, JSON.parse(bodyString).items);
      // if the length is still not enough we call again, otherwise we are done.
      if (bodyJson.items.length < bodyJson.total){
        requestRecursive (reqParams, bodyJson, function(error, response){
          callback(error, response);
        });
      } else {
        callback(err, resp);
      }
    } else {
      callback(err, resp);
    }
  });
};

// NUTCH and solr will use meta tag for sorting. The metatag will be
// a string. This function provides conversion from numbers (user friendly priority) into
// aplhabetical priority (solr friendly)
convertPageSearchPriorityToString = function (priority) {
  if (isNotEmpty(priority)) {
    var priorityInChar;
    switch(priority) {
    case 11:
        priorityInChar = 'B';
        break;
    case 12:
        priorityInChar = 'C';
        break;
    case 13:
        priorityInChar = 'D';
        break;
    case 14:
        priorityInChar = 'E';
        break;

    default:
        priorityInChar = 'Z';
        if (priority < 11) {
          priorityInChar = 'A';
        }
        break;
    }
    return priorityInChar;
  } else {
    return priority;
  }
}

module.exports = {
  isNotEmpty: isNotEmpty,
  isEmpty: isEmpty,
  isNotEmptyOrAll: isNotEmptyOrAll,
  checkForErrorAndLog: checkForErrorAndLog,
  checkForErrorAndLogExceptCodes: checkForErrorAndLogExceptCodes,
  redirectToError: redirectToError,
  cachedRequest: cachedRequest,
  cacheManager: this.cacheManager,
  config: this.config,
  convertPageSearchPriorityToString
};
