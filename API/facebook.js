var FB = require('fb');
FB.setAccessToken(config("properties").facebook_AccessToken);

module.exports = {
  getFacebookPosts: function(callback) {
    FB.api('GraduateSchoolUSA/feed', function (res) {
      if(!res || res.error) {
       console.log(!res ? 'error occurred' : res.error);
       return;
      }
      console.log(res);
      callback(res);
    });
  }
}
