var express = require('express');
var router = express.Router();

// View Our Registration Policies
router.get('/registration/policy', function(req, res, next) {
  res.render('course-related-info/registration_policy');
});
// Bring this Course to Your Location
router.get('/forms/onsite-inquiry', function(req, res, next) {
  res.render('forms/courses/onsite_inquiry');
});

module.exports = router;
