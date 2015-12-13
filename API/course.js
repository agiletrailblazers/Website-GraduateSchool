var request = require('request');
var async = require('async');
var config = require('konphyg')(__dirname + "/../config");
var logger = require('../logger');
var common = require("../helpers/common.js");

module.exports = {
  performCourseSearch: function(callback, params) {
    var courseApiUrl = config("properties").courseApiUrl;
    courseApiUrl = courseApiUrl + '/api/courses?search=' + encodeURIComponent(params.searchCriteria)  ;
    if (common.isNotEmpty(params.numRequested)) {
      courseApiUrl = courseApiUrl + '&numRequested=' + params.numRequested;
    }
    if (common.isNotEmptyOrAll(params.cityState)) {
      courseApiUrl = courseApiUrl + '&filter=city_state:' + params.cityState;
    }
    if (common.isNotEmptyOrAll(params.categorySubject) && common.isNotEmptyOrAll(params.categorySubjectType)) {
      if (params.categorySubjectType === 'category') {
        courseApiUrl = courseApiUrl + '&filter=category:' + params.categorySubject;
      } else {
        courseApiUrl = courseApiUrl + '&filter=category_subject:' + params.categorySubject;
      }
    }
    if (params.page && common.isNotEmpty(params.page.course)) {
      courseApiUrl = courseApiUrl + '&page='+ params.page.course;
    }
    if (common.isNotEmptyOrAll(params.deliveryMethod)) {
      courseApiUrl = courseApiUrl + '&filter=delivery_method:' + params.deliveryMethod;
    }
    if (params.selectedG2G == "true" ) {
      courseApiUrl = courseApiUrl + '&filter=status:C';
    }
    logger.debug(courseApiUrl);
    request({
      method: 'GET',
      url: courseApiUrl
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, courseApiUrl)) {
       return callback(response, new Error("Exception occured performing couse search"), null);
     }
      logger.debug('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    })
  },
  performExactCourseSearch: function(callback, courseId) {
    var courseApiUrl = config("properties").courseApiUrl + '/api/courses/' + courseId;
    request({
      method: 'GET',
      url: courseApiUrl
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, courseApiUrl)) {
       return callback(response, new Error("Exception occured performing exact course search"), null);
      }
      logger.debug("Course Search: " + response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getSchedule: function(callback, courseId) {
    var courseApiUrl = config("properties").courseApiUrl + '/api/courses/' + courseId + '/sessions';
    request({
      method: 'GET',
      url: courseApiUrl
    }, function (error, response, body) {
      if (error || !response || (response.statusCode != 200 && response.statusCode != 404)) {
        var message = "Error performing course schedule search";
        if (response) {
          message = message + ", status code: " + response.statusCode;
        }
        if (error) {
          message = message + ", error message: " + error.message;
        }
        logger.error(message + ", url: " + courseApiUrl);
        return callback(response, new Error("Exception occured performing course search"), null);
      }
      if (response.statusCode == 404) {
        //404 is an expected response, so no need to log an error for it, return result as null
        return callback(response, error, null);
      }
      logger.debug("Course Schedule: " + response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCourses: function(callback) {
    var courseApiUrl = config("properties").courseApiUrl + '/api/courses';
    request({
      method: 'GET',
      url: courseApiUrl
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, courseApiUrl)) {
       return callback(response, new Error("Exception occured getting all courses"), null);
     }
      logger.debug("Get Courses: " + response.statusCode);
      result = JSON.parse(body).courses;
      return callback(response, error, result);
    });
  },
  getLocations: function(callback) {
    var courseApiUrl = config("properties").courseApiUrl + '/api/locations';
    request({
      method: 'GET',
      url: courseApiUrl
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, courseApiUrl)) {
       return callback(response, new Error("Exception occured getting all locations"), null);
      }
      logger.debug("Get Locations: " + response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCategories: function(callback) {
    var courseApiUrl = config("properties").courseApiUrl + '/api/courses/categories';
    request({
      method: 'GET',
      url: courseApiUrl
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, courseApiUrl)) {
       return callback(response, new Error("Exception occured getting all categories"), null);
      }
      logger.debug("Get Categories : " + response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  performSiteSearch: function(callback, params) {
    //skip search if result would be all pages
    if (common.isEmpty(params.searchCriteria) && (common.isEmpty(params.cityState) ||  params.cityState == 'all')) {
      return callback(null, null, {});
    }
    var siteApiUrl = config("properties").courseApiUrl;
    siteApiUrl = siteApiUrl + '/api/site?search=' + encodeURIComponent(params.searchCriteria)
    if (common.isNotEmpty(params.cityState) && params.cityState != 'all') {
      siteApiUrl = siteApiUrl + '&filter=content:' + params.cityState;
    }
    if (common.isNotEmpty(params.numRequested)) {
      siteApiUrl = siteApiUrl + '&numRequested=' + params.numRequested;
    }
    if (params.page && common.isNotEmpty(params.page.site)) {
      siteApiUrl = siteApiUrl + '&page='+ params.page.site;
    }
    logger.debug(siteApiUrl);
    request({
        method: 'GET',
        url: siteApiUrl
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, siteApiUrl)) {
       return callback(response, new Error("Exception occured performing Site search"), null);
      }
        logger.debug('Status:', response.statusCode);
        result = JSON.parse(body);
        return callback(response, error, result);
    });
  }
};
