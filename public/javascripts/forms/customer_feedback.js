var Validate = {
  inputs: function () {
    $("#feedbackForm input").blur(function () {
      if (!$(this).val()) {
        $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Please add content.</p>");
      }

    });
  },
  captcha: function () {
    var googleResponse = $('#g-recaptcha-response').val();
    if (!googleResponse) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below</p>");
    }
  }
}
var _runValidation = function () {
  $("#alertError").slideUp();
  $("#alertError p").remove();
  Validate.captcha();
  Validate.input();
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function () {
  $("#submitForm").click(function (event) {
    event.preventDefault();
    _runValidation();
    var dataForm = {};
    dataForm.firstName = $("#txtFirstName").val();
    dataForm.lastName = $("#txtLastName").val();
    dataForm.phone = $("#telPhone").val();
    dataForm.email = $("#txtEmail").val();
    dataForm.typePerson = $("input[name=typePerson]:checked", '#feedbackForm').val();
    dataForm.feedbackCategories = $('input:checkbox:checked.feedbackCategories').map(function () {
      return this.value;
    }).get();
    dataForm.feedbackText = $("#txtFeedback").val();
    dataForm.captchaResponse = $("#g-recaptcha-response").val();
    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-customer-feedback", dataForm)
        .done(function (data) {
          $(".loading").hide();
          alertify.success("Email sent!")
          $("#feedbackForm-information").toggle();
          $("#alertSuccess").slideDown();
        })
        .fail(function (xhr, textStatus, errorThrown) {
          $(".loading").hide();
          alertify.error("Email failed.")
          var errors = xhr.responseJSON;
          for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
              $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + errors[key] + "</p>");
            }
          }
          $("#alertError").slideDown();
          $("html, body").animate({
            scrollTop: 0
          }, "slow");
        });
    }
  });
});