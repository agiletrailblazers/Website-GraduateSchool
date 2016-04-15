var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');
var common = require("../../helpers/common.js");
var uuid = require('uuid');

getSessionData = function(req, key){
  if(!req.session.sessionData){
    req.session.sessionData = {};
    return undefined;
  } else {
    return req.session.sessionData[key];
  }
};

setSessionData = function(req, key, value){
  if (!req.session.sessionData){
    req.session.sessionData = {};
  }
  req.session.sessionData[key] = value;
};

// clear a session data from the cache if it is no longer needed.
function clearSessionData(req) {
  req.session.sessionData = {};
};

module.exports = {
  getSessionData: getSessionData,
  setSessionData: setSessionData,
  clearSessionData: clearSessionData
};
