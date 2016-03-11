var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var contentful = require('../API/contentful.js');
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");

test('landing-page:landingpage', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
      reqheaders: {
        'Authorization': config("properties").spaces.landing.authorization
      }
    }).get('/spaces/'+config("properties").spaces.landing.spaceId+'/entries/?content_type=landingGeneric&fields.slug=landingpage')
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
