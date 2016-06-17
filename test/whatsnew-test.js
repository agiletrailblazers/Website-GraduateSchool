var chai = require('chai');
var expect = require('chai').expect;
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");
var temp = require('temp').track();
var request = require('request');
var proxyquire = require('proxyquire');

var contentful = proxyquire('../API/contentful.js',
    {
      "../helpers/common.js": {
        cachedRequest: function (reqParams, callback) {
          request(reqParams, function(error, response, body) {
            return callback(error, response, body);
          });
        }
      }
    });

test('what new page testcase 1', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/4QlvJ0GeQw4AY2QOq8SUMY')
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
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/4QlvJ0GeQw4AY2QOq8SUMY')
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
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/4QlvJ0GeQw4AY2QOq8SUMY')
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
