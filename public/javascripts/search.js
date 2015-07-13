function performCourseSearch() {
  //TODO: error handling if no search criteria
  location.href = "course-search?search=" + document.getElementById("searchCriteria").value;
}
