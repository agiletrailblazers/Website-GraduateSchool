var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var prune = require('underscore.string/prune');
var striptags = require('striptags');
var router = express.Router();

router.get('/news', function(req, res, next) {
  contentful.getNewsRecent(function(response) {
    res.render('news/recent_entries', { posts: response.items,
      striptags: striptags, prune: prune });
  });
});

router.get('/news/:news_slug', function(req, res, next) {
  slug = req.params.news_slug;
  contentful.getNewsDetail(function(response) {
    function renderNews(index) {
      res.render('news/news_details', {
        title: response[index].fields.title,
        body: response[index].fields.body,
        featureImage: response[index].fields.featuredImage,
        tags: response[index].fields.tags,
        category: response[index].fields.category,
        author: response[index].fields.author,
        date: response[index].fields.date
      });
    }
    switch (response.length) {
      case 0:
        res.render('404');
        break;
      case 1:
        renderNews(0);
        break;
      case (response.length > 1):
        for (var i = 0; i < response.length; i++) {
          var newSlug = response[i].slug;
          if (newSlug === slug) {
            renderNews(i);
            break;
          } else {
            render('404');
            break;
          }
        }
      case null:
        res.render('404');
        break;
    }
  }, slug)
});

module.exports = router;
