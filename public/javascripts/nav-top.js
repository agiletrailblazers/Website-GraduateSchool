$(document).ready(function() {

  $('#backTop').backTop({
    'position' : 100,
    'speed' : 1000,
    'color' : 'black',
  });
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
$(document).ready(function() {
  $('#close-button').click(function() {
      $('#close-button').fadeOut();
  });
  $('.toggle').click(function() {
    $('#close-button').fadeIn();
  });

  $('#nav-menu-contact-us-link').click(function(e) {
    var map, geocoder;
    var marker;
    mapApp = {
      start: function() {
        map = new google.maps.Map(document.getElementById('map-canvas-nav'), {
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

    var cityStateNav = $('#addressCityNav').data('city');
    mapApp.start();
    var addressNav = $('#addressCityNav').data('address');
    var destinationNav = addressNav.replace(/ /g, '+');
    var directionsUrlNav = "http://maps.google.com?saddr=Current+Location&daddr=" + destinationNav + "";
    google.maps.event.addListenerOnce(map, 'idle', function() {
      google.maps.event.trigger(map, 'resize');
      if (marker != null) {
        map.setCenter(marker.getPosition());
      }
    });
    mapApp.codeAddress(addressNav);
    $("#getDirectionsNav").attr("href", directionsUrlNav);
  });
});


$(document).ready(function() {
  //Controls plus-minus sign on top nav on mobile
  $('.collapse').on('shown.bs.collapse', function() {
    $(this).parent().find(".glyphicon-plus-sign").removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
  }).on('hidden.bs.collapse', function() {
    $(this).parent().find(".glyphicon-minus-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
  });
  $("#footer-map").click(function(e) {
    e.preventDefault();
    window.location="/content/location/washington-dc#section-3";
  })
});


$(document).mouseup(function(e) {
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
