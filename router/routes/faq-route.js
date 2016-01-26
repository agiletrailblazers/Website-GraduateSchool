var express = require('express');
var async = require('async');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var marked = require('marked');
var logger = require('../../logger');
var common = require("../../helpers/common.js");

router.get('/faq',
  function(req, res, next) {
    var faq = {};
    async.waterfall([
      function(callback) {
        contentful.getFAQ(function(response, error) {
          if (error) {
            logger.error('Exception encountered when accessing main FAQ page from Contentful, redirecting to error page', error);
            common.redirectToError(res);
          }
          else {
            faq.response = response;
            callback(null, faq);
          }
        });
      },
      function(faq, callback) {
        faq.categories = [];
        if (faq && faq.response && faq.response.items) {
          faq.response.items.forEach(function(item, i) {
            itemSlug = item.fields.slug.toString();
            faq.categories[i] = {};
            faq.categories[i].title = item.fields.title;
            faq.categories[i].slug = itemSlug;
            faq.categories[i].order = item.fields.order;
          });
          callback(null, faq);
        }
        else {
          callback(new Error("No FAQ categories returned"), null);
        }
      }
    ], function(err, result) {
      if (result && result.categories) {
        async.each(result.categories, function(category, callback) {
          var slug = category.slug;
          contentful.getFAQCategory(slug, function(response, error) { //TODO: This seems to be redundant as the above query returns all questions
            if (error) {
              logger.error('Encountered error retrieving FAQ Category, redirecting to error', error);
              callback(error, null);
            }
            else {
              faq.categories[faq.categories.indexOf(category)].questions = [];
              if (response && response.items[0] && response.items[0].fields) {
                //loop through each faq question (these are in a specific order)
                response.items[0].fields.questions.forEach(function (question) {
                  var questionId = question.sys.id;
                  response.includes.Entry.forEach(function (entry) {
                    //not find the matching entry and add to the array (again, we need to keep these in order)
                    if (questionId === entry.sys.id) {
                      faq.categories[faq.categories.indexOf(category)].questions.push(entry);
                    }
                  });
                });
              }
              callback(null);
            }

          });

        }, function(err, result) {
          if (err) {
            logger.error("There was an error in the FAQ Final results", err);
            common.redirectToError(res);
          }
          else {
            //sort categories
            faq.categories.sort(function (a, b) {
              return a.order > b.order;
            });
            res.render('faq', {
              title: "FAQ",
              faq: faq,
              markdown: marked
            });
          }
        });
      }
      else {
        if (err) {
          logger.error("Error encountered when reading categories, redirecting to error", err);
        }
        logger.error("No FAQ data returned, directing to error");
        common.redirectToError(res);
      }
    });
  });

module.exports = router;
