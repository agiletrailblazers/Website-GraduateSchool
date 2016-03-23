var request = require('request');
var async = require('async');
var config = require('konphyg')(__dirname + "/../config");
var logger = require('../logger');
var common = require("../helpers/common.js");

module.exports = {
  performCourseSearch: function(callback, params, authToken) {
    var apiServer = config("properties").apiServer;
    apiServer = apiServer + '/api/courses?search=' + encodeURIComponent(params.searchCriteria)  ;
    if (common.isNotEmpty(params.numRequested)) {
      apiServer = apiServer + '&numRequested=' + params.numRequested;
    }
    if (common.isNotEmptyOrAll(params.cityState)) {
      apiServer = apiServer + '&filter=city_state:' + params.cityState;
    }
    if (common.isNotEmptyOrAll(params.categorySubject) && common.isNotEmptyOrAll(params.categorySubjectType)) {
      if (params.categorySubjectType === 'category') {
        apiServer = apiServer + '&filter=category:' + params.categorySubject;
      } else {
        apiServer = apiServer + '&filter=category_subject:' + params.categorySubject;
      }
    }
    if (params.page && common.isNotEmpty(params.page.course)) {
      apiServer = apiServer + '&page='+ params.page.course;
    }
    if (common.isNotEmptyOrAll(params.deliveryMethod)) {
      apiServer = apiServer + '&filter=delivery_method:' + params.deliveryMethod;
    }
    if (params.selectedG2G == "true" ) {
      apiServer = apiServer + '&filter=status:C';
    }
    logger.debug(apiServer);
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred performing course search"), null);
     }
      logger.debug('Status:', response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    })
  },
  performExactCourseSearch: function(callback, courseId, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses/' + courseId;
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred performing exact course search"), null);
      }
      logger.debug("Course Search: " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getSchedule: function(callback, courseId, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses/' + courseId + '/sessions';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (error || !response || (response.statusCode != 200 && response.statusCode != 404)) {
        var message = "Error performing course schedule search";
        if (response) {
          message = message + ", status code: " + response.statusCode;
        }
        if (error) {
          message = message + ", error message: " + error.message;
        }
        logger.error(message + ", url: " + apiServer);
        return callback(response, new Error("Exception occurred performing course search"), null);
      }
      if (response.statusCode == 404) {
        //404 is an expected response, so no need to log an error for it, return result as null
        return callback(response, error, null);
      }
      logger.debug("Course Schedule: " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCourses: function(callback, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred getting all courses"), null);
     }
      logger.debug("Get Courses: " + response.statusCode);
      var result = JSON.parse(body).courses;
      return callback(response, error, result);
    });
  },
  getLocations: function(callback, authToken) {
    var apiServer = config("properties").apiServer + '/api/locations';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred getting all locations"), null);
      }
      logger.debug("Get Locations: " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  getCategories: function(callback, authToken) {
    var apiServer = config("properties").apiServer + '/api/courses/categories';
    request({
      method: 'GET',
      url: apiServer,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, apiServer)) {
       return callback(response, new Error("Exception occurred getting all categories"), null);
      }
      logger.debug("Get Categories : " + response.statusCode);
      var result = JSON.parse(body);
      return callback(response, error, result);
    });
  },
  performSiteSearch: function(callback, params, authToken) {
    //skip search if result would be all pages
    if (common.isEmpty(params.searchCriteria) && (common.isEmpty(params.cityState) ||  params.cityState == 'all')) {
      return callback(null, null, {});
    }
    var siteapiServer = config("properties").apiServer;
    siteapiServer = siteapiServer + '/api/site?search=' + encodeURIComponent(params.searchCriteria)
    if (common.isNotEmpty(params.cityState) && params.cityState != 'all') {
      siteapiServer = siteapiServer + '&filter=content:' + params.cityState;
    }
    if (common.isNotEmpty(params.numRequested)) {
      siteapiServer = siteapiServer + '&numRequested=' + params.numRequested;
    }
    if (params.page && common.isNotEmpty(params.page.site)) {
      siteapiServer = siteapiServer + '&page='+ params.page.site;
    }
    logger.debug(siteapiServer);
    request({
        method: 'GET',
        url: siteapiServer,
        headers: {
          'Authorization': authToken
        }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, siteapiServer)) {
       return callback(response, new Error("Exception occurred performing Site search"), null);
      }
        logger.debug('Status:', response.statusCode);
        var result = JSON.parse(body);
        return callback(response, error, result);
    });
  },
  // API to retrieve a specific course session by its ID
  getSession: function(sessionId, callback, authToken) {
    // url for the API call
    var sessionUrl = config("properties").apiServer + '/api/courses/session/' + sessionId;
    request({
      method: 'GET',
      url: sessionUrl,
      headers: {
        'Authorization': authToken
      }
    }, function (error, response, body) {
      if (common.checkForErrorAndLog(error, response, sessionUrl)) {
        return callback(new Error("Exception occurred getting session " + sessionId), null);
      }
      return callback(null, JSON.parse(body));
    });
  },
  // API to retrieve a specific course session by its ID
  getSessions: function(callback, authToken, sessionStatus, sessionDomain) {

var sessions = [
  {
    "classNumber": "600471",
    "segment": null,
    "startDate": "2016-03-31",
    "endDate": "2016-04-01",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Thu-Fri",
    "scheduleMaximum": 25,
    "scheduleAvailable": 9,
    "scheduleMinimum": 8,
    "status": "C",
    "notes": null,
    "tuition": 849,
    "location": {
      "id": "DCWASCAPGL",
      "name": "Graduate School at Capital Gallery",
      "address1": "L'Enfant Plaza Metro Stop",
      "address2": "600 Maryland Avenue, SW",
      "city": "Washington",
      "state": "DC",
      "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089002",
    "courseId": "cours000000000004381",
    "curricumTitle": "Federal Human Resources",
    "courseDomain": "domin000000000001085"
  },
  {
    "classNumber": "00085817",
    "segment": null,
    "startDate": "2016-01-20",
    "endDate": "2016-03-30",
    "startTime": "18:30",
    "endTime": "21:30",
    "days": "Wednesday",
    "scheduleMaximum": 20,
    "scheduleAvailable": 8,
    "scheduleMinimum": 6,
    "status": "C",
    "notes": null,
    "tuition": 365,
    "location": {
      "id": "37",
      "name": "Woodend Sanctuary",
      "address1": "Free parking",
      "address2": "8940 Jones Mill Road",
      "city": "Chevy Chase",
      "state": "MD"
    },
    "instructor": null,
    "offeringSessionId": "class000000000090712",
    "courseId": "cours000000000009869",
    "curricumTitle": "Communication and Professional Skills",
    "courseDomain": "domin000000000001089"
  },
  {
    "classNumber": "00086408",
    "segment": null,
    "startDate": "2017-05-08",
    "endDate": "2017-05-09",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Mon-Tue",
    "scheduleMaximum": 2400,
    "scheduleAvailable": 51,
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
    "offeringSessionId": "class000000000091171",
    "courseId": "cours000000000001652",
    "curricumTitle": "Program and Management Analysis",
    "courseDomain": "domin000000000001085"
  },
  {
    "classNumber": "600591",
    "segment": null,
    "startDate": "2016-04-06",
    "endDate": "2016-04-08",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Wed-Fri",
    "scheduleMaximum": 25,
    "scheduleAvailable": 8,
    "scheduleMinimum": 8,
    "status": "C",
    "notes": null,
    "tuition": 999,
    "location": {
      "id": "DCWASCAPGL",
      "name": "Graduate School at Capital Gallery",
      "address1": "L'Enfant Plaza Metro Stop",
      "address2": "600 Maryland Avenue, SW",
      "city": "Washington",
      "state": "DC",
      "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089082",
    "courseId": "cours000000000005061",
    "curricumTitle": "Communication and Professional Skills",
    "courseDomain": "domin000000000001085"
  },
  {
    "classNumber": "601052",
    "segment": null,
    "startDate": "2016-03-22",
    "endDate": "2016-03-25",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Tue-Fri",
    "scheduleMaximum": 30,
    "scheduleAvailable": 8,
    "scheduleMinimum": 8,
    "status": "C",
    "notes": null,
    "tuition": 899,
    "location": {
      "id": "DCWASCAPGL",
      "name": "Graduate School at Capital Gallery",
      "address1": "L'Enfant Plaza Metro Stop",
      "address2": "600 Maryland Avenue, SW",
      "city": "Washington",
      "state": "DC",
      "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089650",
    "courseId": "cours000000000009046",
    "curricumTitle": "Federal Human Resources",
    "courseDomain": "domin000000000001085"
  },
  {
    "classNumber": "600485",
    "segment": null,
    "startDate": "2016-04-18",
    "endDate": "2016-04-19",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Mon-Tue",
    "scheduleMaximum": 25,
    "scheduleAvailable": 9,
    "scheduleMinimum": 8,
    "status": "C",
    "notes": null,
    "tuition": 789,
    "location": {
      "id": "DCWASCAPGL",
      "name": "Graduate School at Capital Gallery",
      "address1": "L'Enfant Plaza Metro Stop",
      "address2": "600 Maryland Avenue, SW",
      "city": "Washington",
      "state": "DC",
      "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089526",
    "courseId": "cours000000000009637",
    "curricumTitle": "Federal Human Resources",
    "courseDomain": "domin000000000001085"
  },
  {
    "classNumber": "00086407",
    "segment": null,
    "startDate": "2017-05-01",
    "endDate": "2017-05-02",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Mon-Tue",
    "scheduleMaximum": 2400,
    "scheduleAvailable": 63,
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
    "curricumTitle": "Program and Management Analysis",
    "courseDomain": "domin000000000001085"
  },
  {
    "classNumber": "00086426",
    "segment": null,
    "startDate": "2016-03-16",
    "endDate": "2016-04-18",
    "startTime": "18:00",
    "endTime": "21:00",
    "days": "Wed/Mon 5 Weeks",
    "scheduleMaximum": 2500,
    "scheduleAvailable": 0,
    "scheduleMinimum": 6,
    "status": "C",
    "notes": null,
    "tuition": 405,
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
    "offeringSessionId": "class000000000091189",
    "courseId": "cours000000000007682",
    "curricumTitle": "Federal Financial Management",
    "courseDomain": "domin000000000001089"
  },
  {
    "classNumber": "600823",
    "segment": null,
    "startDate": "2016-04-19",
    "endDate": "2016-04-22",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Tue-Fri",
    "scheduleMaximum": 30,
    "scheduleAvailable": 15,
    "scheduleMinimum": 8,
    "status": "C",
    "notes": null,
    "tuition": 1449,
    "location": {
      "id": "DCWASCAPGL",
      "name": "Graduate School at Capital Gallery",
      "address1": "L'Enfant Plaza Metro Stop",
      "address2": "600 Maryland Avenue, SW",
      "city": "Washington",
      "state": "DC",
      "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089765",
    "courseId": "cours000000000003130",
    "curricumTitle": "Program and Management Analysis",
    "courseDomain": "domin000000000001085"
  },
  {
    "classNumber": "601145",
    "segment": null,
    "startDate": "2016-03-23",
    "endDate": "2016-03-24",
    "startTime": "08:30",
    "endTime": "16:00",
    "days": "Wed-Thu",
    "scheduleMaximum": 25,
    "scheduleAvailable": 9,
    "scheduleMinimum": 8,
    "status": "C",
    "notes": null,
    "tuition": 799,
    "location": {
      "id": "DCWASCAPGL",
      "name": "Graduate School at Capital Gallery",
      "address1": "L'Enfant Plaza Metro Stop",
      "address2": "600 Maryland Avenue, SW",
      "city": "Washington",
      "state": "DC",
      "postalCode": "20024"
    },
    "instructor": null,
    "offeringSessionId": "class000000000089739",
    "courseId": "cours000000000002657",
    "curricumTitle": "Communication and Professional Skills",
    "courseDomain": "domin000000000001085"
  }];

  return callback(null, sessions);

    // url for the API call
    // ifti var sessionUrl = config("properties").apiServer + '/api/courses/sessions?' + 'status'=sessiontStatus '&' + 'sessiondomain'=sessionDomain;
    // request({
    //   method: 'GET',
    //   url: sessionUrl,
    //   headers: {
    //     'Authorization': authToken
    //   }
    // }, function (error, response, body) {
    //   if (common.checkForErrorAndLog(error, response, sessionUrl)) {
    //     return callback(new Error("Exception occurred getting sessions " + sessionUrl), null);
    //   }
    //   return callback(null, JSON.parse(body));
    // });
  }
};
