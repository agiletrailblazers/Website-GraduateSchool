var course = require('../API/course.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var contentful = require('../API/contentful.js');
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('generic-page:financial-aid:success', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
      reqheaders: {
        'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
      }
    }).get('/spaces/98qeodfc03o0/entries?access_token=a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0&content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=financial-aid')
    .reply(200, {
      slug: 'financial-aid',
      title: 'Financial Aid',
      intro: 'Welcome to the Financial Aid Office',
      subIntro: 'FINANCIAL AID CAN ONLY BE APPLIED TOWARD  ACADEMIC PROGRAMS DEGREE AND CERTIFICATE PROGRAMS.'
    });
    contentfulServer;
  contentful.getContentPage(function(response) {
    var goodStatus = 200;
    expect(response.statusCode).to.eql(goodStatus);
    done()
  }, 'financial-aid')
});

test('generic-page:financial-aid:data', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
      reqheaders: {
        'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
      }
    }).get('/spaces/98qeodfc03o0/entries?access_token=a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0&content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=financial-aid')
    .reply(200, {
      slug: 'financial-aid',
      title: 'Financial Aid',
      intro: 'Welcome to the Financial Aid Office',
      subIntro: 'FINANCIAL AID CAN ONLY BE APPLIED TOWARD  ACADEMIC PROGRAMS DEGREE AND CERTIFICATE PROGRAMS.'
    });
    contentfulServer;
  contentful.getContentPage(function(response) {
    // expect
  });
});
