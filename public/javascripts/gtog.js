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
        console.log('good');
      } else {
        $("#mapModalLabel").append('<div id="mapAlert" class="alert alert-danger" style="display:none;"> Sorry, unable to find address. Error: ' + status + '</div>').slideDown();
      }
    });
  }
}

$(document).ready(function() {
  var $height = 0 ;
  $("li.tab").each(function(){
    if(($(this).height())>$height){
            $height = $(this).height();
    }
  });
  $("li.tab").each(function(){
    $(this).css("height",$height)
  });
  $('.glyphicon-map-marker').click(function(e) {
    e.preventDefault();
    var cityState = $(this).data('city');
    console.log('city is ' + cityState);
    $("#modalSessionLocationSpan").text(cityState);
    mapApp.start();
    var address = $(this).data('address');
    console.log('address is ' + address);
    var destination = address.replace(/ /g, '+');
    var directionsUrl = "http://maps.google.com?saddr=Current+Location&daddr=" + destination + "";
    $("#map-address").html(address);
    google.maps.event.addListenerOnce(map, 'idle', function() {
      google.maps.event.trigger(map, 'resize');
      if (marker != null) {
        console.log('set marker');
        map.setCenter(marker.getPosition());
      }
    });

    mapApp.codeAddress(address);
    $("#getDirections").attr("href", directionsUrl);
  });
});
