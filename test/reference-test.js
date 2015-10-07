var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('test for reference data API', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
  }).get('/spaces/jzmztwi1xqvn/entries/?content_type=rrnJXELzeC4O8Mc8oQUqK&fields.slug=us-states')
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
