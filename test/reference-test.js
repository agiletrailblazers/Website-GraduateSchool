var chai = require('chai');
var expect = require('chai').expect;
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");

var temp = require('temp').track();
var request = require('request');
var cachedRequest = require('cached-request')(request);
var proxyquire = require('proxyquire');
cacheDir = temp.mkdirSync("cache");
cachedRequest.setCacheDirectory(cacheDir);

var contentful = proxyquire('../API/contentful.js',
  {
    "../helpers/common.js": {
      setCacheDirectory: function (cachedRequestParam) {
        return cachedRequest;
      }
    }
  });

test('test for reference data API', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/?content_type=rrnJXELzeC4O8Mc8oQUqK&fields.slug=us-states')
    .reply(200, {
      'accept': 'application/json',
      "sys": {
        "type": "Array"
      },
      "total": 1,
      "skip": 0,
      "limit": 100,
      "items": [
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "jzmztwi1xqvn"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "rrnJXELzeC4O8Mc8oQUqK"
              }
            },
            "id": "5hRs3nyR8Am2G4ImYGisIK",
            "revision": 2,
            "createdAt": "2015-08-25T01:20:31.371Z",
            "updatedAt": "2015-08-25T01:21:39.509Z",
            "locale": "en-US"
          },
          "fields": {
            "title": "US States",
            "jsonContent": [
              {
                "name": "Alabama",
                "abbreviation": "AL"
              },
              {
                "name": "Alaska",
                "abbreviation": "AK"
              },
              {
                "name": "American Samoa",
                "abbreviation": "AS"
              },
              {
                "name": "Wyoming",
                "abbreviation": "WY"
              }
            ],
            "slug": "us-states"
          }
        }
      ]
  });
  contentfulServer;
  contentful.getReferenceData('us-states', function(data){
    expect(data.length).to.equal(4);
  });
  t.end();
});
