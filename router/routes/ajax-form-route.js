var express = require('express');
var contentfulForms= require('../../API/contentful_forms.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var mailer = require('../../API/nodemailer.js');
var validator = require('validator');


router.post('/mailer-contact-us', function(req, res, next) {
  console.log("Body:", req.body);
  params = req.body;
  // Validate params.firstName
  validator.isLength(params.firstName, 3);
  // Validate params.lastName
  validator.isLength(params.lastName, 3);
  // Validate params.email
  validator.isEmail(params.email);
  // Validate params.phone

  // Validate params.comments

  // mailer.Mail.sendContactUs(params);
  res.send("You made it!");
});

router.post('/mailer-onsite-inquiry', function(req, res, next) {
  res.send("You made it!");
});

module.exports = router;
