$(document).ready(function() {
  $('.nav-toggle').click(function() {
    // If menu is closed, toggle to selected tab
    if($('.npanel').css('display') === 'none') {
      var tab = $(this).data('tab');
      $("#" + tab).trigger('click');
    }
    $('.npanel').slideToggle('5000', "swing",
      // Animation complete.
      function() {
        $('.toggle').toggleClass('hide-panel');
      }
    );
  });
});
