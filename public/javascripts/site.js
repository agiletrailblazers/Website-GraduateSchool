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
  $('[data-toggle="tooltip"]').tooltip();
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

// google maps
var map, geocoder;
var marker;
mapApp = {
    start: function() {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 15,
        });
        geocoder = new google.maps.Geocoder();
        marker = null;
    },
    codeAddress: function(address) {
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                $("#mapModalLabel").append('<div id="mapAlert" class="alert alert-danger" style="display:none;"> Sorry, unable to find address. Error: ' + status + '</div>').slideDown();
            }
        });
    }
}

$(document).ready(function () {
    $('.glyphicon-map-marker').click(function(e) {
        e.preventDefault();
        var cityState = $(this).data('city');
        $("#modalSessionLocationSpan").text(cityState);
        mapApp.start();
        var address = $(this).data('address');
        var destination = address.replace(/ /g, '+');
        var directionsUrl = "http://maps.google.com?saddr=Current+Location&daddr=" + destination + "";
        $("#map-address").html(address);
        google.maps.event.addListenerOnce(map, 'idle', function() {
            google.maps.event.trigger(map, 'resize');
            if (marker != null) {
                map.setCenter(marker.getPosition());
            }
        });

        mapApp.codeAddress(address);
        $("#getDirections").attr("href", directionsUrl);
    });
});
