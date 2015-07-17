var express = require('express');
var contentful = require("../../API/contentful.js");
var router = express.Router();

// Get What's new page.
router.get('/whats-new', function(req, res, next) {
  contentful.getWhatsNew(function(response) {
    res.render('whats_new', { entry: response.cmsEntry.fields });
  });
});

module.exports = router;
