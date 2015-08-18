var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var router = express.Router();

router.get('/news', function(req, res, next) {
  contentful.getNewsRecent(function(response) {
    res.render('news/recent_entries', {
      posts: response
    });
  });
});

router.get('/news/:news_slug', function(req, res, next) {
  slug = req.params.news_slug;
  contentful.getNewsDetail(function(response) {
    console.log(response);
    console.log("Slug:", slug);
    // Response is an array.
    // If array is === 0 Render 404
    // If array === 1 display post
    // If array is > 1 iterate and look for slug match. If match render post else render 404.
    if (response.length === 0) {
      res.render('404');
    } else if (response.length === 1) {
      res.render('news/news_details', {
        title: response[0].fields.title,
        body: response[0].fields.body,
        featureImage: response[0].fields.featuredImage,
        tags: response[0].fields.tags,
        category: response[0].fields.category,
        author: response[0].fields.author,
        date: response[0].fields.date
      });
    } else if (response.length > 1) {
      for (var i = 0; i < response.length; i++) {
        var newSlug = response[i].slug;
        if (newSlug === slug) {
          render('news/news_details', {
            title: response[i].fields.title,
            body: response[i].fields.body,
            featureImage: response[i].fields.featuredImage,
            tags: response[i].fields.tags,
            category: response[i].fields.category,
            author: response[i].fields.author,
            date: response[i].fields.date
          });
          break;
        } else {
          render('404');
        }
      }
    } else {
      render('404');
    }

  }, slug)
});

module.exports = router;
