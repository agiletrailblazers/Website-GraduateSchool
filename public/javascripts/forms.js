$(document).ready(function () {
  $("ul#filterForms li").on("click", function (e) {
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

  function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
      re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
  }

  var navuser = getQueryString()["navuser"];
  var navuserArray = ["to", "ps", "cs"];
  if (navuser && typeof(navuser != 'undefined') && (navuserArray.indexOf(navuser.toLowerCase()) > -1)) {
    $('[name="' + navuser.toLowerCase() + '"]').trigger('click');
    $('[name="' + navuser.toLowerCase() + '"] > a').focus();
  }

});
