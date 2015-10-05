var site = require('../API/course.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;


test('site-search with government search  criteria', function (t) {
  //use endpoing from config even for tests
  var siteApiUrl = config("properties").courseApiUrl;
  var params = {searchCriteria: "government"};
  //test a 200 ok
  var siteServer = nock(siteApiUrl)
    .get('/api/site?search=government')
    .reply(200, {
      "currentPage": 1,
      "totalPages": 1,
      "nextPage": 0,
      "previousPage": 0,
      "pageNavRange": [
        1
      ],
      "pageSize": 1,
      "numRequested": 10,
      "numFound": 1,
      "pages": [
        {
          "title": "Graduate School USA Celebrates Those Who Make Government Work",
          "url": "http://ec2-52-3-249-243.compute-1.amazonaws.com/news/graduate-school-usa-celebrates-those-who-make-government-work",
          "content": "Graduate School USA Celebrates Those Who Make Government Work"
        }
      ]
    });

  siteServer;
  site.performSiteSearch(function (response, error, result) {
    expect(response.statusCode).to.eql(200);
  }, params);
  t.end();
});

test('site-search with government failure  criteria', function (t) {
  //test a 500 internal server error
  var siteApiUrl = config("properties").courseApiUrl;
  var params = {searchCriteria: "failure"};
  var siteServer = nock(siteApiUrl)
    .get('/api/site?search=failure').reply(500, {});
  siteServer;
  site.performSiteSearch(function (response, error, result) {
    expect(response.statusCode).to.eql(500);
    expect(result).to.equal(null);

  }, params);
  t.end();
});


test('site-search with government search  criteria and numRequested', function (t) {
  //use endpoing from config even for tests
  var siteApiUrl = config("properties").courseApiUrl;
  var params = {searchCriteria: "government", numRequested: "100"};
  //test a 200 ok
  var siteServer = nock(siteApiUrl)
    .get('/api/site?search=government&numRequested=100')
    .reply(200, {
      "currentPage": 1,
      "totalPages": 1,
      "nextPage": 0,
      "previousPage": 0,
      "pageNavRange": [
        1
      ],
      "pageSize": 1,
      "numRequested": 100,
      "numFound": 1,
      "pages": [
        {
          "title": "Graduate School USA Celebrates Those Who Make Government Work",
          "url": "http://ec2-52-3-249-243.compute-1.amazonaws.com/news/graduate-school-usa-celebrates-those-who-make-government-work",
          "content": "Graduate School USA Celebrates Those Who Make Government Work"
        }
      ]
    });
  siteServer;
  site.performSiteSearch(function (response, error, result) {
    expect(response.statusCode).to.eql(200);
    expect(result.numRequested).to.eql(100);
  }, params);
  t.end();
});

