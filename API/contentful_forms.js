var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + "/../config");

module.exports = {
  getInquiryForm: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/'+ config("endpoint").contentfulSpace_Main +'/entries/' + config("endpoint").contentfulEntry_InquiryForm,
      headers: {
        'Authorization': 'Bearer ' + config("endpoint").contentfulAuthKey_Main
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
	      url: 'https://cdn.contentful.com/spaces/'+ config("endpoint").contentfulSpace_Main +'/entries/' + config("endpoint").contentfulEntry_ContactUs,
	      headers: {
	        'Authorization': 'Bearer ' + config("endpoint").contentfulAuthKey_Main
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
