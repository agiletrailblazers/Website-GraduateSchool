var express = require('express');
var contentfulForms = require('../../API/contentful_forms.js');
var routerService = require('../../helpers/ajax-form-route-service.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var mailer = require('../../API/nodemailer.js');
var dateformat = require('date-format-lite');
var google = require('../../API/google.js');
var validator = require('validator');
var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');

router.post('/mailer-customer-feedback', function (req, res, next) {
  params = req.body;
  // Server side validation from routerService.
  routerService.validateCustomerFeedBack(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success
          if(validator.isLength(params.email.trim(),1)) {
            mailer.sendToCustomerSubmitForm(function (response) {
            }, params);
          }
          mailer.sendOnCustomerFeedBackForm(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.captchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});

router.post('/mailer-contact-us', function (req, res, next) {
  params = req.body;
  //move code to router service
  routerService.validateContactUsfields(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success

          mailer.sendSubscriptionRequest(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.captchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});

router.post('/mailer-onsite-inquiry', function (req, res, next) {
  params = req.body;
  if (null != params.course["deliveryDate"] && params.course["deliveryDate"] != '') {
    params.course["deliveryDate"] = params.course["deliveryDate"].date('MMM DD, YYYY');
  }
  //move code to router service
  routerService.validateOnsiteInquiryfields(function (response) {
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success
          mailer.sendOnsiteInquiry(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.onSiteInquirycaptchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});


router.post('/mailer-request-duplicate', function (req, res, next) {
  params = req.body;
  //move code to router service
  routerService.validateRequestDuplicate(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success
          mailer.sendOnRequestDuplicate(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.captchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});


router.post('/mailer-request-proctor', function (req, res, next) {
  params = req.body;
  //move code to router service
  routerService.validateRequestProctor(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success
          mailer.sendOnProctorRequest(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.captchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});

router.post('/mailer-request-certificate-program', function(req, res, next) {
  params = req.body;

  switch (true) {
    case (params.formType === '/forms/certificate-program-application'):
      params.emailTo = config("properties").certificateProgramGroup.applicationForm.email;
      params.emailSubject = config("properties").certificateProgramGroup.applicationForm.subject;
      break;
    case (params.formType === '/forms/certificate-program-progress-report'):
      params.emailTo = config("properties").certificateProgramGroup.progressReport.email;
      params.emailSubject = config("properties").certificateProgramGroup.progressReport.subject;
      break;
    case (params.formType === '/forms/certificate-completion'):
      params.emailTo = config("properties").certificateProgramGroup.programCompletion.email;
      params.emailSubject = config("properties").certificateProgramGroup.programCompletion.subject;
      break;
    case (params.formType === '/forms/certificate-program-waiver-request'):
      params.emailTo = config("properties").certificateProgramGroup.waiverRequest.email;
      params.emailSubject = config("properties").certificateProgramGroup.waiverRequest.subject;
      break;
  }
  routerService.validateCertificateProgramForms(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success
          mailer.sendCertificateProgram(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.captchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});


router.post('/mailer-request-catalog', function (req, res, next) {
  params = req.body;
  //move code to router service
  routerService.validateRequestCatalog(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success
          mailer.sendCatalogRequest(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.captchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});

router.post('/mailer-subscription', function (req, res, next) {
  params = req.body;
            console.log("handle post mailer...");
  //move code to router service
  routerService.validateSubscriptionfields(function (response) {
    // Send email if there are no errors.
    // if (true) {
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response) {
        // if (true) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success

          mailer.sendSubscriptionRequest(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params.captchaResponse);
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});

//send errors to client.
function sendErrorResponse(res, response) {
  if ((response != null) && (response.errors != null)) {
    logger.error("Errors:", response.errors);
    res.status(404).send(response.errors);
  } else {
    // Send error to client
    res.status(500).send({"error": "Unexpected Exception Sending Mail"});
  }
}

//shared response handling code
function handleResponse(res, response) {
  logger.info("Node Mailer Response: " + response);
  if (response == 200) {
    //sent success to client
    res.status(200).send();
  }
  else {
    // Send error to client
    res.status(500).send({"error": "Unexpected Exception Sending Mail"});
  }
}

module.exports = router;
