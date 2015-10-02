var chai = require('chai');
var expect = require('chai').expect;
var contentful_forms = require("../API/contentful_forms.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");

test('form route test for inquiry form', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
  }).get('/spaces/jzmztwi1xqvn/entries/80IOLAFnVuYGk6U4ocooC')
    .reply(200, {
      'accept': 'application/json', "fields": {
        "howDidYouHearAboutTraining": [
          {
            "name": "From a GS training officer."
          },
        ],
        "title": "Training at Your Location"
      }
    });
  contentfulformServer;
  contentful_forms.getInquiryForm(function (response) {
    hearAboutTrainingString = 'From a GS training officer.';
    expect(response.fields.howDidYouHearAboutTraining[0].name).to.equal(hearAboutTrainingString);
    expect(response).to.be.a('object');
  });
  t.end();
});

test('form route test for Contact us', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
  }).get('/spaces/jzmztwi1xqvn/entries/6Av0MIjzZC2qIsGKUGyKS0')
    .reply(200, {
      'accept': 'application/json',
      "fields": {
        "title": "Contact Us",
      }
    });
  contentfulformServer;
  contentful_forms.getContactUs(function (response) {
    fieldsTitle = "Contact Us";
    expect(response.cmsEntry.fields.title).to.equal(fieldsTitle);
    expect(response).to.be.a('object');
  });
  t.end();
});

test('form route test for Request Duplicate Form', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
  }).get('/spaces/jzmztwi1xqvn/entries?content_type=6XkrlHCU9ysmKsCYGUckAC')
    .reply(200, {
      'accept': 'application/json',
      "items": [
        {
          "fields": {
            "sectionTitle": "Duplicate Request Forms",
            "sectionFooterDescription": "To receive a duplicate certificate of completion for a specific course, please complete the student information below and submit the form.",
            "sectionHeaderDescription": "A duplicate course completion certificate will be e-mailed to you by the Office of the Registrar. Please allow 3-5 business days for processing.\n\nIf you have questions regarding the status of this request, please contact the Office of the Registrar at registrar@graduateschool.edu or (202) 314-3368.\n\n* = Required"
          }
        }
      ]
    });
  contentfulformServer;

  contentful_forms.getDuplicateForms(function (response) {
    fieldsTitle = "Duplicate Request Forms";
    var goodStatus = 200;
    expect(response.statusCode).to.equal(goodStatus);
    expect(response.sectionTitle).to.equal(fieldsTitle);
  });
  t.end();
});


test('form route test for Request Duplicate Form Internal Error', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
  }).get('/spaces/jzmztwi1xqvn/entries?content_type=6XkrlHCU9ysmKsCYGUckAC')
    .reply(500, {
      'accept': 'application/json',
      "items": [
        {
          "fields": {
            "sectionTitle": "",
            "sectionFooterDescription": "",
            "sectionHeaderDescription": ""
          }
        }
      ]
    });
  contentfulformServer;

  contentful_forms.getDuplicateForms(function (response) {
    var internalErrorStatusCode = 500;
    expect(response.statusCode).to.equal(internalErrorStatusCode);
  });
  t.end();
});