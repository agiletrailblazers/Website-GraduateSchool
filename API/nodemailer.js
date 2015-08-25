var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('konphyg')(__dirname + "/../config");
// Email Templates
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var templatesDir = path.resolve(__dirname, '..', 'templates');
var template = new EmailTemplate(path.join(templatesDir, 'contactus-email'));
// Transporter
var transporter = nodemailer.createTransport(smtpTransport({
  host: config("endpoint").defaultEmailServerName,
  port: config("endpoint").defaultEmailServerPort,
  auth: {
    user: config("endpoint").defaultEmailUserName,
    pass: config("endpoint").defaultEmailUserPassword
  }
}));

module.exports = {

  // *** LEAVE FOR REFERENCE ***
  // var mailOptions = {
  //     from: config("endpoint").defaultEmailUserName,
  //     to:  config("endpoint").defaultEmailToUserName,
  //     subject: config("endpoint").defaultEmailSubject,
  //     text: config("endpoint").defaultEmailText
  // };

  // transporter.sendMail(mailOptions, function(error, info){
  //     if(error){
  //         return console.log(error);
  //     }
  //     console.log('Message sent: ' + info.response);
  //
  // });

  sendContactUs: function(params) {
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
    template.render(locals, function(err, resulsts) {
      if (err) {
        return console.error(err)
      }
      var mailAttributes = {
        from: config("endpoint").defaultEmailToUserName,
        to: config("endpoint").defaultEmailToUserName,
        subject: params.subject,
        html: "" // HTML Goes here
      };
      transporter.sendMail(mailAttributes, function(error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
    });
  }
};
