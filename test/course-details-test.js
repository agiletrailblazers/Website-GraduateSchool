var nock = require('nock');
var chai = require('chai');
var expect = require('chai').expect;
var course = require("../API/course.js");
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");
var contentful = require("../API/contentful.js");

var authToken = "token123456789";

// Nock works by intercepting any HTTP calls your application makes, and
// recording their parameters. You can then record those parameters, so
// future HTTP calls get the recorded responses, rather than making an
// HTTP request to an external service.

test('course-detail testcase 1', function(t) {
  var apiServer = config("properties").apiServer;
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .get('/api/courses/AUDT8002G001')
      .reply(200, {
        // Need sections from Boris.
        courseTitle: 'Prevention and Detection of Fraud LOL',
        courseCode: 'AUDT8002G001',
        courseType: 'Classroom-Day',
        courseCredit: { value: '24', type: 'CPE' },
        courseLength: { value: '3', interval: 'Day' }
        // whoAttends: ,
        // courseObjectives: ,
        // courseSyllabus: ,
        // sessionSchedule:
      });
      server;
      course.performExactCourseSearch(function(response, error, result) {
        server.done();
        expect(response.statusCode).to.eql(200);
    }, 'AUDT8002G001', authToken);
  t.end();
});

test('course-detail testcase 2', function(t) {
  var apiServer = config("properties").apiServer;
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .get('/api/courses/AUDT8002G001')
      .reply(200, {
        // Need sections from Boris.
        courseTitle: 'Prevention and Detection of Fraud LOL',
        courseCode: 'AUDT8002G001',
        courseType: 'Classroom-Day',
        courseCredit: { value: '24', type: 'CPE' },
        courseLength: { value: '3', interval: 'Day' }
        // whoAttends: ,
        // courseObjectives: ,
        // courseSyllabus: ,
        // sessionSchedule:
      });
      server;
      course.performExactCourseSearch(function(response, error, result) {
        server.done();
        expect(result.courseTitle).to.eql('Prevention and Detection of Fraud LOL');
     }, 'AUDT8002G001', authToken);
     t.end();
});

test('course-detail testcase 3', function(t) {
  var apiServer = config("properties").apiServer;
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
      .get('/api/courses/AUDT8002G001')
      .reply(200, {
        // Need sections from Boris.
        courseTitle: 'Prevention and Detection of Fraud LOL',
        courseCode: 'AUDT8002G001',
        courseType: 'Classroom-Day',
        courseCredit: { value: '24', type: 'CPE' },
        courseLength: { value: '3', interval: 'Day' }
        // whoAttends: ,
        // courseObjectives: ,
        // courseSyllabus: ,
        // sessionSchedule:
   });
   server;
   course.performExactCourseSearch(function(response, error, result) {
     server.done();
     expect(result.courseCode).to.eql('AUDT8002G001');
  }, 'AUDT8002G001', authToken);
  t.end();
});

test('course-detail testcase 4', function(t) {
  var apiServer = config("properties").apiServer;
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
        .get('/api/courses/AUDT8002G001')
        .reply(200, {
          // Need sections from Boris.
          courseTitle: 'Prevention and Detection of Fraud LOL',
          courseCode: 'AUDT8002G001',
          courseType: 'Classroom-Day',
          courseCredit: { value: '24', type: 'CPE' },
          courseLength: { value: '3', interval: 'Day' }
          // whoAttends: ,
          // courseObjectives: ,
          // courseSyllabus: ,
          // sessionSchedule:
    });
    server;
    course.performExactCourseSearch(function(response, error, result) {
      server.done();
      expect(result.courseType).to.eql('Classroom-Day');
    }, 'AUDT8002G001', authToken);
    t.end();
  });

test('course-detail testcase 5', function(t) {
  var apiServer = config("properties").apiServer;
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses/AUDT8002G001')
    .reply(200, {
      // Need sections from Boris.
      courseTitle: 'Prevention and Detection of Fraud LOL',
      courseCode: 'AUDT8002G001',
      courseType: 'Classroom-Day',
      courseCredit: { value: '24', type: 'CPE' },
      courseLength: { value: '3', interval: 'Day' }
      // whoAttends: ,
      // courseObjectives: ,
      // courseSyllabus: ,
      // sessionSchedule:
  });
  server;
  course.performExactCourseSearch(function(response, error, result) {
    server.done();
    expect(result.courseCredit).to.be.an('object');
  }, 'AUDT8002G001', authToken);
  t.end();
});

test('course-detail testcase 6', function(t) {
  var apiServer = config("properties").apiServer;
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses/AUDT8002G001')
    .reply(200, {
      // Need sections from Boris.
      courseTitle: 'Prevention and Detection of Fraud LOL',
      courseCode: 'AUDT8002G001',
      courseType: 'Classroom-Day',
      courseCredit: { value: '24', type: 'CPE' },
      courseLength: { value: '3', interval: 'Day' }
      // whoAttends: ,
      // courseObjectives: ,
      // courseSyllabus: ,
      // sessionSchedule:
  });
  server;
  course.performExactCourseSearch(function(response, error, result) {
    server.done();
    expect(result.courseCredit).to.include.keys('type');
  }, 'AUDT8002G001', authToken);
  t.end();
});

test('course-detail testcase 7', function(t) {
  var apiServer = config("properties").apiServer;
  var server = nock(apiServer, {
        reqheaders: {
          'Authorization': authToken
        }
      })
    .get('/api/courses/AUDT8002G001')
    .reply(200, {
      // Need sections from Boris.
      courseTitle: 'Prevention and Detection of Fraud LOL',
      courseCode: 'AUDT8002G001',
      courseType: 'Classroom-Day',
      courseCredit: { value: '24', type: 'CPE' },
      courseLength: { value: '3', interval: 'Day' }
      // whoAttends: ,
      // courseObjectives: ,
      // courseSyllabus: ,
      // sessionSchedule:
  });
  server;
  course.performExactCourseSearch(function(response, error, result) {
    server.done();
    result.courseCredit.should.have.property('value').with.length(2);
  }, 'AUDT8002G001', authToken);
  t.end();
});


test('course-detail Contentful testcase 1', function(t) {
  var courseCode = 'acct7102d';
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.courseData.authorization
    }
  }).get('/spaces/'+config("properties").spaces.courseData.spaceId+'/entries?content_type=6oONI768GACooiUiqmSWIY&fields.courseCode=' + courseCode)
  .reply(200, {
    "sys": {
      "type": "Array"
    },
    "total": 1,
    "skip": 0,
    "limit": 100,
    "items": [
      {
        "fields": {
          "courseCode": "acct7102d",
          "syllabusContent": "<!--BEGIN HEADER--><HTML>\r\n<HEAD><TITLE>Syllabus -- Federal Accounting Standards, ACCT7102D, Grad. School, USDA</TITLE></HEAD>\r\n<body bgcolor=\"#ffffff\"> \r\n\r\n<!--- START TEXT --->\r\n\r\n\r\n\r\n<p><B>Day one of three</B>\r\n<UL><LI>Introduction\r\n\t<UL><LI>Course approach, description and objectives\r\n\t<LI>Course expectations\r\n\t<LI>Hypothetical agency program and mission\r\n\t<LI>Background on FASAB\r\n\t<LI>Objectives of Federal Financial Reporting SFFAC # 1\r\n\t<LI>Standards for Entity and Display, SFFAC # 2</ul>\r\n<LI>Statements of Federal Financial Accounting Standards\r\n\t<UL><LI>Accounting for Revenue and other Financing Sources SFFAS # 7\r\n\t<LI>Accounting for Direct Loans and Loan Guarantees SFFAS # 2</ul>\r\n<LI>End day one\r\n</ul>\r\n\r\n<p><B>Day two of three</B>\r\n<UL><LI>Statement of Federal Financial Accounting Standards (continued)\r\n\t<ul><LI>Questions and answers from day -1\r\n\t<LI>Accounting for Property, Plant, and Equipment SFFAS # 6\r\n\t<LI>Supplementary Stewardship Reporting SFFAS # 8\r\n\t<LI>Managerial Cost Accounting Concepts and Standards SFFAS # 4</ul>\r\n<LI>End day two\r\n</ul>\r\n\r\n<p><B>Day three of three</B>\r\n<UL><LI>Statement of Federal Financial Accounting Standards (continued)\r\n\t<UL><LI>Questions and answers from day-2\r\n\t<LI>Accounting for Selected Assets and Liabilities SFFAS # 1\r\n\t<LI>Accounting for Inventory and Related Property SFFAS # 3\r\n\t<LI>Accounting for Liabilities SFFAS # 5\r\n\t<LI>Update on FASAB activities\r\n\t<LI>Summary and evaluation</ul>\r\n<LI>End of day three\r\n</ul>\r\n\r\n<!--- END TEXT --->\r\n</body>\r\n</html>\r\n\r\n"
        }
      }
    ]
  });

  // call the api
  contentful.getSyllabus(courseCode, function(response, error, result) {
    expect(response.items).to.exit;
    expect(response.items[0].fields.courseCode).to.eql(courseCode);
  });
  t.end();
});
