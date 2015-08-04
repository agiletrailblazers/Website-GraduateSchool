var nock = require('nock');
var chai = require('chai');
var expect = require('chai').expect;
var course = require("../API/course.js");
var should = require("should");


// Nock works by intercepting any HTTP calls your application makes, and
// recording their parameters. You can then record those parameters, so
// future HTTP calls get the recorded responses, rather than making an
// HTTP request to an external service.
nock.recorder.rec({
  dont_print: true,
  output_objects: true
});
var fixtures = nock.recorder.play();

describe('/course-detail', function() {
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
  it("should return a 200 response code", function(done) {
    server;
    course.performExactCourseSearch(function(response, error, result) {
      expect(response.statusCode).to.eql(200);
      done();
    }, 'AUDT8002G001');
  });
  it("should display the course title.", function(done) {
    server;
    course.performExactCourseSearch(function(response, error, result) {
      expect(result.title).to.eql('Prevention and Detection of Fraud');
      done();
    }, 'AUDT8002G001');
  });
  it("should display the course code.", function(done) {
    server;
    expect(result.code).to.eql('AUDT8002G');
    done();
  });
  it("should display the course type.", function(done) {
    server;
    expect(result.type).to.eql('Classroom-Day');
    done();
  });
  it("should display the course credit as an object literal.", function(done) {
    server;
    expect(result.credit).to.be.an('object');
    expect(result.credit).to.include.keys('type');
    result.credit.should.have.property('value').with.length(2);
    done();
  });
});
