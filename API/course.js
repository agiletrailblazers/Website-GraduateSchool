var request = require('request');

module.exports = {
  performCourseSearch: function(callback, searchCriteria) {
    //TODO: environmentalize the URL for course search (this is dev)
    request({
      method: 'GET',
      url: 'http://54.88.17.121:8080/api/course?search=' + searchCriteria
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
