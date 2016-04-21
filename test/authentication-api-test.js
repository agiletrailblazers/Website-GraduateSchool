var authenticate = require('../API/authentication-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var proxyquire = require('proxyquire').noCallThru();

var authToken = '1231231231test2341231231251fadfafd';

test('get token from api success', function(t) {

  var apiServer = config("properties").apiServer;
  // setup our mock response object
  var req = {};
  var res = {};

  //test a 200 ok
  var tokenApiServer = nock(apiServer)
    .get('/api/token')
    .reply(200, {
        "token": authToken
    });

  tokenApiServer;
  authenticate.getAuthToken(req, res, function(error, tokenData) {
      expect(authToken).to.eql(tokenData);
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

  var req = {
    session: {
      sessionData: {
        "authToken": oldAuthToken
      }
    }
  };

  var loginResponse =
  {
    "authToken": newAuthToken,
    "renewalToken": "abc1234",
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

  var controller = proxyquire('../API/authentication-api.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if(key == "authToken") {
              expect(value).to.eql(newAuthToken)
            }
          },
          getSessionData: function (req, key) {
            if (!req.session) {
              return undefined;
            }
            if (!req.session.sessionData) {
              req.session.sessionData = {};
              return undefined;
            } else {
              return req.session.sessionData[key];
            }
          }
        }
      });
  var server = nock(apiServer, {
    reqheaders: {
      'Authorization': oldAuthToken
    }
  })
      .post('/api/authentication', authCredentials)
      .reply(200, loginResponse);
  server;
  controller.loginUser(req, loginResponse, authCredentials, function (error, response, body) {
    server.done();
    expect(newAuthToken).to.eql(response.authToken);

    var user = response.user;
    expect(expectedUsername).to.eql(user.username);
    expect(expectedPassword).to.eql(user.password);
  });

  t.end();
});

test('login user failure', function(t) {
  var apiServer = config("properties").apiServer;

  var authCredentials = {
    "username": "notrealuser",
    "password": "none"
  };
  var req = {
    session: {
      sessionData: {
        "authToken": authToken
      }
    }
  };
  var res = { };

  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .post('/api/authentication', authCredentials)
      .reply(500, {});
  server;

  authenticate.loginUser(req, res, authCredentials, function (error, response, body) {
    server.done();
    expect(response).to.be.a('null');
    expect(error).to.be.an.instanceof(Error);
  });

  t.end();
});

test('encrypt password', function(t) {

  var password = "clearPassword";
  var encryptedPassword = "encryptedPassword";

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var proxiedAuthentication = proxyquire('../API/authentication-api.js',
      {
        "crypto": {
          createHash: function (algorithm) {
            expect(algorithm).to.eql('sha256');
            return {
              update : function (password, encoding) {
                expect(password).to.eql(password);
                expect(encoding).to.eql('UTF8');
                return {
                  digest : function (encoding) {
                    expect(encoding).to.eql('hex');
                    return {
                      toUpperCase: function (){
                        return encryptedPassword;
                      }
                    }
                  }
                }
              }
            };
          }
        }
      });

  var epwd = proxiedAuthentication.encryptPassword(password);
  expect(epwd).to.eql(encryptedPassword);

  t.end();
});

test('validateAuthToken success with token reurned', function(t) {
  var apiServer = config("properties").apiServer;
  var newAuthToken = "new123";
  var renewalToken = "bcd631";
  var sessionData = {
      "authToken": authToken,
      "renewalToken": renewalToken
    };
  var reAuthCredentials = {
    "authToken": {
      token : authToken
    },
    "renewalToken": {
      token : renewalToken
    }
  };
  var req = {
    session: {
      sessionData: sessionData
    }
  };
  var res = {};
  var expectedResponse = { "token" : newAuthToken };
  var server = nock(apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  })
      .post('/api/reauthentication', reAuthCredentials)
      .reply(200, expectedResponse);
  server;

  authenticate.validateAuthToken(req, res, function(error, token, statusCode) {
    server.done();
    expect(token).to.eql(newAuthToken);
    expect(statusCode).to.eql(200);
  });
  t.end();
});

test('validateAuthToken success with token reurned', function(t) {
  var apiServer = config("properties").apiServer;
  var newAuthToken = "new123";
  var renewalToken = "bcd631";
  var sessionData = {
    "authToken": authToken,
    "renewalToken": renewalToken
  };
  var reAuthCredentials = {
    "authToken": {
      token : authToken
    },
    "renewalToken": {
      token : renewalToken
    }
  };
  var req = {
    session: {
      sessionData: sessionData
    }
  };
  var res = {};
  var expectedResponse = { };
  var server = nock(apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  })
      .post('/api/reauthentication', reAuthCredentials)
      .reply(200, expectedResponse);
  server;

  authenticate.validateAuthToken(req, res, function(error, token, statusCode) {
    server.done();
    expect(token).to.be.a('null');
    expect(statusCode).to.eql(200);
  });
  t.end();
});

test('validateAuthToken success 401', function(t) {
  var apiServer = config("properties").apiServer;
  var newAuthToken = "new123";
  var renewalToken = "bcd631";
  var sessionData = {
    "authToken": authToken,
    "renewalToken": renewalToken
  };
  var reAuthCredentials = {
    "authToken": {
      token : authToken
    },
    "renewalToken": {
      token : renewalToken
    }
  };
  var req = {
    session: {
      sessionData: sessionData
    }
  };
  var res = { error : "This is an intentional error"};
  var expectedResponse = { };
  var server = nock(apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  })
      .post('/api/reauthentication', reAuthCredentials)
      .reply(401, expectedResponse);
  server;

  authenticate.validateAuthToken(req, res, function(error, token, statusCode) {
    server.done();
    expect(token).to.be.a('null');
    expect(statusCode).to.eql(401);
  });
  t.end();
});

test('validateAuthToken error', function(t) {
  var apiServer = config("properties").apiServer;
  var newAuthToken = "new123";
  var renewalToken = "bcd631";
  var sessionData = {
    "authToken": authToken,
    "renewalToken": renewalToken
  };
  var reAuthCredentials = {
    "authToken": {
      token : authToken
    },
    "renewalToken": {
      token : renewalToken
    }
  };
  var req = {
    session: {
      sessionData: sessionData
    }
  };
  var res = {};
  var server = nock(apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  })
      .post('/api/reauthentication', reAuthCredentials)
      .reply(500, null);
  server;

  authenticate.validateAuthToken(req, res, function(error, token, statusCode) {
    server.done();
    expect(token).to.be.a('null');
    expect(error).to.be.an.instanceof(Error);
    expect(statusCode).to.eql(500);
  });
  t.end();
})