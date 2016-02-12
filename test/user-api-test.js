var user = require('../API/manage/user-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;


test('createUser success', function(t) {
  //use endpoing from config even for tests
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
  var server = nock(apiServer)
        .post('/api/user', userData)
        .reply(200, expectedResponse);

  server;
  user.createUser(userData, function(error, createdUser) {
    expect(error).to.be.a('null');
    expect(createdUser).to.eql(expectedResponse);
  });
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

  var server = nock(apiServer)
        .post('/api/user', userData)
        .reply(500, {});

  server;
  user.createUser(userData, function(error, createdUser) {
    expect(createdUser).to.be.a('null');
    expect(error).to.be.an.instanceof(Error);
  });
  t.end();
});

test('registerUser success', function(t) {
  //use endpoing from config even for tests
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
  var server = nock(apiServer)
        .post('/api/registration/user/' + userId, registrationList)
        .reply(201, registrationResponse);

  server;
  user.registerUser(userId, registrationList, function(error, response) {
    expect(error).to.be.a('null');
    expect(response).to.eql(registrationResponse);
  });
  t.end();
});

test('registerUser failure', function(t) {
  //test a 500 internal server error
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
  var server = nock(apiServer)
        .post('/api/registration/user/' + userId, registrationList)
        .reply(500, null);

  server;
  user.registerUser(userId, registrationList, function(error, response) {
    expect(response).to.be.a('null');
    expect(error).to.be.an.instanceof(Error);
  });
  t.end();
});
