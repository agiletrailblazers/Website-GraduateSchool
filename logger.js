var log4js = require('log4js');

// configure the logger
log4js.configure({
  "appenders": [
      {
          "type": "file",
          "filename": "logs/app.log",
          "maxLogSize": 5000000,
          "backups": 10,
          "category": "app",
      },
      {
          "type": "console",
          "category": "app",
      }
  ],
  "levels": {
    "app":  "INFO"
  }
});

var logger = log4js.getLogger('app');
logger.info('Logger setup ok');

module.exports = logger;
