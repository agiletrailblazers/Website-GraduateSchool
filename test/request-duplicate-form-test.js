var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;


test('firstName-requestDuplicateForm Empty String Validation', function (t) {
  params = {
    firstName: "",
    lastName: "ATB",
    email: "returu@atb.com",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameEmptyCheckMessage);
  }, params);
  t.end();
});

test('firstName-requestDuplicateForm length Validation', function (t) {
  params = {
    firstName: "GS",
    lastName: "ATB",
    email: "returu@atb.com",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameLengthCheckMessage);
  }, params);
  t.end();
});

test('firstName-requestDuplicateForm White Spaces Validation', function (t) {
  params = {
    firstName: "    ",
    lastName: "ATB",
    email: "returu@atb.com",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameLengthCheckMessage);
  }, params);
  t.end();
});

test('lastName-requestDuplicateForm Empty String Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "",
    email: "returu@atb.com",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameEmptyCheckMessage);
  }, params);
  t.end();
});

test('lastName-requestDuplicateForm Length Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GS",
    email: "gs@atb.com",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameLengthCheckMessage);
  }, params);
  t.end();
});

test('lastName-requestDuplicateForm White Spaces Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "     ",
    email: "gs@atb.com",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameLengthCheckMessage);
  }, params);
  t.end();
});

test('Email-requestDuplicateForm Empty String Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSM",
    email: "",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.email).to.eql(config("properties").contactUsEmailEmptyCheckMessage);
  }, params);
  t.end();
});

test('Email-requestDuplicateForm Email Wrong Format Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSM",
    email: "gs.edu.com",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.email).to.eql(config("properties").contactUsEmailWrongFormatMessage);
  }, params);
  t.end();
});

test('Phone-requestDuplicateForm Empty String Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSM",
    phone: "",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.phone).to.eql(config("properties").contactUsPhoneEmptyCheckMessage);
  }, params);
  t.end();
});

test('Phone-requestDuplicateForm Phone Wrong Format Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSM",
    phone: "000-000-00000",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.phone).to.eql(config("properties").contactUsPhoneWrongFormatMessage);
  }, params);
  t.end();
});

test('Captcha-requestDuplicateForm Empty String Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSM",
    phone: "000-000-0000",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: ""
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.captchaResponse).to.eql(config("properties").contactUsRecaptchaEmptyCheckMessage);
  }, params);
  t.end();
});

test('Captcha-requestDuplicateForm Empty String Validation', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSM",
    phone: "000-000-0000",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: ""
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    expect(response.errors.captchaResponse).to.eql(config("properties").contactUsRecaptchaEmptyCheckMessage);
  }, params);
  t.end();
});


test('requestDuplicateForm Happy Path validation With Email', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSMj",
    email: "gs@edu.com",
    phone: "000-000-0000",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAAAAAAAA"
  };
  ajaxformrouteservice.validateRequestDuplicate(function (response) {
    errorLength = Object.keys(response.errors).length;
    expect(errorLength).to.eql(0);
  }, params);
  t.end();
});

test('contactUs Happy Path validation With Phone Number', function (t) {
  params = {
    firstName: "ATB",
    lastName: "GSM",
    phone: "000-000-0000",
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateContactUsfields(function (response) {
    errorLength = Object.keys(response.errors).length;
    expect(errorLength).to.eql(0);
  }, params);
  t.end();
});
