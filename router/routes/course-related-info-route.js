var express = require('express');
var contentfulForms= require('../../API/contentful_forms.js');
var async = require('async');
var router = express.Router();

// View Our Registration Policies
router.get('/registration/policy', function(req, res, next) {
    res.render('course-related-info/registration_policy');
});

module.exports = router;
