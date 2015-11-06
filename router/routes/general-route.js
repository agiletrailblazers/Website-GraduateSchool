var express = require('express');
var async = require('async');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var marked = require('marked');

router.get('/faq',
  function(req, res, next) {
    faq = {};
    async.waterfall([
      function(callback) {
        contentful.getFAQ(function(response) {
          faq.response = response;
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
          faq.categories[i].order = item.fields.order;
        });
        callback(null, faq);
      }
    ], function(err, result) {
      async.each(result.categories, function(category, callback) {
        slug = category.slug;
        contentful.getFAQCategory(slug, function(response) {
          faq.categories[faq.categories.indexOf(category)].questions = [];
          if (typeof response.includes != "undefined") {
            faq.categories[faq.categories.indexOf(category)].questions = response.includes.Entry;
          }
          callback(null);
        });

      }, function(err, result) {
        if (err) {
          console.log('Error');
        } else {
          faq.categories.sort(function (a,b){
            return a.order > b.order;
          });
          for (var i = 0; i < faq.categories.length; ++i) {
            faq.categories[i].questions.sort(function(a, b) {
              return a.fields.question.localeCompare(b.fields.question);
            });
          }
          res.render('misc/faq', {
            title: "FAQ",
            faq: faq,
            markdown: marked
          });
        }
      });
    });

  });

module.exports = router;
