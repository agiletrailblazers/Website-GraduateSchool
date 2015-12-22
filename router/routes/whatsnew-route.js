var express = require('express');
var contentful = require("../../API/contentful.js");
var async = require('async');
var router = express.Router();
var logger = require('../../logger');

// Get What's new page.
router.get('/whats-new', function(req, res, next) {
  content = {};
  var assetIdList = "";
  var spaceId = "jzmztwi1xqvn";
  async.series([
    function(callback) {
      contentful.getWhatsNew(function(response, error) {
        if(error){
          logger.error(error);
          logger.error('Could not retrieve Whatsnew from Contentful. Redirecting to error page');
          res.redirect('/error');
        }
        else{
          content.class = response;
          if (response && response.cmsEntry && response.cmsEntry.fields && response.cmsEntry.fields.topBanners){
            content.class.cmsEntry.fields.topBanners.forEach(function(topBannersList) {
            assetIdList += topBannersList.sys.id + ",";
            });
          }
          callback();
        }

      });
    },
    function(callback) {
      contentful.getContentAsset(spaceId, function(response, error, result) {
        if(error){
          logger.error(error);
          logger.error('Could not retrieve ContentAsset from Contentful. Redirecting to error page');
          res.redirect('/error');
        }
        else{
          whatsnewheaderImageURLList = "";
          if (result && result.items) {
            result.items.forEach(function(assetList) {
              if (assetIdList.indexOf(assetList.sys.id) > -1) {
                whatsnewheaderImageURLList += assetList.fields.file.url + ",";
              }
            });
          }
          content.whatsnewheaderImageURLList = whatsnewheaderImageURLList;
          callback();
        }
      });
    },
  ], function(results) {
      logger.error('why the hell its triggering');
      res.render('whats_new', {
        title: 'What\'s new',
        entry: content.class.cmsEntry.fields,
        whatsnewheaderImageURLList: content.whatsnewheaderImageURLList
      });
  });
});

module.exports = router;
