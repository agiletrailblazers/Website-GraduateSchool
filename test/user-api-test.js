var user = require('../API/manage/user-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

var authToken = "token123456789";

test('createUser success', function(t) {
  //use endpoint from config even for tests
  var apiServer = config("properties").apiServer;
  var userData = {
    "username" : "foo@bar.com",
    "dateOfBirth" : "01/01/1960",
    "lastFourSSN" : "4444",
    "password" : "test1234",
    "person" :
     {
       "firstName" : "Joe",
       "middleName" : null,
       "lastName" : "Smith",
       "emailAddress" : "foo@bar.com",
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
  };

  var expectedResponse = {"key" : "value"};

  //test a 200 ok
  var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
          }
        })
        .post('/api/user', userData)
        .reply(200, expectedResponse);

  server;
  user.createUser(userData, function(error, createdUser) {
    server.done();
    expect(error).to.be.a('null');
    expect(createdUser).to.eql(expectedResponse);
  }, authToken);
  t.end();
});

test('createUser failure', function(t) {
  //test a 500 internal server error
  var apiServer = config("properties").apiServer;
  var userData = {
    "username" : "foo@bar.com",
    "dateOfBirth" : "01/01/1960",
    "lastFourSSN" : "4444",
    "password" : "test1234",
    "person" :
     {
       "firstName" : "Joe",
       "middleName" : null,
       "lastName" : "Smith",
       "emailAddress" : "foo@bar.com",
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
  };

  var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
          }
        })
        .post('/api/user', userData)
        .reply(500, {});

  server;
  user.createUser(userData, function(error, createdUser) {
    server.done();
    expect(createdUser).to.be.a('null');
    expect(error).to.be.an.instanceof(Error);
  }, authToken);
  t.end();
});

test('registerUser success', function(t) {
  //use endpoint from config even for tests
  var apiServer = config("properties").apiServer;
  var userId = "pers12345";
  var registrationList = [
      {
        "studentId": userId,
        "sessionId" : "session12345"
      }
  ];

  var registrationResponse = [
      {
        "orderNumber": "123456789",
        "studentId": userId,
        "sessionId" : "session12345"
      }
  ];

  //test a 201 created
  var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
          }
        })
        .post('/api/registration/user/' + userId, registrationList)
        .reply(201, registrationResponse);

  server;
  user.registerUser(userId, registrationList, function(error, response) {
    server.done();
    expect(error).to.be.a('null');
    expect(response.paymentAcceptedError).to.eql(false);
    expect(response.paymentDeclinedError).to.eql(false);
    expect(response.generalError).to.eql(false);
    expect(response.registrationResponse).to.eql(registrationResponse);
  }, authToken);
  t.end();
});

test('registerUser general failure', function(t) {
  //test a 500 internal server error
  var apiServer = config("properties").apiServer;
  var userId = "pers12345";
  var registrationList = [
      {
        "studentId": userId,
        "sessionId" : "session12345"
      }
  ];

  //test a 201 created
  var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
          }
        })
        .post('/api/registration/user/' + userId, registrationList)
        .reply(500, null);

  server;
  user.registerUser(userId, registrationList, function(error, response) {
      server.done();
      expect(response.paymentAcceptedError).to.eql(false);
      expect(response.paymentDeclinedError).to.eql(false);
      expect(response.generalError).to.eql(true);
  }, authToken);
  t.end();
});

test('registerUser payment accepted failure', function(t) {
  var apiServer = config("properties").apiServer;
  var userId = "pers12345";
  var registrationList = [
      {
        "studentId": userId,
        "sessionId" : "session12345"
      }
  ];

  //test a 202 accepted
  var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
          }
        })
        .post('/api/registration/user/' + userId, registrationList)
        .reply(202, null);

  server;
  user.registerUser(userId, registrationList, function(error, response) {
      server.done();
      expect(response.paymentAcceptedError).to.eql(true);
      expect(response.paymentDeclinedError).to.eql(false);
      expect(response.generalError).to.eql(false);
  }, authToken);
  t.end();
});

test('registerUser payment declined failure', function(t) {
  var apiServer = config("properties").apiServer;
  var userId = "pers12345";
  var registrationList = [
      {
        "studentId": userId,
        "sessionId" : "session12345"
      }
  ];

  //test a 402 payment required
  var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
          }
        })
        .post('/api/registration/user/' + userId, registrationList)
        .reply(402, null);

  server;
  user.registerUser(userId, registrationList, function(error, response) {
      server.done();
      expect(response.paymentAcceptedError).to.eql(false);
      expect(response.paymentDeclinedError).to.eql(true);
      expect(response.generalError).to.eql(false);
  }, authToken);
  t.end();
});

test('get user success', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';
    var expectedUsername = "testUser@test.com";
    var userData = {
        "id": userId,
        "username": expectedUsername,
        "password": null,
        "lastFourSSN": null,
        "timezoneId": "tzone000000000000007",
        "accountId": "accnt000000000582595",
        "currencyId": "crncy000000000000167",
        "split": "domin000000000000001",
        "timestamp": "1456153504261",
        "person": {
            "firstName": "Test",
            "middleName": null,
            "lastName": "User",
            "emailAddress": expectedUsername,
            "primaryPhone": "5555555555",
            "secondaryPhone": null,
            "primaryAddress": {
                "address1": "666 Test Road",
                "address2": "ATB",
                "city": "Testville",
                "state": "AL",
                "postalCode": "66666"
            },
            "secondaryAddress": null,
            "veteran": null,
            "dateOfBirth": "2011-02-10"
        }
    };

    //test a 200 ok
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/user/' + userId)
        .reply(200, userData);

    server;
    user.getUser(userId, function(error, retrievedUser, body) {
        server.done();
        expect(retrievedUser.username).to.eql(expectedUsername);
        expect(retrievedUser).to.eql(userData);
    }, authToken);
    t.end();
});

test('get user failure', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';

    //test a 200 ok
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/user/' + userId)
        .reply(500, null);

    server;
    user.getUser(userId, function(error, retrievedUser, body) {
        server.done();
        expect(retrievedUser).to.be.a('null');
        expect(error).to.be.an.instanceof(Error);
    }, authToken);
    t.end();
});

test('get registration success has a reg', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';
    var sessionId = '00000123456';
    var regData = [
        {
            "id": "regdw000012345",
            "orderNumber": "123456789",
            "studentId": userId,
            "sessionId" : sessionId
        }
    ];

    //test a 200 ok
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/registration/user/' + userId + '/session/' + sessionId)
        .reply(200, regData);

    server;
    user.getRegistration(userId, sessionId, function(error, retrievedRegistration, body) {
        server.done();
        expect(retrievedRegistration[0].studentId).to.eql(userId);
        expect(retrievedRegistration[0].sessionId).to.eql(sessionId);
        expect(retrievedRegistration).to.eql(regData);
    }, authToken);
    t.end();
});

test('get registration success no registrations', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';
    var sessionId = '00000123456';
    var regData = null;

    //test a 404 not found
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/registration/user/' + userId + '/session/' + sessionId)
        .reply(404, regData);

    server;
    user.getRegistration(userId, sessionId, function(error, retrievedRegistration, body) {
        server.done();
        expect(error).to.eql(null);
        expect(retrievedRegistration).to.eql(null);
    }, authToken);
    t.end();
});

test('get registration success has many regs', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';
    var sessionId = '00000123456';
    var regData = [
        {
            "id": "regdw000012345",
            "orderNumber": "123456789",
            "studentId": userId,
            "sessionId" : sessionId
        },
        {
            "id": "regdw000012346",
            "orderNumber": "123456790",
            "studentId": userId,
            "sessionId" :sessionId
        }
    ];
    //test a 200 ok
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/registration/user/' + userId + '/session/' + sessionId)
        .reply(200, regData);

    server;
    user.getRegistration(userId, sessionId, function(error, retrievedRegistration, body) {
        server.done();
        expect(retrievedRegistration[0].studentId).to.eql(userId);
        expect(retrievedRegistration[0].sessionId).to.eql(sessionId);
        expect(retrievedRegistration).to.eql(regData);
    }, authToken);
    t.end();
});

test('get registration failure', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';
    var sessionId = 'class00000123456';

    //test a 500 failure
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/registration/user/' + userId + '/session/' + sessionId)
        .reply(500, null);

    server;
    user.getRegistration(userId, sessionId, function(error, retrievedRegistration, body) {
        server.done();
        expect(retrievedRegistration).to.be.a('null');
        expect(error).to.be.an.instanceof(Error);
    }, authToken);
    t.end();
});

test('get timezones success', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;

    var id1 = "1234";
    var name1 = "EASTERN";
    var id2 = "5678";
    var name2 = "CENTRAL";

    var timezoneData = [
        {
            "id": id1,
            "name": name1
        },
        {
            "id": id2,
            "name": name2
        }
    ];

    //test a 200 ok
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/registration/user/timezones')
        .reply(200, timezoneData);

    server;
    user.getTimezones(function(error, retrievedTimezones, body) {
        server.done();
        expect(retrievedTimezones[0].id).to.eql(id1);
        expect(retrievedTimezones[0].name).to.eql(name1);
        expect(retrievedTimezones[1].id).to.eql(id2);
        expect(retrievedTimezones[1].name).to.eql(name2);
        expect(retrievedTimezones).to.eql(timezoneData);
    }, authToken);

    t.end();
});