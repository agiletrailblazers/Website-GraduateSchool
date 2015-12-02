
function displayModal(slug) {
  $(".loading").show();
  $.get("/content-snippet/" + slug)
  .done(function(data) {
    $("#modalLabel").html(data.title);
    $("#modalBody").html(data.snippetContent);
    $(".loading").hide();
  })
  .fail(function(xhr, textStatus, errorThrown) {
    $("#modalLabel").html("Error");
    $("#modalBody").html("Content currently unavailable. Please try again.");
    $(".loading").hide();
  });
  return false;
}
