function performCourseSearch() {
    //TODO: error handling if no search criteria
    location.href = "/course-search?search=" + document.getElementById("searchCriteria").value;
}

$(document).ready(function(){

// control collapse/expand function for Refine results -  mobile vs desktop
  $(window).bind('resize load', function() {
      if ($(this).width() < 767) {
          $('#refine-results').removeClass('in');
          $('#refine-results').addClass('out');
      } else {
          $('#refine-results').removeClass('out');
          $('#refine-results').addClass('in');
      }
  });

});
