var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('test for forms contentful service', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
    }).get('/spaces/jzmztwi1xqvn/entries?content_type=5Lz9bSZNE4ACoykGQgQwUu')
    .reply(200, {
      "fields": {
        "sectionTitle": "Graduate School USA Academic Programs Forms",
        "sectionFiles": [
        {
          "sys": {
            "type": "Link",
            "linkType": "Asset",
            "id": "6zHtBU9xJKKuSgEa8Ecc8I"
          }
        }]
      },
      "includes": {
      "Asset": [
      {
        "fields": {
        "title": "Daytime Courses Registration Form",
        "description": "Daytime Courses Registration Form",
        "file": {
          "fileName": "registration_form.pdf",
          "contentType": "application/pdf",
          "details": {
            "size": 126952
          },
          "url": "//assets.contentful.com/jzmztwi1xqvn/1a4VZOF8sQEYQiqwo0qS6O/07886c790e2bbb9118f38c997c248333/registration_form.pdf"
        }
      }
    }] }

  });
  contentfulServer;
  contentful.getForms(function(response){
    var goodStatus = 200;
    expect(response.statusCode).to.equal(goodStatus);
    expect(response.cmsAsset[0].fields.title).to.equal("Daytime Courses Registration Form");
    expect(response.cmsAsset[0].fields.file.url).to.equal("//assets.contentful.com/jzmztwi1xqvn/1a4VZOF8sQEYQiqwo0qS6O/07886c790e2bbb9118f38c997c248333/registration_form.pdf");
    expect(response.cmsAsset[0].fields.file.contentType).to.equal("application/pdf");
  });
    t.end();
});



test('test for forms contentful service with InternalError', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
  reqheaders: {
    'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
  }).get('/spaces/jzmztwi1xqvn/entries?content_type=5Lz9bSZNE4ACoykGQgQwUu')
    .reply(500, {
    "includes": {
    "Asset": [{ }
    ] }
  });
  contentfulServer;
  contentful.getForms(function(response){
    var internalErrorStatus = 500;
    expect(response.statusCode).to.equal(internalErrorStatus);
  });
  t.end();
});
