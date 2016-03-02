
var _runLandingFormValidation = function() {
  $("#alertError").slideUp();
  $("#alertError p").remove();
  validate.Name(validator, "#txtFirstName", "#alertError", "First Name");
  validate.Email(validator, "#txtEmail","#alertError", "Email");
  if ($("#telPhone").val().trim() != ''  ) {
    validate.Phone(validator, "#telPhone", "#alertError", "Phone Number");
  }
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function() {
  $("#telPhone").mask("(999) 999-9999", {autoclear: false});
  $("#alertError").hide();
  $(".loading").hide();
  $("#removeAlert").css('cursor', 'pointer');
  $("#removeAlertSuccess").css('cursor', 'pointer');

  $("#submitForm").click(function(e) {
    e.preventDefault();
    _runLandingFormValidation();
    var data = {};
    data.firstName = $("#txtFirstName").val();
    data.email = $("#txtEmail").val();
    data.phone = $("#telPhone").val();
    data.information = $("#moreInfo").val();
    data.email=$("#email").val();
    data.userEmail = $("#txtEmail").val();
    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-landing", data)
        .done(function(data) {
          $(".loading").hide();
          $("#txtFirstName").val('');
          $("#txtEmail").val('');
          $("#telPhone").val('');
          $("#information").val('');
          alertify.success("Email sent!");
          $("#alertSuccess").toggle();
          $("#request-information-form").toggle();
        })
        .fail(function(xhr, textStatus, errorThrown) {
          $(".loading").hide();
          alertify.error("Email failed.")
          var errors = xhr.responseJSON;
          for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
              $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + errors[key] +"</p>");
            }
          }
          $("#alertError").slideDown();
          $("html, body").animate({
            scrollTop: 0
          }, "slow");
        });
    }
  });

  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });

  $("#removeAlertSuccess").click(function() {
    $("#alertSuccess").slideUp();
    $("#alertSuccess p").remove();
  });

  $('#backTop').backTop({
    'position' : 100,
    'speed' : 1000,
    'color' : 'black',
  });
});
