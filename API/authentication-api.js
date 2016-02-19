var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + '/../config');
var common = require("../helpers/common.js");

checkForAndGetAuthToken = function (req, res, callback) {
    var tokenCookie  = config("properties").authenticate.tokenName;
    logger.debug("Reading token data from " + tokenCookie);

    var token = req.cookies[tokenCookie] ? req.cookies[tokenCookie] : null;

    logger.debug("Token data is {}", token);
    if (!token) {
        logger.debug("No token found, retrieving a new one");
        getGuestToken(function(error, tokenData) {
            if (error) {
                return callback(error, null);
            }

            logger.debug("Got new token " + tokenData.token);

            res.cookie(tokenCookie, tokenData.token, {maxAge: config("properties").authenticate.tokenTimeout});

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

module.exports = {
    checkForAndGetAuthToken: checkForAndGetAuthToken,
    getGuestToken: getGuestToken
};