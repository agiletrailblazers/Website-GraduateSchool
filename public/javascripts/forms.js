$(document).ready(function() {
  $('ul#filterForms li').click(function(e) {
    e.preventDefault();
    name = $(this).attr('name').toLowerCase();
    if (name !== "all") {
      var assets = $("p.asset");
      assets.each(function(index) {
        contentTypeArray = $(this).data('contenttype').replace(/ /g,'').split(',');
        if (jQuery.inArray(name, contentTypeArray) === -1) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    } else {
      $("p.asset").show();
    }
  });
});
