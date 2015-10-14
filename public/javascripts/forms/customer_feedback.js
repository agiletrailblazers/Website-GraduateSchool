var Validate = {
  inputs: function () {
    $("#feedbackForm input").blur(function () {
      if (!$(this).val()) {
        $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Please add content.</p>");
      }

    });
  },
  email: function(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (!pattern.test(email)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Email address is incorrect.</p>");
    }
  },
  captcha: function () {
    var googleResponse = grecaptcha.getResponse(customerFeedbackCaptchaID);
    if (!googleResponse) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below</p>");
    }
  }
}
var _runValidation = function () {
  $("#customerFeedbackFormAlertError").slideUp();
  $("#customerFeedbackFormAlertError p").remove();
  Validate.captcha();
  Validate.inputs();
  Validate.email();
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
    if ((typeof($("input[name=typePerson]:checked", '#feedbackForm').val())) != "undefined") {
      dataForm.typePerson = $("input[name=typePerson]:checked", '#feedbackForm').val();
    }else {
      dataForm.typePerson = "";
    }
    if ($('input:checkbox:checked.feedbackCategories') !=[] && $('input:checkbox:checked.feedbackCategories').length>0){
      dataForm.feedbackCategories = $('input:checkbox:checked.feedbackCategories').map(function () {
        return this.value;
      }).get();
    } else {
      dataForm.feedbackCategories="";
    }
    if (($('#other').is(":checked")) && $("#txtfeedbackCategoriesOther").val().trim() != "") {
      dataForm.feedbackCategories.push($("#txtfeedbackCategoriesOther").val());
    }
    dataForm.feedbackText = $("#txtFeedback").val();
    dataForm.captchaResponse = grecaptcha.getResponse(customerFeedbackCaptchaID);
    if (!$("#customerFeedbackFormAlertError p").length) {
      $(".loading").show();
      $.post("/mailer-customer-feedback", dataForm)
        .done(function (data) {
          $(".loading").hide();
          alertify.success("Email sent!")
          $("#feedbackForm-information").toggle();
          $("#customerFeedbackFormAlertSuccess").slideDown();
          if( (dataForm.firstName != '' && dataForm.firstName != null && typeof(dataForm.firstName) != 'undefined') ) {
            $("#txtCustomerName").text(dataForm.firstName);
          } else {
            $("#txtCustomerName").text("Valued Customer");
          }
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
