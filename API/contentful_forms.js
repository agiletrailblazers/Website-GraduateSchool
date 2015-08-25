 var contentful = require('contentful');
var request = require('request');
module.exports = {
  getInquiryForm: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/tz32dajhh9bn/entries/80IOLAFnVuYGk6U4ocooC/?access_token=093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af',
      headers: {
        'Authorization': 'Bearer 093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af'
      }
    }, function(error, response, body) {
      form = JSON.parse(body);
      return callback(form);
    });
  },
  getContactUs: function(callback) {
	    request({
	      method: 'GET',
	      url: 'https://cdn.contentful.com/spaces/tz32dajhh9bn/entries/6Av0MIjzZC2qIsGKUGyKS0?access_token=093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af',
	      headers: {
	        'Authorization': 'Bearer 093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af'
	      }
	    }, function(error, response, body) {
	      console.log('Status:', response.statusCode);
	      cmsEntry = JSON.parse(body);
	      console.log(cmsEntry.fields.title);
	      return callback({
	        cmsEntry: cmsEntry,
	        statusCode: response.statusCode
	      });
	    });
	  }
};
