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
  limitTable: function(limit) {
    $(".courseDetailSessionRow, #loadMore, #showLess").hide();
    courseSessionLength = $("#courseSessionTable").data('totaltr');
    $('.courseDetailSessionRow:lt(' + limit + ')').show();
    if(courseSessionLength > limit) {
      $("#loadMore").show();
    }
  },
  showAll: function() {
    $(".courseDetailSessionRow").fadeIn();
    $("#loadMore").fadeOut();
    $("#showLess").fadeIn();
  },
  hideAll: function() {
    $("#loadMore").fadeIn();
    $("#showLess").fadeOut();
  }
}

tablemobApp = {
  limitSessions: function(limit) {
    $(".mob-courseDetailSessionRow, #mob-loadMore, #mob-showLess").hide();
    courseSessionLength = $("#mob-courseSessionTable").data('totaltr');
    $('.mob-courseDetailSessionRow:lt(' + limit + ')').show();
    if(courseSessionLength > limit) {
      $("#mob-showAll").show();
    }
    $('#mob-showAll').click(function() {
      $('.mob-courseDetailSessionRow').show();
      $('#mob-showLess').show();
      $('#mob-showAll').hide();
    });
    $('#mob-showLess').click(function() {
      $('.mob-courseDetailSessionRow').not(':lt(' + limit + ')').hide();
      $('#mob-showAll').show();
      $('#mob-showLess').hide();
    });
  }
}

$(document).ready(function() {
  tableApp.limit = 10;
  tableApp.limitTable(tableApp.limit);
  $("#loadMore").click(function(e) {
    e.preventDefault();
    tableApp.showAll();
  });
  $("#showLess").click(function(e) {
    e.preventDefault();
    $('.courseDetailSessionRow:gt(' + (tableApp.limit - 1) + ')').fadeOut();
    tableApp.hideAll();
  });

  tablemobApp.limitSessions(5);
  $('.glyphicon-map-marker').click(function(e) {
    e.preventDefault();
    var cityState = $(this).data('city');
    $("#mapModalLabel").append('<span id="modalSessionLocationSpan">' + cityState + '</span>');
    mapApp.start();
    var address = $(this).data('address');
    var destination = address.replace(/ /g, '+');
    var directionsUrl = "http://maps.google.com?saddr=Current+Location&daddr=" + destination + "";
    $("#map-address").html(address);
    google.maps.event.addListenerOnce(map, 'idle', function() {
      google.maps.event.trigger(map, 'resize');
    });
    $("#mapModal").on("shown.bs.modal", function() {
      mapApp.codeAddress(address);
      $("#getDirections").attr("href", directionsUrl);
      google.maps.event.trigger(map, "resize");
    });
  });
  $('#mapModal').on('hidden.bs.modal', function() {
    $("#modalSessionLocationSpan, #mapAlert").remove();
  });

  $(".sessionExpand").eq(0).removeClass('collapsed');

  $(function () {
      $('#accordion2').on('shown.bs.collapse', function (e) {
          var offset = $(this).find('.collapse.in').prev('.panel-heading');
          if(offset) {
              $('html,body').animate({
                  scrollTop: $(offset).offset().top
              }, 777);
          }
      });
  });
});
