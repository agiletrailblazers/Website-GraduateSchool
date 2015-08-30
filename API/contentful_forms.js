var request = require('request');
var logger = require('../logger');

module.exports = {
  getInquiryForm: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/tz32dajhh9bn/entries/80IOLAFnVuYGk6U4ocooC',
      headers: {
        'Authorization': 'Bearer 093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af'
      }
    }, function(error, response, body) {
      logger.debug("Forms Get Inquiry Contentful: " + response.statusCode);
      form = JSON.parse(body);
      return callback(form);
    });
  },
  getContactUs: function(callback) {
	    request({
	      method: 'GET',
	      url: 'https://cdn.contentful.com/spaces/tz32dajhh9bn/entries/6Av0MIjzZC2qIsGKUGyKS0',
	      headers: {
	        'Authorization': 'Bearer 093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af'
	      }
	    }, function(error, response, body) {
        logger.debug("Forms Contact Us Contentful: " + response.statusCode);
	      cmsEntry = JSON.parse(body);
	      return callback({
	        cmsEntry: cmsEntry,
	        statusCode: response.statusCode
	      });
	    });
	  }
};
