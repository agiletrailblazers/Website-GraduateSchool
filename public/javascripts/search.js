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

//Displays search box and advanced filter on focus/mouse enter.
$(document).ready(function(){
  $('#searchGroup').focusin(function() {
      $('#advancedSearchBox').fadeIn();
  });
  $('#searchGroup').mouseenter(function() {
      $('#advancedSearchBox').fadeIn();
  });;
});

//Hide advanced filter on click outside of the Search Box area and their descendents.
$(document).mouseup(function (e)
{
    var container = $(".searchBox");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $('#advancedSearchBox').fadeOut('medium');
    }
});
