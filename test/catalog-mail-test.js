var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');

var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

test('test for catalog download', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
    }).get('/spaces/jzmztwi1xqvn/entries?content_type=5SLs6g27dK2IOeuOyKyeoq')
    .reply(200, {
      "sys": {
        "type": "Array"
      },
      "total": 15,
      "skip": 0,
      "limit": 100,
      "items": [
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "jzmztwi1xqvn"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "5SLs6g27dK2IOeuOyKyeoq"
              }
            },
            "id": "Q7ktvLlVE2KYe68y8oM8k",
            "revision": 1,
            "createdAt": "2015-11-06T20:16:18.206Z",
            "updatedAt": "2015-11-06T20:16:18.206Z",
            "locale": "en-US"
          },
          "fields": {
            "catalogHardCopy": "Center for Leadership and Management brochure"
          }
        },
      ]
    });
  contentfulServer;
  contentful.getCatalogRequestHardCopy(function(response){
    var goodStatus = 200;
    expect(response.statusCode).to.equal(goodStatus);
    expect(response.cmsEntry[0].fields.catalogHardCopy).to.equal("Center for Leadership and Management brochure");
  });
  t.end();
});


test('firstName-catalogMailForm length Validation', function (t) {

  var address = {
    firstName: "AA",
    lastName: "ATB",
    organization: "Help"
  };

  var contact = {
    email: "gs@email.com",
    phone: "1234567890"
  };

  var params  = {};
  params.address = address;
  params.contact = contact;

  ajaxformrouteservice.validateRequestCatalog(function (response) {
    expect(response.errors.firstName).to.eql(config("properties").contactUsFirstNameLengthCheckMessage);
  }, params);
  t.end();
});

test('lastName-catalogMailForm length Validation', function (t) {

  var address = {
    firstName: "AAA",
    lastName: "AB",
    organization: "Help"
  };

  var contact = {
    email: "gs@email.com",
    phone: "1234567890"
  };

  var params  = {};
  params.address = address;
  params.contact = contact;

  ajaxformrouteservice.validateRequestCatalog(function (response) {
    expect(response.errors.lastName).to.eql(config("properties").contactUsLastNameLengthCheckMessage);
  }, params);
  t.end();
});

test('organization-catalogMailForm Organization is Empty', function (t) {

  var address = {
    firstName: "AAA",
    lastName: "ATB",
    organization: ""
  };

  var contact = {
    email: "gs@email.com",
    phone: "1234567890"
  };

  var params  = {};
  params.address = address;
  params.contact = contact;

  ajaxformrouteservice.validateRequestCatalog(function (response) {
    expect(response.errors.organization).to.eql("Organization is empty.");
  }, params);
  t.end();
});

test('Email-catalogMailForm Email Wrong Format Validation', function (t) {

  var address = {
    firstName: "AAA",
    lastName: "ATB",
    organization: ""
  };

  var contact = {
    email: "gs.email.com",
    phone: "1234567890"
  };

  var params  = {};
  params.address = address;
  params.contact = contact;

  ajaxformrouteservice.validateRequestCatalog(function (response) {
    expect(response.errors.email).to.eql(config("properties").contactUsEmailWrongFormatMessage);
  }, params);
  t.end();
});


test('Phone-catalogMailForm Empty String Validation', function (t) {

  var address = {
    firstName: "AAA",
    lastName: "ATB",
    organization: ""
  };

  var contact = {
    email: "gs@email.com",
    phone: ""
  };

  var params  = {};
  params.address = address;
  params.contact = contact;

  ajaxformrouteservice.validateRequestCatalog(function (response) {
    expect(response.errors.phone).to.eql(config("properties").contactUsPhoneEmptyCheckMessage);
  }, params);
  t.end();
});
