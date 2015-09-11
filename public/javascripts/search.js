function performCourseSearch() {
    //TODO: error handling if no search criteria
    location.href = "/course-search?search=" + document.getElementById("searchCriteria").value;
}

// Retrieve Search criteria term that user has search for and prints it out on the title section
var App = {
  getSearchParamater: function() {
    var url = window.location.href;
    var regex = /=(.+)/;
    var matches = url.match(regex);
    if (matches) {
      var match = matches[1];
      $("#title").text("Results for ");
      $("#title").append(match);
      $("#results-for-alert").append(match);
      }
    }
}

$(document).ready(function(){
    App.getSearchParamater();

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
