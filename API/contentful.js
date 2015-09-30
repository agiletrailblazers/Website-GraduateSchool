var request = require('request');
var logger = require('../logger');

module.exports = {
  getWhatsNew: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      logger.debug("What's New Contentful: " + response.statusCode);
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
      logger.debug("Get Asset Contentful: " + response.statusCode);
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
      logger.debug("Syllabus Contentful: " + response.statusCode);
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
      logger.debug("Recent News Contentful: " + response.statusCode);
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
      logger.debug("News Post Contentful: " + response.statusCode);
      newsPost = JSON.parse(body);
      newsPost = newsPost;
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
      logger.debug("Get Content Asset Contentful: " + response.statusCode);
      if (error != null || response.statusCode != 200) {
        logger.error("Exception occured in getting the images " + error);
        return callback(response, new Error("Exception occured in getting the images"), null);
      }
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getNavigation: function(callback) {
    var MAX_LINKS = 20;
    var MAX_GROUPS = 7;
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/5tnto6ug3qkh/entries?include=2&content_type=47TLz18cmI6WaeC0KWgOIo',
      headers: {
        'Authorization': 'Bearer db132f1da5cc75a00f487cce1c94143798d8e5d12c65c169b2fc04febdfae44d'
      }
    }, function(error, response, body) {
      logger.debug("Main Nav Contentful: " + response.statusCode);
      if (error != null || response.statusCode != 200) {
        logger.error("Exception occured getting navigation " + error);
        return callback(response, new Error("Exception occured getting navigation"), null);
      }
      content = JSON.parse(body);
      var nav = {};
      if (content && content.items) {
        content.items.forEach(function(navEntry) {
          var groups = [];
          for(i=1; i<=MAX_GROUPS; i++) {
            createGroup(navEntry, groups, i);
          }
          if (navEntry.fields.title === 'Main Nav') {
            nav.main = groups;
          } else if (navEntry.fields.title === 'Footer') {
            nav.footer = groups;
          } else if (navEntry.fields.title === 'Top Nav') {
              nav.top = groups;
          }
        });
      }
      return callback(nav);
    })
    function createGroup(navEntry, groups, groupCount) {
      if (navEntry.fields['sectionTitle'+groupCount]) {
        var group = {};
        group.active = '';
        group.title = navEntry.fields['sectionTitle'+groupCount];
        group.key = navEntry.fields['sectionKey'+groupCount];
        if (groupCount == 1) {
          group.active = 'active';
        }
        var icon = navEntry.fields['sectionIcon'+groupCount];
        if (icon) {
          content.includes.Asset.forEach(function(asset) {
            if (icon.sys.id === asset.sys.id) {
              group.icon = asset.fields;
            }
          });
        }
        if (navEntry.fields['section'+groupCount]) {
          var sections = [];
          navEntry.fields['section'+groupCount].forEach(function(sectionEntry) {
            createSection(sections, sectionEntry);
          });
          group.sections = sections;
        }
        groups.push(group);
      }
    }
    function createSection(sections, sectionEntry) {
        var section = {};
        section.links = [];
        content.includes.Entry.forEach(function(linkEntry) {
          if (linkEntry.sys.id===sectionEntry.sys.id) {
            for(k=1; k<=MAX_LINKS; k++) {
              createLink(section, linkEntry, k);
            }
          }
      });
      sections.push(section);
    }
    function createLink(section, linkEntry, linkCount) {
      section.title = linkEntry.fields.title;
      section.startNewColumn = typeof(linkEntry.fields.startNewColumn)=='undefined' ? true : linkEntry.fields.startNewColumn;
      if (linkEntry.fields['link'+linkCount]) {
        var link = {};
        link.title = linkEntry.fields['link'+linkCount][0];
        link.url = linkEntry.fields['link'+linkCount][1];
        section.links.push(link);
      }
    }
  },
  getReferenceData: function(slug, callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/?content_type=rrnJXELzeC4O8Mc8oQUqK&fields.slug=' + slug + '',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      logger.debug("Reference Data Contentful: " + response.statusCode);
      var states = {};
      if (error != null || response == null || response.statusCode != 200) {
        logger.error("Exception occured getting reference data " + slug + " - " + error);
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
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/98qeodfc03o0/entries/?content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=' + slug + '',
      headers: {
        'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
      }
    }, function(error, response, body) {
      contentPage = JSON.parse(body);
      return callback(contentPage);
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
      logger.debug("Course Search Contentful: " + response.statusCode);
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
      logger.debug("Course Details Contentful: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry.fields);
    });
  },
  getHomepageSlider: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries?content_type=2Ak0RNhLwIwSGaiukUsCku',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      logger.debug("Homepage slider: " + response.statusCode);
      content = JSON.parse(body);
      var sliders = [];
      var itemCount = 0;
      if (content && content.items) {
        content.items.forEach(function(item) {
          sliders[itemCount] = item.fields;
          if (itemCount === 0) {
            sliders[itemCount].status = "active";
          }
          content.includes.Asset.forEach(function(asset) {
            if (item.fields.slideImage.sys.id === asset.sys.id) {
              sliders[itemCount].imageAsset = asset.fields;
            }
          });
          itemCount++;
        });
      }
      return callback(sliders);
    });
  },
  getForms: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries?content_type=5Lz9bSZNE4ACoykGQgQwUu',
      headers: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
       }
    }, function(error, response, body) {
      logger.debug("Get Forms Contentful: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback({
        cmsEntry: cmsEntry.items,
        cmsAsset: cmsEntry.includes.Asset,
        statusCode: response.statusCode
      });
    });
  },
  getTestimonial: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries?content_type=6xOVVkV7wc8ecwKqCaSwyW',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }
    }, function(error, response, body) {
      logger.debug("Marketing testimonial: " + response.statusCode);
      content = JSON.parse(body);
      var testimonial = [];
      var itemCount = 0;
      if (content && content.items) {
        content.items.forEach(function(item) {
          testimonial[itemCount] = item.fields;
          content.includes.Asset.forEach(function(asset) {
            if (item.fields.marketingImage.sys.id === asset.sys.id) {
              testimonial[itemCount].imageAsset = asset.fields;
            }
          });
          itemCount++;
        });
      }
      return callback(testimonial);
    });
  },
  getAlerts: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries?content_type=22JH0IRqc0iEqM2uMgMyyy',
      headers: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
       }
    }, function(error, response, body) {
      logger.debug("Get Alerts from Contentful: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry.items);
    });
  }

};
