var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");

test('navigation contentful test:success', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
        reqheaders: {
            'Authorization': 'Bearer db132f1da5cc75a00f487cce1c94143798d8e5d12c65c169b2fc04febdfae44d'
        }
    }).get('/spaces/5tnto6ug3qkh/entries?include=2&content_type=47TLz18cmI6WaeC0KWgOIo')
      .reply(200, {
          "items": [
            {
             "fields": {
               "title": "Footer",
               "sectionTitle1": "Graduate School",
               "sectionTitle2": "Students",
               "section1": [
                 {
                   "sys": {
                     "type": "Link",
                     "linkType": "Entry",
                     "id": "1wBja7Ze2YKSqga8cmUSoG"
                   }
                 }
               ]
             }
          }
        ],
        "includes": {
          "Entry": [
            {
              "fields": {
                "title": "Customized Solutions",
                "link1": [
                  "Customized Course Design and Development",
                  "#"
                ],
                "link2": [
                  "Training at your location",
                  "/forms/onsite-inquiry"
                ],
                "link3": [
                  "Assessment Tools",
                  "#"
                ],
                "name": "Main Nav - Customized Solutions"
              },
              "sys": {
                "space": {
                  "sys": {
                    "type": "Link",
                    "linkType": "Space",
                    "id": "jzmztwi1xqvn"
                  }
                },
                "type": "Entry",
                "id": "1wBja7Ze2YKSqga8cmUSoG",
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
    contentful.getNavigation(function(nav) {
      expect(nav.footer[0].title).to.equal('Graduate School');
      expect(nav.footer[0].sections[0].title).to.equal('Customized Solutions');
      expect(nav.footer[1].title).to.equal('Students');
    });
    t.end();
});

test('homepage contentful test:failure', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
        reqheaders: {
            'Authorization': 'Bearer db132f1da5cc75a00f487cce1c94143798d8e5d12c65c169b2fc04febdfae44d'
        }
    }).get('/spaces/5tnto6ug3qkh/entries?include=2&content_type=47TLz18cmI6WaeC0KWgOIo')
      .reply(404, {});
    contentfulServer;
    contentful.getNavigation(function(nav) {
      expect(nav.footer).to.be.undefined;
    });
    t.end();
});
