var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var logger = require('../../logger');
var marked = require('marked');
var common = require("../../helpers/common.js");

router.get(['/content/:content_slug','/content/:subfolder/:content_slug'], function(req, res, next) {
  var slug = (typeof(req.params.subfolder) == 'undefined' ? '' : (req.params.subfolder + '/')) + req.params.content_slug;
  contentful.getContentPage(function(response, error) {
    if (error) {
      logger.error('Exception encountered searching for content page, redirecting to error', error);
      common.redirectToError(res);
      return;
    }
    else if (!response || !response.items || !response.items[0] || !response.items[0].fields ) {
      logger.warn('No results for content slug ' + slug + ' from Contentful. Redirecting to page not found');
      res.redirect('/pagenotfound');
      return;
    }
    var content = response.items[0].fields;
    var imageUrl = null;
    if (content.featureImage) {
      if (response.includes && response.includes.Asset) {
        response.includes.Asset.forEach(function(asset) {
          if (content.featureImage.sys.id === asset.sys.id) {
            imageUrl = asset.fields.file.url;
          }
        });
      }
    }

    var snippetContent = function (sectionSnippet) {
      if (!sectionSnippet || !sectionSnippet.sys || !sectionSnippet.sys.id) {
        return null;
      }

      if (!response.includes || !response.includes.Entry) {
        logger.error("Snippet reference included in content but no included Entry")
        return null;
      }

      var includedEntries = response.includes.Entry;
      for (i = 0; i < includedEntries.length; i++) {
        if (includedEntries[i].sys.id === sectionSnippet.sys.id) {
          return includedEntries[i].fields.snippetContent;
        }
      }
      return null;
    };

    res.render('generic/generic_detail', {
      title: content.title,
      pageSearchPriority:convertPageSearchPriorityToString(content.pageSearchPriority),
      slug: content.slug,
      intro: content.intro,
      subIntro: content.subIntro,
      relatedLinks: content.relatedLinks,
      seoDescription: content.seoDescription,
      seoKeywords: content.seoKeywords,
      imageUrl: imageUrl,
      markdown: marked,
      sections: [
      { title: content.sectionTitle1, content: content.section1, collapse: content.sectionCollapse1, snippet: snippetContent(content.sectionSnippet1) },
      { title: content.sectionTitle2, content: content.section2, collapse: content.sectionCollapse2, snippet: snippetContent(content.sectionSnippet2) },
      { title: content.sectionTitle3, content: content.section3, collapse: content.sectionCollapse3, snippet: snippetContent(content.sectionSnippet3) },
      { title: content.sectionTitle4, content: content.section4, collapse: content.sectionCollapse4, snippet: snippetContent(content.sectionSnippet4) },
      { title: content.sectionTitle5, content: content.section5, collapse: content.sectionCollapse5, snippet: snippetContent(content.sectionSnippet5) },
      { title: content.sectionTitle6, content: content.section6, collapse: content.sectionCollapse6, snippet: snippetContent(content.sectionSnippet6) },
      { title: content.sectionTitle7, content: content.section7, collapse: content.sectionCollapse7, snippet: snippetContent(content.sectionSnippet7) },
      { title: content.sectionTitle8, content: content.section8, collapse: content.sectionCollapse8, snippet: snippetContent(content.sectionSnippet8) },
      { title: content.sectionTitle9, content: content.section9, collapse: content.sectionCollapse9, snippet: snippetContent(content.sectionSnippet9) },
      { title: content.sectionTitle10, content: content.section10, collapse: content.sectionCollapse10, snippet: snippetContent(content.sectionSnippet10) }
     ]
    });
  }, slug);
});

router.get(['/content-snippet/:snippet_slug','/content-snippet/:subfolder/:snippet_slug'], function(req, res, next) {
  var slug = (typeof(req.params.subfolder) == 'undefined' ? '' : (req.params.subfolder + '/')) + req.params.snippet_slug;
  contentful.getContentSnippet(slug, function(response, error) {
    if (error) {
      logger.error('Exception encountered searching for content snippet slug ' + slug + ' , redirecting to error', error);
      res.json({"title" : "Error", "snippetContent": "We had a problem processing your request. Please try your request again in a few moments"});
      return
    }
    if (!response || !response.items || !response.items[0] || !response.items[0].fields ) {
      logger.warn('No results for content snippet slug ' + slug + ' from Contentful. Redirecting to page not found');
      res.json({"title" : "Not Found", "snippetContent": "Sorry, content not found."});
      return;
    }
    var content = response.items[0].fields;
    res.json({"title" : content.title, "snippetContent": marked(content.snippetContent)});
    return;
  });
});

module.exports = router;
