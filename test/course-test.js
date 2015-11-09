var course = require('../API/course.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;


test('course-search with government search  criteria', function(t) {
  //use endpoing from config even for tests
  var courseApiUrl = config("properties").courseApiUrl;
  var params ={searchCriteria:"government"};
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
      },params);
      t.end();
 });

  test('course-search with government failure  criteria', function(t) {
    //test a 500 internal server error
  var courseApiUrl = config("properties").courseApiUrl;
  var params ={searchCriteria:"failure"};
  var courseServer = nock(courseApiUrl)
    .get('/api/courses?search=failure').reply(500, {
      });
        courseServer;
        course.performCourseSearch(function(response, error, result){
          expect(response.statusCode).to.eql(500);
          expect(result).to.equal(null);

        },params);
  t.end();
  });

test('course-search with government search  criteria and numRequested', function(t) {
    //use endpoing from config even for tests
  var courseApiUrl = config("properties").courseApiUrl;
  var params ={searchCriteria:"government",numRequested:"100"};
    //test a 200 ok
  var courseServer = nock(courseApiUrl)
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
      expect(response.statusCode).to.eql(200);
      expect(result.numRequested).to.eql("100");
    },params);
    t.end();
});


test('course-search with government search  criteria,numRequested and cityState', function(t) {
    //use endpoing from config even for tests
  var courseApiUrl = config("properties").courseApiUrl;
  var params ={searchCriteria:"government",numRequested:"100",cityState:"Washington, DC"};
    //test a 200 ok
  var courseServer = nock(courseApiUrl)
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
     expect(response.statusCode).to.eql(200);
     expect(result.numRequested).to.eql("100");
     expect(result.numFound).to.eql("235");
  },params);
  t.end();
});


test('course-search with government search  criteria,numRequested,cityState and G2G', function(t) {
    //use endpoing from config even for tests
  var courseApiUrl = config("properties").courseApiUrl;
  var params ={searchCriteria:"government",numRequested:"100",cityState:"Washington, DC",selectedG2G:"true"};
    //test a 200 ok
  var courseServer = nock(courseApiUrl)
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
     expect(response.statusCode).to.eql(200);
     expect(result.numRequested).to.eql("100");
     expect(result.numFound).to.eql("235");
  },params);
  t.end();
});


test('course-search with government search  criteria,numRequested,categorySubject and G2G', function(t) {
  //use endpoing from config even for tests
  var courseApiUrl = config("properties").courseApiUrl;
  var params ={searchCriteria:"government",numRequested:"100",categorySubjectType:"Accounting",categorySubject:"Accounting, Budgeting and Financial Management/Financial Management",selectedG2G:"true"};
  //test a 200 ok
  var courseServer = nock(courseApiUrl)
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
    expect(response.statusCode).to.eql(200);
    expect(result.numRequested).to.eql("100");
    expect(result.numFound).to.eql("235");
  },params);
  t.end();
});

test('course-search with subject search', function(t) {
  //use endpoing from config even for tests
  var courseApiUrl = config("properties").courseApiUrl;
  var params ={};
  //test a 200 ok
  var courseServer = nock(courseApiUrl)
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
    expect(response.statusCode).to.eql(200);
    expect(result.category).to.eql("Accounting, Budgeting and Financial Management");
    expect(result.courseSubject[0].subject).to.eql("Accounting");
  },params);
  t.end();
});

