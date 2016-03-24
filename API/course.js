var request = require('request');
var async = require('async');
var config = require('konphyg')(__dirname + "/../config");
var logger = require('../logger');
var common = require("../helpers/common.js");

module.exports = {
  performCourseSearch: function(callback, params, authToken) {
    var apiServer = config("properties").apiServer;
    apiServer = apiServer + '/api/courses?search=' + encodeURIComponent(params.searchCriteria)  ;
    if (common.isNotEmpty(params.numRequested)) {
      apiServer = apiServer + '&numRequested=' + params.numRequested;
    }
    if (common.isNotEmptyOrAll(params.cityState)) {
      apiServer = apiServer + '&filter=city_state:' + params.cityState;
    }
    if (common.isNotEmptyOrAll(params.categorySubject) && common.isNotEmptyOrAll(params.categorySubjectType)) {
      if (params.categorySubjectType === 'category') {
        apiServer = apiServer + '&filter=category:' + params.categorySubject;
      } else {
        apiServer = apiServer + '&filter=category_subject:' + params.categorySubject;
      }
    }
    if (params.page && common.isNotEmpty(params.page.course)) {
      apiServer = apiServer + '&page='+ params.page.course;
    }
    if (common.isNotEmptyOrAll(params.deliveryMethod)) {
      apiServer = apiServer + '&filter=delivery_method:' + params.deliveryMethod;
    }
    if (params.selectedG2G == "true" ) {
      apiServer = apiServer + '&filter=status:C';
    }
    logger.debug(apiServer);
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred performing course search"), null);
     }
      logger.debug('Status:', response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    })
  },
  performExactCourseSearch: function(callback, courseId, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses/' + courseId;
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred performing exact course search"), null);
      }
      logger.debug("Course Search: " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getSchedule: function(callback, courseId, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses/' + courseId + '/sessions';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (error || !response || (response.statusCode != 200 && response.statusCode != 404)) {
        var message = "Error performing course schedule search";
        if (response) {
          message = message + ", status code: " + response.statusCode;
        }
        if (error) {
          message = message + ", error message: " + error.message;
        }
        logger.error(message + ", url: " + apiServer);
        return callback(response, new Error("Exception occurred performing course search"), null);
      }
      if (response.statusCode == 404) {
        //404 is an expected response, so no need to log an error for it, return result as null
        return callback(response, error, null);
      }
      logger.debug("Course Schedule: " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCourses: function(callback, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred getting all courses"), null);
     }
      logger.debug("Get Courses: " + response.statusCode);
      var result = JSON.parse(body).courses;
      return callback(response, error, result);
    });
  },
  getLocations: function(callback, authToken) {
    var apiServer = config("properties").apiServer + '/api/locations';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred getting all locations"), null);
      }
      logger.debug("Get Locations: " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCategories: function(callback, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses/categories';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred getting all categories"), null);
      }
      logger.debug("Get Categories : " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  performSiteSearch: function(callback, params, authToken) {
    //skip search if result would be all pages
    if (common.isEmpty(params.searchCriteria) && (common.isEmpty(params.cityState) ||  params.cityState == 'all')) {
      return callback(null, null, {});
    }
    var siteapiServer = config("properties").apiServer;
    siteapiServer = siteapiServer + '/api/site?search=' + encodeURIComponent(params.searchCriteria)
    if (common.isNotEmpty(params.cityState) && params.cityState != 'all') {
      siteapiServer = siteapiServer + '&filter=content:' + params.cityState;
    }
    if (common.isNotEmpty(params.numRequested)) {
      siteapiServer = siteapiServer + '&numRequested=' + params.numRequested;
    }
    if (params.page && common.isNotEmpty(params.page.site)) {
      siteapiServer = siteapiServer + '&page='+ params.page.site;
    }
    logger.debug(siteapiServer);
    request({
        method: 'GET',
        url: siteapiServer,
        headers: {
          'Authorization': authToken
        }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, siteapiServer)) {
       return callback(response, new Error("Exception occurred performing Site search"), null);
      }
        logger.debug('Status:', response.statusCode);
        var result = JSON.parse(body);
        return callback(response, error, result);
    });
  },
  // API to retrieve a specific course session by its ID
  getSession: function(sessionId, callback, authToken) {
    // url for the API call
    var sessionUrl = config("properties").apiServer + '/api/courses/session/' + sessionId;
    request({
      method: 'GET',
      url: sessionUrl,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, sessionUrl)) {
        return callback(new Error("Exception occurred getting session " + sessionId), null);
      }
      return callback(null, JSON.parse(body));
    });
  },
  // API to retrieve a specific course session by its ID
  getSessions: function(callback, authToken, sessionStatus, sessionDomain) {
    // url for the API call
    var url = config("properties").apiServer + '/api/courses/sessions?status=c&sessiondomain=CD';
    request({
      method: 'GET',
      url: url,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, url)) {
        return callback(new Error("Exception occurred getting sessions " + url), null);
      }

      return callback(null, JSON.parse(body));
    });
  }
};
