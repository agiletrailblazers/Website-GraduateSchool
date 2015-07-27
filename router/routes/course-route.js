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
      console.log("Exact course match found for " + result.courses[0].id + " - Redirecting.")
      // res.redirect('course-detail?courseId=' + result.courses[0].id);
      res.redirect('courses/' + result.courses[0].id);
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

// Get course details based off course code.
router.get('/courses/:course_id', function(req, res, next){
  var courseId = req.params.course_id;
  course.performExactCourseSearch(function(response, error, result) {
    if (result) {
      console.log(result);
      res.render('course_detail', { title: "Title", courseTitle: result.title,
                  courseId: result.id, courseCode: result.code, courseType: result.type,
                  courseDescription: result.description, courseCredit: result.credit,
                  courseLength: result.length.value, courseInterval: result.length.interval,
                  courseSchedule: result.schedule });
    } else {
      // Render a 404 page.
    }
  }, courseId);
});
module.exports = router;
