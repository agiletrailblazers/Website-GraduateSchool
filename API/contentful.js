var contentful = require('contentful');
var request = require('request');
var cmsAsset;
var client = contentful.createClient({
  accessToken: '940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652',
  host: 'production.contentful.com',
  space: 'jzmztwi1xqvn'
});

module.exports = {
  getWhatsNew: function(callback) {
    request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }}, function (error, response, body) {
      console.log('Status:', response.statusCode);
      cmsEntry = JSON.parse(body);
      cmsAsset = JSON.parse(body);

    return callback({cmsEntry: cmsEntry, statusCode: response.statusCode,});
    });
  },
  //Below function is for the future use to support image assets.
  getAsset: function(space, asset, callback) {

      request({
      method: 'GET',
      url: 'https://cdn.contentful.com/spaces/jzmztwi1xqvn/assets?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652',
      headers: {
        'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
      }}, function (error, response, body) {
      /*  for(i=0;i<cmsAsset.fields.topBanners.length;i++){
          assetid=cmsEntry.fields.topBanners[i].sys.id;
          console.log(assetid);
        }
*/
      console.log('Status:', response.statusCode);

      asset = JSON.parse(body);
      console.log('This is asset',asset.items.fields);
      return asset;
    });
  }
};
