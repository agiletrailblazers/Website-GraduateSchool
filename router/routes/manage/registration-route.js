var express = require('express');
var async = require('async');
var router = express.Router();
var logger = require('../../../logger');

// Routes related to registration
router.get('/register', function(req, res, next) {
  async.series([
    function(callback) {
      callback();
    },
    function(callback) {
      callback();
    },
  ], function(results) {
    logger.info("In register route");
    res.redirect('/pagenotfound');
  });
});

module.exports = router;
