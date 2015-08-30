var request = require('request');

module.exports = {
  getWhatsNew: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
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
      asset = JSON.parse(body);
      return callback(asset);
    });
  },
  getSyllabus: function(entry, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/0rlhdagwnyoo/entries/' + entry + '',
      headers: {
        'Authorization': 'Bearer d60cc07cb9754202a1483b9e4758b9a38dae4823d6891676b7ac1640daaf09f8'
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
      url: 'https://cdn.contentful.com/spaces/uoxr2n07eksi/entries?content_type=2wKn6yEnZewu2SCCkus4as&order=-fields.date',
      headers: {
        'Authorization': 'Bearer a4b26b024423366c60bfc912d2b367fda2a6038f4cde24778f9b9edb5f067d2e'
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
      url: 'https://cdn.contentful.com/spaces/uoxr2n07eksi/entries?content_type=2wKn6yEnZewu2SCCkus4as&fields.slug=' + slug + '',
      headers: {
        'Authorization': 'Bearer a4b26b024423366c60bfc912d2b367fda2a6038f4cde24778f9b9edb5f067d2e'
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
      url: 'https://cdn.contentful.com/spaces/5tnto6ug3qkh/entries/6A8kbegf6Me6aKKeCECiQE',
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
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/?content_type=rrnJXELzeC4O8Mc8oQUqK&fields.slug=' + slug + '',
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
  getCourseSearch: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/3AdFDCVaOIeQSgemcmkGqk',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry.fields);
    });
  },
  getCourseDetails: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/1Cwi1ay4SEWcIYAy8EAu8U',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry.fields);
    });
  }
};
