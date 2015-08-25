var express = require('express');
var contentfulForms= require('../../API/contentful_forms.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var mailer = require('../../API/nodemailer.js');

router.post('/mailer-contact-us', function(req, res, next) {
  console.log("Body:", req.body);
  params = req.body;
  // Validate params
  // mailer.Mail.sendContactUs(params);
  res.send("You made it!");
});

router.post('/mailer-onsite-inquiry', function(req, res, next) {
  res.send("You made it!");
});

module.exports = router;
