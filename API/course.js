var request = require('request');
var async = require('async');
var config = require('konphyg')(__dirname + "/../config");
var logger = require('../logger');

module.exports = {
  performCourseSearch: function(callback, searchCriteria) {
    var courseApiUrl = config("endpoint").courseApiUrl;
    logger.debug(courseApiUrl);
    request({
      method: 'GET',
      url: courseApiUrl + '/api/courses?search=' + searchCriteria + ''
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
    var courseApiUrl = config("endpoint").courseApiUrl;
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
    var courseApiUrl = config("endpoint").courseApiUrl;
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
    var courseApiUrl = config("endpoint").courseApiUrl;
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
  }
  ,
  getLocations: function(callback) {
    var courseApiUrl = config("endpoint").courseApiUrl;
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
  }
};
