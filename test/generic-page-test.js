var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var contentful = require('../API/contentful.js');
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");

test('generic-page:financial-aid:success', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
      reqheaders: {
        'Authorization': config("properties").spaces.content.authorization
      }
    }).get('/spaces/'+config("properties").spaces.content.spaceId+'/entries/?content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=financial-aid')
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
        'Authorization': config("properties").spaces.content.authorization
      }
    }).get('/spaces/'+config("properties").spaces.content.spaceId+'/entries/?content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=financial-aid')
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

test('generic-page:with-subfolder', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
      reqheaders: {
        'Authorization': config("properties").spaces.content.authorization
      }
    }).get('/spaces/'+config("properties").spaces.content.spaceId+'/entries/?content_type=4oNvURz39SeMw6EaS84gIM&fields.slug=folder/page')
    .reply(200, {
      slug: 'folder/page',
      title: 'Test Title',
      intro: 'Test Intro',
      subIntro: 'Test Sub Intro'
    });
  contentful.getContentPage(function(contentPage) {
    expect(contentPage.title).to.equal('Test Title');
  }, 'folder/page');
  t.end();
});
