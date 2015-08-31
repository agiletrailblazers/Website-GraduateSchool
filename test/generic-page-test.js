var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var contentful = require('../API/contentful.js');
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
  contentful.getContentPage(function(contentPage) {
    expect(contentPage.slug).to.equal('financial-aid');
  }, 'financial-aid');
  t.end();
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
  contentful.getContentPage(function(contentPage) {
    expect(contentPage.title).to.equal('Financial Aid');
  }, 'financial-aid');
  t.end();
});
