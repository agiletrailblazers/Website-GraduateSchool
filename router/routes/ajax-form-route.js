var express = require('express');
var contentfulForms= require('../../API/contentful_forms.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');

router.post('/mailer-contact-us', function(req, res, next) {
  res.send("You made it!");
});

router.post('/mailer-onsite-inquiry', function(req, res, next) {
  res.send("You made it!");
});

module.exports = router;
