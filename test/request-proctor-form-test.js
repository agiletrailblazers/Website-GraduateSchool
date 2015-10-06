var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;


test('firstName-requestProctorForm Empty String Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "",
    lastName: "ATB",
    email: "gs@atb.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law"
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameEmptyCheckMessage);
  }, params);
  t.end();
});

test('firstName-requestProctorForm length Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "AA",
    lastName: "ATB",
    email: "gs@atb.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
    captchaResponse: "AAAAA"
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameLengthCheckMessage);
  }, params);
  t.end();
});

test('firstName-requestProctorForm White Spaces Validation', function (t) {
  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "   ",
    lastName: "ATB",
    email: "gs@atb.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameLengthCheckMessage);
  }, params);
  t.end();
});

test('lastName-requestProctorForm Empty String Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "",
    email: "gs@atb.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law"
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"
  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameEmptyCheckMessage);
  }, params);
  t.end();
});

test('lastName-requestProctorForm Length Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "AA",
    email: "gs@atb.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law"
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameLengthCheckMessage);
  }, params);
  t.end();
});

test('lastName-requestProctorForm White Spaces Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "   ",
    email: "gs@atb.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law"
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameLengthCheckMessage);
  }, params);
  t.end();
});

test('Email-requestProctorForm Empty String Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law"

  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.email).to.eql(config("properties").contactUsEmailEmptyCheckMessage);
  }, params);
  t.end();
});

test('Email-requestProctorForm Email Wrong Format Validation', function (t) {

  var phoneNo = {
    day: "3473261715"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "",
    email: "gs.edu.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law"
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.email).to.eql(config("properties").contactUsEmailWrongFormatMessage);
  }, params);
  t.end();
});

test('Phone-requestProctorForm Empty String Validation', function (t) {
  var phoneNo = {
    day: ""
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "",
    email: "gs.edu.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.phone).to.eql(config("properties").contactUsPhoneEmptyCheckMessage);
  }, params);
  t.end();
});

test('Phone-requestProctorForm Phone Wrong Format Validation', function (t) {
  var phoneNo = {
    day: "ATB-09i-0000"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "",
    email: "gs.edu.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.phone).to.eql(config("properties").contactUsPhoneWrongFormatMessage);
  }, params);
  t.end();
});

test('Captcha-requestProctorForm Empty String Validation', function (t) {
  var phoneNo = {
    day: "ATB-09i-0000"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "",
    email: "gs.edu.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: ""

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    expect(response.errors.captchaResponse).to.eql(config("properties").contactUsRecaptchaEmptyCheckMessage);
  }, params);
  t.end();
});

test('requestProctorForm Happy Path validation', function (t) {
  var phoneNo = {
    day: "000-000-0000"
  }
  var studentDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com",
    phone: phoneNo,
    instructor: "ATB",
    courseCode: "ACT0001",
    courseTitle: "Law",
  }
  var proctorDetails = {
    firstName: "ATB",
    lastName: "ATB",
    email: "gs@atb.com"
  }
  params = {
    student: studentDetails,
    proctor: proctorDetails,
    captchaResponse: "AAAAAA"

  };
  ajaxformrouteservice.validateRequestProctor(function (response) {
    errorLength = Object.keys(response.errors).length;
    expect(errorLength).to.eql(0);
  }, params);
  t.end();
});

