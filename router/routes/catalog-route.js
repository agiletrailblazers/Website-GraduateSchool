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
          arrayofAssetObj =[];
          if(typeof(cmsEntryAsset.fields.catlogFileAssets) !='undefined') {
            cmsEntryAsset.fields.catlogFileAssets.forEach(function (sectionFile) {
              response.cmsAsset.forEach(function (asset) {
                if (asset.sys.id == sectionFile.sys.id) {
                  assetObj = {};
                  assetObj.title = asset.fields.title;
                  assetObj.description = asset.fields.description;
                  assetObj.url = asset.fields.file.url;
                  assetObj.displayInSecondColumn = false;
                  arrayofAssetObj.push(assetObj);
                }
              });
            });
          }
          content.assetList=arrayofAssetObj;
          arrayOfContent.push(content);

        });
        arrayOfContent.forEach(function(categoryGroup) {
          categoryGroup.assetList.sort(function(a,b) {
             return a.title.localeCompare(b.title);
          });
          if (categoryGroup.assetList.length > 16) {
            categoryGroup.assetList.forEach(function(asset,num) {
            if (num > 8)  {
              asset.displayInSecondColumn = true;
           }
         });
          }
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
