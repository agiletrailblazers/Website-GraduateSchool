function performCourseSearch() {
  if ($("#searchCriteria").val().trim().length >= 1) {
    location.href = "/search?search=" + $("#searchCriteria").val().trim();
  }
}

$(document).on('change', '#selSearchLocation', function() {
  location.href = "/search?search=" + $("#searchCriteria").val().trim() + "&cityState=" + $("#selSearchLocation").val();
});

// control collapse/expand function for Refine results -  mobile vs desktop
$(document).ready(function(){
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


//Displays search box and advanced filter on click.
$(document).ready(function(){
  $('#searchGroup').focusin(function() {
      $('#advancedSearchBox').fadeIn();
  });
  $('#searchGroup').mouseenter(function() {
      $('#advancedSearchBox').fadeIn();
  });
  $("div.searchBox").mouseleave(function() {
    $('#advancedSearchBox').fadeOut('medium');
  });
});
