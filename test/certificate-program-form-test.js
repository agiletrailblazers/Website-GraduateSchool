var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('firstName-certificateProgramForm length Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var params = {
    firstName: "AA",
    lastName: "ATB",
    email: "gs@atb.com",
    phone: '1234567890',
    captchaResponse: "AAAAA"
  }

  ajaxformrouteservice.validateCertificateProgramForms(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameLengthCheckMessage);
  }, params);
  t.end();
});

test('lastName-certificateProgramForm length Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var params = {
    firstName: "ATA",
    lastName: "AT",
    email: "gs@atb.com",
    phone: '1234567890',
    captchaResponse: "AAAAA"
  }

  ajaxformrouteservice.validateCertificateProgramForms(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameLengthCheckMessage);
  }, params);
  t.end();
});

test('Email-certificateProgramForm Email Wrong Format Validation', function (t) {

  var params = {
    firstName: "ATB",
    lastName: "",
    email: "gs.edu.com",
    phone: "1234567890",
    captchaResponse: "AAAAA"
  }

  ajaxformrouteservice.validateCertificateProgramForms(function (response) {
    expect(response.errors.email).to.eql(config("properties").contactUsEmailWrongFormatMessage);
  }, params);
  t.end();
});

test('Phone-certificateProgramForm Empty String Validation', function (t) {

  var params = {
    firstName: "ATB",
    lastName: "tbz",
    email: "gs.edu.com",
    phone: "",
    captchaResponse: "AAAAA"
  }

  ajaxformrouteservice.validateCertificateProgramForms(function (response) {
    expect(response.errors.phone).to.eql(config("properties").contactUsPhoneEmptyCheckMessage);
  }, params);
  t.end();
});

test('City-certificateProgramForm Length Validation', function (t) {

  var params = {
    firstName: "ATB",
    lastName: "tbz",
    email: "gs.edu.com",
    phone: "1234567890",
    instructor: "ATB",
    city: "1",
    captchaResponse: "AAAAA"
  }

  ajaxformrouteservice.validateCertificateProgramForms(function (response) {
    expect(response.errors.city).to.eql(config("properties").certificateProgramCity);
  }, params);
  t.end();
});

test('Zip-certificateProgramForm  Length Validation', function (t) {

  var params = {
    firstName: "ATB",
    lastName: "tbz",
    email: "gs.edu.com",
    phone: "1234567890",
    instructor: "ATB",
    city: "1",
    zip: "1234",
    captchaResponse: "AAAAA"
  }

  ajaxformrouteservice.validateCertificateProgramForms(function (response) {
    expect(response.errors.zip).to.eql(config("properties").certificateProgramZip);
  }, params);
  t.end();
});

test('Zip-certificateProgramForm  Select Validation', function (t) {

  var params = {
    firstName: "ATB",
    lastName: "tbz",
    email: "gs.edu.com",
    phone: "1234567890",
    instructor: "ATB",
    city: "1",
    zip: "1234",
    state: null,
    captchaResponse: "AAAAA"
  }

  ajaxformrouteservice.validateCertificateProgramForms(function (response) {
    expect(response.errors.state).to.eql(config("properties").certificateProgramState);
  }, params);
  t.end();
});
