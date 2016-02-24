$(document).ready(function() {

  //Important to use live events since we dynamically update page content
  $(document).on('change', 'select.itemsPerPage, select#selLocation, select#categorySubject, select#deliveryMethod', function() {
    $('.itemsPerPage').val($(this).val());
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    reloadSearchResults();
  });

  $(document).on("click",".refine, .refine-mobile",function(event){
    $("#itemsPerPage").val("10");
    $("#selLocation").val("all");
    $("#categorySubject").val("all");
    $("#deliveryMethod").val("all");
    $('#G2G').prop('checked', false);
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    $("#txtSearchCriteria").val("");
    reloadSearchResults();
  });

  $(document).on("click","#clearLocation",function(event){
    $("#selLocation").val("all");
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    reloadSearchResults();
  });

  $(document).on("click","#clearCategoriesSubject",function(event){
    $("#categorySubject").val("all");
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    reloadSearchResults();
  });
  $(document).on("click","#clearDeliveryMethod",function(event){
    $("#deliveryMethod").val("all");
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    reloadSearchResults();
  });
  $(document).on("click","#clearKeyword",function(event){
    $("#txtSearchCriteria").val("");
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    $('#G2G').prop('checked', false);
    reloadSearchResults();
  });

  $(document).on("click","#G2G",function(event){
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    reloadSearchResults();
  });

  $(document).on("keydown","#txtSearchCriteria",function(event){
    if(event.which == 13) {
      $('#txtPageCourse').val(1);
      $('#txtPageSite').val(1);
      $('#G2G').prop('checked', false);
      reloadSearchResults();
    }
  });

  $(document).on("click","#btnSearchCriteria",function(event){
      $('#txtPageCourse').val(1);
      $('#txtPageSite').val(1);
      $('#G2G').prop('checked', false);
      reloadSearchResults();
  });

  $(document).on("click",".pagination a",function(event){
    var tab = $('#txtSelectedTab').val();
    if (tab == 'course') {
      $('#txtPageCourse').val($(this).attr("name"));
    }
    else if (tab == 'site') {
      $('#txtPageSite').val($(this).attr("name"));
    }
    reloadSearchResults();
  });

  $(document).on("click",".nav-tabs a",function(event){
    var tab = $(this).attr("data-tab");
    $('#txtSelectedTab').val(tab);
    $("span[data-showfor~='" + tab + "']").removeClass('hidden');
    $("span[data-hidefor~='" + tab + "']").addClass('hidden');
    pushBrowserHistory();
  });

  function pushBrowserHistory() {
    var urlParams = "search=" + $("#txtSearchCriteria").val()
        + "&numRequested=" + $(".itemsPerPage").val()
        + "&cityState=" + $("#selLocation").val()
        + "&categorySubjectType=" + $('#categorySubject').find(":selected").attr('data-optionType')
        + "&categorySubject=" + $("#categorySubject").val()
        + "&deliveryMethod=" + $("#deliveryMethod").val()
        + "&selectedG2G=" + $('#G2G').prop('checked')
        + "&page-course=" + $('#txtPageCourse').val()
        + "&page-site=" + $('#txtPageSite').val().trim()
        + "&tab=" + $('#txtSelectedTab').val();
    history.pushState({state:1}, "", "?" + urlParams);
    return urlParams;
  }

  function isNotEmpty(val) {
    if (val != '' && val != null && typeof(val) != 'undefined') {
      return true;
    }
    return false;
  };

  function reloadSearchResults() {
    $(".loading").show();

    var topTitle = "Search Results";
    if (isNotEmpty($("#txtSearchCriteria").val()) && $("#txtSearchCriteria").val() != '') {
      topTitle = "Results for " + $("#txtSearchCriteria").val();
    } else if (isNotEmpty($('#G2G').prop('checked')) && $('#G2G').prop('checked') == true) {
      topTitle = "Results for " + 'Guaranteed To Go';
    } else if (isNotEmpty($("#categorySubject").val()) && $("#categorySubject").val() != 'all') {
      var subject = ($("#categorySubject").val()).split('~');
      topTitle = "Results for " + subject[0];
    } else if (isNotEmpty($("#selLocation").val()) && $("#selLocation").val() != 'all'){
      topTitle = "Results for " + $("#selLocation").val();
    } else if (isNotEmpty($("#deliveryMethod").val() && $("#deliveryMethod").val() != 'all')) {
      topTitle = "Results for " + $("#deliveryMethod").val();
    }

    $("#title").text(topTitle);
    var urlParams = pushBrowserHistory();
    $.get("/search?partial=true&" + urlParams)
    .done(function(data) {
      $("#searchResults").replaceWith(data);
      $(".loading").hide();
      if ($(window).width() < 767) {
        $('#refine-results').removeClass('in');
        $('#refine-results').addClass('out');
        $('#collapseLink').addClass('collapsed')
      }
    })
    .fail(function(xhr, textStatus, errorThrown) {
      $(".loading").hide();
      $("#searchResults").replaceWith('<div id="searchResults" class="col-lg-9 col-md-9 col-sm-8"><div id="alertError" class="alert alert-danger" role="alert">Search currently unavailable. Please try again.</div></div>');
    });
  }
});
