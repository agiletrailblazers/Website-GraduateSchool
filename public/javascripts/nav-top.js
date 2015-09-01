$(document).ready(function() {
  $('.toggle').click(function() {
    $('.npanel').slideToggle('5000', "swing",
      // Animation complete.
      function() {
        $('.toggle').toggleClass('hide-panel');
      }
    );
  });
});
