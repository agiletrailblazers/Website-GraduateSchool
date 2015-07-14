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
      entry = JSON.parse(body);
      return callback(entry);
    });
  },
  getAsset: function(space, asset, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/'+ space +'/assets/' + asset + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }}, function (error, response, body) {
      console.log('Status:', response.statusCode);
      entry = JSON.parse(body);
      return callback(entry);
    });
  }
};
