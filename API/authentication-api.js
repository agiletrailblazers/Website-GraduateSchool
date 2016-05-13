var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + '/../config');
var common = require("../helpers/common.js");
var session = require("./manage/session-api.js");
var crypto = require('crypto');

getAuthToken = function (req, res, callback) {
    logger.debug("No token found, retrieving a new one");
    var targetURL = config("properties").apiServer + '/api/tokens';
    request({
        method: 'GET',
        url: targetURL
    }, function (error, response, body) {
        if (common.checkForErrorAndLog(error, response, targetURL)) {
            return callback(new Error("Exception occurred getting auth token"), null);
        }
        var newToken = JSON.parse(body).token;
        logger.debug("Got new token " + newToken);
        return callback(null, newToken);
    });
};

encryptPassword = function (password) {
    return crypto.createHash('sha256').update(password, 'UTF8').digest('hex').toUpperCase();
};

loginUser = function(req, res, authCredentials, callback) {
    var targetURL = config("properties").apiServer + '/api/authentication';
    var currentAuthToken = session.getSessionData(req, "authToken");

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
        logger.info("Logged in username: " + body.user.username + " with token: " + body.authToken.token + " and renewalToken : " + body.renewalToken.token);

        // add the user to session
        session.setSessionData(req, "user", body.user);

        // add tokens to session
        session.setSessionData(req, "authToken", body.authToken.token);
        session.setSessionData(req, "renewalToken", body.renewalToken.token);

        return callback(null, body, response.statusCode);
    });
};

validateAuthToken = function (req, res, callback) {
    var currentAuthToken = session.getSessionData(req, "authToken");
    var renewalToken = session.getSessionData(req, "renewalToken");
    var reAuthCredentials = {
        "authToken": {
            token : currentAuthToken
        },
        "renewalToken": {
            token : renewalToken
        }
    };
    var targetURL = config("properties").apiServer + '/api/reauthentication';
    request({
        method: 'POST',
        url: targetURL,
        json: reAuthCredentials,
        headers: {
            'Authorization': currentAuthToken
        }
    }, function (error, response, body) {
        var statusCode = response ? response.statusCode : null;
        logger.debug("Reauthentication: " + statusCode);
        if (error || !response || (statusCode != 200 && statusCode != 401)) {
            return callback(new Error("Error reauthenticating token"), null, statusCode)
        }
        var token = null;
        if (common.isNotEmpty(body)) {
            token = common.isNotEmpty(body.token) ? body.token : null
        }
        return callback(null, token, statusCode);
    });
};

module.exports = {
    getAuthToken: getAuthToken,
    loginUser: loginUser,
    validateAuthToken: validateAuthToken,
    encryptPassword: encryptPassword
};