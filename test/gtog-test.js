var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var courseAPI = require("../API/course.js")
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");
var common = require("../helpers/common.js")
var proxyquire = require('proxyquire').noCallThru();

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
    "id": "60o2cWEaVaQAqwo2IcmcOU",
    "type": "Entry",
    "locale": "en-US"
  },
  "fields": {
    "featureImage": {
      "sys": {
        "type": "Link",
        "linkType": "Asset",
        "id": "7JVkMp8CQMyW0Q0IokEaiu"
      }
    },
    "section": "Graduate School USA is committed to confirming __Guaranteed-to-Go__ course sessions for our federal customers, making it easier for them to schedule and register for training through the fiscal year. We want you to be confident in planning your training expenditures.\n\n<a href=\"/search?search=&selectedG2G=true\" class=\"btn btn-primary btn-lg active\" role=\"button\">Search Guaranteed-to-Go Sessions</a>",
    "relatedLinks": [
      {
        "url": "/search",
        "name": "Search All Courses"
      }
    ],
    "title": "Guaranteed-to-Go Classes"
  }
}

test('test for getting G2G content', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.content.authorization
    }
    }).get('/spaces/'+config("properties").spaces.content.spaceId+'/entries/60o2cWEaVaQAqwo2IcmcOU')
    .reply(200, gTogResponse);

  contentful.getGtoGPage(function(response){
    expect(response.fields.title).to.equal("Guaranteed-to-Go Classes");
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

// test('displayG2GPage', function(t) {
//
//   var res = {};
//
//   var req = {};
//
//   // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
//   var controller = proxyquire('../router/routes/gtog-controller.js',
//   {
//
//     "../../API/course.js": {
//       getSessions: function (cb, authToken, sessionStatus, sessionDomain) {
//         cb(null, sessions);
//       }
//     },
//     "../../../API/contentful.js": {
//       getGtoGPage: function(cb) {
//         cb(gTogResponse);
//       }
//     }
//    });
//
//   res.render = function(page, arguments) {
//       expect(page).to.eql('gtog/gtog');
//       expect(arguments.title).to.eql(gTogResponse.title);
//       expect(arguments.content).to.eql(course);
//       expect(arguments.curriculumSessions).to.eql(courseSession);
//   };
//
//   controller.displayG2GPage(req, res, null);
//
//   t.end();
// });
