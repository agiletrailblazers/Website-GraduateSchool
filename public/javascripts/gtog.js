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
    $("#modalSessionLocationSpan").text(cityState);
    var courseTitle = $(this).data('course');
    $("#modalCourseTitleSpan").text(courseTitle);
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

  $("#gtog0, #gtog1, #gtog2, #gtog3, #gtog4, #gtog5, #gtog6").tablesorter();

});
