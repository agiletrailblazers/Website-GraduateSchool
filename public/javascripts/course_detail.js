var map;
var geocoder;
mapApp = {
  start: function() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 8,
      center: {
        lat: 38.8859870,
        lng: -77.0212
      }
    });
  },
  codeAddress: function(address) {
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
}
$(document).ready(function() {
  $('#map-canvas').hide();
  $('#close-map').hide();
  $('.glyphicon-map-marker').click(function(e) {
    e.preventDefault();
    mapApp.start();
    var address = $(this).data('address');
    google.maps.event.addListenerOnce(map, 'idle', function() {
      google.maps.event.trigger(map, 'resize');
    });
    // mapApp.codeAddress(address);
    $("#myModal").on("shown.bs.modal", function() {
      google.maps.event.trigger(map, "resize");
    });
  });
});
