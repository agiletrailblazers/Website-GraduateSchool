var express = require('express');
var router = express.Router();
var logger = require('../logger');
var contentful = require('../API/contentful.js');
var common = require("../helpers/common.js")
var config = require('konphyg')(__dirname + '/../config');

// requires for route controllers
var userController = require('./routes/manage/user-controller.js');
var cartController = require('./routes/manage/cart-controller.js');
var timeController = require('./routes/time-controller.js');
var gtogController = require('./routes/gtog-controller.js');
var ajaxFormController = require('./routes/ajax-form-controller.js')

// log some key configuration information
logger.info("userRouteEnabled: " + config("properties").manage.userRouteEnabled);
logger.info("registrationUrl: " + config("properties").registrationUrl);


// load all routes from sub-files
module.exports = function (app) {
    app.use('/', require('./routes/home-route'));
    app.use('/', require('./routes/course-route'));
    app.use('/', require('./routes/search-route'));
    app.use('/', require('./routes/whatsnew-route'));
    app.use('/', require('./routes/news-route'));
    app.use('/', require('./routes/form-route'));
    app.use('/', require('./routes/generic-page-route'));
    app.use('/', require('./routes/forms-route'));
    app.use('/', require('./routes/catalog-route'));
    app.use('/', require('./routes/faq-route'));
    app.use('/', require('./routes/subscription-route'));
    app.use('/', router.get('/gtog', gtogController.displayG2GPage));

    //get the year from the time controller
    app.use('/', router.get('/year', timeController.getYear));

    // async AJAX Email Routes
    app.use('/', router.post('/mailer-customer-feedback', ajaxFormController.mailCustomerFeedback));
    app.use('/', router.post('/mailer-contact-us', ajaxFormController.mailContactUs));
    app.use('/', router.post('/mailer-onsite-inquiry', ajaxFormController.mailOnsiteInquiry));
    app.use('/', router.post('/mailer-request-duplicate', ajaxFormController.mailRequestDuplicate));
    app.use('/', router.post('/mailer-request-proctor', ajaxFormController.mailRequestProctor));
    app.use('/', router.post('/mailer-request-certificate-program', ajaxFormController.mailRequestCertificateProgram));
    app.use('/', router.post('/mailer-request-catalog', ajaxFormController.mailRequestCatalog));
    app.use('/', router.post('/mailer-subscription', ajaxFormController.mailSubscription));
    app.use('/', router.post('/mailer-landing', ajaxFormController.mailLanding));
    if (config("properties").manage.userRouteEnabled === true) {
        // user management routes
        app.use('/', router.get('/manage/user/login', userController.displayLogin));
        app.use('/', router.get('/manage/user/registration_login_create', userController.displayRegistrationLoginCreate));
        app.use('/', router.post('/manage/user/create', userController.displayCreateUser));
        app.use('/', router.post('/manage/user/registration_login', userController.registrationLogin));
        app.use('/', router.get('/manage/user/logout', userController.logout));
        app.use('/', router.get('/manage/user/password/forgot', userController.displayForgotPassword));
        app.use('/', router.post('/manage/user/password/forgot', userController.forgotPassword));
        app.use('/', router.get('/manage/user/password/change', userController.displayChangePassword));
        app.use('/', router.get('/manage/user/account', userController.displayMyAccount));
        // async AJAX user management routes
        app.use('/', router.post('/manage/user/login_user', userController.login));
        app.use('/', router.post('/manage/user/create_user', userController.createUser));
        app.use('/', router.post('/manage/user/update_user', userController.updateUser));
        app.use('/', router.post('/manage/user/logout', userController.logoutAsync));
        app.use('/', router.post('/manage/user/password/change', userController.changePassword));

        // cart routes
        app.use('/', router.get('/manage/cart', cartController.displayCart));
        app.use('/', router.post('/manage/cart', cartController.updateCart));
        app.use('/', router.get('/manage/cart/payment', cartController.displayPayment));
        app.use('/', router.post('/manage/cart/payment/cancel', cartController.cancelPayment));
        app.use('/', router.post('/manage/cart/payment/confirm', cartController.confirmPayment));
        app.use('/', router.post('/manage/cart/payment/complete', cartController.completePayment));
        app.use('/', router.post('/manage/cart/registration/cancel', cartController.cancelRegistration));
    }
    app.use('/', require('./routes/landing-page-route'));
    app.use(defaultUrlRedirect);
};

function defaultUrlRedirect(req, res, next) {
  contentful.getContentUrlRedirect(function(data, error) {
    if (data != null) {
      var map = new Object();
      data.forEach(function (curr){
        map[curr.fields.from] = curr.fields.to;
      });
      var  requrl = req.url.trim();
      var lastChar=requrl.charAt(requrl.length-1);
      if (lastChar.indexOf('/')==0) {
        requrl = requrl.substring(0, requrl.length - 1);
      }
      if(common.isNotEmpty(map[requrl])) {
        res.redirect(map[requrl]);
      }
      // redirect non-one word urls to pagenotfound. '1' is used in substring to ignore the first char in url i.e to ignore first '/'
      else if (-1 === req.url.substring(1).search(/^[A-Za-z0-9_-]+$/)){
        logger.error("One-word page not found: " + req.url + " redirecting to page not found");
        res.redirect('/pagenotfound');
      }
      // everything else redirects to page not found
      else {
        logger.error("One-word page not found: " + req.url + " redirecting to homepage");
        res.redirect('/');
      }
    } else {
        if (error) {
          logger.error(error);
          common.redirectToError(res);
        }
    }
  });
}
