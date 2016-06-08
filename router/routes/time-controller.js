var express = require('express');
var moment = require('moment');
var router = express.Router();
var logger = require('../../logger');

module.exports = {

    // Displays the Guaranteed to Go Page
    getYear: function (req, res) {

        //Get the UTC time and subtract 5 hours for EST
        var time = moment.utc().subtract(5, 'd');
        var year = time.year().toString();

        res.setHeader('Content-Type', 'text/plain');
        res.send(year);
    }
}

