var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");

test('homepage contentful test:success', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
        reqheaders: {
            'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
        }
    }).get('/spaces/jzmztwi1xqvn/entries?content_type=2Ak0RNhLwIwSGaiukUsCku')
      .reply(200, {
          "items": [
            {
              "fields": {
              "marketingMessage": "Government Training <br> and Professional Development",
              "secondaryMessage": "Strengthen your skills as you work to build a quality organization.",
              "buttonText": "Read More",
              "buttonUrl": "#",
              "title": "Government Training and Professional Development Slider",
              "slideImage": {
                "sys": {
                  "type": "Link",
                  "linkType": "Asset",
                  "id": "gyBbFRVYBiU0Q0ic482sK"
                }
              }
            }
          }
        ],
        "includes": {
          "Asset": [
            {
              "fields": {
                "file": {
                  "fileName": "slider_example.png",
                  "contentType": "image/png",
                  "details": {
                    "image": {
                      "width": 1170,
                      "height": 449
                    },
                    "size": 847491
                  },
                  "url": "//images.contentful.com/jzmztwi1xqvn/gyBbFRVYBiU0Q0ic482sK/106e3859c010684dcf3312f408e30f1a/slider_example.png"
                },
                "title": "Slider Example",
                "description": "Placeholder example slider marketing image"
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
                "id": "gyBbFRVYBiU0Q0ic482sK",
                "revision": 1,
                "createdAt": "2015-09-09T18:07:40.023Z",
                "updatedAt": "2015-09-09T18:07:40.023Z",
                "locale": "en-US"
              }
            }
          ]
        }
    });
    contentfulServer;
    contentful.getHomepageSlider(function(slides) {
      expect(slides[0].marketingMessage).to.equal('Government Training <br> and Professional Development');
      expect(slides[0].imageAsset.title).to.equal('Slider Example');
    });
    t.end();
});

test('homepage contentful test:failure', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
        reqheaders: {
            'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
        }
    }).get('/spaces/jzmztwi1xqvn/entries?content_type=2Ak0RNhLwIwSGaiukUsCku')
      .reply(404, {});
    contentfulServer;
    contentful.getHomepageSlider(function(slides) {
      expect(slides).to.deep.equal([]);
    });
    t.end();
});
