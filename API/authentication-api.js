var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + '/../config');
var common = require("../helpers/common.js");
var crypto = require('crypto');

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

encryptPassword = function (password) {
    return crypto.createHash('sha256').update(password, 'UTF8').digest('hex').toUpperCase();
};

loginUser = function(req, res, authCredentials, callback) {
    var targetURL = config("properties").apiServer + '/api/authentication';
    var currentAuthToken = req.query["authToken"];

    request({
        method: 'POST',
        url: targetURL,
        json: authCredentials,
        headers: {
            'Authorization': currentAuthToken
        }
    }, function (error, response, body) {
        var httpCodesNotToLog = [401];
        if (common.checkForErrorAndLogExceptCodes(error, response, targetURL, httpCodesNotToLog)) {
            return callback(new Error("Exception occurred logging in user"), null, response.statusCode);
        }
        logger.info("Logged in username: " + body.user.username + " with token: " + body.authToken.token);

        //Replace old token in cookie and req variable with new token
        var tokenCookieName  = config("properties").authenticate.tokenName;
        var tokenFromCookie = req.cookies[tokenCookieName] ? req.cookies[tokenCookieName] : null;

        if (tokenFromCookie) {
            logger.debug("Read token data to be replaced from " + tokenCookieName + ": " + tokenFromCookie);
        }

        res.cookie(tokenCookieName, body.authToken.token, {maxAge: config("properties").authenticate.tokenTimeout});

        req.query["authToken"] = body.authToken.token;

        logger.debug("New token set to: " + body.authToken.token);

        return callback(null, body, response.statusCode);
    });
};

logoutUser = function(req, res) {
    //Replace existing token cookie with one which expires immediately
    res.cookie(config("properties").authenticate.tokenName, null, { expires : new Date() });
}

module.exports = {
    getAuthToken: getAuthToken,
    getGuestToken: getGuestToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
    encryptPassword: encryptPassword
};