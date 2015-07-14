var express = require('express');
var router = express.Router();
var gethomepage = require('./param/gethomepage');

router.get('/', gethomepage);

module.exports = router;
