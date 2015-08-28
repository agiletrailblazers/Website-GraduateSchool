var express = require('express');
var contentfulForms= require('../../API/contentful_forms.js');
var routerService= require('../../router-service/ajax-form-route-service.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var mailer = require('../../API/nodemailer.js');
var google = require('../../API/google.js');
var validator = require('validator');

router.post('/mailer-contact-us', function(req, res, next) {
	params = req.body;
  // Send email if there are no errors.
  if (Object.keys(response.errors).length === 0) {
    //verify captcha
    google.verifyCaptcha(function(response) {
        if ((response!=null) && (response.statusCode == 200)) {
          //send mail of success
          mailer.sendContactUs(function(response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
    }, params.captchaResponse);
  } else {
    sendErrorResponse(res, response);
  },params,req);
});

router.post('/mailer-onsite-inquiry', function(req, res, next) {
	params = req.body;
  if (Object.keys(response.errors).length === 0) {
    //verify captcha
    google.verifyCaptcha(function(response) {
      if ((response!=null) && (response.statusCode == 200)) {
        //send mail of success
        mailer.sendOnsiteInquiry(function(response) {
          handleResponse(res, response);
        }, params);
      } else {
        sendErrorResponse(res, response);
      }
    }, params.onSiteInquirycaptchaResponse);
  } else {
    sendErrorResponse(res, response);
  },params,req);
});

//send errors to client.
function sendErrorResponse(res, response) {
  if((response !=null) && (response.errors !=null)) {
    console.log("Errors:", response.errors);
    res.status(404).send(response.errors);
  }else {
    // Send error to client
    res.status(500).send({"error":"Unexpected Exception Sending Mail"});
  }
}

//shared response handling code
function handleResponse(res, response) {
  console.log("Node Mailer Response: " + response);
  if (response == 200) {
    //sent success to client
    res.status(200).send();
  }
  else {
    // Send error to client
    res.status(500).send({"error":"Unexpected Exception Sending Mail"});
  }
}

module.exports = router;
