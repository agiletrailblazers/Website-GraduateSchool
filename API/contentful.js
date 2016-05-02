var config = require('konphyg')(__dirname + '/../config');
var request = require('request'), cachedRequest = require('cached-request')(request),
  cacheDirectory = config("properties").contentfulCache.location;
var logger = require('../logger');
var common = require("../helpers/common.js");
cachedRequest.setCacheDirectory(cacheDirectory);
module.exports = {
  getWhatsNew: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/4QlvJ0GeQw4AY2QOq8SUMY';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting whats new"), null);
      }
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
    var targetURL = 'https://cdn.contentful.com/spaces/' + space + '/assets/' + asset;
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting asset"), null);
      }
      logger.debug("Get Asset Contentful: " + response.statusCode);
      asset = JSON.parse(body);
      return callback(asset);
    });
  },
  getSyllabus: function(entry, callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.courseData.spaceId+'/entries/' + entry;
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.courseData.authorization
      }
    }, function(error, response, body) {
      var httpCodesNotToLog = [404];
      if (common.checkForErrorAndLogExceptCodes(error, response, targetURL, httpCodesNotToLog)) {
        return callback(response, new Error("Exception occurred in getting the syllabus"), null);
      }
      logger.debug("Syllabus Contentful: " + response.statusCode);
      syllabus = JSON.parse(body);
      return callback(syllabus);
    });
  },
  // Pulls all news entries from newest to oldest.
  getNewsRecent: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.news.spaceId+'/entries?content_type=2wKn6yEnZewu2SCCkus4as&order=-fields.date';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.news.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the news recent"), null);
      }
      logger.debug("Recent News Contentful: " + response.statusCode);
      posts = JSON.parse(body);
      return callback(posts);
    });
  },
  // Pulls specific news detail (as an array).
  getNewsDetail: function(callback, slug) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.news.spaceId+'/entries?content_type=2wKn6yEnZewu2SCCkus4as&fields.slug=' + slug;
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.news.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the news detail"), null);
      }
      logger.debug("News Post Contentful: " + response.statusCode);
      newsPost = JSON.parse(body);
      newsPost = newsPost;
      return callback(newsPost);
    });
  },
  getContentAsset: function(space, callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/' + space + '/assets/';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the content asset"), null);
      }
      logger.debug("Get Content Asset Contentful: " + response.statusCode);
      result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getNavigation: function(callback) {
    var MAX_LINKS = config("properties").maxTopNavigationLinks;
    var MAX_GROUPS = config("properties").maxTopNavigationGroups;
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.navigation.spaceId+'/entries?include=2&content_type=47TLz18cmI6WaeC0KWgOIo';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.navigation.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the navigation"), null);
      }
      logger.debug("Main Nav Contentful: " + response.statusCode);
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
        link.newWindow = (linkEntry.fields['link'+linkCount][2]) === 'true' ? true : false;
        section.links.push(link);
      }
    }
  },
  getReferenceData: function(slug, callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/?content_type=rrnJXELzeC4O8Mc8oQUqK&fields.slug=' + slug;
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the reference data: " + slug), null);
      }
      logger.debug("Reference Data Contentful: " + response.statusCode);
      var data = {};
      ref = JSON.parse(body);
      if (ref.items && ref.items.length >= 1 && ref.items[0].fields && ref.items[0].fields.jsonContent) {
        data = ref.items[0].fields.jsonContent;
      }
      return callback(data);
    });
  },
  getContentPage: function(callback, slug) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.content.spaceId+'/entries/?content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=' + slug;
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.content.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) { //This call returns 200 even when nothing found
        return callback(response, new Error("Exception occurred in getting the content page, " + slug), null);
      }
      logger.debug("Content Page " +  slug + " Contentful: " + response.statusCode);
      contentPage = JSON.parse(body);
      return callback(contentPage);
    });
  },

  getGtoGPage: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.content.spaceId+'/entries?sys.id=60o2cWEaVaQAqwo2IcmcOU';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.content.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) { //This call returns 200 even when nothing found
        return callback(response, new Error("Exception occurred in getting the G2G content page, "), null);
      }
      logger.debug("G2G Page Contentful: " + response.statusCode);
      var contentPage = JSON.parse(body);

      return callback(contentPage);
    });
  },

  getLandingPage: function(callback, slug) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.landing.spaceId+
                    '/entries/?content_type=landingGeneric&fields.slug=' + slug;
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.landing.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) { //This call returns 200 even when nothing found
        return callback(response, new Error("Exception occurred in getting the landing page, " + slug), null);
      }
      logger.debug("Landing Page " +  slug + " Contentful: " + response.statusCode);
      landingPage = JSON.parse(body);
      return callback(landingPage);
    });
  },
  getCourseSearch: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/3AdFDCVaOIeQSgemcmkGqk';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the course search"), null);
      }
      logger.debug("Course Search Contentful: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry.fields);
    });
  },
  getCourseDetails: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/1Cwi1ay4SEWcIYAy8EAu8U';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the course details"), null);
      }
      logger.debug("Course Details Contentful: " + response.statusCode);
      cmsEntry = JSON.parse(body);
      return callback(cmsEntry.fields);
    });
  },
  getHomepageSlider: function(callback) {
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=2Ak0RNhLwIwSGaiukUsCku';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the homepage slider"), null);
      }
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
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=5Lz9bSZNE4ACoykGQgQwUu';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
      'Authorization': config("properties").spaces.main.authorization
       }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the forms"), null);
      }
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
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=6xOVVkV7wc8ecwKqCaSwyW';
    cachedRequest({
      method: 'GET',
      url: targetURL,
      ttl: config("properties").contentfulCache.timeout,
      headers: {
        'Authorization': config("properties").spaces.main.authorization
      }
    }, function(error, response, body) {
      if (common.checkForErrorAndLog(error, response, targetURL)) {
        return callback(response, new Error("Exception occurred in getting the testimonial"), null);
      }
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
    var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=22JH0IRqc0iEqM2uMgMyyy';
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
     'Authorization': config("properties").spaces.main.authorization
      }
   }, function(error, response, body) {
     var httpCodesNotToLog = [404];
     if (common.checkForErrorAndLogExceptCodes(error, response, targetURL, httpCodesNotToLog)) {
       return callback(response, new Error("Exception occurred in getting the alerts"), null);
     }
     logger.debug("Get Alerts from Contentful: " + response.statusCode);
     cmsEntry = JSON.parse(body);
     return callback(cmsEntry.items);
   });
 },
 getDataGrouping: function(entryId, callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/' + entryId;
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
     'Authorization': config("properties").spaces.main.authorization
      }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) {
       return callback(response, new Error("Exception occurred in getting the data grouping"), null);
     }
     logger.debug("Get data group from Contentful: " + response.statusCode);
     dataGroup = JSON.parse(body);
     return callback(dataGroup);
   });
 },
 getCatalogType: function(callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=ZRkwvyMcCqK46gGOggeWs';
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
     'Authorization': config("properties").spaces.main.authorization
      }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) {
       return callback(response, new Error("Exception occurred in getting the catalog type"), null);
     }
     logger.debug("Get Catalog Contentful: " + response.statusCode);
     cmsEntry = JSON.parse(body);
     return callback({
       cmsEntry: cmsEntry.items,
       cmsAsset: cmsEntry.includes.Asset,
       statusCode: response.statusCode
     });
   });
 },
 getCatalogRequestHardCopy: function(callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=5SLs6g27dK2IOeuOyKyeoq';
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
     'Authorization': config("properties").spaces.main.authorization
      }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) {
       return callback(response, new Error("Exception occurred in getting the catalog request hard copy"), null);
     }
     logger.debug("Get Catalog Contentful: " + response.statusCode);
     cmsEntry = JSON.parse(body);
     return callback({
       cmsEntry: cmsEntry.items,
       statusCode: response.statusCode
     });
   });
 },
 getFAQCategory: function(categorySlug, callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.faq.spaceId+'/entries?content_type=5Qnph4LqeWyqy2aeQmes4y&fields.slug=' + categorySlug;
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
     'Authorization': config("properties").spaces.faq.authorization
      }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) {
       return callback(response, new Error("Exception occurred in getting the FAQ category "+ categorySlug), null);
     }
     logger.debug("Get FAQ category " + categorySlug + " from Contentful: " + response.statusCode);
     singleFaq = JSON.parse(body);
     return callback(singleFaq);
   });
 },

 getFAQ: function(callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.faq.spaceId+'/entries?content_type=5Qnph4LqeWyqy2aeQmes4y';
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
     'Authorization': config("properties").spaces.faq.authorization
      }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) {
       return callback(response, new Error("Exception occurred in getting the FAQ"), null);
     }
     logger.debug("Get main faq page from Contentful: " + response.statusCode);
     faq = JSON.parse(body);
     return callback(faq);
   });
 },

 getContentSnippet: function(slug, callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.content.spaceId+'/entries?content_type=vWuB3fpTWge2EU8ec0OOA&fields.slug=' + slug;
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
       'Authorization': config("properties").spaces.content.authorization
     }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) { //This returns 200 even when nothing is found
       return callback(response, new Error("Exception occurred in getting the snippet, " + slug), null);
     }
     logger.debug("Content snippet " +  slug + " Contentful: " + response.statusCode);
     contentSnippet = JSON.parse(body);
     return callback(contentSnippet);
   });
 },

 getContentUrlRedirect: function(callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.content.spaceId+'/entries?content_type=redirect&limit=1000';
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
       'Authorization': config("properties").spaces.content.authorization
     }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) {
       return callback(null, new Error("Exception occurred in getting the redirect information"));
     }
     logger.debug("ContentUrlRedirect Contentful: " + response.statusCode);
     data = JSON.parse(body).items;
     return callback(data, null);
   });
 },

 getCatalogArchiveLink: function(callback) {
   var targetURL = 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/18K2MpUdQmysAmK4ISSeOs';
   cachedRequest({
     method: 'GET',
     url: targetURL,
     ttl: config("properties").contentfulCache.timeout,
     headers: {
     'Authorization': config("properties").spaces.main.authorization
      }
   }, function(error, response, body) {
     if (common.checkForErrorAndLog(error, response, targetURL)) {
       return callback(response, new Error("Exception occurred in getting the catalog archive link"), null);
     }
     logger.debug("Get Catalog Archive Link: " + response.statusCode);
     cmsEntry = JSON.parse(body);
     return callback({
       link: cmsEntry.fields.link
     });
   });
 },
};
