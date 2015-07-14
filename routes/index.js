var express = require('express');
var contentful = require("../API/contentful.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Graduate School', name: 'Home Page'});
});

// GET demo home page
router.get('/demo', function(req, res, next) {
  res.render('demo_index', { });
});

// Get What's new page.
router.get('/whats-new', function(req, res, next) {
  contentful.getWhatsNew(function(response) {
    // Need help with this.
    var assets = new Array();
    for (var i = 0; i < response.fields.topBanners.length; i++) {
      contentful.getAsset("jzmztwi1xqvn", response.fields.topBanners[i].sys.id, function(resp) {
        console.log(typeof String(resp.fields.file.url) === 'string');
        assets.push(resp.fields.file.url);
      });
      return assets;
    }
    res.render('whats_new', { entry: response.fields, assets: assets });
  });
});

module.exports = router;
