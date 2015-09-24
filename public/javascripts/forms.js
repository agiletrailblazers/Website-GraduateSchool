$(document).ready(function() {
  $('ul#filterForms li').click(function(e) {
    e.preventDefault();
    name = $(this).attr('name').toLowerCase();
    if (name !== "all") {
      var assets = $("p.asset");
      assets.each(function(index) {
        if ($(this).data('contenttype').toLowerCase() !== name) {
          $(this).hide();
        }
      });
    } else {
      $("p.asset").show();
    }
  });
});
