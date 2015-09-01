var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('konphyg')(__dirname + "/../config");
var logger = require('../logger');
// Email Templates
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var templatesDir = path.resolve(__dirname, '..', 'views/templates');
var contactUsTemplate = new EmailTemplate(path.join(templatesDir, 'contactus-email'));
var onsiteInquiryTemplate = new EmailTemplate(path.join(templatesDir, 'onsiteinquiry-email'));

var smtp = {
  host: config("endpoint").defaultEmailServerName,
  port: config("endpoint").defaultEmailServerPort,
  tls: {
    rejectUnauthorized: false
  }
};
if (config("endpoint").defaultEmailUserName != "") {
  smtp.auth = {
    user: config("endpoint").defaultEmailUserName,
    pass: config("endpoint").defaultEmailUserPassword
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
        from: config("endpoint").defaultEmailToUserName,
        to: config("endpoint").defaultEmailToUserName,
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
        from: config("endpoint").defaultEmailToUserName,
        to: config("endpoint").defaultEmailToUserName,
        subject: config("endpoint").onsiteInquiryEmailSubject,
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
  setTransport: function(transporterIn) {
    //this is needed for unit tests to set a mock transporter
    transporter =  transporterIn;
  }
};
