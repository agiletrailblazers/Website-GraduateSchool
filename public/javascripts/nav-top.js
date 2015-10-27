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
        $("html, body").scrollTop(0);

      }
    );
  });
});


//Hide/Show close button while animating.
$(document).ready(function(){
  $('#close-button').click(function() {
      $('#close-button').fadeOut();
  });
  $('.toggle').click(function() {
    $('#close-button').fadeIn();
  });
});

$(document).ready(function(){
  //Controls plus-minus sign on top nav on mobile
  $('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-plus-sign").removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
  }).on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-minus-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
  });
});


$(document).mouseup(function(e)
{
    var container = $("#top-menu");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0  //  nor a descendant of the container
        && $('.npanel').css('display') != 'none') // nor npanel is hidden
    {
        $('#close-button').fadeOut();
        $('.npanel').slideUp();
        $("html, body").animate({ scrollTop: 0 }, "slow");

    }
});
