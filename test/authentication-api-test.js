var authenticate = require('../API/authentication-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('get token from api and set cookie success', function(t) {
  var tokenName = config("properties").authenticate.tokenName;
  var tokenTimeout = config("properties").authenticate.tokenTimeout;
  var expectedTokenData = '1231231231test2341231231251fadfafd';
  var apiServer = config("properties").apiServer;
  // setup our mock response object
  var req = {
      cookies: {}
  };
  var res = {
  cookie: function(name, value, props) {
    expect(name).to.eql(tokenName);
    var actualToken = value.token;
    expect(actualToken, expectedTokenData);
    }
  };

  //test a 200 ok
  var tokenApiServer = nock(apiServer)
    .get('/api/token')
    .reply(200, {
        "token": expectedTokenData
    });

  tokenApiServer;
  authenticate.checkForAndGetAuthToken(req, res, function(error, tokenData) {
      expect(expectedTokenData).to.eql(tokenData);
  });
  t.end();
});

test('get token from api and set cookie failure', function(t) {
  var tokenName = config("properties").authenticate.tokenName;
  var tokenTimeout = config("properties").authenticate.tokenTimeout;
  var tokenData = '1231231231test2341231231251fadfafd';
  var apiServer = config("properties").apiServer;
  // setup our mock response object
  var req = {
    cookies: {}
  };
  var res = {
  };

  //test a 200 ok
  var tokenApiServer = nock(apiServer)
      .get('/api/token')
      .reply(500, { });

  tokenApiServer;
  authenticate.checkForAndGetAuthToken(req, res, function(error, tokenData) {
    //expect(res).to.be.a('token: '{}'');
    expect(error).to.be.an.instanceof(Error);
  });
  t.end();
});


test('get token from cookie success', function(t) {
  var tokenData = '1231231231test2341231231251fadfafd';
  // setup our mock response object
  var req = {
    cookies: {
      gstoken: tokenData
    }
  };
  var res = {
    cookie: function(name, value, props) {
      expect(name).to.eql(tokenName);
      var actualToken = value.token;
      expect(actualToken, tokenData);
    }
  };

  authenticate.checkForAndGetAuthToken(req, res, function(error, tokenData) {
    expect(tokenData).to.eql(res.token);
  });
  t.end();
});
