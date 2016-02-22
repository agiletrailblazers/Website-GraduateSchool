var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');

module.exports = {

  // get the session data associated with the specified http request
  getSessionData: function(req) {
    var sessionName = config("properties").manage.sessionName;
    // session is currently stored in a cookie as a JSON string
    var sessionData = req.cookies[sessionName] ? req.cookies[sessionName] : "{}";

    // convert the JSON string into a javascript object and return it
    logger.debug("Get session data: " + sessionData);
    return JSON.parse(sessionData);
  },

  // set the session data associated with the specified http response
  setSessionData: function(res, sessionData) {

    // always update the timestamp in the session data
    sessionData.lastUpdated = Date.now();

    // serialize the session data to JSON for persistence
    var sessionDataStr = JSON.stringify(sessionData);
    logger.debug("Set session data: " + sessionDataStr);

    // session is currently stored in a cookie as a JSON string
    res.cookie(config("properties").manage.sessionName, sessionDataStr, {maxAge : config("properties").manage.sessionTimeout});
    return;
  }

};
