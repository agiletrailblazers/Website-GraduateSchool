var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('firstName-contactUs Empty String Validation', function(t) {
  params = {firstName:"", lastName:"ATB", communicationPref:"Email",email:"returu@atb.com",captchaResponse :"AAAAA"};
  ajaxformrouteservice.validateContactUsfields(function(response){
    expect(response.errors.firstName).to.eql(config("endpoint").contactUsFirstNameEmptyCheckMessage);
    },params);
    t.end();
  });

 test('firstName-contactUs length Validation', function(t) {
   params = {firstName:"GS", lastName:"ATB", communicationPref:"Email",email:"returu@atb.com",captchaResponse :"AAAAA"};
   ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.firstName).to.eql(config("endpoint").contactUsFirstNameLengthCheckMessage);
      },params);
        t.end();
   });

test('firstName-contactUs White Spaces Validation', function(t) {
    params = {firstName:"    ", lastName:"ATB", communicationPref:"Email",email:"returu@atb.com",captchaResponse :"AAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.firstName).to.eql(config("endpoint").contactUsFirstNameLengthCheckMessage);
    },params);
    t.end();
});

test('lastName-contactUs Empty String Validation', function(t) {
  params = {firstName:"ATB", lastName:"", communicationPref:"Email",email:"returu@atb.com",captchaResponse :"AAAAA"};
  ajaxformrouteservice.validateContactUsfields(function(response){
    expect(response.errors.lastName).to.eql(config("endpoint").contactUsLastNameEmptyCheckMessage);
    },params);
    t.end();
  });

 test('lastName-contactUs Length Validation', function(t) {
   params = {firstName:"ATB", lastName:"GS", communicationPref:"Email",email:"returu@atb.com",captchaResponse :"AAAAA"};
   ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.lastName).to.eql(config("endpoint").contactUsLastNameLengthCheckMessage);
      },params);
        t.end();
   });

test('lastName-contactUs White Spaces Validation', function(t) {
    params = {firstName:"ATB", lastName:"     ", communicationPref:"Email",email:"returu@atb.com",captchaResponse :"AAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.lastName).to.eql(config("endpoint").contactUsLastNameLengthCheckMessage);
    },params);
    t.end();
});

test('Email-contactUs Empty String Validation', function(t) {
    params = {firstName:"ATB", lastName:"GSM", communicationPref:"Email",email:"",captchaResponse :"AAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.email).to.eql(config("endpoint").contactUsEmailEmptyCheckMessage);
    },params);
    t.end();
});

test('Email-contactUs Email Wrong Format Validation', function(t) {
    params = {firstName:"ATB", lastName:"GSM", communicationPref:"Email",email:"gs.edu.com",captchaResponse :"AAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.email).to.eql(config("endpoint").contactUsEmailWrongFormatMessage);
    },params);
    t.end();
});

test('Phone-contactUs Empty String Validation', function(t) {
    params = {firstName:"ATB", lastName:"GSM", communicationPref:"Phone",phone:"",captchaResponse :"AAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.phone).to.eql(config("endpoint").contactUsPhoneEmptyCheckMessage);
    },params);
    t.end();
});

test('Phone-contactUs Phone Wrong Format Validation', function(t) {
    params = {firstName:"ATB", lastName:"GSM", communicationPref:"Phone",phone:"000-000-00000",captchaResponse :"AAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.phone).to.eql(config("endpoint").contactUsPhoneWrongFormatMessage);
    },params);
    t.end();
});

test('Captcha-contactUs Empty String Validation', function(t) {
    params = {firstName:"ATB", lastName:"GSM", communicationPref:"Phone",phone:"000-000-0000",captchaResponse :""};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.captchaResponse).to.eql(config("endpoint").contactUsRecaptchaEmptyCheckMessage);
    },params);
    t.end();
});

test('Captcha-contactUs Empty String Validation', function(t) {
    params = {firstName:"ATB", lastName:"GSM", communicationPref:"Phone",phone:"000-000-0000",captchaResponse :""};
    ajaxformrouteservice.validateContactUsfields(function(response){
        expect(response.errors.captchaResponse).to.eql(config("endpoint").contactUsRecaptchaEmptyCheckMessage);
    },params);
    t.end();
});

test('contactUs Happy Path validation With Email', function(t) {
    params = {firstName:"ATB", lastName:"GSMj", communicationPref:"Email",email:"gs@edu.com",captchaResponse :"AAAAAAAAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
        errorLength = Object.keys(response.errors).length;
        expect(errorLength).to.eql(0);
    },params);
    t.end();
});

test('contactUs Happy Path validation With Phone Number', function(t) {
    params = {firstName:"ATB", lastName:"GSM", communicationPref:"Phone",phone:"000-000-0000",captchaResponse :"AAAAA"};
    ajaxformrouteservice.validateContactUsfields(function(response){
       errorLength = Object.keys(response.errors).length;
       expect(errorLength).to.eql(0);
    },params);
    t.end();
});
