var express = require('express');
var router = express.Router();
var config = require('konphyg')(__dirname + '/../../config');

router.get(['/landing-form'], function(req, res, next) {
    res.render('landing/landing_detail', {
      title: "landing",
      skipReCaptcha : config("properties").skipReCaptchaVerification
    });
});

module.exports = router;
