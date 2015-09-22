function performCourseSearch() {
  if ($("#searchCriteria").val().trim().length >= 3) {
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

// advanced search > display locations dropdown on search focus
$(document).ready(function(){
$('#searchCriteria').focus(function() {
    $('div.locations').show();
    $(document).bind('focusin.locations click.locations',function(e) {
        if ($(e.target).closest('.locations, #searchCriteria').length) return;
        $(document).unbind('.locations');
        $('div.locations').fadeOut('medium');
    });
});
$('div.locations').hide();
});
