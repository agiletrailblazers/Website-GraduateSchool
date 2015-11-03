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
    if (req.url.indexOf("/development-training-frequently-asked-questions") > -1) {
      // TODO: Add logic to let front end know that this is under a url.
      // TODO: Make conditionals or a switch for all possible FAQ's.
    }
    faq = {};
    async.waterfall([
      function(callback) {
        contentful.getFAQ(function(response) {
          faq.response = response;
          // console.log("First function faq: ", faq);
          callback(null, faq);
        });
      },
      function(faq, callback) {
        faq.categories = [];
        faq.response.items.forEach(function(item, i) {
          itemSlug = item.fields.slug.toString();
          faq.categories[i] = {};
          faq.categories[i].title = item.fields.title;
          faq.categories[i].slug = itemSlug;
        });
        callback(null, faq);
      }
    ], function(err, result) {
      console.log("Result: ", result);
      async.each(result.categories, function(category, callback) {
        slug = category.slug;
        contentful.getFAQCategory(slug, function(response) {
          faq.categories[faq.categories.indexOf(category)].questions = [];
          if (typeof response.includes != "undefined") {
            faq.categories[faq.categories.indexOf(category)].questions = response.includes.Entry;
          }
        });
        callback(null);
      }, function(err, result) {
        if (err) {
          console.log('Error');
        } else {
          console.log("Categories", result);
          res.render('misc/faq', {
            title: "FAQ",
            faq: result,
            markdown: marked
          });
        }
      });
    });

  });

module.exports = router;
