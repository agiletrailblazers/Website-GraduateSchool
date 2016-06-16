var logger = require('../logger');
var config = require('konphyg')(__dirname + '/../config');
var request = require('request');
cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');

var cacheEnvPrefix = config("properties").env + "-";
if (config("properties").contentfulCache.turnOn == true) {

}

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

  if (config("properties").contentfulCache.turnOn == true) {
    contentCache.get(cacheEnvPrefix + reqParams.url, function(err, result) {
      if (result != undefined) {
        callback(null, result.response, result.body);
        if (config("properties").contentfulCache.loggerOn) logger.info('Using cached content for: ' + reqParams.url);
        return;
      }
      request(reqParams, function(error, response, body) {
        if (config("properties").contentfulCache.loggerOn) logger.info('Fetching new content for: ' + reqParams.url);

        if (config("properties").contentfulCache.turnOn == true) {
          if (!error && response && (response.statusCode >= 200 && response.statusCode < 300)) {
            obj = { response: JSON.stringify(response), body: body };
            contentCache.set(cacheEnvPrefix + reqParams.url, obj);
          }
        }
        callback(error, response, body);
      });
    });
  }
};

module.exports = {
  isNotEmpty: isNotEmpty,
  isEmpty: isEmpty,
  isNotEmptyOrAll: isNotEmptyOrAll,
  checkForErrorAndLog: checkForErrorAndLog,
  checkForErrorAndLogExceptCodes: checkForErrorAndLogExceptCodes,
  redirectToError: redirectToError,
  cachedRequest: cachedRequest
};
