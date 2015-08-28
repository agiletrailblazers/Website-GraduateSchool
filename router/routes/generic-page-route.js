var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var router = express.Router();

router.get('/content/:content_slug', function(req, res, next) {
  slug = req.params.content_slug;
  contentful.getContentPage(function(response) {
    console.log(response[0].fields);
    res.render('generic/generic_detail', {
      title: response[0].fields.title,
      slug: response[0].fields.slug,
      intro: response[0].fields.intro,
      subIntro: response[0].fields.subIntro,
      sections: [ response[0].fields.section1, response[0].fields.section2,
              response[0].fields.section3, response[0].fields.section4,
              response[0].fields.section5, response[0].fields.section6,
              response[0].fields.section7, response[0].fields.section8,
              response[0].fields.section9, response[0].fields.section10 ]
    });
  }, slug);
});

module.exports = router;
