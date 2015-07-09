var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: 'Arti'});
});

// GET demo home page
router.get('/demo', function(req, res, next){
  res.render('demo_index', { });
});

router.get('/whats-new', function(req, res, next){
  res.render('whats_new', { });
});

module.exports = router;
