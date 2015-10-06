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
  //removes navbar-fixed-top class on resolutions < 768
  function checkWindowSize() {
      if ( $(window).width() < 768) {
          $('div').removeClass('navbar-fixed-top');
          }
      }
  checkWindowSize();

  //add/remove class for fixed top nav bar based on resized resolution
  $(function(){
  $(window).bind("resize",function(){
      if($(this).width() <768){
      $('#top-menu').removeClass('navbar-fixed-top');
    } else {
      $('#top-menu').addClass('navbar-fixed-top');
    }
  });
  });

});
