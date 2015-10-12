var FB = require('fb');
var request = require('request');
var config = require('konphyg')(__dirname + "/../config");



FB.setAccessToken(config("properties").facebook_AccessToken);

module.exports = {
  getFacebookPosts: function(callback) {
    FB.api('GraduateSchoolUSA/feed?limit=4', function (res) {
      if(!res || res.error) {
       console.log(!res ? 'error occurred' : res.error);
       return;
      }
      console.log(res);
      callback(res);
    });
  }
}
