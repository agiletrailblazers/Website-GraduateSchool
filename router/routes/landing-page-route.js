var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var config = require('konphyg')(__dirname + '/../../config');
var logger = require('../../logger');
var marked = require('marked');
var common = require("../../helpers/common.js");

router.get(['/landing/:landing_slug'], function(req, res, next) {
  var slug = req.params.landing_slug;
  //console.log(slug);
  contentful.getLandingPage(function(response, error) {
    if (error) {
      logger.error('Exception encountered searching for landing page, redirecting to error', error);
      common.redirectToError(res);
      return;
    }
    else if (!response || !response.items || !response.items[0] || !response.items[0].fields ) {
      logger.warn('No results for landing slug ' + slug + ' from Contentful. Redirecting to page not found');
      //console.log(response.items[0]);
      res.redirect('/pagenotfound');
      return;
    }
    var landingcontent = response.items[0].fields;
    var featureImageUrl = null;
    if (landingcontent.featureImage) {
      if (response.includes && response.includes.Asset) {
        response.includes.Asset.forEach(function (asset) {
          if (landingcontent.featureImage.sys.id === asset.sys.id) {
            featureImageUrl = asset.fields.file.url;
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
    var rightContentImageUrl = null;
    if (landingcontent.rightColumnContent) {
      if (response.includes && response.includes.Asset) {
        response.includes.Asset.forEach(function (asset) {
          if (landingcontent.rightColumnContent.sys.id === asset.sys.id) {
            rightContentImageUrl = asset.fields.file.url;
          }
        });
      }
    }

    res.render('landing/landing_detail', {
      title: landingcontent.title,
      slug: landingcontent.slug,
      maintitle:landingcontent.mainTitle,
      maincontent:landingcontent.mainContent,
      formDisplay:landingcontent.formDisplay,
      imageDisplay:landingcontent.imageDisplay,
      videosDisplay:landingcontent.videosDisplay,
      leftcolumncontent:landingcontent.leftColumnContent,
      rightcolumncontent:rightContentImageUrl,
      additionalsectiontitle:landingcontent.additionalSectionTitle,
      additionalsectioncontent:landingcontent.additionalSectionContent,
      featureImageUrl: featureImageUrl,
      rightContentVideoUrl:landingcontent.rightContentVideoUrl,
      markdown: marked,
      sections: [
      { title: landingcontent.sectionTitle1, content: landingcontent.section1, collapse: landingcontent.sectionCollapse1, snippet: snippetContent(landingcontent.sectionSnippet1) },
      { title: landingcontent.sectionTitle2, content: landingcontent.section2, collapse: landingcontent.sectionCollapse2, snippet: snippetContent(landingcontent.sectionSnippet2) },
      { title: landingcontent.sectionTitle3, content: landingcontent.section3, collapse: landingcontent.sectionCollapse3, snippet: snippetContent(landingcontent.sectionSnippet3) },
      { title: landingcontent.sectionTitle4, content: landingcontent.section4, collapse: landingcontent.sectionCollapse4, snippet: snippetContent(landingcontent.sectionSnippet4) },
      { title: landingcontent.sectionTitle5, content: landingcontent.section5, collapse: landingcontent.sectionCollapse5, snippet: snippetContent(landingcontent.sectionSnippet5) },
     ],
     landingPageFormDisplay : config("properties").landingPageFormDisplay
    });
  }, slug);
});

module.exports = router;
