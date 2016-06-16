var common = require('../helpers/common.js');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var proxyquire = require('proxyquire');
var nock = require('nock');

var reqParams = {
  method: 'GET',
  url: 'https://cdn.contentful.com/spaces/'+config("properties").spaces.main.spaceId+'/entries/4QlvJ0GeQw4AY2QOq8SUMY',
  ttl: config("properties").contentfulCache.timeout,
  headers: {
    'Authorization': config("properties").spaces.main.authorization
  }
};

var cacheEnvPrefix = config("properties").env + "-";

test('checkForErrorAndLog - 404', function(t) {
  var error = null;
  var response = {
    statusCode: 404
  };
  var url = "http://foo.com";

  // call the object under test
  var result = common.checkForErrorAndLog(error, response, url);
  expect(result).to.eql(true);

  t.end();
 });

test('checkForErrorAndLog - 200', function(t) {
  var error = null;
  var response = {
    statusCode: 200
  };
  var url = "http://foo.com";

  // call the object under test
  var result = common.checkForErrorAndLog(error, response, url);
  expect(result).to.eql(false);

  t.end();
});

test('checkForErrorAndLog - 204', function(t) {
  var error = null;
  var response = {
    statusCode: 204
  };
  var url = "http://foo.com";

  // call the object under test
  var result = common.checkForErrorAndLog(error, response, url);
  expect(result).to.eql(false);

  t.end();
});

test('cachedRequest from cache', function(t) {
  var commonMock = proxyquire('../helpers/common.js',
      {
        "cache-manager": {
          caching: function (options) {
            var cache = {
              get: function (req_params, callback) {
                var result = {
                  response: "This is the response",
                  body: "This is the body"
                };
                callback(null, result);
              },
              store: {
                events: {
                  on: function(event, callback){}
                }
              }
            }
            return cache;
          }
        }
      });

  commonMock.cachedRequest(reqParams, function (error, response, body) {
    expect(body).to.exist;
  });
  t.end();
});

test('cachedRequest from contentful', function(t) {
  var commonMock = proxyquire('../helpers/common.js',
      {
        "cache-manager": {
          caching: function (options) {
            var cache = {
              get: function (req_params, callback) {
                var result = undefined;
                callback(null, result);
              },
              store: {
                events: {
                  on: function(event, callback){
                    expect(event).to.eql('redisError');
                  }
                }
              },
              set: function (req_params, obj){
                expect(req_params).to.eql(cacheEnvPrefix + reqParams.url);
                expect(obj.response).to.exist;
                expect(obj.body).to.exist;
              }
            }
            return cache;
          }
        }
      });

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

  commonMock.cachedRequest(reqParams, function (error, response, body) {
    expect(response).to.exist;
    expect(body).to.exist;
    expect(error).to.be.null;
  });
  t.end();
});

test('cachedRequest from contentful with error', function(t) {
  var commonMock = proxyquire('../helpers/common.js',
      {
        "cache-manager": {
          caching: function (options) {
            var cache = {
              get: function (req_params, callback) {
                var result = undefined;
                callback(null, result);
              },
              store: {
                events: {
                  on: function(event, callback){
                    expect(event).to.eql('redisError');
                  }
                }
              },
              set: function (req_params, obj){
                expect(req_params).to.eql(cacheEnvPrefix + reqParams.url);
                expect(obj.response).to.exist;
                expect(obj.body).to.exist;
              }
            }
            return cache;
          }
        }
      });

  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/4QlvJ0GeQw4AY2QOq8SUMY')
      .replyWithError('OH NO!');
  contentfulServer;

  commonMock.cachedRequest(reqParams, function (error, response, body) {
    expect(response).to.be.undefined;
    expect(body).to.be.undefined;
    expect(error.message).to.eql('OH NO!');
  });
  t.end();
});