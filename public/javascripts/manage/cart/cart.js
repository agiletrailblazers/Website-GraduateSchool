var map, geocoder;
var marker;
mapApp = {
    start: function() {
        map = new google.maps.Map(document.getElementById('manage-map-canvas'), {
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

function showCourseDetails() {
    $('#courseDetails').fadeIn("slow","swing");
}

function hideCourseDetails() {
    $('#courseDetails').fadeOut("slow","swing");
}

$(document).ready(function () {
    $("#gs-alert-remove").css('cursor', 'pointer');
    $("#gs-alert-remove").click(function () {
        $("#gs-alert-error").slideUp();
        $("#gs-alert-error p").remove();
    });
    $('#details').click(function() {
        showCourseDetails();
    });
    $('#hide-course-details').click(function() {
        hideCourseDetails();
    });

    $('.glyphicon-map-marker').click(function(e) {
        e.preventDefault();
        var cityState = $(this).data('city');
        $("#modalSessionLocationSpan").text(cityState);
        mapApp.start();
        var address = $(this).data('address');
        var destination = address.replace(/ /g, '+');
        var directionsUrl = "http://maps.google.com?saddr=Current+Location&daddr=" + destination + "";
        $("#manage-map-address").html(address);
        google.maps.event.addListenerOnce(map, 'idle', function() {
            google.maps.event.trigger(map, 'resize');
            if (marker != null) {
                map.setCenter(marker.getPosition());
            }
        });

        mapApp.codeAddress(address);
        $("#getDirections").attr("href", directionsUrl);
    });
});