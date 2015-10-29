var express = require('express');
var async = require('async');
var router = express.Router();

router.get(
  ['/development-training-frequently-asked-questions',
    '/academic-program-frequently-asked-questions',
    '/evening-weekend-frequently-asked-questions'
  ],
  function(req, res, next) {
    res.render('/misc/faq');
  });

module.exports = router;
