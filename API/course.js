var request = require('request');

module.exports = {
  performCourseSearch: function(callback, searchCriteria) {
    console.log('statrted');
    //TODO: environmentalize the URL for course search (this is dev)
    request({
      method: 'GET',
      url: 'http://54.88.17.121:8080/api/course?search=' + searchCriteria + ''
    }, function (error, response, body) {
      if (response == null || response.statusCode != 200) {
        //TODO: add error handling
        console.log("Exception occured performing course search: " + error);
        result = null;
      }
      else {
        console.log('Status:', response.statusCode);
        result = JSON.parse(body);
      }
      return callback(response, error, result);
    })
  }
};
