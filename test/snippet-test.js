var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");

// test API to get content snippet
test("content snippet returns snippet", function(t) {
  var contentfulServerSnippet = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.content.authorization
    }
  }).get('/spaces/'+config("properties").spaces.content.spaceId+'/entries?content_type=vWuB3fpTWge2EU8ec0OOA&fields.slug=snippet/test')
  .reply(200, {
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
                "id": "98qeodfc03o0"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "vWuB3fpTWge2EU8ec0OOA"
              }
            },
            "id": "6TOGhww8pOWEAugG2kECKC",
            "revision": 2,
            "createdAt": "2015-11-30T19:32:35.604Z",
            "updatedAt": "2015-11-30T21:25:13.238Z",
            "locale": "en-US"
          },
          "fields": {
            "title": "Test Snippet",
            "snippetContent": "Yay, this is a test snippet!",
            "slug": "snippet/test"
          }
        }
      ]
  });

  // call the api
  contentful.getContentSnippet("snippet/test", function(response) {
    expect(response.items[0].fields.title).to.equal("Test Snippet");
    expect(response.items[0].fields.snippetContent).to.equal("Yay, this is a test snippet!");
    expect(response.items[0].fields.slug).to.equal("snippet/test");
  });
  t.end();
});
