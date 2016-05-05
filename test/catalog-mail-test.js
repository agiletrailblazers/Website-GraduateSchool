var ajaxformrouteservice = require('../helpers/ajax-form-route-service.js');
var chai = require('chai');
var expect = require('chai').expect;
var nock = require('nock');

var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var temp = require('temp').track();
var request = require('request');
var cachedRequest = require('cached-request')(request);
var proxyquire = require('proxyquire');
cacheDir = temp.mkdirSync("cache");
cachedRequest.setCacheDirectory(cacheDir);
var contentful = proxyquire('../API/contentful.js',
  {
    "../helpers/common.js": {
      setCacheDirectoryAndTimeOut: function (cachedRequestParam) {
        return cachedRequest;
      }
    }
  });


test('test for catalog download', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
    }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries?content_type=5SLs6g27dK2IOeuOyKyeoq')
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

test('organization-catalogMailForm Organization is optional Field', function (t) {

  var address = {
    firstName: "ATB",
    lastName: "ATB",
    street :"ATB",
    city  :"ATB",
    state :"PA",
    zip :"19406"
  };
  var contact = {
    email: "gs@email.com",
    phone: "1234567890"
  };
  var params  = {};
  params.address = address;
  params.contact = contact;
  params.captchaResponse = true;

  ajaxformrouteservice.validateRequestCatalog(function (response) {
    errorLength = Object.keys(response.errors).length;
    expect(errorLength).to.eql(0);
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
