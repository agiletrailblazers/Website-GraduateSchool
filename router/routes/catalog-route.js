  var express = require('express');
  var contentful = require("../../API/contentful.js");
  var async = require('async');
  var router = express.Router();
  // Get Catalog Request Form  page.
  router.get('/catalog-request-form', function(req, res, next) {
  arrayOfContent=[];
  var catalogHardCopy = {};
  async.parallel([
    function(callback) {
      contentful.getCatalogDownload(function(response) {
        response.cmsEntry.forEach(function(cmsEntryAsset) {
          content = {};
          content.catlogTitle=  cmsEntryAsset.fields.catlogTitle;
          content.catalogFilter = cmsEntryAsset.fields.catalogFilter;
          content.catalogDisplayOrder = cmsEntryAsset.fields.catlogFilterOrder;
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
        arrayOfContent.sort(function(a, b) {
          return (a.catalogDisplayOrder) - (b.catalogDisplayOrder);
        });
        arrayOfContent.forEach(function(categoryGroup) {
          categoryGroup.assetList.sort(function(a,b) {
             return a.title.localeCompare(b.title);
          });
          if (categoryGroup.assetList.length > 16) {
            categoryGroup.assetList.forEach(function(asset,num) {
            if (num > categoryGroup.assetList.length/2)  {
              asset.displayInSecondColumn = true;
           }
         });
          }
        });
        callback();
      });
    },function(callback) {
      contentful.getCatalogRequestHardCopy(function(response) {
        catalogHardCopy = response.cmsEntry;
        catalogHardCopy.sort(function(a,b) {
          return a.fields.catalogHardCopy.localeCompare(b.fields.catalogHardCopy);
        });
        callback();
      });
    },function(callback) {
      contentful.getReferenceData('us-states', function(result) {
        states = result;
        callback();
      });
    } ], function(results) {
      res.render('catalogs', {
        entry: arrayOfContent, title: "Catalog Request Form",
        hardCopyEntry:catalogHardCopy,
        states: states
      });
    });
  });
  module.exports = router;
