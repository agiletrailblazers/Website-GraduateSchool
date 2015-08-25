var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('konphyg')(__dirname + "/../config");


var transporter = nodemailer.createTransport(smtpTransport({
  host: config("endpoint").defaultEmailServerName,
  port: config("endpoint").defaultEmailServerPort,
  auth: {
    user: config("endpoint").defaultEmailUserName,
    pass: config("endpoint").defaultEmailUserPassword
  }
}));

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

var Mail = {
  sendContactUs: function(params) {
    var mailAttributes = {
      from: "", // params.from goes here
      to: config("endpoint").defaultEmailToUserName,
      subject: "", // params.subject goes here
      html: // HTML Goes here
    }
    transporter.sendMail(mailAttributes, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }
}
