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
  $("#customerFeedbackFormAlertError").slideUp();
  $("#customerFeedbackFormAlertError p").remove();
  Validate.captcha();
  Validate.input();
  if ($("#customerFeedbackFormAlertError p").length) {
    $("#customerFeedbackFormAlertError").slideDown("slow");
  }
}

$(document).ready(function () {

  $('#other').click(function () {
    if ($('#other').is(":checked")) {
      $("#txtfeedbackCategoriesOther").attr('disabled', false);
    } else {
      $("#txtfeedbackCategoriesOther").attr('disabled', true);
      $("#txtfeedbackCategoriesOther").val("");
    }
  });
  $("#customerFeedbackSubmitForm").click(function (event) {
    event.preventDefault();
    _runValidation();
    var dataForm = {};
    dataForm.firstName = $("#txtCustomerFirstName").val();
    dataForm.lastName = $("#txtCustomerLastName").val();
    dataForm.phone = $("#telCustomerPhone").val();
    dataForm.email = $("#txtCustomerEmail").val();
    dataForm.typePerson = $("input[name=typePerson]:checked", '#feedbackForm').val();
    dataForm.feedbackCategories = $('input:checkbox:checked.feedbackCategories').map(function () {
      return this.value;
    }).get();
    if (($('#other').is(":checked")) && $("#txtfeedbackCategoriesOther").val().trim() != "") {
      dataForm.feedbackCategories.push($("#txtfeedbackCategoriesOther").val());
    }
    dataForm.feedbackText = $("#txtFeedback").val();
    dataForm.captchaResponse = $("#g-recaptcha-response").val();
    if (!$("#customerFeedbackFormAlertError p").length) {
      $(".loading").show();
      $.post("/mailer-customer-feedback", dataForm)
        .done(function (data) {
          $(".loading").hide();
          alertify.success("Email sent!")
          $("#feedbackForm-information").toggle();
          $("#customerFeedbackFormAlertSuccess").slideDown();
        })
        .fail(function (xhr, textStatus, errorThrown) {
          $(".loading").hide();
          alertify.error("Email failed.")
          var errors = xhr.responseJSON;
          for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
              $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + errors[key] + "</p>");
            }
          }
          $("#customerFeedbackFormAlertError").slideDown();
          $("html, body").animate({
            scrollTop: 0
          }, "slow");
        });
    }
  });
});