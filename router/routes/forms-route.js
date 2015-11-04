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
                  assetObj.description = asset.fields.description;
                  assetObj.url = asset.fields.file.url;
                  if (asset.fields.file.contentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    assetObj.type = "application/docx";
                  } else {
                    assetObj.type = asset.fields.file.contentType;
                  }
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
              assetObj.description = sectionLink.description;
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
        entry: arrayOfContent, title: "Forms"
      });
    });
  });
  module.exports = router;
