var express = require('express');
var contentful = require("../API/contentful.js");
var course = require("../API/course.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Graduate School', name: 'Home Page'});
});

// Get What's new page.
router.get('/whats-new', function(req, res, next) {
  contentful.getWhatsNew(function(response) {
    res.render('whats_new', { entry: response.cmsEntry.fields });
  });
});

// Search for a course.  If there is only one exact match redirect to the course details page
//  otherwise show the search results page.
router.get('/course-search', function(req, res, next){
  var searchCriteria = req.query["search"];
  course.performCourseSearch(function(response){
    if (entry.exactMatch) {
      //redirect to course details
      console.log("Exact course match found for " + entry.courses[0].courseId + " - Redirecting.")
      res.redirect('course-detail?courseId=' + entry.courses[0].courseId);
    }
    else {
      //display course search page
      res.render('course_search', { title: 'Course Search', entry: entry });
    }
  }, searchCriteria);
});

// Get the course details page
router.get('/course-detail', function(req, res, next){
  var courseId = req.query["courseId"];
  console.log("Getting course details for course " + courseId);
  //TODO - make a call to get course details and pass it to the view
  res.render('course_detail', { title: 'Course Details', courseId : courseId });
});

module.exports = router;
