var map, geocoder;
mapApp = {
  start: function() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 15,
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
        $("#mapModalLabel").append('<div id="mapAlert" class="alert alert-danger" style="display:none;"> Sorry, unable to find address. Error: ' + status + '</div>').slideDown();
      }
    });
  }
}

tableApp = {
  limitTable: function() {
    courseSessionLength = $("#courseSessionTable").data('totaltr');
    x = 10;
    $('.courseDetailSessionRow:lt(' + x + ')').show();
    $('#loadMore').click(function() {
      x = (x + 5 <= courseSessionLength) ? x + 5 : courseSessionLength;
      $('.courseDetailSessionRow:lt(' + x + ')').show();
      $('#showLess').show();
      if (x == courseSessionLength) {
        $('#loadMore').hide();
      }
    });
    $('#showLess').click(function() {
      x = (x - 5 < 0) ? 3 : x - 5;
      $('.courseDetailSessionRow').not(':lt(' + x + ')').hide();
      $('#loadMore').show();
      $('#showLess').show();
      if (x == 3) {
        $('#showLess').hide();
      }
    });
  }
}

$(document).ready(function() {
  $(".courseDetailSessionRow").hide();
  tableApp.limitTable();
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
    $("#modalSessionLocationSpan, #mapAlert").remove();
  });
});
