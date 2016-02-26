var common = require('../helpers/common.js');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

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

test('createTruncatedString success', function(t) {
  var originalString = "this is a string that is 37 characters";

  var result = common.createTruncatedString(originalString, 16);

  expect(result).to.eql(originalString.substr(0, 16));
  expect(result.length).to.eql(16);
  t.end();
});

test('createTruncatedString null value should return empty string', function(t) {
  var originalString = null;

  var result = common.createTruncatedString(originalString, 16);

  expect(result).to.eql(""); //Function always returns empty string
  expect(result.length).to.eql(0);
  t.end();
});

test('createTruncatedString not string value should return empty string', function(t) {
  var intValue = 123456;

  var result = common.createTruncatedString(intValue, 16);

  expect(result).to.eql("");
  expect(result.length).to.eql(0);
  t.end();
});