$(document).ready(function() {

  //Important to use live events since we dynamically update page content
  $(document).on('change', 'select#itemsPerPage, select#selLocation', function() {
      reloadSearchResults();
  });

  $(".refine").click(function() {
    $("#itemsPerPage").val("100");
    $("#selLocation").val("all");
    $('#G2G').prop('checked', false);
    reloadSearchResults();
  });

   $('#G2G').click(function() {
     reloadSearchResults();
    });

  $("#clearLocation").click(function() {
    $("#selLocation").val("all");
    reloadSearchResults();
  });

  function reloadSearchResults() {
    $(".loading").show();
    $.get("/course-search?partial=true&search=" + $("#txtSearchCriteria").val()
        + "&numRequested=" + $("#itemsPerPage").val()
        + "&cityState=" + $("#selLocation").val()
        + "&selectedG2G=" + $('#G2G').prop('checked') )
    .done(function(data) {
      $("#searchResults").replaceWith(data);
      $(".loading").hide();
    })
    .fail(function(xhr, textStatus, errorThrown) {
      $(".loading").hide();
      $("#searchResults").replaceWith('<div id="searchResults" class="col-lg-9 col-md-9 col-sm-8"><div id="alertError" class="alert alert-danger" role="alert">Search currently unavailable. Please try again.</div></div>');
    });
  }

});
