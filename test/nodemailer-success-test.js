var mailer = require('../API/nodemailer.js');
var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');
var test = require('tap').test;
var chai = require('chai');
var expect = chai.expect;

test('nodemailer-test:contact-us:success', function(t) {

  var transport = nodemailer.createTransport(stubTransport());
  mailer.setTransport(transport);

  params = {};
  response = null;
  mailer.sendContactUs(function(response) {
    expect(200).to.eql(response);
  }, params);

  t.end();
 });

 test('nodemailer-test:onsite-inquiry:success', function(t) {

   var transport = nodemailer.createTransport(stubTransport());
   mailer.setTransport(transport);

   params = {};
   params.address = {};
   params.contact = {};
   params.location = {};
   params.course = {};
   params.course.names = "";
   params.hearAbout = {};
   params.comments = {};
   response = null;
   mailer.sendOnsiteInquiry(function(response) {
     expect(200).to.eql(response);
   }, params);

   t.end();
 });
