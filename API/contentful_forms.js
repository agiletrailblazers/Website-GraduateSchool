var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + "/../config");

module.exports = {
  getInquiryForm: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/'+ config("properties").contentfulSpace_Main +'/entries/' + config("properties").contentfulEntry_InquiryForm,
      headers: {
        'Authorization': 'Bearer ' + config("properties").contentfulAuthKey_Main
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
	      url: 'https://cdn.contentful.com/spaces/'+ config("properties").contentfulSpace_Main +'/entries/' + config("properties").contentfulEntry_ContactUs,
	      headers: {
	        'Authorization': 'Bearer ' + config("properties").contentfulAuthKey_Main
	      }
	    }, function(error, response, body) {
        logger.debug("Forms Contact Us Contentful: " + response.statusCode);
	      cmsEntry = JSON.parse(body);
	      return callback({
	        cmsEntry: cmsEntry,
	        statusCode: response.statusCode
	      });
	    });
	  },
  getDuplicateForms: function(callback) {
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
  },
  getFormWithHeaderAndFooter: function(callback, entryId) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/'+ entryId + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      logger.debug("Get Proctoring Request Form Contentful Response Code: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback({
        sectionTitle: cmsEntry.fields.sectionTitle,
        sectionHeaderDescription: cmsEntry.fields.sectionHeaderDescription,
        sectionFooterDescription: cmsEntry.fields.sectionFooterDescription,
        statusCode: response.statusCode
      });
    });
  };
