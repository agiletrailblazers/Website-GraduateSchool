$(document).ready(function() {

  //Important to use live events since we dynamically update page content
  $(document).on('change', 'select#itemsPerPage, select#selLocation', function() {
      reloadSearchResults();
  });

  $(document).on("click",".refine",function(event){
    $("#itemsPerPage").val("100");
    $("#selLocation").val("all");
    $('#G2G').prop('checked', false);
    reloadSearchResults();
  });

  $(document).on("click","#clearLocation",function(event){
    $("#selLocation").val("all");
    reloadSearchResults();
  });

  $(document).on("click",".pagination a, #G2G",function(event){
    reloadSearchResults($(this).attr("name"));
  });

  function reloadSearchResults() {
    $(".loading").show();
    var urlParams = "search=" + $("#txtSearchCriteria").val()
        + "&numRequested=" + $("#itemsPerPage").val()
        + "&cityState=" + $("#selLocation").val()
        + "&selectedG2G=" + $('#G2G').prop('checked');
    history.pushState({state:1}, "", "?" + urlParams);
    $.get("/course-search?partial=true&" + urlParams)
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
