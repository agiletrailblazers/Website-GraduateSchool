  var express = require('express');
  var contentful = require("../../API/contentful.js");
  var async = require('async');
  var router = express.Router();
  // Get Forms page.
  router.get('/forms', function(req, res, next) {
  arrayOfContent=[];
  async.series([
    function(callback) {
      contentful.getForms(function(response) {
        response.cmsEntry.forEach(function(cmsEntryAsset) {
          content = {};
          content.sectionTitle=  cmsEntryAsset.fields.sectionTitle;
          content.sectionColumn=  cmsEntryAsset.fields.sectionColumn;
          content.sectionOrder=  cmsEntryAsset.fields.sectionOrder;
          arrayofAssetObj =[];
          if(typeof(cmsEntryAsset.fields.sectionFiles) !='undefined') {
            cmsEntryAsset.fields.sectionFiles.forEach(function (sectionFile) {
              response.cmsAsset.forEach(function (asset) {
                if (asset.sys.id == sectionFile.sys.id) {
                  assetObj = {};
                  assetObj.title = asset.fields.title;
                  assetObj.url = asset.fields.file.url;
                  assetObj.type = asset.fields.file.contentType;
                  arrayofAssetObj.push(assetObj);
                }
              });
            });
          }
          if(typeof(cmsEntryAsset.fields.sectionLink) !='undefined') {
            cmsEntryAsset.fields.sectionLink.forEach(function (sectionLink) {
              assetObj = {};
              assetObj.title = sectionLink.name;
              assetObj.url = sectionLink.url;
              assetObj.type = "application/link";
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
