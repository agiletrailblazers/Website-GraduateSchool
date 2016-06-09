var express = require('express');
var contentful = require('../../API/contentful.js');
var routerService = require('../../helpers/ajax-form-route-service.js');
var async = require('async');
var router = express.Router();
var mailer = require('../../API/nodemailer.js');
var google = require('../../API/google.js');
var validator = require('validator');
var logger = require('../../logger');
var config = require('konphyg')(__dirname + '/../../config');

module.exports = {
  mailCustomerFeedback : function (req, res, next) {
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
  },

  mailContactUs : function (req, res, next) {
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
  },

  mailOnsiteInquiry : function (req, res, next) {
    var params = req.body;
    if (null != params.course["deliveryDate"] && params.course["deliveryDate"] != '') {
      params.course["deliveryDate"] = params.course["deliveryDate"].date('MMM DD, YYYY');
    }
    //move code to router service
    routerService.validateOnsiteInquiryfields(function (response) {
      if (Object.keys(response.errors).length === 0) {
        if (config("properties").skipReCaptchaVerification) {
          logger.debug("onsite-inquiry- reCaptcha verification is turned off");
          // send subscription email
          mailer.sendOnsiteInquiry(function (response) {
            handleResponse(res, response);
          }, params);
        } else {
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

        }
      } else {
        sendErrorResponse(res, response);
      }
    }, params);
  },

  mailRequestDuplicate : function (req, res, next) {
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
  },

  mailRequestProctor : function (req, res, next) {
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
  },

  mailRequestCertificateProgram : function(req, res, next) {
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
  },

  mailRequestCatalog : function (req, res, next) {
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
  },

  mailSubscription : function (req, res, next) {
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
  },

  mailLanding : function (req, res, next) {
    var params = req.body;
    var landingReceiptEmail = "";
    var landingMoreInfo = "";
    var landingPageFormDisplay = config("properties").landingPageFormDisplay;
    contentful.getLandingPage(function(landingResponse,error){
      if (error) {
        logger.error('Exception encountered searching for landing page, redirecting to error', error);
        sendErrorResponse(res, landingResponse);
        return;
      }
      else if (!landingResponse || !landingResponse.items || !landingResponse.items[0] || !landingResponse.items[0].fields ) {
        logger.warn('No results for landing slug ' + params.slug + ' from Contentful. Redirecting to page not found');
        sendErrorResponse(res, landingResponse);
        return;
      }
      if (landingPageFormDisplay) {
        landingReceiptEmail = config("properties").landingRequestToUserName;
      } else if(landingResponse.items[0].fields.email) {
        landingReceiptEmail = landingResponse.items[0].fields.email;
      }
      if(landingResponse.items[0].fields.moreInfo) {
        landingMoreInfo = landingResponse.items[0].fields.moreInfo;
      }

      logger.debug("In mailer-landing");
      params.email = landingReceiptEmail;
      params.information = landingMoreInfo;
      //move code to router service
      routerService.validateLandingFields(function (response) {
        // Send email if there are no errors.
        if (Object.keys(response.errors).length === 0) {
          // send landing email
          sendLandingEmail(res, params);
        } else {
          sendErrorResponse(res, response);
        }
      }, params);

    },params.urlPath);
   }
}; //end module exports

//send mail of success
function sendSubscriptionEmail(res, params) {
  logger.debug("Sending subscription email");
  mailer.sendSubscriptionRequest(function (response) {
    handleResponse(res, response);
  }, params);
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