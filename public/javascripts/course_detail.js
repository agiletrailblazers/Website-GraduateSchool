
var map;
mapApp = {
  start: function() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 8,
      center: {lat: 38.8859870, lng: -77.0212}
    });
  }
} 
$(document).ready(function(){
  $('#map-canvas').hide();
  $('#close-map').hide();
  $('.glyphicon-map-marker').click(function(e) {
    e.preventDefault();
    $('#map-canvas').slideDown();
    $('#close-map').show();
    mapApp.start();
    google.maps.event.addListenerOnce(map, 'idle', function() {
       google.maps.event.trigger(map, 'resize');
    });
  });
  $('#close-map').click(function(e) {
    e.preventDefault();
    $('#map-canvas').slideUp();
  });
});
