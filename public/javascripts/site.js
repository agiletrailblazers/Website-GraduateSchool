//Navigation: Desktop
$(document).on('click', '.gs .dropdown-menu', function(e) {
  e.stopPropagation()
});


//Navigation: Mobile
	$(function() {
		$('#dl-menu').dlmenu();
	});


//Print
$(document).ready(function() {
  $("#printPage").click(function(e) {
    window.print();
    return false;
  });
  $("#emailPage").click(function(e) {
    document.location.href = $('#emailPage').data('href') + encodeURIComponent(document.location.href);
    return false;
  });
});

//Slider
  $(document).ready(function() {
  		 $("#myCarousel").swiperight(function() {
    		  $(this).carousel('prev');
	    		});
		   $("#myCarousel").swipeleft(function() {
		      $(this).carousel('next');
	   });

	});

//Displays contact us menu on click
$(document).ready(function(){
  $('#contact-us').click(function() {
      $('#contact-us-top-menu').toggle();
  });
});

$(document).mouseup(function(e)
{
    var container = $("#contact-us-top-menu");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $('#contact-us-top-menu').fadeOut('medium');
    }
});
