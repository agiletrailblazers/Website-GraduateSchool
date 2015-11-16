  var express = require('express');
  var contentful = require("../../API/contentful.js");
  var async = require('async');
  var router = express.Router();
  // Get Catalog Request Form  page.
  router.get('/subscription-form', function(req, res, next) {
    arrayOfContent=[];
    var catalogHardCopy = {};
    async.series([
      function(callback) {
        contentful.getCatalogType(function(response) {
          response.cmsEntry.forEach(function(cmsEntryAsset) {
            content = {};
            content.areaOfInterest=  cmsEntryAsset.fields.catlogTitle;
            content.areaOfInterestDisplayOrder = cmsEntryAsset.fields.catlogFilterOrder;
            arrayOfContent.push(content);
          });
          arrayOfContent.sort(function(a, b) {
            return (a.catalogDisplayOrder) - (b.catalogDisplayOrder);
          });
          callback();
        });
      }], function(results) {
        res.render('subscription_form', {
          entry: arrayOfContent, title: "Subscription Form",
        });
    });
  });
  module.exports = router;
