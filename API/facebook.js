var FB = require('fb');
FB.setAccessToken('');

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
