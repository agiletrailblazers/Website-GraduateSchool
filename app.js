var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var contentful = require('./API/contentful.js');
var authentication = require('./API/authentication-api.js');
var config = require('konphyg')("./config");
var logger = require('./logger');
var async = require('async');
var course = require("./API/course.js");
var common = require("./helpers/common.js");
var session = require('./API/manage/session-api.js');
var user = require("./API/manage/user-api.js");
var Redis = require('ioredis');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);

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
	var userFirstName = "";
	var nextPageAfterCreateUser = "";
	async.series([
		function(callback) {
			//Check to see if a token exists in the cookie, and if not get one from API and put it in cookie.
			authentication.getAuthToken(req, res, function(error, token) {
				if (error) {
					logger.error(error);
					common.redirectToError(res);
				}
				logger.debug("Token returned is ", token);
				//Set token to request variable for use in API calls
				req.query["authToken"] = token;
				callback();
			});
		},
		//get data for all pages

	function() {
		async.parallel([
			function(callback) {
				contentful.getNavigation(function (nav, error) {
					if (error) {
						logger.error('Error retrieving navigation from Contentful. Redirecting to error page', error);
						common.redirectToError(res);
					}
					else {
						navigation = nav;
						callback();
					}
				});
			},
			function(callback) {
				course.getLocations(function (response, error, result) {
					if (error) {
						logger.warn('Error retrieving locations from API. Ignoring error and displaying page', error);
					}
					if (result != null) {
						result.forEach(function (location) {
							locations.push(location.city + ", " + location.state);
						});
						locations.sort();
					}
					callback();
				}, req.query["authToken"]);
			},
			function(callback) {
				course.getCategories(function (response, error, result) {
					if (error) {
						logger.warn('Error retrieving subjects from API. Ignoring error and displaying page', error);
					}
					if (result != null) {
						courseSubjectResult = result;
					}
					callback();
				}, req.query["authToken"]);
			}
			,
			function(callback) {
				session.getSessionData(req, function(error, sessionData) {
					if (error) {
						logger.error('Could not retrieve session from Cache. Redirecting to error page', error);
						common.redirectToError(res);
					}
					app.set('sessionData', sessionData);
					//Try to get user's first name from the session data
					if(sessionData.userFirstName){
						userFirstName = sessionData.userFirstName;
						callback();
					}
					//Could not get first name from sessionData
					else{
						callback();
					}
				});
			},
			function(callback) {
				//If the user clicks the create account link, this is the page to navigate to after successful creation
				nextPageAfterCreateUser = req.url;
				callback();
			}
		], function() {
			res.locals = {navigation: navigation,
				locations: locations,
				courseSubjectResult: courseSubjectResult,
				googleAnalyticsId: googleAnalyticsId,
				showChat: showChat,
				mailPage: mailPage,
				env: env,
				userFirstName: userFirstName,
				nextPageAfterCreateUser: nextPageAfterCreateUser,
				userRouteEnabled: config("properties").manage.userRouteEnabled
			};
			next();
		})
	}
	]);
});
if (config("properties").manage.useCache === true) {

	// setup Redis connection
	Redis.Promise.onPossiblyUnhandledRejection(function (error) {
		logger.error("Redis Error: ", error);
	});

	//Create Redis client with custom retry limit functions
	var redisConfig = config("properties").redis;
	var redisRetryLimit = config("properties").manage.redisRetryLimit;
	var redisRetryDelay = config("properties").manage.redisRetryDelay;
	var retryFunction = function (times) {
		if (times < redisRetryLimit){
			logger.warn("Could not connect to Redis, try number: " + times);
			return redisRetryDelay;
		}
		else{
			return;
		}
	};
	logger.debug("Redis Retry limit: " + redisRetryLimit + "  and redisRetryDelay: " + redisRetryDelay);
	redisConfig.retryStrategy = retryFunction;
	redisConfig.sentinelRetryStrategy = retryFunction;
	var cache = new Redis(config("properties").redis);

	//Redis cache logging
	cache.on("connect", function () {
		logger.debug("Redis connected")
	});
	cache.on("ready", function () {
		logger.info("Redis ready");
	});
	cache.on("error", function (err) {
		logger.error("Redis error: " + err);
	});
	cache.on("close", function () {
		logger.debug("Redis close");
	});
	cache.on("reconnecting", function (time) {
		logger.debug("Redis reconnecting in " + time + " msec");
	});
	cache.on("end", function () {
		logger.info("Redis end")
	});

	app.use(expressSession({
		secret: 'ssshhhhh',
		store: new RedisStore({client: cache}),
		saveUninitialized: false,
		resave: false
	}));
}

//app.use('/', require('./routes'));
var router = require('./router')(app);

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
