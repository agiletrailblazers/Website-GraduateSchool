var express = require('express');
var router = express.Router();
var config = require('konphyg')(__dirname + '/../../config');
var logger = require('../../logger');
var async = require('async');
var common = require("../../helpers/common.js");
var courseAPI = require('../../API/course.js');
var contentfulAPI = require('../../API/contentful.js');
var marked = require('marked');


// handlers for generic content papge

module.exports = {

    // Displays the Guaranteed to Go Page
    displayG2GPage : function(req, res, next) {
      async.parallel({
        getContentPage : function (callback) {
          // contentful.
          callback();
        },
        getSessions : function (callback) {
          var sessionStatus = 'c';
          var sessionDomain = 'CD';
          courseAPI.getSessions(function (error, sessions){
            // Create a map. The curriculum title will be the key.
            var orderedSessions = new Object();

            if (common.isEmpty(error)) {
              // If key doesn't exit we add it
              // Once the key is there the value is an array and session is added to it.
              sessions.forEach (function(session, i) {
                if (common.isEmpty(orderedSessions[session.curricumTitle])) {
                  orderedSessions[session.curricumTitle] = [];
                }
                orderedSessions[session.curricumTitle].push(session);
              });
            }

            callback(error, orderedSessions);
          }, req.query["authToken"], sessionStatus, sessionDomain);
        }
      }, function (err, results) {
        var keys = Object.keys(results.getSessions);
        for (var i = 0; i < keys.length; i++) {
          console.log("Key is " + keys[i]);
          console.log("value is " + JSON.stringify(results.getSessions[keys[i]],null, 2));
        }
        if (err) {
            logger.error("Error rendering shopping cart", err);
            common.redirectToError(res);
            return;
        }
        console.log('i am done');
        var sections = [];
        var relatedLinks = [];
        var imageUrl = null;
        var intro = null;
        var subIntro = null;
        res.render('gtog/gtog', { seoDescription: "seoDescription",
          seoKeywords: "seoKeywords",
          title: 'title',
          imageUrl: imageUrl,
          intro: intro,
          subIntro: subIntro,
          sections: sections,
          relatedLinks: relatedLinks
        });
      });
    }
} // end module.exports

//
// contentfulAPI.getContentPage(function(response, error) {
//   if (error) {
//     logger.error('Exception encountered searching for content page, redirecting to error', error);
//     common.redirectToError(res);
//     return;
//   }
//   else if (!response || !response.items || !response.items[0] || !response.items[0].fields ) {
//     logger.warn('No results for content slug ' + slug + ' from Contentful. Redirecting to page not found');
//     res.redirect('/pagenotfound');
//     return;
//   }
//   var content = response.items[0].fields;
//   var imageUrl = null;
//   if (content.featureImage) {
//     if (response.includes && response.includes.Asset) {
//       response.includes.Asset.forEach(function(asset) {
//         if (content.featureImage.sys.id === asset.sys.id) {
//           imageUrl = asset.fields.file.url;
//         }
//       });
//     }
//   }
//
//   var snippetContent = function (sectionSnippet) {
//     if (!sectionSnippet || !sectionSnippet.sys || !sectionSnippet.sys.id) {
//       return null;
//     }
//
//     if (!response.includes || !response.includes.Entry) {
//       logger.error("Snippet reference included in content but no included Entry")
//       return null;
//     }
//
//     var includedEntries = response.includes.Entry;
//     for (i = 0; i < includedEntries.length; i++) {
//       if (includedEntries[i].sys.id === sectionSnippet.sys.id) {
//         return includedEntries[i].fields.snippetContent;
//       }
//     }
//     return null;
//   };
//
//   res.render('generic/generic_detail', {
//     title: content.title,
//     slug: content.slug,
//     intro: content.intro,
//     subIntro: content.subIntro,
//     relatedLinks: content.relatedLinks,
//     seoDescription: content.seoDescription,
//     seoKeywords: content.seoKeywords,
//     imageUrl: imageUrl,
//     markdown: marked,
//     sections: [
//     { title: content.sectionTitle1, content: content.section1, collapse: content.sectionCollapse1, snippet: snippetContent(content.sectionSnippet1) },
//     { title: content.sectionTitle2, content: content.section2, collapse: content.sectionCollapse2, snippet: snippetContent(content.sectionSnippet2) },
//     { title: content.sectionTitle3, content: content.section3, collapse: content.sectionCollapse3, snippet: snippetContent(content.sectionSnippet3) },
//     { title: content.sectionTitle4, content: content.section4, collapse: content.sectionCollapse4, snippet: snippetContent(content.sectionSnippet4) },
//     { title: content.sectionTitle5, content: content.section5, collapse: content.sectionCollapse5, snippet: snippetContent(content.sectionSnippet5) },
//     { title: content.sectionTitle6, content: content.section6, collapse: content.sectionCollapse6, snippet: snippetContent(content.sectionSnippet6) },
//     { title: content.sectionTitle7, content: content.section7, collapse: content.sectionCollapse7, snippet: snippetContent(content.sectionSnippet7) },
//     { title: content.sectionTitle8, content: content.section8, collapse: content.sectionCollapse8, snippet: snippetContent(content.sectionSnippet8) },
//     { title: content.sectionTitle9, content: content.section9, collapse: content.sectionCollapse9, snippet: snippetContent(content.sectionSnippet9) },
//     { title: content.sectionTitle10, content: content.section10, collapse: content.sectionCollapse10, snippet: snippetContent(content.sectionSnippet10) }
//    ]
//   });
// }, slug);
