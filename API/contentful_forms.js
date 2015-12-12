var request = require('request');
var logger = require('../logger');
var config = require('konphyg')(__dirname + "/../config");
var common = require("../helpers/common.js");

module.exports = {
  getInquiryForm: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+ config("properties").contentfulSpace_Main +'/entries/' + config("properties").contentfulEntry_InquiryForm;
    request({
      method: 'GET',
      url: targetURL,
      headers: {
        'Authorization': 'Bearer ' + config("properties").contentfulAuthKey_Main
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
    var targetURL = 'https://cdn.contentful.com/spaces/'+ config("properties").contentfulSpace_Main +'/entries/' + config("properties").contentfulEntry_ContactUs;
    request({
      method: 'GET',
      url: targetURL,
      headers: {
        'Authorization': 'Bearer ' + config("properties").contentfulAuthKey_Main
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
    var targetURL = 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/' + entryId;
    request({
      method: 'GET',
      url: targetURL,
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
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
