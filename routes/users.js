var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
    res.render('users', { title: 'ABOUT US', name: 'User Name',about: 'about us' });
});

module.exports = router;
