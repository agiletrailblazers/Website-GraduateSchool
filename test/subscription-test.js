var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');

var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('Form : First name Validation', function (t) {
  var data = {};
  data.firstName = "";
  data.middleName = "";
  data.lastName = "Trailblazers";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "true";
  data.mailSubscription =  "false";

  data.street = "20F";
  data.city = "Washington";
  data.state = "DC";
  data.zip = "20987";
  data.country = "";
  data.apartment = "";
  data.phone = "8009765454";
  data.organization = "";
  data.email = "i@k.com";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.firstName).to.eql("First name is required and must be at least 2 characters.");
  }, data);
  t.end();
});

test('Form : Last name Validation', function (t) {
  var data = {};
  data.firstName = "Agile";
  data.middleName = "";
  data.lastName = "";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "true";
  data.mailSubscription =  "false";

  data.street = "20F";
  data.city = "Washington";
  data.state = "DC";
  data.zip = "20987";
  data.country = "";
  data.apartment = "";
  data.phone = "8009765454";
  data.organization = "";
  data.email = "i@k.com";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.lastName).to.eql("Last name is required and must be at least 2 characters.");
  }, data);
  t.end();
});

test('Form : Street Validation', function (t) {
  var data = {};
  data.firstName = "Agile";
  data.middleName = "";
  data.lastName = "Trailblazers";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "false";
  data.mailSubscription =  "true";

  data.street = "";
  data.city = "Washington";
  data.state = "DC";
  data.zip = "20987";
  data.country = "";
  data.apartment = "";
  data.phone = "8009765454";
  data.organization = "";
  data.email = "i@k.com";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.streetAddress).to.eql("Street Address is required and must be at least 5 characters.");
  }, data);
  t.end();
});

test('Form : City Validation', function (t) {
  var data = {};
  data.firstName = "Agile";
  data.middleName = "";
  data.lastName = "Trailblazers";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "false";
  data.mailSubscription =  "true";

  data.street = "20F";
  data.city = "";
  data.state = "DC";
  data.zip = "20987";
  data.country = "";
  data.apartment = "";
  data.phone = "8009765454";
  data.organization = "";
  data.email = "i@k.com";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.city).to.eql("City is required and must be at least 3 characters.");
  }, data);
  t.end();
});

test('Form : State Validation', function (t) {
  var data = {};
  data.firstName = "Agile";
  data.middleName = "";
  data.lastName = "Trailblazers";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "false";
  data.mailSubscription =  "true";

  data.street = "20F";
  data.city = "Washington";
  data.state = "";
  data.zip = "20987";
  data.country = "";
  data.apartment = "";
  data.phone = "8009765454";
  data.organization = "";
  data.email = "i@k.com";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.state).to.eql("Please select a state.");
  }, data);
  t.end();
});

test('Form : Zip Validation', function (t) {
  var data = {};
  data.firstName = "Agile";
  data.middleName = "";
  data.lastName = "Trailblazers";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "false";
  data.mailSubscription =  "true";

  data.street = "20F";
  data.city = "Washington";
  data.state = "DC";
  data.zip = "";
  data.country = "";
  data.apartment = "";
  data.phone = "8009765454";
  data.organization = "";
  data.email = "i@k.com";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.zip).to.eql("Zip is required and must be at least 5 characters.");
  }, data);
  t.end();
});

test('Form : Phone Validation', function (t) {
  var data = {};
  data.firstName = "Agile";
  data.middleName = "";
  data.lastName = "Trailblazers";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "false";
  data.mailSubscription =  "true";

  data.street = "20F";
  data.city = "Washington";
  data.state = "DC";
  data.zip = "20876";
  data.country = "";
  data.apartment = "";
  data.phone = "";
  data.organization = "";
  data.email = "i@k.com";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.phone).to.eql("Phone number is required.");
  }, data);
  t.end();
});

test('Form : Email Validation', function (t) {
  var data = {};
  data.firstName = "Agile";
  data.middleName = "";
  data.lastName = "Trailblazers";

  data.subscriptionAction = "Subscribe";
  data.actionSubscribe = "Subscribe";
  data.actionModify = "Modify";
  data.actionUnsubscribe = "Unsubscribe";

  var subscriptionAction = data.subscriptionAction;

  data.emailSubscription = "true";
  data.mailSubscription =  "false";

  data.street = "20F";
  data.city = "Washington";
  data.state = "DC";
  data.zip = "20876";
  data.country = "";
  data.apartment = "";
  data.phone = "8009765454";
  data.organization = "";
  data.email = "hello";

  ajaxformrouteservice.validateSubscriptionfields(function (response) {
    expect(response.errors.email).to.eql("Email is required and must be a properly formatted email address.");
  }, data);
  t.end();
});
