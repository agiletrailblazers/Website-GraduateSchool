var course = require('../API/course.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");

describe ('course-search', function(){

  //use endpoing from config even for tests
  var courseApiUrl = config("endpoint").courseApiUrl;

  //test a 200 ok
  var courseServer = nock(courseApiUrl)
        .get('/api/course?search=government')
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
    it("Calls course search API 200 OK", function(done) {
      courseServer;
      course.performCourseSearch(function(response, error, result){
        expect(response.statusCode).to.eql(200);
        expect(result.exactMatch).to.equal(true);
        expect(result.courses[0].courseId).to.equal('WRIT7043D');
        done();
      },'government');
    });

    //test a 500 internal server error
    var courseServer = nock(courseApiUrl)
          .get('/api/course?search=failure')
          .reply(500, {
      });
      it("Calls course search API 200 OK", function(done) {
        courseServer;
        course.performCourseSearch(function(response, error, result){
          expect(response.statusCode).to.eql(500);
          expect(result).to.equal(null);
          done();
        },'failure');
      });

});
