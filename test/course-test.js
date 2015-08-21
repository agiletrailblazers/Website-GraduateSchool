var course = require('../API/course.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;


test('course-search test-case 1', function(t) {
  //use endpoing from config even for tests
  var courseApiUrl = config("endpoint").courseApiUrl;

  //test a 200 ok
  var courseServer = nock(courseApiUrl)
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
        expect(response.statusCode).to.eql(200);
      },'government');


    //test a 500 internal server error
  var courseApiUrl = config("endpoint").courseApiUrl;
    var courseServer = nock(courseApiUrl)
          .get('/api/courses?search=failure')
          .reply(500, {
      });
        courseServer;
        course.performCourseSearch(function(response, error, result){
          expect(response.statusCode).to.eql(500);
          expect(result).to.equal(null);

        },'failure');
  t.end();
  });


