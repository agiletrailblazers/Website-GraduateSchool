var express = require('express');
var contentfulForms = require('../../API/contentful_forms.js');
var contentful = require('../../API/contentful.js');
var course = require('../../API/course.js');
var async = require('async');
var router = express.Router();

router.get('/content/:content_slug', function(req, res, next) {
  slug = req.params.content_slug;
  contentful.getContentPage(function(response) {
    // render page here.
  }, slug)
});

module.exports = router;
