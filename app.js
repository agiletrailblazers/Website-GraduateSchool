var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var contentful = require('./API/contentful.js');
var config = require('konphyg')("./config");
var logger = require('./logger');

var app = express();

logger.info('starting app');

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
	//load the main nav on every request
	contentful.getNav(function(navItems) {
		var googleAnalyticsId = config("endpoint").googleAnalyticsId;
		var nav = {};
		if (navItems) {
			navItems.forEach(function(navItem) {
				switch(navItem.fields.slug) {
    	    case('main'):
						nav.main = navItem.fields.main;
						break;
					case('footer'):
					  nav.footer = navItem.fields.main;
						break;
					case('top'):
					  nav.top = navItem.fields.main;
					  break;
				}
			});
		}
		res.locals = {navigation: nav, googleAnalyticsId: googleAnalyticsId};
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
