var chai = require('chai');
var expect = require('chai').expect;
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");
var temp = require('temp').track();
var request = require('request');
var proxyquire = require('proxyquire');

var contentful = proxyquire('../API/contentful.js',
    {
      "../helpers/common.js": {
        cachedRequest: function (reqParams, callback) {
          request(reqParams, function(error, response, body) {
            return callback(error, response, body);
          });
        }
      }
    });

test('test for catalog download', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
    }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=ZRkwvyMcCqK46gGOggeWs')
    .reply(200, {
      "sys": {
        "type": "Array"
      },
      "total": 4,
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
                "id": "ZRkwvyMcCqK46gGOggeWs"
              }
            },
            "id": "2FJxphiLmwsc2ms6cE2SGc",
            "revision": 2,
            "createdAt": "2015-11-05T17:25:39.585Z",
            "updatedAt": "2015-11-05T17:38:18.719Z",
            "locale": "en-US"
          },
          "fields": {
            "catlogTitle": "Government Training & Professional Development",
            "catlogFileAssets": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Asset",
                  "id": "4wAz881nLqwWQWeIugeEIc"
                }
              }
            ],
            "catalogFilter": "gtpd"
          }
        }
      ],
      "includes": {
        "Asset": [
          {
            "fields": {
              "file": {
                "fileName": "Nationwide-Schedule-Oct2015-March2016.pdf",
                "contentType": "application/pdf",
                "details": {
                  "size": 2206407
                },
                "url": "//assets.contentful.com/jzmztwi1xqvn/4s8EAz3KS4mk8c2G8oWek/5546f5450f26ea86b6ec7a7b1e35f2e9/Nationwide-Schedule-Oct2015-March2016.pdf"
              },
              "title": "Training & Professional Development *",
              "description": "1"
            },
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "jzmztwi1xqvn"
                }
              },
              "type": "Asset",
              "id": "4s8EAz3KS4mk8c2G8oWek",
              "revision": 2,
              "createdAt": "2015-10-28T20:46:51.507Z",
              "updatedAt": "2015-10-28T20:59:25.531Z",
              "locale": "en-US"
            }
          }
        ]
      }
    });
  contentfulServer;
  contentful.getCatalogType(function(response){
    var goodStatus = 200;
    expect(response.statusCode).to.equal(goodStatus);
    expect(response.cmsEntry[0].fields.catlogTitle).to.equal("Government Training & Professional Development");
    expect(response.cmsAsset[0].fields.file.contentType).to.equal("application/pdf");
  });
  t.end();
});
