var request = require('request');
var config = require('konphyg')(__dirname + "/../config");

module.exports = {
  performCourseSearch: function(callback, searchCriteria) {
    var courseApiUrl = config("endpoint").courseApiUrl;
    console.log(courseApiUrl);
    request({
      method: 'GET',
      url: courseApiUrl + '/api/course?search=' + searchCriteria + ''
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
      url: 'http://54.88.17.121:8080' + '/api/course/' + courseId + ''
    }, function (error, response, body) {
      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured performing course search. " + error);
        return callback(response, new Error("Exception occured performing couse search"), null);
      }
      console.log('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  }
};
