var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();

router.get('/forms/request_duplicate_form', function(req, res, next) {
  contentful.getDuplicateForms(function(response) {
      res.render('forms/request_duplicate_form', {
        sectionTitle: response.sectionTitle,
        sectionHeaderDescription:response.sectionHeaderDescription,
        sectionFooterDescription:response.sectionFooterDescription,
        title:"Request duplicate Form",
      });
  })
});

module.exports = router;

