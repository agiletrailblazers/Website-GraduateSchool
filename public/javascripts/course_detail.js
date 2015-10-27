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
    var filteredList = $('.courseDetailSessionRow[data-rowhide="false"]:lt(' + limit + ')');
    filteredList.show();
    $('#currentCount').text(filteredList.length);
    if(courseSessionLength > limit || courseSessionLength > filteredList.length) {
      $("#loadMore").show();
    }
  },
  showAll: function(limit) {
    var unfilteredList = $(".courseDetailSessionRow");
    unfilteredList.fadeIn();
    $('#currentCount').text(unfilteredList.length);
    $("#loadMore").fadeOut();
    if (unfilteredList.length > limit) {
      $("#showLess").fadeIn();
    }
  },
  hideAll: function(limit) {
    $("#loadMore").fadeIn();
    $("#showLess").fadeOut();
  }
}

tablemobApp = {
  limitSessions: function(limit) {
    $(".mob-courseDetailSessionRow, #mob-loadMore, #mob-showLess").hide();
    courseSessionLength = $("#mob-courseSessionTable").data('totaltr');
    var filteredList = $('.mob-courseDetailSessionRow[data-rowhide="false"]:lt(' + limit + ')');
    filteredList.show();
    $('#mCurrentCount').text(filteredList.length);
    if(courseSessionLength > limit || courseSessionLength > filteredList.length) {
      $("#mob-showAll").show();
    }
    $('#mob-showAll').click(function() {
      var unfilteredList = $('.mob-courseDetailSessionRow');
      unfilteredList.show();
      $('#mCurrentCount').text(unfilteredList.length);
      $('#mob-showAll').hide();
      if (unfilteredList.length > limit) {
        $('#mob-showLess').show();
      }
      tablemobApp.mobileDetaillExpandReset();
    });
    $('#mob-showLess').click(function() {
      $('.mob-courseDetailSessionRow').not(':lt(' + limit + ')').hide();
      $('#mCurrentCount').text($('.mob-courseDetailSessionRow:lt(' + limit + ')').length);
      $('#mob-showAll').show();
      $('#mob-showLess').hide();
      tablemobApp.mobileDetaillExpandReset();
    });
  },
  initialMobileDetailExpand: function() {
    //expand the first non-hidden section
    $(".sessionExpand[data-rowhide='false']").eq(0).removeClass('collapsed');
    $(".mySession[data-rowhide='false']").eq(0).addClass("in");
  },
  mobileDetaillExpandReset: function() {
    //collapse all sections
    $(".sessionExpand").addClass('collapsed');
    $(".mySession").removeClass("in");
    //now expand only the first section
    $(".sessionExpand").eq(0).removeClass('collapsed');
    $(".mySession").eq(0).addClass("in");
  }
}

$(document).ready(function() {
  tableApp.limit = 10;
  tableApp.limitTable(tableApp.limit);
  $("#loadMore").click(function(e) {
    e.preventDefault();
    tableApp.showAll(tableApp.limit);
  });
  $("#showLess").click(function(e) {
    e.preventDefault();
    $('.courseDetailSessionRow:gt(' + (tableApp.limit - 1) + ')').fadeOut();
    $('#currentCount').text($('.courseDetailSessionRow:lt(' + tableApp.limit + ')').length);
    tableApp.hideAll(tableApp.limit);
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
  tablemobApp.initialMobileDetailExpand();

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
