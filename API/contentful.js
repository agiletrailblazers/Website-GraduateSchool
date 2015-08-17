var contentful = require('contentful');
var request = require('request');

var client = contentful.createClient({
  accessToken: '940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652',
  host: 'production.contentful.com',
  space: 'jzmztwi1xqvn'
});

module.exports = {
  getWhatsNew: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }}, function (error, response, body) {
      console.log('Status:', response.statusCode);
      cmsEntry = JSON.parse(body);
      console.log(cmsEntry.fields.topBanners);
      return callback({cmsEntry: cmsEntry, statusCode: response.statusCode});
    });
  },
  //Below function is for the future use to support image assets.
  getAsset: function(space, asset, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/'+ space +'/assets/' + asset + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }}, function (error, response, body) {
      console.log('Status:', response.statusCode);
      asset = JSON.parse(body);
      return callback(asset);
    });
  },
  getSyllabus: function(entry, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/' + entry + '?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }}, function(error, response, body) {
          syllabus = JSON.parse(body);
          return callback(syllabus);
      });
  },
  getContentAsset: function(space, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/'+ space +'/assets/'+ '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }}, function (error, response, body) {

      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured in getting the images " + error);
        return callback(response, new Error("Exception occured in getting the images"), null);
      }
      console.log('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);

    });
  }
};
