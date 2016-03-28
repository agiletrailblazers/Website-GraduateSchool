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

test('test pad date', function(t) {
  var dateToTest =  new Date("Tue Mar 15 2016 00:00:00 GMT-0400 (EDT)");
  var formattedDateOfBirth = "" + dateToTest.getFullYear() + common.pad("00", dateToTest.getDate(), true) + common.pad("00", dateToTest.getMonth() + 1, true);

  expect(formattedDateOfBirth).to.eql("20161503");

  t.end();
});