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
  response = {};
  response.errors = {};
  // Validate params.firstName
  switch(params.firstName) {
    case (!params.firstName):
      response.errors.firstName = "First name is empty.";
      break;
    case (validator.isLength(params.firstName, 3)):
      response.errors.firstName = "First name must be at least 3 characters.";
      break;
  }
  // Validate params.lastName
  switch(params.lastName) {
    case (!params.lastName):
      response.errors.lastName = "Last name is empty.";
      break;
    case (validator.isLength(params.lastName, 3)):
      response.errors.lastName = "Last name must be at lease 3 characters.";
      break;
  }
  // Validate params.email
  switch(params.email) {
    case (!params.email):
      response.errors.email = "Email is empty.";
      break;
    case (validator.isEmail(params.email)):
      response.errors.email = "Email is in the wrong format."
      break;
  }
  // Validate params.phone
  switch(params.phone) {
    case (!params.phone):
      response.errors.phone = "Phone number is empty.";
      break;
    case (!params.phone.match(/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/)):
      response.errors.phone = "Phone number is not in the correct format.";
      break;
  }
  // Validate params.comments

  // mailer.Mail.sendContactUs(params);
  res.send("You made it!");
});

router.post('/mailer-onsite-inquiry', function(req, res, next) {
  res.send("You made it!");
});

module.exports = router;
