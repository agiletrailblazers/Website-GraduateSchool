$(document).ready(function () {
  $("ul#filterCatalogs li").on("click", function (e) {
    e.preventDefault();
    name = $(this).attr('name').toLowerCase();
    if (name !== "all") {
      var assets = $("p.asset");
      assets.each(function (index, element) {
        contentTypeArray = $(this).data('contenttype').replace(/ /g, '').split(',');
        if (jQuery.inArray(name, contentTypeArray) === -1) {
          $(this).hide();
        } else {
          $(this).show();
        }

      });
    } else {
      $("p.asset").show();
    }
    headers = $(".assets").find("h3");
    $(headers).each(function (i, e) {
      if ($(this).siblings(":visible").length > 0) {
        $(this).show();
      }
      else {
        $(this).hide();
      }
    })

  });


});
