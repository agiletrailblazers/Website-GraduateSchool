$(document).ready(function() {
  $("#alertDismiss").click(function(e) {
    var slug = $(this).attr("data-slug");
    //make ajax call to dismiss
    $.get("/alert-dismiss?slug=" + slug)
      .done(function(data) {
        //hide it
        $('#alert').fadeOut();
      })
      .fail(function(xhr, textStatus, errorThrown) {
        console.log("Failed to record alert dismisal");
        //hide it anyway
        $('#alert').hide();
      });

  });
});
