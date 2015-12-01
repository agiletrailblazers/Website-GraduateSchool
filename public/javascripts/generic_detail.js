
function displayModal(slug) {
  $(".loading").show();
  $.get("/content-snippet/" + slug)
  .done(function(data) {
    $("#modalContent").replaceWith(data);
    $(".loading").hide();
  })
  .fail(function(xhr, textStatus, errorThrown) {
    $(".loading").hide();
    $("#modalContent").replaceWith('<div id="modelContentError" class="col-lg-9 col-md-9 col-sm-8"><div id="alertError" class="alert alert-danger" role="alert">Content currently unavailable. Please try again.</div></div>');
  });
  return false;
}
