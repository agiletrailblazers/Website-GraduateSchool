$(document).ready(function() {

  orderOptgroups();

  //Important to use live events since we dynamically update page content
  $(document).on('change', 'select.itemsPerPage, select#selLocation,select#categorySubject', function() {
    $('.itemsPerPage').val($(this).val());
    $('#txtPageCourse').val(1);
    $('#txtPageSite').val(1);
    reloadSearchResults();
  });

  $(document).on("click",".refine",function(event){
    $("#itemsPerPage").val("10");
    $("#selLocation").val("all");
    $("#categorySubject").val("all");
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
        + "&categorySubject=" + $("#categorySubject").val()
        + "&selectedG2G=" + $('#G2G').prop('checked')
        + "&page-course=" + $('#txtPageCourse').val()
        + "&page-site=" + $('#txtPageSite').val().trim()
        + "&tab=" + $('#txtSelectedTab').val();
    history.pushState({state:1}, "", "?" + urlParams);
    return urlParams;
  }

  function reloadSearchResults() {
    $(".loading").show();
    $("#title").text("Results for " + $("#txtSearchCriteria").val());
    var urlParams = pushBrowserHistory();
    $.get("/search?partial=true&" + urlParams)
    .done(function(data) {
      $("#searchResults").replaceWith(data);
      $(".loading").hide();
    })
    .fail(function(xhr, textStatus, errorThrown) {
      $(".loading").hide();
      $("#searchResults").replaceWith('<div id="searchResults" class="col-lg-9 col-md-9 col-sm-8"><div id="alertError" class="alert alert-danger" role="alert">Search currently unavailable. Please try again.</div></div>');
    });
  }

  function orderOptgroups() {
    $("#categorySubject").each(function() {
      var $select = $(this);
      var $groups = $select.find("optgroup ");
      $groups.remove();
      $groups = $groups.sort(function(g1, g2) {
        return g1.label.localeCompare(g2.label);
      });
      $select.append($groups);
      $groups.each(function() {
        var $group = $(this);
        var options = $group.find("option");
        options.remove();
        options = options.sort(function(a, b) {
          return a.innerHTML.localeCompare(b.innerHTML);
        });
        $group.append(options);
      });
    });
  }

});
