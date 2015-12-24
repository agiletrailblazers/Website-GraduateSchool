var express = require('express');
 var contentful = require("../../API/contentful.js");
 var async = require('async');
 var router = express.Router();
 var config = require('konphyg')(__dirname + '/../../config');
 var contentfulForms = require('../../API/contentful_forms.js');
 var logger = require('../../logger');

 // Get subscription-form page.
 router.get('/subscription-form', function(req, res, next) {
   arrayOfContent=[];
   var catalogHardCopy = {};
   async.parallel([
     function(callback) {
       contentful.getCatalogType(function(response, error) {
         if(error){
           logger.warn('Ignoring error retrieving the catalog types in subscription-form, because areaofinterest is not a mandatory field', error);
         }
         else{
           response.cmsEntry.forEach(function(cmsEntryAsset) {
             content = {};
             content.areaOfInterest=  cmsEntryAsset.fields.catlogTitle;
             content.areaOfInterestDisplayOrder = cmsEntryAsset.fields.catlogFilterOrder;
             arrayOfContent.push(content);
           });
           arrayOfContent.sort(function(a, b) {
             return (a.catalogDisplayOrder) - (b.catalogDisplayOrder);
           });
         }
         callback();
       });
     },
     function(callback) {
       var entryId = "2wAaVPf3aIWCAu0SeeI44O";
       contentfulForms.getFormWithHeaderAndFooter(entryId, function(response, error) {
         if(error){
           logger.warn('Ignoring error retrieving the SectionTitle in subscription-form', error);
           title = 'Form'; //title cannot be null in order to render the page so choose generic title
         }
         else{
           title = response.fields.sectionTitle;
         }
         callback();
       });
     },
     function(callback) {
       contentful.getReferenceData('us-states', function(result, error) {
         if(error){
           logger.error('Could not get states from Contentful.getReferenceData API call. Redirecting to error page', error);
           res.redirect('/error');
         }
         else{
           states = result;
           callback();
         }
       });
     }], function(results) {
       res.render('forms/subscription_form', {
         entry : arrayOfContent, title: title,
         states : states,
         skipReCaptcha : config("properties").skipReCaptchaVerification
       });
   });
 });
 module.exports = router;
