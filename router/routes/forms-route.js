var express = require('express');
var contentful = require("../../API/contentful.js");
var async = require('async');
var router = express.Router();

// Get What's new page.
router.get('/forms', function(req, res, next) {
arrayOfContent=[];
  async.series([
    function(callback) {
      contentful.getForms(function(response) {
        response.cmsEntry.forEach(function(cmsEntryAsset) {
          content = {};
          content.sectionTitle=  cmsEntryAsset.fields.sectionTitle1;
          content.sectionColumn=  cmsEntryAsset.fields.sectionColumn1;
          content.sectionOrder=  cmsEntryAsset.fields.sectionOrder1;
          arrayofAssetObj =[];
          if(typeof(cmsEntryAsset.fields.sectionFiles1) !='undefined') {
            cmsEntryAsset.fields.sectionFiles1.forEach(function (sectionFile) {
              response.cmsAsset.forEach(function (asset) {
                if (asset.sys.id == sectionFile.sys.id) {
                  assetObj = {};
                  assetObj.title = asset.fields.title;
                  assetObj.url = asset.fields.file.url;
                  arrayofAssetObj.push(assetObj);
                }
              });
            });
          }
          if(typeof(cmsEntryAsset.fields.sectionLink1) !='undefined') {
            cmsEntryAsset.fields.sectionLink1.forEach(function (sectionLink) {
              assetObj = {};
              assetObj.title = sectionLink.name;
              assetObj.url = sectionLink.url;
              arrayofAssetObj.push(assetObj);
            });
          }
          content.assetList=arrayofAssetObj;
          arrayOfContent.push(content);
        });
        arrayOfContent.sort(function(a, b) {
          return (a.sectionOrder) - (b.sectionOrder);
        });
        callback();
      });
    } ], function(results) {
      res.render('forms', {
        entry: arrayOfContent
      });
    });
  });
module.exports = router;
