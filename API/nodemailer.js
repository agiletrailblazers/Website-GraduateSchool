var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('konphyg')(__dirname + "/../config");
var logger = require('../logger');
// Email Templates
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var templatesDir = path.resolve(__dirname, '..', 'views/mailers');
var contactUsTemplate = new EmailTemplate(path.join(templatesDir, 'contactus-email'));
var onsiteInquiryTemplate = new EmailTemplate(path.join(templatesDir, 'onsiteinquiry-email'));
var requestduplicateTemplate = new EmailTemplate(path.join(templatesDir, 'requestduplicate-email'));
var requestProctorTemplate = new EmailTemplate(path.join(templatesDir, 'requestProctor-email'));
var customerFeedBackTemplate = new EmailTemplate(path.join(templatesDir, 'customerfeedback-email'));
var customerTemplate = new EmailTemplate(path.join(templatesDir, 'customer-email'));
var certificateProgramTemplate = new EmailTemplate(path.join(templatesDir, 'certificate-program'));

var smtp = {
  host: config("properties").defaultEmailServerName,
  port: config("properties").defaultEmailServerPort,
  tls: {
    rejectUnauthorized: false
  }
};
if (config("properties").defaultEmailUserName != "") {
  smtp.auth = {
    user: config("properties").defaultEmailUserName,
    pass: config("properties").defaultEmailUserPassword
  };
}
var transporter = nodemailer.createTransport(smtpTransport(smtp));

module.exports = {

  sendContactUs: function(callback, params) {
    logger.debug("SMTP sending to: " + smtp);
    var locals = {
      email: params.email,
      name: {
        first: params.firstName,
        last: params.lastName
      },
      phone: params.phone,
      comments: params.comments
    }
    // Rendering template with locals.
    contactUsTemplate.render(locals, function(err, results) {
      logger.info("Starting mail send");
      if (err) {
        logger.error(err);
        return callback(500);
      }
      var mailAttributes = {
        from: config("properties").defaultEmailFromUserName,
        to: config("properties").contactUsToUserName,
        subject: params.subject,
        text:  results.text,
        html:  results.html
      };
      transporter.sendMail(mailAttributes, function(error, info) {
        if (error) {
          logger.error(error);
          return callback(500);
        }
        logger.info('Message sent: ' + info.response);
        return callback(200);
      });
    });
  },
  sendOnsiteInquiry: function(callback, params) {
    logger.debug("SMTP sending to: " + smtp);
    onsiteInquiryTemplate.render(params, function(err, results) {
      logger.info("Starting mail send");
      if (err) {
        logger.error(err);
        return callback(500);
      }
      var mailAttributes = {
        from: config("properties").defaultEmailFromUserName,
        to: config("properties").onsiteInquiryToUserName,
        subject: config("properties").onsiteInquiryEmailSubject,
        text:  results.text,
        html:  results.html
      };
      transporter.sendMail(mailAttributes, function(error, info) {
        if (error) {
          logger.error(error);
          return callback(500);
        }
        logger.info('Message sent: ' + info.response);
        return callback(200);
      });
    });
  },
  sendOnRequestDuplicate: function(callback, params) {
    logger.debug("SMTP sending to: " + smtp);
    var requestDuplicateToEmail=config("properties").requestDuplicateCourseCompletionCertificateToUserName;
    var requestDuplicateEmailSubject =config("properties").requestDuplicateFormEmailSubject+" "+params.courseType;
    if(params.courseType=="Official Grade Report") {
      requestDuplicateToEmail=config("properties").requestDuplicateOfficialGradeReportToUserName;
    }
    requestduplicateTemplate.render(params, function(err, results) {
      logger.info("Starting mail send");
      if (err) {
        logger.error(err);
        return callback(500);
      }
      var mailAttributes = {
        from: config("properties").defaultEmailFromUserName,
        to: requestDuplicateToEmail,
        subject: requestDuplicateEmailSubject,
        text:  results.text,
        html:  results.html
      };
      transporter.sendMail(mailAttributes, function(error, info) {
        if (error) {
          logger.error(error);
          return callback(500);
        }
        logger.info('Message sent: ' + info.response);
        return callback(200);
      });
    });
  },
  sendOnProctorRequest: function(callback, params) {
    logger.debug("SMTP sending to: " + smtp);
    requestProctorTemplate.render(params, function(err, results) {
      logger.info("Starting mail send");
      if (err) {
        logger.error(err);
        return callback(500);
      }
      var mailAttributes = {
        from: config("properties").defaultEmailFromUserName,
        to: config("properties").proctorRequestToUserName,
        subject: config("properties").proctorRequestEmailSubject,
        text:  results.text,
        html:  results.html
      };
      transporter.sendMail(mailAttributes, function(error, info) {
        if (error) {
          logger.error(error);
          return callback(500);
        }
        logger.info('Message sent: ' + info.response);
        return callback(200);
      });
    });
  },
  sendOnCustomerFeedBackForm: function(callback, params) {
    logger.debug("SMTP sending to: " + smtp);
    customerFeedBackTemplate.render(params, function(err, results) {
      logger.info("Starting mail send");
      if (err) {
        logger.error(err);
        return callback(500);
      }
      var mailAttributes = {
        from: config("properties").defaultEmailFromUserName,
        to: config("properties").customerFeedBackFormToUserName,
        subject: config("properties").customerFeedBackFormEmailSubject,
        text:  results.text,
        html:  results.html
      };
      transporter.sendMail(mailAttributes, function(error, info) {
        if (error) {
          logger.error(error);
          return callback(500);
        }
        logger.info('Message sent: ' + info.response);
        return callback(200);
      });
    });
  },
  sendToCustomerSubmitForm: function (callback, params) {
    logger.debug("SMTP sending to: " + smtp);
    customerTemplate.render(params, function (err, results) {
      logger.info("Starting mail send");
      if (err) {
        logger.error(err);
        return callback(500);
      }
      var mailAttributes = {
        from: config("properties").defaultEmailFromUserName,
        to: params.email,
        subject: config("properties").customerFeedBackFormEmailSubject,
        text: results.text,
        html: results.html
      };
      transporter.sendMail(mailAttributes, function (error, info) {
        if (error) {
          logger.error(error);
          return callback(500);
        }
        logger.info('Message sent: ' + info.response);
        return callback(200);
      });
    });
  },
  sendCertificateProgram: function (callback, params) {
    logger.debug("SMTP sending to: " + smtp);
    certificateProgramTemplate.render(params, function(err, results) {
      logger.info("Starting mail send");
      if (err) {
        logger.error(err);
        return callback(500);
      }
      var mailAttributes = {
        from: config("properties").defaultEmailFromUserName,
        to: params.email,
        subject: config("properties"),// TODO: Add config for subject title.
        text: results.text,
        html: results.html
      };
      transporter.sendMail(mailAttributes, function (error, info) {
        if (error) {
          logger.error(error);
          return callback(500);
        }
        logger.info('Message sent: ' + info.response);
        return callback(200);
      });
    });
  },
  setTransport: function(transporterIn) {
    //this is needed for unit tests to set a mock transporter
    transporter =  transporterIn;
  }
};
