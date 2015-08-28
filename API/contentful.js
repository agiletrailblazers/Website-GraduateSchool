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
      }
    }, function(error, response, body) {
      console.log('Status:', response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback({
        cmsEntry: cmsEntry,
        statusCode: response.statusCode
      });
    });
  },
  //Below function is for the future use to support image assets.
  getAsset: function(space, asset, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/' + space + '/assets/' + asset + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
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
      }
    }, function(error, response, body) {
      syllabus = JSON.parse(body);
      return callback(syllabus);
    });
  },
  // Pulls all news entries from newest to oldest.
  getNewsRecent: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/uoxr2n07eksi/entries?access_token=a4b26b024423366c60bfc912d2b367fda2a6038f4cde24778f9b9edb5f067d2e&content_type=2wKn6yEnZewu2SCCkus4as&order=-fields.date',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      posts = JSON.parse(body);
      return callback(posts);
    });
  },
  // Pulls specific news detail (as an array).
  getNewsDetail: function(callback, slug) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/uoxr2n07eksi/entries?access_token=a4b26b024423366c60bfc912d2b367fda2a6038f4cde24778f9b9edb5f067d2e&content_type=2wKn6yEnZewu2SCCkus4as&fields.slug=' + slug + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      newsPost = JSON.parse(body);
      newsPost = newsPost.items;
      return callback(newsPost);
    });
  },
  getContentAsset: function(space, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/' + space + '/assets/' + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      if (error != null || response == null || response.statusCode != 200) {
        console.log("Exception occured in getting the images " + error);
        return callback(response, new Error("Exception occured in getting the images"), null);
      }
      console.log('Status:', response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getMainNav: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/5tnto6ug3qkh/entries/6A8kbegf6Me6aKKeCECiQE?access_token=db132f1da5cc75a00f487cce1c94143798d8e5d12c65c169b2fc04febdfae44d',
      headers: {
        'Authorization': 'Bearer db132f1da5cc75a00f487cce1c94143798d8e5d12c65c169b2fc04febdfae44d'
      }
    }, function(error, response, body) {
    	if (error != null || response == null || response.statusCode != 200) {
            console.log("Exception occured getting navigation " + error);
            return callback(response, new Error("Exception occured getting navigation"), null);
        }
        nav = JSON.parse(body);
        return callback(nav.fields.main);
    })
  },
  getReferenceData: function(slug, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652&content_type=rrnJXELzeC4O8Mc8oQUqK&fields.slug=' + slug + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
    	var states = {};
        if (error != null || response == null || response.statusCode != 200) {
            console.log("Exception occured getting reference data " + slug + " - " + error);
            return callback(response, new Error("Exception occured getting reference data " + slug), null);
        }
        ref = JSON.parse(body);
        if (ref.items && ref.items.length >= 1 && ref.items[0].fields && ref.items[0].fields.jsonContent) {
        	states = ref.items[0].fields.jsonContent;
        }
        return callback(states);
    });
  },
  getContentPage: function(callback, slug) {
    console.log(slug);
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/98qeodfc03o0/entries?access_token=a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0&content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=' + slug + '',
      headers: {
        'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
      }
    }, function(error, response, body) {
      contentPage = JSON.parse(body);
      contentPage = contentPage.items;
      return callback(contentPage);
    });
  }
};
