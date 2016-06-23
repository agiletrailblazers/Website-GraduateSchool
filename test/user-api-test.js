var user = require('../API/manage/user-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var proxyquire = require('proxyquire').noCallThru();

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

  var expectedResponse = {"user" : "userValues"};

  //test a 201 created
  var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
          }
        })
        .post('/api/users', userData)
        .reply(201, expectedResponse);

  server;
  user.createUser(userData, function(error, results) {
    server.done();
    expect(error).to.be.a('null');
    expect(results.createdUser).to.eql(expectedResponse);
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
        .post('/api/users', userData)
        .reply(500, null);

  server;
  user.createUser(userData, function(error, results) {
    server.done();
    expect(results.createdUser).to.be.a('null');
    expect(results.generalError).to.eql(true);
  }, authToken);
  t.end();
});

test('createUser failure with Validation Errors', function(t) {
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

    var validationErrors = {
        "validationErrors": [
            {
                "fieldName": "person.dateOfBirth",
                "errorMessage": "Date of Birth is not in yyyyMMdd format"
            }
        ]
    }

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .post('/api/users', userData)
        .reply(400, validationErrors);

    server;
    var expectedNullUserData = null;
    user.createUser(userData, function(error, results) {
        server.done();
        expect(results.createdUser).to.be.a('null');
        expect(results.validationErrors[0].fieldName).to.eql("person.dateOfBirth");
        expect(results.validationErrors[0].errorMessage).to.eql("Date of Birth is not in yyyyMMdd format");
        expect(error).to.be.an.instanceof(Error);
    }, authToken);
    t.end();
});

test('createUser failure duplicate user', function(t) {
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
        .post('/api/users', userData)
        .reply(409, null);

    server;
    user.createUser(userData, function(error, results) {
        server.done();
        expect(results.createdUser).to.be.a('null');
        expect(results.duplicateUserError).to.eql(true);
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
        .post('/api/registrations/users/' + userId, registrationList)
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
        .post('/api/registrations/users/' + userId, registrationList)
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
        .post('/api/registrations/users/' + userId, registrationList)
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
        .post('/api/registrations/users/' + userId, registrationList)
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
        .get('/api/users/' + userId)
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
        .get('/api/users/' + userId)
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
        .get('/api/registrations/users/' + userId + '/sessions/' + sessionId)
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
        .get('/api/registrations/users/' + userId + '/sessions/' + sessionId)
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
        .get('/api/registrations/users/' + userId + '/sessions/' + sessionId)
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
        .get('/api/registrations/users/' + userId + '/sessions/' + sessionId)
        .reply(500, null);

    server;
    user.getRegistration(userId, sessionId, function(error, retrievedRegistration, body) {
        server.done();
        expect(retrievedRegistration).to.be.a('null');
        expect(error).to.be.an.instanceof(Error);
    }, authToken);
    t.end();
});

test('resetPassword', function(t) {
    var apiServer = config("properties").apiServer;

    var expectedUsername = "JoeSmith@test.com";
    var authCredentials = {
        "username": expectedUsername
    };

    var req = {};

    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
    .post('/api/users/password/forgot', authCredentials)
    .reply(204);
    server;

    proxiedUser.forgotPassword(req, authCredentials, function (error, passwordReset, userNotFound) {
        server.done();
        expect(passwordReset).to.eql(true);
        expect(userNotFound).to.eql(false);
    });

    t.end();
});

test('resetPassword handles user not found', function(t) {
    var apiServer = config("properties").apiServer;
    var expectedUsername = "JoeSmith@test.com";
    var authCredentials = {
        "username": expectedUsername
    };

    var req = {};

    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
    .post('/api/users/password/forgot', authCredentials)
    .reply(404);
    server;

    proxiedUser.forgotPassword(req, authCredentials, function (error, passwordReset, userNotFound) {
        server.done();
        expect(passwordReset).to.eql(false);
        expect(userNotFound).to.eql(true);
    });

    t.end();
});

test('resetPassword handles error', function(t) {
    var apiServer = config("properties").apiServer;
    var expectedUsername = "JoeSmith@test.com";
    var authCredentials = {
        "username": expectedUsername
    };

    var req = {};

    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .post('/api/users/password/forgot', authCredentials)
        .reply(500);
    server;

    proxiedUser.forgotPassword(req, authCredentials, function (error, passwordReset, userNotFound) {
        server.done();
        expect(error).to.be.an.instanceof(Error);
        expect(passwordReset).to.eql(null);
        expect(userNotFound).to.eql(null);
    });

    t.end();
});

test('changePassword', function(t) {
    var apiServer = config("properties").apiServer;

    var userId = "prsn0000123123123123";

    var expectedUsername = "JoeSmith@test.com";
    var expectedOldPassword = "oldPassword";
    var expectedNewPassword = "newPassword";

    var pwChangeCredentials = {
        "username" : expectedUsername,
        "password" : expectedOldPassword,
        "newPassword" : expectedNewPassword
    };

    var req = {};

    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
    .post('/api/users/' + userId + '/password', pwChangeCredentials)
    .reply(204);
    server;

    proxiedUser.changeUserPassword(req, pwChangeCredentials, userId, function (error, statusCode) {
        server.done();
        expect(error).to.be.null;
        expect(statusCode).to.eql(204);
    });

    t.end();
});

test('changePassword handles exception', function(t) {
    var apiServer = config("properties").apiServer;
    var userId = "prsn0000123123123123";

    var expectedUsername = "JoeSmith@test.com";
    var expectedOldPassword = "oldPassword";
    var expectedNewPassword = "newPassword";

    var pwChangeCredentials = {
        "username" : expectedUsername,
        "password" : expectedOldPassword,
        "newPassword" : expectedNewPassword
    };

    var req = {};

    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
    .post('/api/users/' + userId + '/password', pwChangeCredentials)
    .reply(404);
    server;

    proxiedUser.changeUserPassword(req, pwChangeCredentials, userId, function (error, statusCode) {
        server.done();
        expect(error).to.not.be.null;
        expect(statusCode).to.eql(404);
    });

    t.end();
});

test('get registrations success has reg details', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';

    var req = {}

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return authToken;
                }
            }
        });

    var startDateTime = ((new Date().getTime()) - 86400000).toString();
    var endDateTime = ((new Date().getTime()) + 86400000).toString();
    var regDetailsList = [
        {
            "sessionNo": "1234567",
            "courseNo": "COURSE1234",
            "courseTitle": "Introduction to Testing",
            "startDate" : startDateTime,
            "endDate" : endDateTime,
            "locationAddress" : {
                "address1": "123 Main Street",
                "address2": "Suite 100",
                "city": "Washington",
                "state": "DC",
                "postalCode": "12345"
            },
            "facilityAddress" : {
                "address1": "123 Main Street",
                "address2": "Suite 100",
                "city": "Washington",
                "state": "DC",
                "postalCode": "12345"
            },
            "type" : "CLASSROOM"
        }
    ];

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/registrations/users/' + userId)
        .reply(200, regDetailsList);

    server;

    proxiedUser.getUserRegistrations(req, userId, function(error, retrievedRegistrationDetails) {
        server.done();
        expect(retrievedRegistrationDetails[0].sessionNo).to.eql("1234567");
        expect(retrievedRegistrationDetails[0].courseNo).to.eql("COURSE1234");
        expect(retrievedRegistrationDetails[0].courseTitle).to.eql("Introduction to Testing");
        expect(retrievedRegistrationDetails[0].startDate).to.eql(startDateTime);
        expect(retrievedRegistrationDetails[0].endDate).to.eql(endDateTime);
        expect(retrievedRegistrationDetails[0].locationAddress.address1).to.eql("123 Main Street");
        expect(retrievedRegistrationDetails[0].locationAddress.address2).to.eql("Suite 100");
        expect(retrievedRegistrationDetails[0].locationAddress.city).to.eql("Washington");
        expect(retrievedRegistrationDetails[0].locationAddress.state).to.eql("DC");
        expect(retrievedRegistrationDetails[0].locationAddress.postalCode).to.eql("12345");
        expect(retrievedRegistrationDetails[0].facilityAddress.address1).to.eql("123 Main Street");
        expect(retrievedRegistrationDetails[0].facilityAddress.address2).to.eql("Suite 100");
        expect(retrievedRegistrationDetails[0].facilityAddress.city).to.eql("Washington");
        expect(retrievedRegistrationDetails[0].facilityAddress.state).to.eql("DC");
        expect(retrievedRegistrationDetails[0].facilityAddress.postalCode).to.eql("12345");
        expect(retrievedRegistrationDetails[0].type).to.eql("CLASSROOM");
        expect(retrievedRegistrationDetails).to.eql(regDetailsList);
    });
    t.end();
});

test('get registrations handles error', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userId = 'persn00000012345';

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return authToken;
                }
            }
        });

    var req = {};

    //test a 404 Error
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/registrations/users/' + userId)
        .reply(404);

    server;

    proxiedUser.getUserRegistrations(req, userId, function(error, retrievedRegistrationDetails) {
        server.done();
        expect(error).to.not.be.null;
        expect(error.message).to.eq("Exception occurred getting user registrations");
    });
    t.end();
});

test('get registrations handles error no user ID', function(t) {
    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return "token1234";
                }
            }
        });

    var req = {};

    proxiedUser.getUserRegistrations(req, null, function(error, retrievedRegistrationDetails) {
        expect(error).to.not.be.null;
        expect(error.message).to.eq("User ID cannot be empty");
    });
    t.end();
});

test('updateUser success', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var userData = {
        "id" : "pers66666",
        "username" : "foo@bar.com",
        "dateOfBirth" : "01/01/1960",
        "lastFourSSN" : "4444",
        "password" : "test1234",
        "person" :
        {
            "firstName" : "Joe",
            "middleName" : null,
            "lastName" : "Smith",
            "emailAddress" : "foo2@bar.com",
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

    var expectedUserResponse = {
        "id" : "pers66666",
        "username" : "foo2@bar.com",
        "dateOfBirth" : "01/01/1960",
        "lastFourSSN" : "4444",
        "password" : "test1234",
        "person" :
        {
            "firstName" : "Joe",
            "middleName" : null,
            "lastName" : "Smith",
            "emailAddress" : "foo2@bar.com",
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

    // test a 200 success
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    }).post('/api/users/' + userData.id, userData)
        .reply(200, expectedUserResponse);

    server;

    var req = {};
    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                },
                setSessionData: function (req, key, value) {
                    expect(key).to.eql("user");
                    expect(value).to.eql(expectedUserResponse);
                }
            }
        });

    proxiedUser.updateUser(req, userData, function(error, results) {
        server.done();
        expect(error).to.be.a('null');
        expect(results.validationErrors).to.be.a('null');
        expect(results.updatedUser).to.eql(expectedUserResponse);
    });
    t.end();
});

test('updateUser failure', function(t) {
    // test a 500 internal server error
    var apiServer = config("properties").apiServer;
    var userData = {
        "id" : "pers66666",
        "username" : "foo@bar.com",
        "dateOfBirth" : "01/01/1960",
        "lastFourSSN" : "4444",
        "password" : "test1234",
        "person" :
        {
            "firstName" : "Joe",
            "middleName" : null,
            "lastName" : "Smith",
            "emailAddress" : "foo2@bar.com",
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
    }).post('/api/users/' + userData.id, userData)
        .reply(500, null);

    server;

    var req = {};
    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    proxiedUser.updateUser(req, userData, function(error, results) {
        server.done();
        expect(results.validationErrors).to.be.a('null');
        expect(results.updatedUser).to.be.a('null');
        expect(results.generalError).to.eql(true);
    });
    t.end();
});

test('updateUser failure with Validation Errors', function(t) {
    // test a 400 validation error
    var apiServer = config("properties").apiServer;
    var userData = {
        "id" : "pers66666",
        "username" : "foo@bar.com",
        "dateOfBirth" : "01/01/1960",
        "lastFourSSN" : "4444",
        "password" : "test1234",
        "person" :
        {
            "firstName" : "Joe",
            "middleName" : null,
            "lastName" : "Smith",
            "emailAddress" : "foo2@bar.com",
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

    var validationErrors = {
        "validationErrors": [
            {
                "fieldName": "person.dateOfBirth",
                "errorMessage": "Date of Birth is not in yyyyMMdd format"
            }
        ]
    }

    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    }).post('/api/users/' + userData.id, userData)
        .reply(400, validationErrors);

    server;

    var req = {};
    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    proxiedUser.updateUser(req, userData, function(error, results) {
        server.done();
        expect(results.updatedUser).to.be.a('null');
        expect(results.validationErrors[0].fieldName).to.eql("person.dateOfBirth");
        expect(results.validationErrors[0].errorMessage).to.eql("Date of Birth is not in yyyyMMdd format");
        expect(error).to.be.an.instanceof(Error);
    });
    t.end();
});

test('updateUser failure with Duplicate User Error', function(t) {
    // test a 409 duplicate user error
    var apiServer = config("properties").apiServer;
    var userData = {
        "id" : "pers66666",
        "username" : "foo@bar.com",
        "dateOfBirth" : "01/01/1960",
        "lastFourSSN" : "4444",
        "password" : "test1234",
        "person" :
        {
            "firstName" : "Joe",
            "middleName" : null,
            "lastName" : "Smith",
            "emailAddress" : "foo2@bar.com",
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
    }).post('/api/users/' + userData.id, userData)
        .reply(409);

    server;

    var req = {};
    var sessionData = {
        "authToken": authToken
    };

    var proxiedUser = proxyquire('../API/manage/user-api.js',
        {
            "./session-api.js": {
                getSessionData: function (req, key) {
                    expect(key).to.eql("authToken");
                    return sessionData[key];
                }
            }
        });

    proxiedUser.updateUser(req, userData, function(error, results) {
        server.done();
        expect(results.updatedUser).to.be.a('null');
        expect(results.validationErrors[0].fieldName).to.eql("username.duplicate");
        expect(results.validationErrors[0].errorMessage).to.eql("duplicateUser");
        expect(error).to.be.an.instanceof(Error);
    });
    t.end();
});



