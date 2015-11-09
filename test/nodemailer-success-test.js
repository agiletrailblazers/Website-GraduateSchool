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


test('nodemailer-test:RequestDuplicate:success', function(t) {

  var transport = nodemailer.createTransport(stubTransport());
  mailer.setTransport(transport);
  params = {};
  params.firstName = {};
  params.lastName = {};
  params.street = {};
  params.suite = {};
  params.city = {};
  params.state = {};
  params.zip = {};
  params.phone = {};
  params.email = {};
  params.instructor = {};
  params.courseCode = {};
  params.courseTitle = {};
  params.startDate = {};
  params.endDate = {};
  params.courseLocation = {};
  params.captchaResponse = {};
  params.courseType = {};
  response = null;
  mailer.sendOnRequestDuplicate(function(response) {
    expect(200).to.eql(response);
  }, params);

  t.end();
});

test('nodemailer-test:ProctorRequest:success', function(t) {

  var transport = nodemailer.createTransport(stubTransport());
  mailer.setTransport(transport);
  params = {};
  params.student ={};
  params.student.phone ={};
  params.proctor ={};
  params.proctor.phone ={};
  params.student.firstName = {};
  params.student.lastName = {};
  params.student.street = {};
  params.student.suite = {};
  params.student.city = {};
  params.student.state = {};
  params.student.zip = {};
  params.student.phone.day = {};
  params.student.phone.home = {};
  params.student.email = {};
  params.student.instructor = {};
  params.student.courseCode = {};
  params.student.courseTitle = {};
  params.student.courseLocation = {};
  params.proctor.firstName =  {};
  params.proctor.lastName =  {};
  params.proctor.employmentLocation = {};
  params.proctor.profession = {};
  params.proctor.studentRelationship = {};
  params.proctor.email = {};
  params.proctor.phone.work = {};
  params.proctor.phone.fax = {};
  params.proctor.emailTo = {};
  params.proctor.organizationName = {};
  params.proctor.attentionName = {};
  params.proctor.street = {};
  params.proctor.suite = {};
  params.proctor.city = {};
  params.proctor.state= {};
  params.proctor.zip = {};
  params.captchaResponse = {};
  response = null;
  mailer.sendOnProctorRequest(function(response) {
    expect(200).to.eql(response);
  }, params);

  t.end();
});

test('nodemailer-test:CustomerFeedBackForm:success', function(t) {

  var transport = nodemailer.createTransport(stubTransport());
  mailer.setTransport(transport);
  params = {};
  params.firstName = {};
  params.lastName = {};
  params.phone = {};
  params.email = {};
  params.typePerson = {};
  params.feedbackCategories= {};
  params.feedbackText = {};;
  params.captchaResponse = {};
  response = null;
  mailer.sendOnCustomerFeedBackForm(function(response) {
    expect(200).to.eql(response);
  }, params);

  t.end();
});

test('nodemailer-test:CustomerSendToForm:success', function(t) {

  var transport = nodemailer.createTransport(stubTransport());
  mailer.setTransport(transport);
  params = {};
  params.firstName = {};
  params.lastName = {};
  params.phone = {};
  params.email = {};
  params.typePerson = {};
  params.feedbackCategories= {};
  params.feedbackText = {};;
  params.captchaResponse = {};
  response = null;
  mailer.sendToCustomerSubmitForm(function(response) {
    expect(200).to.eql(response);
  }, params);

  t.end();
});

test('nodemailer-test:CertificateProgramForm:success', function(t) {
  var transport = nodemailer.createTransport(stubTransport());
  mailer.setTransport(transport);
  params = {};
  params.other = {};
  params.title = {};
  params.formType = {};
  params.selectBox = {};
  params.firstName = {};
  params.lastName = {};
  params.phone = {};
  params.email = {};
  params.mi = {};
  params.formerLastName = {};
  params.ssn = {};
  params.dob = {};
  params.fax = {};
  params.city = {};
  params.state = {};
  params.country = {};
  params.zip = {};
  params.streetAddress = {};
  params.suite = {};
  params.comment = {};
  mailer.sendCertificateProgram(function(response) {
    expect(200).to.eql(response);
  }, params);

  t.end();
});


test('nodemailer-test:CatalogForm:success', function(t) {
  var transport = nodemailer.createTransport(stubTransport());
  mailer.setTransport(transport);

  data = {};
  data.address = {};
  data.location = {};
  data.contact = {};
  data.course = {};
  data.address.prefix = {};
  data.address.firstName = {};
  data.address.middleName = {};
  data.address.lastName = {};
  data.address.organization = {};
  data.address.street = {};;
  data.address.suite = {};
  data.address.city = {};
  data.address.state = {};
  data.address.zip = {};
  data.address.country = {};
  data.contact.fax = {};
  data.contact.email = {};
  data.contact.phone = {};
  data.catalogHardCopyTitles = {};
  data.catalogHardCopyTitlesList = {};
  mailer.sendCatalogRequest(function(response) {
    expect(200).to.eql(response);
  }, data);

  t.end();
});
