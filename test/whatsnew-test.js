var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('what new page testcase 1', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
        reqheaders: {
            'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
        }
    }).get('/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY')
      .reply(200, {
          sidebarHeader: 'http://graduateschool.edu/images/whats_new_success.jpg',
          sidebarTitle: 'LET US WORK WITH YOU TO ACHIEVE GREAT RESULTS. SEE WHAT SOME OF OUR CLIENTS HAVE TO SAY:',
        });
    contentfulServer;
    contentful.getWhatsNew(function(response){
      var goodStatus = 200;
      expect(response.statusCode).to.equal(goodStatus);
    });
    t.end();
});

test('what new page testcase 2', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
        reqheaders: {
            'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
        }
    }).get('/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY')
      .reply(500, {
            sidebarHeader: 'http://graduateschool.edu/images/whats_new_success.jpg',
            sidebarTitle: 'LET US WORK WITH YOU TO ACHIEVE GREAT RESULTS. SEE WHAT SOME OF OUR CLIENTS HAVE TO SAY:',
        });
    contentfulServer;
    contentful.getWhatsNew(function(response){
        var badStatus = 500;
        expect(response.statusCode).to.equal(badStatus);

    });
        t.end();
    });


test('what new page testcase 3', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
        reqheaders: {
            'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
        }
    }).get('/spaces/jzmztwi1xqvn/entries/4QlvJ0GeQw4AY2QOq8SUMY')
      .reply(200, {
            sidebarHeader: 'http://graduateschool.edu/images/whats_new_success.jpg',
            sidebarTitle: 'LET US WORK WITH YOU TO ACHIEVE GREAT RESULTS. SEE WHAT SOME OF OUR CLIENTS HAVE TO SAY:',
            'accept': 'application/json'

        });
    contentfulServer;
    contentful.getWhatsNew(function(response){
       expect(response).to.be.a('object');
    });

    t.end();
});
