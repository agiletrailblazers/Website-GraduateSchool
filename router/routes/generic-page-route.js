var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var router = express.Router();

router.get('/content/:content_slug', function(req, res, next) {
  slug = req.params.content_slug;
  contentful.getContentPage(function(response) {
    res.render('/generic/generic_detail', {
      title: response.fields.title,
      slug: response.fields.slug,
      intro: response.fields.intro,
      subIntro: response.fields.subIntro,
      sections: [ response.fields.section1, response.fields.section2,
              response.fields.section3, response.fields.section4,
              response.fields.section5, response.fields.section6,
              response.fields.section7, response.fields.section8,
              response.fields.section9, response.fields.section10 ]
    });
  }, slug);
});

module.exports = router;
