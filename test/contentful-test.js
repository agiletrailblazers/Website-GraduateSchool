var chai = require('chai');
var expect = chai.expect;
var test = require('tap').test;
var nock = require('nock');
var config = require('konphyg')(__dirname + '/../config');
var temp = require('temp').track();
var request = require('request');
var cachedRequest = require('cached-request')(request);
var proxyquire = require('proxyquire');
cacheDir = temp.mkdirSync("cache");
cachedRequest.setCacheDirectory(cacheDir);
var contentful = proxyquire('../API/contentful.js',
  {
    "../helpers/common.js": {
      setCacheDirectoryAndTimeOut: function (cachedRequestParam) {
        return cachedRequest;
      }
    }
  });


test("url redirect provides corresponding links", function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.content.authorization
    }
  }).get('/spaces/'+config("properties").spaces.content.spaceId+'/entries?content_type=redirect&limit=1000')
  .reply(200, {
    "sys": {
      "type": "Array"
    },
    "total": 5,
    "skip": 0,
    "limit": 100,
    "items": [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "98qeodfc03o0"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "redirect"
            }
          },
          "id": "6lvq7UyIPSImoYUw8O8oUM",
          "revision": 1,
          "createdAt": "2015-12-11T14:57:06.759Z",
          "updatedAt": "2015-12-11T14:57:06.759Z",
          "locale": "en-US"
        },
        "fields": {
          "from": "/academic",
          "to": "/content/academic"
        }
      }
    ]
  });

  // call the api
  contentful.getContentUrlRedirect(function(response) {
    contentfulServer.done();
    expect(response[0].fields.from).to.exit;
    expect(response[0].fields.to).to.exist;
  });
  t.end();
});
