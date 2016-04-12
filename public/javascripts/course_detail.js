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
    $(".mob-courseDetailSessionRow, #mob-showAll, #mob-showLess").hide();
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
      $('#mob-showLess').fadeOut();
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
    $("#session1").removeAttr('style');
  }
}

$(document).ready(function() {
  tableApp.limit = 5;
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
  //Scrolls to the title of page on ShowLess click for desktop version (height: 230px)
  $('#showLess').click(function() {
      $("html, body").delay(400).animate({ scrollTop: 230 }, "slow");
  });
  $('#mob-showLess').click(function() {
      $("html, body").delay(400).animate({ scrollTop: 490 }, "slow");
  });

  tablemobApp.limitSessions(5);
  tablemobApp.initialMobileDetailExpand();
});
