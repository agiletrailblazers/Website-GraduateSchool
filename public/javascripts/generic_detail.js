
function displayModal(slug) {
  $(".loading").show();
  $.get("/content-snippet/" + slug)
  .done(function(data) {
    var dataJSON = JSON.parse(data);
    $("#modalLabel").html(dataJSON.modalLabel);
    $("#modalBody").html(dataJSON.modalBody);
    $(".loading").hide();
  })
  .fail(function(xhr, textStatus, errorThrown) {
    $("#modalLabel").html("Error");
    $("#modalBody").html("Content currently unavailable. Please try again.");
    $(".loading").hide();
  });
  return false;
}
