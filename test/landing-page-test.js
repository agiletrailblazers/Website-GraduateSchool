var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var contentful = require('../API/contentful.js');
var test = require('tap').test;

test('landing-page:landingpage', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
      reqheaders: {
        'Authorization': 'Bearer 58b9e19609e55070f0f46a3165e9116329acd28e3dd9495b8bccee6d2cc7deba'
      }
    }).get('/spaces/rwpes6c9xnt6/entries/?content_type=landingGeneric&fields.slug=landingpage')
    .reply(200, {
      slug: 'landingpage',
      title: 'Government Training and Professional Development',
      mainTile: 'Federally focused, relevant training for every stage of your career',
    });
  contentful.getLandingPage(function(contentPage) {
    expect(contentPage.title).to.equal('Government Training and Professional Development');
  }, 'landingpage');
  t.end();
});
