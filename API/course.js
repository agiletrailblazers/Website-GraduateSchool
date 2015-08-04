var request = require('request');
var async = require('async');
var config = require('konphyg')(__dirname + "/../config");

module.exports = {
  performCourseSearch: function(callback, searchCriteria) {
    var courseApiUrl = config("endpoint").courseApiUrl;
    console.log(courseApiUrl);
    request({
      method: 'GET',
      url: courseApiUrl + '/api/courses?search=' + searchCriteria + ''
    }, function (error, response, body) {
      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured performing course search. " + error);
        return callback(response, new Error("Exception occured performing couse search"), null);
      }
      console.log('Status:', response.statusCode);
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
      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured performing course search. " + error);
        return callback(response, new Error("Exception occured performing exact course search"), null);
      }
      console.log('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getSchedule: function(callback, courseId) {
    console.log(courseId);
    var courseApiUrl = config("endpoint").courseApiUrl;
    request({
      method: 'GET',
      url: courseApiUrl + '/api/courses/' + courseId + '/sessions'
    }, function (error, response, body) {
      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured performing course schedule search. " + error);
        return callback(response, new Error("Exception occured performing couse search"), null);
      }
      console.log('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  }
};
