var YouTube = require('youtube-node');

var youTube = new YouTube();

youTube.setKey(config("properties").youTubeKey);

module.exports = {
  getGraduateSchoolVideos: function() {
    youTube.getById(config("properties").youTubeAccountId, function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(JSON.stringify(result, null, 2));
      }
    });

  }
}
