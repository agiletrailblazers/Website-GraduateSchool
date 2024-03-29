var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + "/../config");
var common = require("../helpers/common.js");
var request = require('request');

module.exports = {
  getInquiryForm: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/'+config("properties").contentfulEntry_InquiryForm;
    common.cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(null, new Error("Exception occured in getting Inquiry Form"));
      }
      logger.debug("Forms Get Inquiry Contentful: " + response.statusCode);
      form = JSON.parse(body);
      return callback(form, null);
    });
  },
  getContactUs: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/'+config("properties").contentfulEntry_ContactUs;
    common.cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization':  config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(null, new Error("Exception occured in getting Contact Us"));
      }
      logger.debug("Forms Contact Us Contentful: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry, null);
    });
  },
  getFormWithHeaderAndFooter: function(entryId, callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/' + entryId;
    common.cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(null, new Error("Exception occured in getting Form with Header and Footer"));
      }
      logger.debug("Get Form With Header and Footer Request Form Contentful Response Code: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry, null);
    });
  }
};
