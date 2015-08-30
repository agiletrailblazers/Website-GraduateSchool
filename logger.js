var log4js = require('log4js');

//define global logger
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/app.log'), 'app');
var logger = log4js.getLogger('app');
logger.setLevel('DEBUG');
logger.info('Logger setup ok');

module.exports = logger;
