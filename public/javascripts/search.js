function performCourseSearch() {
  //TODO: error handling if no search criteria
  location.href = "/course-search?search=" + document.getElementById("searchCriteria").value;
}

$(document).ready(function(){
  $("#searchWarn").hide();
  // Validating search on front-end.
  $("#course-search-button").click(function(e){
    e.preventDefault();
    var searchInput = $("#searchCriteria").val();
    if (searchInput.length < 3) {
      $("#searchWarn").show();
    } else {
      performCourseSearch();
    }
  });
});
