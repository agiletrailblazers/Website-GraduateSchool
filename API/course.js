var request = require('request');

module.exports = {
  performCourseSearch: function(callback, searchCriteria) {
    request({
      method: 'GET',
      url: 'http://localhost:8080/api/course?search=' + searchCriteria
    }, function (error, response, body) {
      console.log('Status:', response.statusCode);
      if (response.statusCode != 200) {
        //TODO: add error handling
      }
      entry = JSON.parse(body);
      return callback(entry);
    });
  }
};
