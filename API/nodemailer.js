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


var mailOptions = {
    from: config("endpoint").defaultEmailUserName,
    to:  config("endpoint").defaultEmailToUserName,
    subject: config("endpoint").defaultEmailSubject,
    text: config("endpoint").defaultEmailText
};


transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});