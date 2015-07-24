var express = require('express');
var course = require("../../API/course.js");
var router = express.Router();

// Search for a course.  If there is only one exact match redirect to the course details page
//  otherwise show the search results page.
router.get('/course-search', function(req, res, next){
  var searchCriteria = req.query["search"];
  course.performCourseSearch(function(response, error, result){
    //TODO: how do we globally handle error's and send to an error page?
    if (result && result.exactMatch) {
      //redirect to course details
      console.log("Exact course match found for " + result.courses[0].courseId + " - Redirecting.")
      res.redirect('course-detail?courseId=' + result.courses[0].courseId);
    }
    else {
      //display course search page
      res.render('course_search', { title: 'Course Search', result: result });
    }
  }, searchCriteria);
});

// Get the course details page
router.get('/course-detail', function(req, res, next){
  var courseId = req.query["id"];
  console.log("Getting course details for course " + courseId);
  //TODO - make a call to get course details and pass it to the view
  res.render('course_detail', { title: 'Course Details', courseId : courseId });
});

module.exports = router;
