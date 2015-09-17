$(document).ready(function() {

  //Important to use live events since we dynamically update page content
  $(document).on('change', 'select#itemsPerPage, select#selLocation', function() {
    $('#txtCurrentPage').val(1);
    reloadSearchResults();
  });

  $(document).on("click",".refine",function(event){
    $("#itemsPerPage").val("10");
    $("#selLocation").val("all");
    $('#G2G').prop('checked', false);
    $('#txtCurrentPage').val(1);
    $("#txtSearchCriteria").val("");
    reloadSearchResults();
  });

  $(document).on("click","#clearLocation",function(event){
    $("#selLocation").val("all");
    $('#txtCurrentPage').val(1);
    reloadSearchResults();
  });

  $(document).on("click","#clearKeyword",function(event){
    $("#txtSearchCriteria").val("");
    $('#txtCurrentPage').val(1);
    $('#G2G').prop('checked', false);
    reloadSearchResults();
  });

  $(document).on("click","#G2G",function(event){
    $('#txtCurrentPage').val(1);
    reloadSearchResults();
  });

  $(document).on("keydown","#txtSearchCriteria",function(event){
    if(event.which == 13) {
      $('#txtCurrentPage').val(1);
      $('#G2G').prop('checked', false);
      reloadSearchResults();
    }
  });

  $(document).on("click","#btnSearchCriteria",function(event){
      $('#txtCurrentPage').val(1);
      $('#G2G').prop('checked', false);
      reloadSearchResults();
  });

  $(document).on("click",".pagination a",function(event){
    $('#txtCurrentPage').val($(this).attr("name"));
    reloadSearchResults();
  });

  function reloadSearchResults() {
    $(".loading").show();
    $("#title").text("Results for " + $("#txtSearchCriteria").val());
    var urlParams = "search=" + $("#txtSearchCriteria").val()
        + "&numRequested=" + $("#itemsPerPage").val()
        + "&cityState=" + $("#selLocation").val()
        + "&selectedG2G=" + $('#G2G').prop('checked')
        + "&page=" + $('#txtCurrentPage').val();
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
