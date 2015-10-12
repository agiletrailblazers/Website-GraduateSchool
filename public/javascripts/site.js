$(document).ready(function() {
  $("#printPage").click(function(e) {
    window.print();
    return false;
  });
  $("#emailPage").click(function(e) {
    document.location.href = $('#emailPage').data('href') + encodeURIComponent(document.location.href);
    return false;
  });

});
