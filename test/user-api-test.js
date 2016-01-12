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
        .post('/api/registration/user', userData)
        .reply(200, expectedResponse);

  server;
  user.createUser(userData, function(createdUser, error) {
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
          .post('/api/registration/user', userData)
          .reply(500, {});

    server;
    user.createUser(userData, function(createdUser, error) {
      expect(createdUser).to.be.a('null');
      expect(error).to.be.an.instanceof(Error);
    });
    t.end();
  });
