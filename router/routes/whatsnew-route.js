var express = require('express');
var contentful = require("../../API/contentful.js");
var async = require('async');
var router = express.Router();
var logger = require('../../logger');
var common = require("../../helpers/common.js");

// Get What's new page.
router.get('/whats-new', function(req, res, next) {
  content = {};
  var assetIdList = "";
  var spaceId = "jzmztwi1xqvn";
  async.series([
    function(callback) {
      contentful.getWhatsNew(function(response, error) {
        if(error){
          logger.error('Could not retrieve Whatsnew from Contentful. Redirecting to error page', error);
          common.redirectToError(res);
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
          logger.error('Could not retrieve ContentAsset from Contentful. Redirecting to error page', error);
          common.redirectToError(res);
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
    if (common.isNotEmpty(content.class)) {
      res.render('whats_new', {
        title: 'What\'s new',
        entry: content.class.cmsEntry.fields,
        whatsnewheaderImageURLList: content.whatsnewheaderImageURLList
      });
    } else {
      res.redirect('/pagenotfound');

    }
  });

});

module.exports = router;
