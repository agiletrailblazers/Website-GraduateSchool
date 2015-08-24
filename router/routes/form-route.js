var express = require('express');
var contentfulForms= require('../../API/contentful_forms.js');
var async = require('async');
var router = express.Router();

// Bring this Course to Your Location
router.get('/forms/onsite-inquiry', function(req, res, next) {
  contentfulForms.getInquiryForm(function(response) {
    fields = response.fields;
    console.log(fields);
    res.render('forms/courses/onsite_inquiry', {topParagraph: fields.topParagraph,
      highlightedParagraph: fields.highlightedParagraph,
      gsReference: fields.howDidYouHearAboutTraining,
      prefix: fields.namePrefix });
  });
});

module.exports = router;
