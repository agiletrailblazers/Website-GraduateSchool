var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var contentful = require('./API/contentful.js');
var config = require('konphyg')("./config");
var logger = require('./logger');
var async = require('async');
var course = require("./API/course.js");

var app = express();

var env = config("properties").env;
logger.info('starting app for environment ' + env);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
	var googleAnalyticsId = config("properties").googleAnalyticsId;
	var chatPages = config("properties").chatPages;
	var env = config("properties").env;
	var navigation = {};
	var locations = [];
  var courseSubjectResult = [];
	//should we show chat on this page?
	var currentUrl = req.url.split("?",1)[0];
	var pattern = new RegExp(chatPages);
	var showChat = pattern.test(currentUrl);
	//build mail page "mailto" object
	var mailPage = {};
	mailPage.titlePrefix = config("properties").mailPageTitlePrefix;
	mailPage.body = config("properties").mailPageBody;
	//get data for all pages
	async.parallel([
    function(callback) {
			//load the main nav on every request
			contentful.getNavigation(function(nav) {
				navigation = nav;
				callback();
			});
		},
		function(callback) {
			course.getLocations(function(response, error, result) {
				result.forEach(function(location) {
					 locations.push(location.city + ", " + location.state);
				});
				locations.sort();
				callback();
			});
		},
    function(callback) {
      course.getCategories(function(response, error, result) {
        courseSubjectResult = result;
        callback();
      });
    }
		], function() {
			res.locals = {navigation: navigation,
				locations: locations,
        courseSubjectResult: courseSubjectResult,
				googleAnalyticsId: googleAnalyticsId,
				showChat: showChat,
				mailPage: mailPage,
				env: env};
			next();
		});
});

//app.use('/', require('./routes'));
var router = require('./router')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
