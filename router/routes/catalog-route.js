var express = require('express');
var contentful = require("../../API/contentful.js");
var async = require('async');
var router = express.Router();
var logger = require('../../logger');
var common = require("../../helpers/common.js");

  // Get Catalog Request Form  page.
  router.get('/catalog-request-form', function(req, res, next) {
  var arrayOfContent=[];
  var catalogHardCopy = {};
  var archivelink = "";
  var states = [];
  async.parallel([
    function(callback) {
      contentful.getCatalogType(function(response, error) {
        if(error){
          logger.error('Could not retrieve CatalogType from Contentful. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          response.cmsEntry.forEach(function(cmsEntryAsset) {
            var content = {};
            content.catlogTitle=  cmsEntryAsset.fields.catlogTitle;
            content.catalogFilter = cmsEntryAsset.fields.catalogFilter;
            content.catalogDisplayOrder = cmsEntryAsset.fields.catlogFilterOrder;
            var arrayofAssetObj =[];
            if(typeof(cmsEntryAsset.fields.catlogFileAssets) !='undefined') {
              cmsEntryAsset.fields.catlogFileAssets.forEach(function (sectionFile) {
                response.cmsAsset.forEach(function (asset) {
                  if (asset.sys.id == sectionFile.sys.id) {
                    assetObj = {};
                    assetObj.title = asset.fields.title;
                    assetObj.description = asset.fields.description;
                    assetObj.url = asset.fields.file.url;
                    assetObj.displayInSecondColumn = false;
                    if (common.isNotEmpty(cmsEntryAsset.fields.sectionCatalogdisplay)) {
                      cmsEntryAsset.fields.sectionCatalogdisplay.forEach(function (sectionCatalogdisplayObj) {
                        if (common.isNotEmpty(sectionCatalogdisplayObj) &&
                          common.isNotEmpty(sectionCatalogdisplayObj.catalogtitle) &&
                          common.isNotEmpty(sectionCatalogdisplayObj.catalogdisplayorder))
                          if (sectionCatalogdisplayObj.catalogtitle.indexOf(asset.fields.title) >= 0) {
                            assetObj.catalogdisplayorder = sectionCatalogdisplayObj.catalogdisplayorder;
                          }
                      });
                    }
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
              return (a.catalogdisplayorder) - (b.catalogdisplayorder);
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
        }
      });
    },function(callback) {
      contentful.getCatalogRequestHardCopy(function(response, error) {
        if(error){
          logger.error('Could not get CatalogRequestHardCopy from Contentful. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          catalogHardCopy = response.cmsEntry;
          catalogHardCopy.sort(function(a,b) {
            return a.fields.catalogHardCopy.localeCompare(b.fields.catalogHardCopy);
          });
          callback();
        }
      });
    }, function(callback){
      contentful.getCatalogArchiveLink(function(response, error) {
        if(error){
          logger.error('Could not retrieve CatalogType from Contentful. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          archivelink = response.link;
          callback();
        }
      });
    },function(callback) {
      contentful.getReferenceData('us-states', function(result, error) {
        if(error){
          logger.error('Could not get state details from Contentful. Redirecting to error page', error);
          common.redirectToError(res);
        }
        else{
          states = result;
          callback();
        }
      });
    } ], function(results) {
      res.render('catalogs', {
        entry: arrayOfContent, title: "Catalog Request Form",
        hardCopyEntry:catalogHardCopy,
        states: states,
        archivelink: archivelink
      });
    });
  });
  module.exports = router;
