var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var logger = require('../../logger');
var marked = require('marked');

router.get(['/content/:content_slug','/content/:subfolder/:content_slug'], function(req, res, next) {
  var slug = (typeof(req.params.subfolder) == 'undefined' ? '' : (req.params.subfolder + '/')) + req.params.content_slug;
  contentful.getContentPage(function(response) {
    if (!response || !response.items || !response.items[0] || !response.items[0].fields ) {
      //handle error
      logger.error("Page not found: " + slug)
    	res.render('error', { message: 'Sorry, page not found.', error: null });
      return;
    }
    var content = response.items[0].fields;
    var imageUrl = null;
    if (content.featureImage) {
       response.includes.Asset.forEach(function(asset) {
         if (content.featureImage.sys.id === asset.sys.id) {
           imageUrl = asset.fields.file.url;
         }
       });
    }
    res.render('generic/generic_detail', {
      title: content.title,
      slug: content.slug,
      intro: content.intro,
      subIntro: content.subIntro,
      relatedLinks: content.relatedLinks,
      imageUrl: imageUrl,
      markdown: marked,
      sections: [
      { title: content.sectionTitle1, content: content.section1, collapse: content.sectionCollapse1 },
      { title: content.sectionTitle2, content: content.section2, collapse: content.sectionCollapse2 },
      { title: content.sectionTitle3, content: content.section3, collapse: content.sectionCollapse3 },
      { title: content.sectionTitle4, content: content.section4, collapse: content.sectionCollapse4 },
      { title: content.sectionTitle5, content: content.section5, collapse: content.sectionCollapse5 },
      { title: content.sectionTitle6, content: content.section6, collapse: content.sectionCollapse6 },
      { title: content.sectionTitle7, content: content.section7, collapse: content.sectionCollapse7 },
      { title: content.sectionTitle8, content: content.section8, collapse: content.sectionCollapse8 },
      { title: content.sectionTitle9, content: content.section9, collapse: content.sectionCollapse9 },
      { title: content.sectionTitle10, content: content.section10, collapse: content.sectionCollapse10 }
     ]
    });
  }, slug);
});

module.exports = router;
