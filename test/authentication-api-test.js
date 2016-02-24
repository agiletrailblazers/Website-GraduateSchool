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
  authenticate.getAuthToken(req, res, function(error, tokenData) {
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
  authenticate.getAuthToken(req, res, function(error, tokenData) {
    expect(error).to.be.an.instanceof(Error);
  });
  t.end();
});


test('get token from cookie success', function(t) {
  var expectedToken = '1231231231test2341231231251fadfafd';
  // setup our mock response object
  var req = {
    cookies: {
      gstoken: expectedToken
    }
  };
  var res = {
    cookie: function(name, value, props) {
      expect(name).to.eql(tokenName);
      var actualToken = value.token;
      expect(actualToken, expectedToken);
    }
  };

  authenticate.getAuthToken(req, res, function(error, tokenData) {
    expect(expectedToken).to.eql(tokenData);
  });
  t.end();
});

test('login user successful', function(t) {
  var apiServer = config("properties").apiServer;
  var oldAuthToken = "tokenOld123";
  var newAuthToken = "token123456789";

  var expectedUsername = "JoeSmith@test.com";
  var expectedPassword = "test1234";
  var authCredentials = {
    "username": expectedUsername,
    "password": expectedPassword
  };

  var loginResponse =
    {
      "authToken": newAuthToken,
      "user": {
        "username" : expectedUsername,
        "dateOfBirth" : "01/01/1960",
        "lastFourSSN" : "4444",
        "password" : expectedPassword,
        "person" :
        {
          "firstName" : "Joe",
          "middleName" : null,
          "lastName" : "Smith",
          "emailAddress" : expectedUsername,
          "primaryPhone" : "555-555-5555",
          "secondaryPhone" : null,
          "primaryAddress" :
          {
            "address1" : "1313 Mockingbird Lane",
            "address2" : null,
            "city" : "Los Angeles",
            "state" : "CA",
            "postalCode" : "55555"
          },
          "secondaryAddress" : null
        }
      }
    };
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': oldAuthToken
        }
      })
      .post('/api/authentication', authCredentials)
      .reply(200, loginResponse);
  server;

  authenticate.loginUser(authCredentials, function (error, response, body) {
    server.done();
    expect(response).to.eql(loginResponse);
    expect(newAuthToken).to.eql(response.authToken);

    var user = response.user;
    expect(expectedUsername).to.eql(user.username);
    expect(expectedPassword).to.eql(user.password);
  },oldAuthToken);

  t.end();
});

test('login user failure', function(t) {
  var apiServer = config("properties").apiServer;
  var authToken = "tokenOld123";

  var authCredentials = {
    "username": "notrealuser",
    "password": "none"
  };
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .post('/api/authentication', authCredentials)
      .reply(500, {});
  server;

  authenticate.loginUser(authCredentials, function (error, response, body) {
    server.done();
    expect(response).to.be.a('null');
    expect(error).to.be.an.instanceof(Error);
  }, authToken);

  t.end();
});

test('set new token cookie with no prior cookie success', function(t) {
  var tokenName = config("properties").authenticate.tokenName;
  var tokenTimeout = config("properties").authenticate.tokenTimeout;
  var expectedTokenData = '1231231231test2341231231251fadfafd';
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
  authenticate.setNewToken(req, res, expectedTokenData);

  t.end();
});


test('set new token cookie with prior cookie success', function(t) {
  var tokenName = config("properties").authenticate.tokenName;
  var oldToken = '1231231231test2341231231251fadfafd';
  var newToken = 'new123123123123';
  // setup our mock response object
  var req = {
    cookies: {
      gstoken: oldToken
    }
  };
  var res = {
    cookie: function(name, value, props) {
      expect(name).to.eql(tokenName);
      var actualToken = value.token;
      expect(actualToken, newToken);
    }
  };
  authenticate.setNewToken(req, res, newToken);

  t.end();
});