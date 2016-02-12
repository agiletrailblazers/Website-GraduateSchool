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
  var params = req.body;
  // Server side validation from routerService.
  routerService.validateCustomerFeedBack(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response, error) {
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
  var params = req.body;
  //move code to router service
  routerService.validateContactUsfields(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response, error) {
        if ((response != null) && (response.statusCode == 200)) {
          //send mail of success

          mailer.sendContactUs(function (response) {
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
  var params = req.body;
  if (null != params.course["deliveryDate"] && params.course["deliveryDate"] != '') {
    params.course["deliveryDate"] = params.course["deliveryDate"].date('MMM DD, YYYY');
  }
  //move code to router service
  routerService.validateOnsiteInquiryfields(function (response) {
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response, error) {
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
  var params = req.body;
  //move code to router service
  routerService.validateRequestDuplicate(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response, error) {
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
  var params = req.body;
  //move code to router service
  routerService.validateRequestProctor(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response, error) {
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
  var params = req.body;

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
      google.verifyCaptcha(function (response, error) {
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
  var params = req.body;
  //move code to router service
  routerService.validateRequestCatalog(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      google.verifyCaptcha(function (response, error) {
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
  var params = req.body;
  logger.debug("In mailer-subscription");
  //move code to router service
  routerService.validateSubscriptionfields(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      if (config("properties").skipReCaptchaVerification) {
        logger.debug("mailer-subscription - reCaptcha verification is turned off");
        // send subscription email
        sendSubscriptionEmail(res, params);
      }
      else {
        google.verifyCaptcha(function (response, error) {
          if ((response != null) && (response.statusCode == 200) ) {
            logger.debug("mailer-subscription captcha verification success");
            // send subscription email
            sendSubscriptionEmail(res, params);
          } else {
            logger.debug("mailer-subscription captcha verification failed");
            sendErrorResponse(res, response);
          }
        }, params.captchaResponse);
      }
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});

function sendSubscriptionEmail(res, params) {
  //send mail of success
  logger.debug("Sending subscription email");
  mailer.sendSubscriptionRequest(function (response) {
    handleResponse(res, response);
  }, params);
}


router.post('/mailer-landing', function (req, res, next) {
  var params = req.body;
  logger.debug("In mailer-landing");
  //move code to router service
  routerService.validateLandingFields(function (response) {
    // Send email if there are no errors.
    if (Object.keys(response.errors).length === 0) {
      //verify captcha
      if (config("properties").skipReCaptchaVerification) {
        logger.debug("mailer-landing - reCaptcha verification is turned off");
        // send landing email
        sendLandingEmail(res, params);
      }
      else {
      google.verifyCaptcha(function (response, error) {
          if ((response != null) && (response.statusCode == 200) ) {
            logger.debug("mailer-landing captcha verification success");
            // send subscription email
            sendLandingEmail(res, params);
          } else {
            logger.debug("mailer-landing captcha verification failed");
            sendErrorResponse(res, response);
          }
        }, params.captchaResponse);
      }
    } else {
      sendErrorResponse(res, response);
    }
  }, params);
});

function sendLandingEmail(res, params) {
  //send mail of success
  logger.debug("Sending landing email");
  mailer.sendLandingRequest(function (response) {
    handleResponse(res, response);
  }, params);
}

//send errors to client.
function sendErrorResponse(res, response) {
  if ((response != null) && (response.errors != null)) {
    logger.error("Errors:", response.errors);
    res.status(404).send(response.errors);
  } else {
    // Send error to client
    res.status(500).send({"error": "We have experienced a problem processing your request, please try again later."});
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
    res.status(500).send({"error": "We have experienced a problem processing your request, please try again later."});
  }
}

module.exports = router;
