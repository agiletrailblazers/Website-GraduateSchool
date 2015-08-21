var nock = require('nock');
var chai = require('chai');
var expect = require('chai').expect;
var course = require("../API/course.js");
var should = require("should");
var test = require('tap').test;


// Nock works by intercepting any HTTP calls your application makes, and
// recording their parameters. You can then record those parameters, so
// future HTTP calls get the recorded responses, rather than making an
// HTTP request to an external service.

test('course-detail testcase 1', function(t) {
/*describe('/course-detail', function() {*/
  var server = nock('http://54.88.17.121:8080')
      .get('/api/course/AUDT8002G001')
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

    course.performExactCourseSearch(function(response, error, result) {
      expect(response.statusCode).to.eql(200);

    }, 'AUDT8002G001');
  t.end();
});
test('course-detail testcase 2', function(t) {
  /*describe('/course-detail', function() {*/
  var server = nock('http://54.88.17.121:8080')
      .get('/api/course/AUDT8002G001')
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
    course.performExactCourseSearch(function(response, error, result) {
      expect(result.title).to.eql('Prevention and Detection of Fraud');
    }, 'AUDT8002G001');
    });
  test('course-detail testcase 3', function(t) {
    /*describe('/course-detail', function() {*/
    var server = nock('http://54.88.17.121:8080')
        .get('/api/course/AUDT8002G001')
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
  course.performExactCourseSearch(function(response, error, result) {
    expect(result.code).to.eql('AUDT8002G');
  }, 'AUDT8002G001');
    t.end();
  });
    test('course-detail testcase 4', function(t) {
      /*describe('/course-detail', function() {*/
      var server = nock('http://54.88.17.121:8080')
          .get('/api/course/AUDT8002G001')
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
  course.performExactCourseSearch(function(response, error, result) {
    expect(result.type).to.eql('Classroom-Day');
  }, 'AUDT8002G001');
      t.end();
    });
test('course-detail testcase 5', function(t) {
  /*describe('/course-detail', function() {*/
  var server = nock('http://54.88.17.121:8080')
      .get('/api/course/AUDT8002G001')
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
  course.performExactCourseSearch(function(response, error, result) {
    expect(result.credit).to.be.an('object');
  }, 'AUDT8002G001');
  t.end();
});
test('course-detail testcase 6', function(t) {
  /*describe('/course-detail', function() {*/
  var server = nock('http://54.88.17.121:8080')
      .get('/api/course/AUDT8002G001')
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
  course.performExactCourseSearch(function(response, error, result) {
    expect(result.credit).to.include.keys('type');
  }, 'AUDT8002G001');
  t.end();
});
test('course-detail testcase 7', function(t) {
  /*describe('/course-detail', function() {*/
  var server = nock('http://54.88.17.121:8080')
      .get('/api/course/AUDT8002G001')
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
  course.performExactCourseSearch(function(response, error, result) {
    result.credit.should.have.property('value').with.length(2);
  }, 'AUDT8002G001');
  t.end();
});
