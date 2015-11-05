  var express = require('express');
  var contentful = require("../../API/contentful.js");
  var async = require('async');
  var router = express.Router();
  // Get Catalog Request Form  page.
  router.get('/catalog-request-form', function(req, res, next) {
  arrayOfContent=[];
  async.series([
    function(callback) {
      contentful.getCatalogDownload(function(response) {
        response.cmsEntry.forEach(function(cmsEntryAsset) {
          content = {};
          content.catlogTitle=  cmsEntryAsset.fields.catlogTitle;
          content.catalogFilter = cmsEntryAsset.fields.catalogFilter;
            console.log(  content.catlogTitle);
          arrayofAssetObj =[];
          if(typeof(cmsEntryAsset.fields.catlogFileAssets) !='undefined') {
            cmsEntryAsset.fields.catlogFileAssets.forEach(function (sectionFile) {
              response.cmsAsset.forEach(function (asset) {
                if (asset.sys.id == sectionFile.sys.id) {
                  assetObj = {};
                  assetObj.title = asset.fields.title;
                  assetObj.description = asset.fields.description;
                  assetObj.url = asset.fields.file.url;
                  arrayofAssetObj.push(assetObj);
                }
              });
            });
          }
          content.assetList=arrayofAssetObj;
          arrayOfContent.push(content);
        });
        callback();
      });
    } ], function(results) {
      res.render('catalogs', {
        entry: arrayOfContent, title: "catalogs"
      });
    });
  });
  module.exports = router;
