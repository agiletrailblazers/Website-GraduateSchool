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

var useCache = config("properties").session.useCache;
logger.info("use cache backed sessions: " + useCache);

var sessionTimeout = config("properties").session.timeout;
logger.info("session timeout: " + sessionTimeout);

var secureCookies = config("properties").session.secure;
logger.info("secure cookies: " + secureCookies);

var useContentfulCache = config("properties").contentfulCache.turnOn;
logger.info("use contentful cache: " + useContentfulCache);

if (useCache) {
	// setup Redis connection for express session
	Redis.Promise.onPossiblyUnhandledRejection(function (error) {
		logger.error("Redis Error: ", error);
	});

	//Create Redis client with custom retry limit functions
	var redisConfig = config("properties").cache.redis;
	var redisRetryLimit = config("properties").cache.redisRetryLimit;
	var redisRetryDelay = config("properties").cache.redisRetryDelay;
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
	var cache = new Redis(redisConfig);

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
		secret: 'thisisthegraduateschoolsecretphrase',
		store: new RedisStore({client: cache, ttl: sessionTimeout}),
		saveUninitialized: false,
		resave: false,
		rolling: true,
		cookie: {
			maxAge: sessionTimeout,
			secure: secureCookies
		}
	}));
}
else {
	app.use(expressSession({
		secret: 'thisisthegraduateschoolsecretphrase',
		saveUninitialized: false,
		resave: false,
		rolling: true,
		cookie: {
			maxAge: sessionTimeout,
			secure: secureCookies
		}
	}));
}

if (secureCookies) {
	// set express trust proxy
	app.set('trust proxy', 1);
}

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
	var user = session.getSessionData(req, "user");
	var userFirstName = (user != undefined) ? user.person.firstName : undefined;
	var userId = (user != undefined) ? user.id : undefined;
	var authToken = session.getSessionData(req, "authToken");
	var nextPageAfterCreateUser = "";
	async.series([
		function(callback) {
			//Check to see if a token exists, and if not get one from API and put it in session.
			logger.debug("Existing token is", authToken);
			if (common.isEmpty(authToken)) {
				authentication.getAuthToken(req, res, function(error, token) {
					if (error) {
						logger.error(error);
						common.redirectToError(res);
						return;
					}
					session.setSessionData(req, "authToken", token);
					authToken = token;
					callback();
				});
			}
			else {
				callback();
			}
		},
		function(callback) {
			if (common.isNotEmpty(userId)) {
				logger.debug("User " + userId + " is logged in, verifying token is valid");
				authentication.validateAuthToken(req, res, function (error, token, statusCode) {
					if (error) {
						logger.error(error);
						common.redirectToError(res);
					}
					else if (statusCode == 401) {
						logger.info("User token has expired, logging user out and redirecting to login");
						session.clearSessionData(req);
						session.setSessionData(req, "loginMessage", "In order to protect your privacy, you have been logged out and must log back in");
						session.setSessionData(req, "nextPage", req.url);
						res.redirect('/manage/user/login');
						return;
					}
					else if (statusCode == 200) {
						if (token) {
							session.setSessionData(req, "authToken", token);
							logger.debug("Token expired, replacing with new token " + token);

						}
						else {
							logger.debug("Token is valid and does not need to be replaced");
						}
						callback();
					}
				})
			}
			else {
				callback();
			}

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
				}, session.getSessionData(req, "authToken"));
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
				}, session.getSessionData(req, "authToken"));
			}
			,
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
				userId: userId,
				sessionTimeout: sessionTimeout,
				nextPageAfterCreateUser: nextPageAfterCreateUser,
				userRouteEnabled: config("properties").manage.userRouteEnabled
			};
			next();
		})
	}
	]);
});

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
