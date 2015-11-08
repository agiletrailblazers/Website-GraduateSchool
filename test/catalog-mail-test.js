var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('test for catalog download', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
    }).get('/spaces/jzmztwi1xqvn/entries?content_type=5SLs6g27dK2IOeuOyKyeoq')
    .reply(200, {
      "sys": {
        "type": "Array"
      },
      "total": 15,
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
                "id": "5SLs6g27dK2IOeuOyKyeoq"
              }
            },
            "id": "Q7ktvLlVE2KYe68y8oM8k",
            "revision": 1,
            "createdAt": "2015-11-06T20:16:18.206Z",
            "updatedAt": "2015-11-06T20:16:18.206Z",
            "locale": "en-US"
          },
          "fields": {
            "catalogHardCopy": "Center for Leadership and Management brochure"
          }
        },
      ]
    });
  contentfulServer;
  contentful.getCatalogRequestHardCopy(function(response){
    var goodStatus = 200;
    expect(response.statusCode).to.equal(goodStatus);
    expect(response.cmsEntry[0].fields.catalogHardCopy).to.equal("Center for Leadership and Management brochure");
  });
  t.end();
});
