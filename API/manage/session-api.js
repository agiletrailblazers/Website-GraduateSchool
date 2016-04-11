var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");
var uuid = require('uuid');

// get the session data associated with the specified http request
getSessionData = function(req, callback) {
  if (config("properties").useCache === true) {
    var sessionName = config("properties").manage.sessionName;
    var cacheAccessKey = req.cookies[sessionName];
    if (cacheAccessKey) {
      var cache = req.app.get('cache');
      if (cache) {
        cache.get(cacheAccessKey, function (err, result) {
          if (err) {
            callback(err, {});
          }
          else {
            logger.debug("Get session data: " + result);
            if (common.isNotEmpty(result)) {
              callback(null, JSON.parse(result));
            }
            else {
              callback(null, {});
            }
          }
        });
      }
      else {
        callback(null, {});
      }
    }
    else {
      callback(null, {});
    }
  }
  else {
    var sessionName = config("properties").manage.sessionName;
    // session is currently stored in a cookie as a JSON string
    var sessionData = req.cookies[sessionName] ? req.cookies[sessionName] : "{}";

    // convert the JSON string into a javascript object and return it
    logger.debug("Get session data: " + sessionData);
    callback(null, JSON.parse(sessionData));
  }
};

// set the session data associated with the specified http response
setSessionData = function(req, res, sessionData) {
  setSessionDataWithKey(req, res, sessionData, null);
};

setLoggedInUserSession = function(req, res, sessionData) {
  var sessionName = config("properties").manage.sessionName; //TODO getting the key from the last login
  var originalCacheAccessKey = req.cookies[sessionName];
  var newSessionAccessKey = sessionData.userId + config("properties").env;
  setSessionDataWithKey(req, res, sessionData, newSessionAccessKey);
  deleteSessionData(req, originalCacheAccessKey);
};

logoutUserSession = function(req, res) {
  var sessionData = {};
  setSessionDataWithKey(req, res, sessionData);
  res.cookie(config("properties").manage.sessionName, null, { expires : new Date() });
};

//The newSessionAccessKey should only be used when switching an existing cache to a new cache
function setSessionDataWithKey(req, res, sessionData, newSessionAccessKey) { //TODO should probably update
  if (config("properties").useCache === true) {
    var sessionName = config("properties").manage.sessionName;
    var cache = req.app.get('cache');
    if (cache) {
      var cacheSessionDataAccessKey;
      if (common.isNotEmpty(newSessionAccessKey)) {
        cacheSessionDataAccessKey = newSessionAccessKey;
      }
      else {
        cacheSessionDataAccessKey = req.cookies[sessionName];
        if (common.isEmpty(cacheSessionDataAccessKey)) {
          cacheSessionDataAccessKey = uuid.v4(); //TODO is this going to be a GUID or GUID + env
        }
      }
      sessionData.lastUpdated = Date.now();
      var sessionDataStr = JSON.stringify(sessionData);
      cache.set(cacheSessionDataAccessKey, sessionDataStr);
      console.log("ASHLEY - - - - -  - - - - - - " + sessionDataStr);
      logger.debug("Set session data: " + sessionDataStr);
      res.cookie(config("properties").manage.sessionName, cacheSessionDataAccessKey);
      req.app.set("sessionData", sessionData);
    }
  }
  else {
    // always update the timestamp in the session data
    sessionData.lastUpdated = Date.now();

    // serialize the session data to JSON for persistence
    var sessionDataStr = JSON.stringify(sessionData);
    logger.debug("Set session data: " + sessionDataStr);

    // session is currently stored in a cookie as a JSON string
    res.cookie(config("properties").manage.sessionName, sessionDataStr);
  }
};

// delete a session data in the cache if it is no longer needed.
function deleteSessionData(req, sessionDataAccessKey) {
  if (config("properties").useCache === true) {
    var cache = req.app.get('cache');
    if (cache) {
      cache.del(sessionDataAccessKey);
      logger.debug("Deleted session from the cache with key " + sessionDataAccessKey)
    }
  }
}

module.exports = {
  getSessionData: getSessionData,
  setSessionData: setSessionData,
  setLoggedInUserSession: setLoggedInUserSession,
  logoutUserSession: logoutUserSession
};
