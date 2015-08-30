var Twitter = require('twitter');
var logger = require('../logger');

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    logger.debug(tweets);
  }
});
