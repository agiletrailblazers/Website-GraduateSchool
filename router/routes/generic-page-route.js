var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();

router.get('/content/:content_slug', function(req, res, next) {
  slug = req.params.content_slug;
  contentful.getContentPage(function(response) {
    res.render('generic/generic_detail', {
      title: response.items[0].fields.title,
      slug: response.items[0].fields.slug,
      intro: response.items[0].fields.intro,
      subIntro: response.items[0].fields.subIntro,
      relatedLinks: response.items[0].fields.relatedLinks,
      sections: [ response.items[0].fields.section1, response.items[0].fields.section2,
                  response.items[0].fields.section3, response.items[0].fields.section4,
                  response.items[0].fields.section5, response.items[0].fields.section6,
                  response.items[0].fields.section7, response.items[0].fields.section8,
                  response.items[0].fields.section9, response.items[0].fields.section10 ]
    });
  }, slug);
});

module.exports = router;
