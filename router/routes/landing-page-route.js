var express = require('express');
var contentful = require('../../API/contentful.js');
var router = express.Router();
var logger = require('../../logger');
var marked = require('marked');
var common = require("../../helpers/common.js");
var config = require('konphyg')(__dirname + '/../../config');

router.get(['/landing/:content_slug'], function(req, res, next) {
    res.render('landing/landing_detail', {
      title: "landing",
      skipReCaptcha : config("properties").skipReCaptchaVerification
    });
});

module.exports = router;
