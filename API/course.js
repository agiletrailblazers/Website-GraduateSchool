var request = require('request');

module.exports = {
  performCourseSearch: function(callback, searchCriteria) {
    //TODO: environmentalize the URL for course search (this is dev)
    request({
      method: 'GET',
      url: 'http://54.88.17.121:8080/api/course?search=' + searchCriteria + ''
    }, function (error, response, body) {
      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured performing course search. " + error);
        return callback(response, new Error("Exception occured performing couse search"), null);
      }
      console.log('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    })
  }
};
