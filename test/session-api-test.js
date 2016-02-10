var session = require('../API/manage/session-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('set session data success', function(t) {
  var sessionName = config("properties").manage.sessionName;
  var sessionTimeout = config("properties").manage.sessionTimeout;
  var sessionData = {
    data1 : "foo",
    data2 : "bar"
  };

  // setup our mock response object
  var res = {
    cookie: function(name, value, props) {
      expect(name).to.eql(sessionName);
      var actualSessionData = JSON.parse(value);
      expect(actualSessionData.data1).to.eql(sessionData.data1);
      expect(actualSessionData.data2).to.eql(sessionData.data2);
      expect(actualSessionData.lastUpdated).to.exist;
      expect(props.maxAge).to.eql(sessionTimeout);
    }
  };

  // call the object under test
  session.setSessionData(res, sessionData);

  t.end();
 });

test('get session data empty success', function(t) {

   // setup our mock request object
   var req = {
     cookies: {}
   };

   // call the object under test
   var sessionData = session.getSessionData(req);

   expect(sessionData).to.eql({});

   t.end();
});

test('get session data success', function(t) {

  // setup our mock request object
  var gssessionObj = {
    lastUpdated: 123456,
    data1: "foo"
  };

  var req = {
    cookies: {
      gssession: JSON.stringify(gssessionObj)
    }
  };

   // call the object under test
   var sessionData = session.getSessionData(req);

   expect(sessionData).to.eql(gssessionObj);

   t.end();
  });
