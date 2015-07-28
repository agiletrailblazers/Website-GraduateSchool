
var map;
mapApp = {
  start: function() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 8,
      center: {lat: -34.397, lng: 150.644}
    });
  }
} 


$(document).ready(function(){
  $('#map-canvas').hide();
  $('#close-map').hide();
  $('.glyphicon-map-marker').click(function(e) {
    e.preventDefault();
    $('#map-canvas').slideDown();
    mapApp.start();
    $('#close-map').show();
    google.maps.event.addListenerOnce(map, 'idle', function() {
       google.maps.event.trigger(map, 'resize');
    });
  });
  $('#close-map').click(function(e) {
    e.preventDefault();
    $('#map-canvas').slideUp();
  });
});
