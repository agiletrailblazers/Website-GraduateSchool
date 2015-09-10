var express = require('express');
var course= require('../../API/course.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var logger = require('../../logger');

router.get('/ajax-course-search', function(req, res, next) {

    var params = req.body;
    var searchResult = {};
    async.parallel([
        function (callback) {
            course.performCourseSearch(function (response, error, result) {
                if ((response!=null) && (response.statusCode == 200)) {
                    searchResult = result;
                    callback();
                }
            }, params);

        }

    ]);
    callback();
});
module.exports = router;
