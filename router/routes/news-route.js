var express = require('express');
var contentful = require('../../API/contentful.js');
var async = require('async');
var prune = require('underscore.string/prune');
var striptags = require('striptags');
var router = express.Router();
var logger = require('../../logger');

router.get('/news', function(req, res, next) {
  contentful.getNewsRecent(function(response) {
    res.render('news/recent_entries', { posts: response.items,
      striptags: striptags, prune: prune });
  });
});

router.get('/news/:news_slug', function(req, res, next) {
  slug = req.params.news_slug;
  contentful.getNewsDetail(function(response) {
    function renderNews(index,featureImageURL) {
      res.render('news/news_details', {
        title: response.items[index].fields.title,
        body: response.items[index].fields.body,
        featureImage: response.items[index].fields.featuredImage,
        featureImageURL: featureImageURL,
        tags: response.items[index].fields.tags,
        category: response.items[index].fields.category,
        author: response.items[index].fields.author,
        date: response.items[index].fields.date
      });
    }
    switch (response.items.length) {
      case 0:
        logger.error('News item not found: ' + slug);
        res.render('404');
        break;
      case 1:
        featureImageURL ="";
        if ((response.includes != null) && (null != response.includes.Asset) && (response.includes.Asset.length>0) &&
          (null != response.includes.Asset[0].fields)  &&  (null != response.includes.Asset[0].fields.file) &&
          (null != response.includes.Asset[0].fields.file)) {
           featureImageURL = response.includes.Asset[0].fields.file.url;
        }
        renderNews(0,featureImageURL);
        break;
      case (response.items.length > 1):
        for (var i = 0; i < response.items.length; i++) {
          featureImageURL ="";
          var newSlug = response.items[i].slug;
          if (newSlug === slug) {
            if ((response.includes != null) && (null != response.includes.Asset) && (response.includes.Asset.length>0) &&
              (null != response.includes.Asset[index].fields)  &&  (null != response.includes.Asset[index].fields.file) &&
              (null != response.includes.Asset[index].fields.file)) {
                featureImageURL = response.includes.Asset[index].fields.file.url;
            }
            renderNews(i,featureImageURL);
            break;
          } else {
            logger.error('News item not found: ' + slug);
            render('404');
            break;
          }
        }
      case null:
        logger.error('News item not found: ' + slug);
        res.render('404');
        break;
    }
  }, slug)
});

module.exports = router;
