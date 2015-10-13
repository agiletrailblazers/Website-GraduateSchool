var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('Customer Feedback  Happy Path Validation', function(t) {
  params = {firstName:"", lastName:"ATB",email:"gs@atb.com",phone:"400-000-0000",typePerson:"Student",feedbackCategories:"Course",captchaResponse :"AAAAA"};
  ajaxformrouteservice.validateCustomerFeedBack(function(response){
    errorLength = Object.keys(response.errors).length;
    expect(errorLength).to.eql(0);
  },params);
  t.end();
  });

test('Email-Customer Feedback Wrong Format Validation', function(t) {
  params = {firstName:"", lastName:"ATB",email:"gs.edu.com",phone:"400-000-0000",typePerson:"Student",feedbackCategories:"Course",captchaResponse :"AAAAA"};
  ajaxformrouteservice.validateCustomerFeedBack(function(response){
    expect(response.errors.email).to.eql(config("properties").contactUsEmailWrongFormatMessage);
  },params);
  t.end();
});

test('Captcha-Customer Feedback  captcha Validation', function(t) {
  params = {firstName:"", lastName:"ATB",email:"gs.edu.com",phone:"400-000-0000",typePerson:"Student",feedbackCategories:"Course",captchaResponse :""};
  ajaxformrouteservice.validateCustomerFeedBack(function(response){
    expect(response.errors.captchaResponse).to.eql(config("properties").contactUsRecaptchaEmptyCheckMessage);
  },params);
  t.end();
});


