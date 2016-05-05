var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var courseAPI = require("../API/course.js")
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");
var common = require("../helpers/common.js")
//var proxyquire = require('proxyquire').noCallThru();
var temp = require('temp').track();
var request = require('request');
var cachedRequest = require('cached-request')(request);
var proxyquire = require('proxyquire');
cacheDir = temp.mkdirSync("cache");
cachedRequest.setCacheDirectory(cacheDir);

var contentful = proxyquire('../API/contentful.js',
  {
    "../helpers/common.js": {
      setCacheDirectory: function (cachedRequestParam) {
        return cachedRequest;
      }
    }
  });

var sessions = [
  {
    "classNumber": "00086407",
    "segment": null,
    "startDate": "2017-05-01",
    "endDate": "2017-05-02",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Mon-Tue",
    "scheduleMaximum": 2400,
    "scheduleAvailable": 70,
    "scheduleMinimum": 8,
    "status": "C",
    "notes": null,
    "tuition": 1000,
    "location": {
      "id": "01",
      "name": "National Arboretum",
      "telephone": "2022454521",
      "address1": "Stadium Amory Metro Stop",
      "address2": "24th & R Streets NE",
      "city": "Washington",
      "state": "DC",
      "postalCode": "20002"
    },
    "instructor": null,
    "offeringSessionId": "class000000000091170",
    "courseId": "cours000000000001652",
    "courseCode": "PROJ8295D",
    "courseTitle": "Making Sense of CC Errors 101",
    "curricumTitle": "Program and Management Analysis"
  }
]

var gTogResponse = {
  "sys": {
    "type": "Array"
  },
  "total": 1,
  "skip": 0,
  "limit": 100,
  "items": [
    {
      "sys": {
        "space": {
          "sys": {
            "type": "Link",
            "linkType": "Space",
            "id": "8geya92t3ilu"
          }
        },
        "id": "7snuHLxffaCcWgo2mKgokK",
        "type": "Entry",
        "createdAt": "2016-03-23T19:26:30.068Z",
        "updatedAt": "2016-03-24T20:32:32.378Z",
        "revision": 4,
        "contentType": {
          "sys": {
            "type": "Link",
            "linkType": "ContentType",
            "id": "guaranteedToGo"
          }
        },
        "locale": "en-US"
      },
      "fields": {
        "title": "Guaranteed-to-Go Classes",
        "featureImage": {
          "sys": {
            "type": "Link",
            "linkType": "Asset",
            "id": "1l5TQYWeBqO4Q42aoMCAuQ"
          }
        },
        "section": "Graduate School USA is committed to confirming __Guaranteed-to-Go__ course sessions for our federal customers, making it easier for them to schedule and register for training through the fiscal year. We want you to be confident in planning your training expenditures.\n\n<a href=\"/search?search=&selectedG2G=true\" class=\"btn btn-primary btn-lg active\" role=\"button\">Search Guaranteed-to-Go Sessions</a>\n",
        "relatedLinks": [
          {
            "url": "/search",
            "name": "Search All Courses"
          },
          {
            "url": "//assets.contentful.com/jzmztwi1xqvn/1weAu5s2XSOqO6UMUak0qa/ca9f8d05dc4d4357120dc55492106933/Nationwide_Schedule_of_Classes_FY16_040116_093016.pdf",
            "name": "Nationwide Schedule of Classes, April 2016 – September 2016 (PDF)"
          },
          {
            "url": "//assets.contentful.com/98qeodfc03o0/6x8wz5avrUaQyUuSceEseu/d12095f7c00a211eae0d37cff24170c2/Nationwide-Schedule-Oct2015-March2016.pdf",
            "name": "Nationwide Schedule of Classes, October 2015 – March 2016 (PDF)"
          },
          {
            "url": "//assets.contentful.com/98qeodfc03o0/41IJ05gtK8qgCGm8I8cMa0/41610305f7494d513df61faddad6a86d/GS_Training_and_Professional_Course_Catalog_2016.pdf ",
            "name": "Training & Professional Course Catalog 2016 (PDF)"
          }
        ]
      }
    }
  ],
  "includes": {
    "Asset": [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "8geya92t3ilu"
            }
          },
          "id": "1l5TQYWeBqO4Q42aoMCAuQ",
          "type": "Asset",
          "createdAt": "2016-03-24T20:30:08.411Z",
          "updatedAt": "2016-03-24T20:30:08.411Z",
          "revision": 1,
          "locale": "en-US"
        },
        "fields": {
          "title": "GTOG 1 ",
          "file": {
            "url": "//images.contentful.com/8geya92t3ilu/1l5TQYWeBqO4Q42aoMCAuQ/1c88139a99681cd26dfd3bba9f6644ca/GTOG_1_.jpg",
            "details": {
              "size": 69620,
              "image": {
                "width": 1100,
                "height": 357
              }
            },
            "fileName": "GTOG_1_.jpg",
            "contentType": "image/jpeg"
          }
        }
      }
    ]
  }
}

test('test for getting G2G content', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.content.authorization
    }
  }).get('/spaces/'+config("properties").spaces.content.spaceId+'/entries?sys.id=60o2cWEaVaQAqwo2IcmcOU')
    .reply(200, gTogResponse);

  contentful.getGtoGPage(function(response){
    expect(response.items[0].fields.title).to.equal("Guaranteed-to-Go Classes");
  });
  t.end();
});

test('test for getting G2G curriculum Daytime', function(t) {
  var authToken = "token123456789";
  var contentfulServer = nock(config("properties").apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  }).get('/api/courses/sessions?status=c&sessiondomain=CD')
    .reply(200, sessions);

  courseAPI.getSessions(function(error, response){
    expect(response[0].courseTitle).to.equal("Making Sense of CC Errors 101");
  }, authToken, 'c', 'CD');
  t.end();
});

test('test for getting G2G curriculum', function(t) {
  var authToken = "token123456789";
  var contentfulServer = nock(config("properties").apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  }).get('/api/courses/sessions?status=c')
    .reply(200, sessions);

  courseAPI.getSessions(function(error, response){
    expect(response[0].courseTitle).to.equal("Making Sense of CC Errors 101");
  }, authToken, 'c');
  t.end();
});

test('test for getting sessions', function(t) {
  var authToken = "token123456789";
  var contentfulServer = nock(config("properties").apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  }).get('/api/courses/sessions')
    .reply(200, sessions);

  courseAPI.getSessions(function(error, response){
    expect(response[0].courseTitle).to.equal("Making Sense of CC Errors 101");
  }, authToken);
  t.end();
});

test('test for getting sessions error', function(t) {
  var authToken = "token123456789";
  var contentfulServer = nock(config("properties").apiServer, {
    reqheaders: {
      'Authorization': authToken
    }
  }).get('/api/courses/sessions')
    .reply(100, [
      {
        "classNumber": "00086407",
        "segment": null,
        "startDate": "2017-05-01",
        "endDate": "2017-05-02",
        "startTime": "08:30",
        "endTime": "16:00",
        "days": "Mon-Tue",
        "scheduleMaximum": 2400,
        "scheduleAvailable": 70,
        "scheduleMinimum": 8,
        "status": "C",
        "notes": null,
        "tuition": 1000,
        "location": {
          "id": "01",
          "name": "National Arboretum",
          "telephone": "2022454521",
          "address1": "Stadium Amory Metro Stop",
          "address2": "24th & R Streets NE",
          "city": "Washington",
          "state": "DC",
          "postalCode": "20002"
        },
        "instructor": null,
        "offeringSessionId": "class000000000091170",
        "courseId": "cours000000000001652",
        "courseCode": "PROJ8295D",
        "courseTitle": "Making Sense of CC Errors 101",
        "curricumTitle": "Program and Management Analysis"
      }
    ]
  );

  courseAPI.getSessions(function(error, response){
    var flag = false;
    if (common.isNotEmpty) {
      flag = true;
    }
    expect(flag).to.equal(true);
  }, authToken);
  t.end();
});

test('displayG2GPage', function(t) {

  var res = {};

  var req = {
    query : {
      authToken : "123456789123456789",
      courseId : "course12345",
      sessionId : "session12345"
    }
  };

  var sessionStatus = 'c';
  var sessionDomain = null;

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/gtog-controller.js',
  {

    "../../API/course.js": {
      getSessions: function (cb, authToken, sessionStatus, sessionDomain) {
        cb(null, sessions);
      }
    },
    "../../API/contentful.js": {
      getGtoGPage: function(cb) {
        cb(gTogResponse);
      }
    }
   });

  res.render = function(page, arguments) {
      expect(page).to.eql('gtog/gtog');
      expect(arguments.title).to.eql(gTogResponse.items[0].fields.title);
      expect(arguments.content.relatedLinks).to.eql(gTogResponse.items[0].fields.relatedLinks);
      expect(arguments.content.imageUrl).to.eql(gTogResponse.includes.Asset[0].fields.file.url);
      expect(arguments.content.section).to.eql(gTogResponse.items[0].fields.section);
      expect(arguments.curriculumSessions[sessions[0].curricumTitle][0].curricumTitle).to.eql(sessions[0].curricumTitle);
      // expect(arguments.curriculumSessions).to.eql(courseSession);
  };

  controller.displayG2GPage(req, res, null);

  t.end();
});
