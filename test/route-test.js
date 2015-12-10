var indexRouter = require('../router/index');
var indexRouter = require('../router/routes/home-route');
var indexRouter = require('../router/routes/course-route');
var indexRouter = require('../router/routes/whatsnew-route');
var getRoutemocker = require('../router/param/getroutemocker');

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var test = require('tap').test;
var nock = require('nock');
var contentful = require("../API/contentful.js");

test('Routes test case 1', function(t) {
      var req,res,spy;

      req = res = {};
      spy = res.send = sinon.spy();

      getRoutemocker.getHomepage(req, res);
      expect(spy.calledOnce).to.equal(true);
      t.end();
});
test('Routes test case 2', function(t) {
      req = res = {};
      spy = res.send = sinon.spy();

      getRoutemocker.getWhatsNew(req, res);
      expect(spy.calledOnce).to.equal(true);
      t.end();

});

test("url redirect provides corresponding links", function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
    }
  }).get('/spaces/98qeodfc03o0/entries?content_type=urlRedirect')
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
              "id": "urlRedirect"
            }
          },
          "id": "1UBFWW9THOs88gIAEUGYmi",
          "revision": 5,
          "createdAt": "2015-12-09T19:06:39.292Z",
          "updatedAt": "2015-12-09T20:53:31.608Z",
          "locale": "en-US"
        },
        "fields": {
          "title": "UrlMapping",
          "links": {
            "/academic": "/content/academic",
            "/gov": "/content/government",
            "/metro": "/content/government",
            "/evening": "/content/evening"
          }
        }
      }
    ]
  });

  // call the api
  contentful.getContentUrlRedirect(function(response) {
    expect(response.title).to.equal("UrlMapping");
    expect(response.links).to.exist;
  });
  t.end();
});
