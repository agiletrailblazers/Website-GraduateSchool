var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Graduate School', name: 'Home Page'});
});
//Contact GS to know more form
router.get('/forms/contact-us', function(req, res, next) {
  res.render('forms/contact_us');
});
module.exports = router;
