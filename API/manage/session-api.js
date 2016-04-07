var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");
var async = require('async');

module.exports = {

  // get the session data associated with the specified http request
  getSessionData: function(req) {
    var sessionData;
    if (config("properties").useCache === true) {
      async.waterfall([ //TODO This doesn't seem to actually be blocking app.js
        function(callback) {
          var cache = req.app.get('cache');
          if (cache) {
            //Key into cache will be some cookie value  if they have it
            //key originally some randomguid. When they log in, they use their user id
            //when they log in transfer everything from the randomGuid to the UserId + environmentID
            var sessionName = config("properties").manage.sessionName;
            // session is currently stored in a cookie as a JSON string
            var cacheAccessKey = req.cookies[sessionName] ? req.cookies[sessionName] : "{}";

            cache.get(cacheAccessKey, function (err, result) {
              if (err) {
                callback(err, null);
              }
              else {
                logger.debug("Get session data: " + result);
                if (common.isNotEmpty(result)) {
                  callback(JSON.parse(result));
                }
                else {
                  callback("{}");
                }
              }
            });
          }
        }
    ], function (err, sessionData) {
        if (err) {
          logger.error("Couldn't connect to cache" + err);
          return;
        }
        else {
          return sessionData;
        }
      })
    }
    else {
      var sessionName = config("properties").manage.sessionName;
      // session is currently stored in a cookie as a JSON string
      var sessionData = req.cookies[sessionName] ? req.cookies[sessionName] : "{}";

      // convert the JSON string into a javascript object and return it
      logger.debug("Get session data: " + sessionData);
      return JSON.parse(sessionData);
    }
  },

  // set the session data associated with the specified http response
  setSessionData: function(req, res, sessionData) {
    if (config("properties").useCache === true) {
      var cache = req.app.get('cache');
      if (cache) {
        var cacheSessionDataAccessKey;
        if (common.isNotEmpty(req.query["sessionKey"])) {
          cacheSessionDataAccessKey = req.query["sessionKey"];
        }
        if (common.isEmpty(cacheSessionDataAccessKey)) {
          var sessionName = config("properties").manage.sessionName;
          cacheSessionDataAccessKey = req.cookies[sessionName] ? req.cookies[sessionName] : "{}";
          if (common.isEmpty(cacheSessionDataAccessKey)) {
            cacheSessionDataAccessKey = uuid.v4();
          }
        }
        sessionData.lasUpdated = Date.now();
        var sessionDataStr = JSON.stringify(sessionData);
        cache.set(cacheSessionDataAccessKey, sessionData);

        logger.debug("Set session data: " + sessionDataStr);
        res.cookie(config("properties").manage.sessionName, cacheSessionDataAccessKey);
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
      return;
    }
  },

  setGuestSessionToUserSession: function(req, res, userId) {
    var sessionName = config("properties").manage.sessionName;
    var cacheSessionDataAccessKey = req.cookies[sessionName] ? req.cookies[sessionName] : "{}";
    var sessionData = this.getSessionData(req, res, cacheSessionDataAccessKey);
    //delete old session data in cache
    var newAccessKey = userId + config("env");
    req.cookie(config("properties").manage.sessionName, newAccessKey);
    this.setSessionData(req, res, sessionData, newAccessKey);
  }
};
