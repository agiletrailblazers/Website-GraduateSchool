var map, geocoder;
mapApp = {
  start: function() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 15,
      center: {
        lat: 38.8859870,
        lng: -77.0212
      }
    });
    geocoder = new google.maps.Geocoder();
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
  $('.glyphicon-map-marker').click(function(e) {
    e.preventDefault();
    var cityState = $(this).data('city');
    $("#mapModalLabel").append('<span id="modalSessionLocationSpan">' + cityState + '</span>');
    mapApp.start();
    var address = $(this).data('address');
    google.maps.event.addListenerOnce(map, 'idle', function() {
      google.maps.event.trigger(map, 'resize');
    });
    $("#mapModal").on("shown.bs.modal", function() {
      mapApp.codeAddress(address);
      google.maps.event.trigger(map, "resize");
    });
  });
  $('#mapModal').on('hidden.bs.modal', function() {
    $('#modalSessionLocationSpan').remove();
  });
});
