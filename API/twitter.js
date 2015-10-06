var Twitter = require('twitter');
var logger = require('../logger');
var config = require('konphyg')(__dirname + "/../config");

var client = new Twitter({
  consumer_key: config("properties").consumer_key,
  consumer_secret: config("properties").consumer_secret,
  access_token_key: config("properties").access_token_key,
  access_token_secret: config("properties").access_token_secret
});

var params = {
  screen_name: 'nodejs'
};

module.exports = {
  getTwitterTweets: function(callback) {
    client.get('statuses/user_timeline', {
      user_id: "thegradschool",
      count: 4
    }, function(error, tweets, response) {
      if (!error) {
        logger.debug(tweets);
      }
      callback(tweets);
    });
  }
}
