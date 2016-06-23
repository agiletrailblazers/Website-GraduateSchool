var course = require('../API/course.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

var authToken = "token123456789";

var sampleSchedule = [{
    "classNumber": "600178",
    "segment": null,
    "startDate": "2016-09-13",
    "endDate": "2016-09-16",
    "startTime": "08:30",
    "endTime": "16:30",
    "days": "TUE-FRI",
    "scheduleMaximum": 25,
    "scheduleAvailable": 0,
    "scheduleMinimum": 8,
    "status": "S",
    "notes": null,
    "tuition": 1199.0,
    "location": {
        "id": "DCWAS20024",
        "name": "Washington/DC",
        "city": "Washington",
        "state": "DC"
    },
    "facility": {
        "id": "DCWASCAPGL",
        "name": "Graduate School at Capital Gallery",
        "address1": "L'Enfant Plaza Metro Stop",
        "address2": "600 Maryland Avenue, SW",
        "city": "Washington",
        "state": "DC",
        "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089319",
    "courseId": "cours000000000001163",
    "courseCode": "ACCT7001D",
    "courseTitle": "Introduction to Federal Accounting",
    "curricumTitle": "Federal Financial Management",
    "curricumTabDisplayOrder": 2
}, {
    "classNumber": "600176",
    "segment": null,
    "startDate": "2016-07-12",
    "endDate": "2016-07-15",
    "startTime": "08:30",
    "endTime": "16:30",
    "days": "TUE-FRI",
    "scheduleMaximum": 25,
    "scheduleAvailable": 7,
    "scheduleMinimum": 8,
    "status": "S",
    "notes": null,
    "tuition": 1199.0,
    "location": {
        "id": "DCWAS20024",
        "name": "Washington/DC",
        "city": "Washington",
        "state": "DC"
    },
    "facility": {
        "id": "DCWASCAPGL",
        "name": "Graduate School at Capital Gallery",
        "address1": "L'Enfant Plaza Metro Stop",
        "address2": "600 Maryland Avenue, SW",
        "city": "Washington",
        "state": "DC",
        "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089063",
    "courseId": "cours000000000001163",
    "courseCode": "ACCT7001D",
    "courseTitle": "Introduction to Federal Accounting",
    "curricumTitle": "Federal Financial Management",
    "curricumTabDisplayOrder": 2
}];

test('course-search with government search  criteria', function(t) {
  //use endpoing from config even for tests
  var apiServer = config("properties").apiServer;
  var params ={searchCriteria:"government"};
  //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .get('/api/courses?search=government')
      .reply(200, {
          "exactMatch": true,
          "courses": [
            {
              "courseId": "WRIT7043D",
              "courseTitle": "Plain Writing: It is the Law (Classroom-Day)",
              "courseDescription": "The Plain Writing Act of 2015 (October 13, 2010) requires the Federal government to..."
            }
          ]
        });

      courseServer;
      course.performCourseSearch(function(response, error, result){
        courseServer.done();
        expect(response.statusCode).to.eql(200);
      },params, authToken);

      t.end();
 });

test('course-search with government failure  criteria', function(t) {
    //test a 500 internal server error
  var apiServer = config("properties").apiServer;
  var params ={searchCriteria:"failure"};
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .get('/api/courses?search=failure').reply(500, {
        });
        courseServer;
        course.performCourseSearch(function(response, error, result){
          courseServer.done();
          expect(response.statusCode).to.eql(500);
          expect(result).to.equal(null);
        },params, authToken);
  t.end();
  });

test('course-search with government search  criteria and numRequested', function(t) {
    //use endpoing from config even for tests
  var apiServer = config("properties").apiServer;
  var params ={searchCriteria:"government",numRequested:"100"};
    //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .get('/api/courses?search=government&numRequested=100')
      .reply(200, {
       "exactMatch": true,
       "numRequested":"100",
        "courses": [
        {
          "courseId": "WRIT7043D",
          "courseTitle": "Plain Writing: It is the Law (Classroom-Day)",
          "courseDescription": "The Plain Writing Act of 2015 (October 13, 2010) requires the Federal government to..."
        }
        ]
      });
    courseServer;
    course.performCourseSearch(function(response, error, result){
      courseServer.done();
      expect(response.statusCode).to.eql(200);
      expect(result.numRequested).to.eql("100");
    },params, authToken);
    t.end();
});


test('course-search with government search  criteria,numRequested and cityState', function(t) {
    //use endpoing from config even for tests
  var apiServer = config("properties").apiServer;
  var params ={searchCriteria:"government",numRequested:"100",cityState:"Washington, DC"};
    //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses?search=government&numRequested=100&filter=city_state:Washington,%20DC')
      .reply(200, {
         "exactMatch": true,
         "numRequested":"100",
         "numFound":"235",
         "courses": [
           {
             "courseId": "WRIT7043D",
             "courseTitle": "Plain Writing: It is the Law (Classroom-Day)",
             "courseDescription": "The Plain Writing Act of 2015 (October 13, 2010) requires the Federal government to..."
           }
           ]
      });
  courseServer;
  course.performCourseSearch(function(response, error, result){
    courseServer.done();
     expect(response.statusCode).to.eql(200);
     expect(result.numRequested).to.eql("100");
     expect(result.numFound).to.eql("235");
  },params, authToken);
  t.end();
});


test('course-search with government search  criteria,numRequested,cityState and G2G', function(t) {
    //use endpoing from config even for tests
  var apiServer = config("properties").apiServer;
  var params ={searchCriteria:"government",numRequested:"100",cityState:"Washington, DC",selectedG2G:"true"};
    //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses?search=government&numRequested=100&filter=city_state:Washington,%20DC&filter=status:C')
      .reply(200, {
         "exactMatch": true,
         "numRequested":"100",
         "numFound":"235",
         "courses": [
           {
             "courseId": "WRIT7043D",
             "courseTitle": "Plain Writing: It is the Law (Classroom-Day)",
             "courseDescription": "The Plain Writing Act of 2015 (October 13, 2010) requires the Federal government to..."
           }
           ]
      });
  courseServer;
  course.performCourseSearch(function(response, error, result){
    courseServer.done();
     expect(response.statusCode).to.eql(200);
     expect(result.numRequested).to.eql("100");
     expect(result.numFound).to.eql("235");
  },params, authToken);
  t.end();
});


test('course-search with government search  criteria,numRequested,categorySubject and G2G', function(t) {
  //use endpoing from config even for tests
  var apiServer = config("properties").apiServer;
  var params ={searchCriteria:"government",numRequested:"100",categorySubjectType:"Accounting",categorySubject:"Accounting, Budgeting and Financial Management/Financial Management",selectedG2G:"true"};
  //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses?search=government&numRequested=100&filter=category_subject:Accounting,%20Budgeting%20and%20Financial%20Management/Financial%20Management&filter=status:C')
    .reply(200, {
      "exactMatch": true,
      "numRequested":"100",
      "numFound":"235",
      "courses": [
        {
          "courseId": "WRIT7043D",
          "courseTitle": "Plain Writing: It is the Law (Classroom-Day)",
          "courseDescription": "The Plain Writing Act of 2015 (October 13, 2010) requires the Federal government to..."
        }
      ]
    });
  courseServer;
  course.performCourseSearch(function(response, error, result){
    courseServer.done();
    expect(response.statusCode).to.eql(200);
    expect(result.numRequested).to.eql("100");
    expect(result.numFound).to.eql("235");
  },params, authToken);
  t.end();
});

test('course-search with subject search', function(t) {
  //use endpoing from config even for tests
  var apiServer = config("properties").apiServer;
  //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses/categories')
    .reply(200,
      {
      "category": "Accounting, Budgeting and Financial Management",
      "courseSubject": [
        {
          "subject": "Accounting",
          "filter": "Accounting, Budgeting and Financial Management/Accounting",
          "count": 0
        }
      ]
    });
  courseServer;
  course.getCategories(function(response, error, result){
    courseServer.done();
    expect(response.statusCode).to.eql(200);
    expect(result.category).to.eql("Accounting, Budgeting and Financial Management");
    expect(result.courseSubject[0].subject).to.eql("Accounting");
  }, authToken);
  t.end();
});

test('course-search with government search  criteria,numRequested and DeliveryMethod', function(t) {
  //use endpoing from config even for tests
  var apiServer = config("properties").apiServer;
  var params ={searchCriteria:"government",numRequested:"100",deliveryMethod:"Classroom - Daytime"};
  //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses?search=government&numRequested=100&filter=delivery_method:Classroom%20-%20Daytime')
    .reply(200, {
      "exactMatch": true,
      "numRequested":"100",
      "numFound":"235",
      "courses": [
        {
          "courseId": "WRIT7043D",
          "courseTitle": "Plain Writing: It is the Law (Classroom-Day)",
          "courseDescription": "The Plain Writing Act of 2015 (October 13, 2010) requires the Federal government to..."
        }
      ],
      "deliveryMethodFacets": {
        "ClassroomEvening": 32,
        "OnlineLearning": 19,
        "ClassroomDaytime":102
      }
    });
  courseServer;
  course.performCourseSearch(function(response, error, result){
    courseServer.done();
    expect(response.statusCode).to.eql(200);
    expect(result.numRequested).to.eql("100");
    expect(result.numFound).to.eql("235");
    expect(result.deliveryMethodFacets.ClassroomEvening).to.eql(32);
    expect(result.deliveryMethodFacets.OnlineLearning).to.eql(19);
    expect(result.deliveryMethodFacets.ClassroomDaytime).to.eql(102);
  },params, authToken);
  t.end();
});

test('getSession success', function(t) {
  //use endpoint from config even for tests
  var apiServer = config("properties").apiServer;
  var sessionId = "55555";
  var expectedResponse = {"key" : "value"};

  //test a 200 ok
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
        .get('/api/courses/sessions/' + sessionId)
        .reply(200, expectedResponse);

  courseServer;
  course.getSession(sessionId, function(error, session) {
    courseServer.done();
    expect(error).to.be.a('null');
    expect(session).to.eql(expectedResponse);
  }, authToken);
  t.end();
});

test('getSession failure', function(t) {
  //use endpoint from config even for tests
  var apiServer = config("properties").apiServer;
  var sessionId = "55555";
  var expectedResponse = {"key" : "value"};

  //test a 500 internal server error
  var courseServer = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .get('/api/courses/sessions/' + sessionId)
      .reply(400, {});

    courseServer;
    course.getSession(sessionId, function(error, session) {
      courseServer.done();
      expect(session).to.be.a('null');
      expect(error).to.be.an.instanceof(Error);
    }, authToken);
    t.end();
});

test('getSchedule success', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;
    var sessionId = "55555";
    var expectedResponse = sampleSchedule;

    //test a 200 ok
    var courseServer = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/courses/' + sessionId + '/sessions')
        .reply(200, expectedResponse);

    courseServer;
    course.getSchedule(function(response, error, result) {
        courseServer.done();
        expect(error).to.be.a('null');
        expect(result).to.eql(expectedResponse);
        expect(response.statusCode).to.eql(200);
    }, sessionId, authToken);
    t.end();
});
