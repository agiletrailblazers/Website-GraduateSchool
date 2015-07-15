var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var homepg = require('../API/tester.js');
var sinon = require('sinon');
var nock = require('nock');

describe ('homepage', function() {
  it('returns lowercase of a string', function(){
    var inputword='Welcome to the Graduate School Home Page';
    var outputword = homepg.landingPage(inputword);
    expect(outputword).to.equal('welcome to the graduate school home page');
  });
});

describe('/whats-new', function() {
  it.skip("makes a GET request for what's new", function() {

  });

  it("should return a 200 response code", function(done) {
    nock('https://cdn.contentful.com')
      .get('/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652')
      .reply(200, {
        sidebarHeader: 'http://graduateschool.edu/images/whats_new_success.jpg',
        sidebarTitle: 'LET US WORK WITH YOU TO ACHIEVE GREAT RESULTS. SEE WHAT SOME OF OUR CLIENTS HAVE TO SAY:',
        statusCode: "200"
      });
    contentful.getWhatsNew(function(response){
      var goodStatus = 200;
      expect(response.statusCode).to.equal(goodStatus);
      done();
    });
  });
  it("should not return a 500 error.", function(done) {
    nock('https://cdn.contentful.com')
      .get('/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652')
      .reply(200, {
        sidebarHeader: 'http://graduateschool.edu/images/whats_new_success.jpg',
        sidebarTitle: 'LET US WORK WITH YOU TO ACHIEVE GREAT RESULTS. SEE WHAT SOME OF OUR CLIENTS HAVE TO SAY:',
        statusCode: "200"
      });
    contentful.getWhatsNew(function(response){
      var badStatus = 500;
      expect(response.statusCode).to.not.equal(badStatus);
      done();
    });
  });
  it("should return a JSON", function() {
    nock('https://cdn.contentful.com')
      .get('/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY?access_token=940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652')
      .reply(200, {
        sidebarHeader: 'http://graduateschool.edu/images/whats_new_success.jpg',
        sidebarTitle: 'LET US WORK WITH YOU TO ACHIEVE GREAT RESULTS. SEE WHAT SOME OF OUR CLIENTS HAVE TO SAY:',
        statusCode: "200"
      });
    contentful.getWhatsNew(function(response){
      expect(response).to.be.a('json');
    });
  });

});
