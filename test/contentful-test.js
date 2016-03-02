var chai = require('chai');
var expect = chai.expect;
var test = require('tap').test;
var nock = require('nock');
var contentful = require("../API/contentful.js");

test("url redirect provides corresponding links", function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
    }
  }).get('/spaces/98qeodfc03o0/entries?content_type=redirect&limit=1000')
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
