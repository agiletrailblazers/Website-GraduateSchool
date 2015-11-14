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
      if (error != null || response == null || response.statusCode != 200) {
        logger.error("Exception occured performing course search. " + error);
        return callback(response, new Error("Exception occured performing couse search"), null);
      }
      logger.debug('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    })
  },
  performExactCourseSearch: function(callback, courseId) {
    var courseApiUrl = config("properties").courseApiUrl;
    request({
      method: 'GET',
      url: courseApiUrl + '/api/courses/' + courseId + ''
    }, function (error, response, body) {
      logger.debug("Course Search: " + response.statusCode);
      if (error != null || response.statusCode != 200) {
        logger.error("Exception occured performing exact course search. " + error);
        return callback(response, new Error("Exception occured performing exact course search"), null);
      }
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getSchedule: function(callback, courseId) {
    var courseApiUrl = config("properties").courseApiUrl;
    request({
      method: 'GET',
      url: courseApiUrl + '/api/courses/' + courseId + '/sessions'
    }, function (error, response, body) {
      logger.debug("Course Schedule: " + response.statusCode);
      if (error != null || response.statusCode != 200) {
        logger.error("Exception occured performing course schedule search. " + error);
        return callback(response, new Error("Exception occured performing couse search"), null);
      }
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCourses: function(callback) {
    var courseApiUrl = config("properties").courseApiUrl;
    request({
      method: 'GET',
      url: courseApiUrl + '/api/courses'
    }, function (error, response, body) {
      logger.debug("Get Courses: " + response.statusCode);
      if (error != null || response.statusCode != 200) {
        logger.error("Exception occured getting all courses. " + error);
        return callback(response, new Error("Exception occured getting all courses"), null);
      }
      result = JSON.parse(body).courses;
      return callback(response, error, result);
    });
  },
  getLocations: function(callback) {
    var courseApiUrl = config("properties").courseApiUrl;
    request({
      method: 'GET',
      url: courseApiUrl + '/api/locations'
    }, function (error, response, body) {
      logger.debug("Get Locations: " + response.statusCode);
      if (error != null || response == null || response.statusCode != 200) {
        logger.error("Exception occured getting all locations. " + error);
        return callback(response, new Error("Exception occured getting all locations"), null);
      }
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCategories: function(callback) {
    var courseApiUrl = config("properties").courseApiUrl;
    request({
      method: 'GET',
      url: courseApiUrl + '/api/courses/categories'
    }, function (error, response, body) {
      logger.debug("Get Categories : " + response.statusCode);
      if (error != null || response == null || response.statusCode != 200) {
        logger.error("Exception occured getting all categories. " + error);
        return callback(response, new Error("Exception occured getting all categories"), null);
      }
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
        if (error != null || response == null || response.statusCode != 200) {
            logger.error("Exception occured performing course search. " + error);
            return callback(response, new Error("Exception occured performing Site search"), null);
        }
        logger.debug('Status:', response.statusCode);
        result = JSON.parse(body);
        return callback(response, error, result);
    });
  }
};
