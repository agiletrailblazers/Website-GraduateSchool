var express = require('express');
var async = require('async');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var marked = require('marked');

router.get(
  ['/development-training-frequently-asked-questions',
    '/academic-program-frequently-asked-questions',
    '/evening-weekend-frequently-asked-questions'
  ],
  function(req, res, next) {
    if (req.url.indexOf("/development-training-frequently-asked-questions") > -1 ) {
      title = "General Frequently Asked Questions (FAQ)"
      faq = "general";
    }
    contentful.getFAQ(faq, function(response) {
      faq = response;
      faqEntries = faq.includes["Entry"];
    });
    res.render('misc/faq', {title: title, faqEntries: faqEntries, markdown: marked});
  });

module.exports = router;
