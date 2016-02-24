var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + '/../config');
var common = require("../helpers/common.js");

getAuthToken = function (req, res, callback) {
    var tokenCookieName  = config("properties").authenticate.tokenName;
    logger.debug("Reading token data from " + tokenCookieName);

    var token = req.cookies[tokenCookieName] ? req.cookies[tokenCookieName] : null;

    logger.debug("Existing token is ", token);
    if (token) {
        callback(null, token);
    }
    else {
        logger.debug("No token found, retrieving a new one");
        getGuestToken(function(error, tokenData) {
            if (error) {
                return callback(error, null);
            }
            logger.debug("Got new token " + tokenData.token);

            res.cookie(tokenCookieName, tokenData.token, {maxAge: config("properties").authenticate.tokenTimeout});

            callback(null, tokenData.token);
        })
    }
};

getGuestToken = function (callback) {
    var targetURL = config("properties").apiServer + '/api/token';
    request({
        method: 'GET',
        url: targetURL
    }, function (error, response, body) {
        if (common.checkForErrorAndLog(error, response, targetURL)) {
            return callback(new Error("Exception occurred getting guest token"), null);
        }
        return callback(null, JSON.parse(body));
    });
};

loginUser = function(authCredentials, callback, authToken) {
    var targetURL = config("properties").apiServer + '/api/authentication';
    request({
        method: 'POST',
        url: targetURL,
        json: authCredentials,
        headers: {
            'Authorization': authToken
        }
    }, function (error, response, body) {
        if (common.checkForErrorAndLog(error, response, targetURL)) {
            return callback(new Error("Exception occurred logging in user"), null);
        }
        logger.info("Successfully logged in");
        return callback(null, body);
    });
};

setNewToken = function (req, res, newToken) {
    var tokenCookieName  = config("properties").authenticate.tokenName;
    var oldToken = req.cookies[tokenCookieName] ? req.cookies[tokenCookieName] : null;

    if (oldToken) {
        logger.debug("Read token data to be replaced from " + tokenCookieName + " token: " + oldToken);
    }
    res.cookie(tokenCookieName, newToken, {maxAge: config("properties").authenticate.tokenTimeout});
    logger.debug("New token set to: " + newToken);
};

module.exports = {
    getAuthToken: getAuthToken,
    getGuestToken: getGuestToken,
    loginUser: loginUser,
    setNewToken: setNewToken
};