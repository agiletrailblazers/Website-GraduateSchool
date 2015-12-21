var Validate = {
  typePerson: function(person) {
    var result = customer_feedback_validations.typeOfPerson(false, person);
    if (!result.status) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
          + result.errMsg + "</p>");
    }
  },
  feedbackCategories: function() {
    var result = customer_feedback_validations.feedbackCategory(false, $(".typePerson").is(':checked'));
    if (!result.status) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
          + result.errMsg + "</p>");
    }
  },
  feedback: function() {
    var result = customer_feedback_validations.feedbackText(false, $("#txtFeedback").val());
    if (!result.status) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
         + result.errMsg + "</p>");
    }
  },
  captcha: function () {
    var googleResponse = grecaptcha.getResponse(customerFeedbackCaptchaID);
    if (!googleResponse) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below.</p>");
    }
  }
}
var _runValidation = function (person) {
  $("#customerFeedbackFormAlertError").slideUp();
  $("#customerFeedbackFormAlertError p").remove();
  // Validate.captcha();
  Validate.typePerson(person);
  Validate.feedbackCategories();
  Validate.feedback();

  if ($("#customerFeedbackFormAlertError p").length) {
    $("#customerFeedbackFormAlertError").slideDown("slow");
  }
}

$(document).ready(function () {
  $("#removeAlertCustomerFeedback").css('cursor', 'pointer');
  $("#removeAlertCustomerFeedback").click(function() {
    $("#customerFeedbackFormAlertError").slideUp();
    $("#customerFeedbackFormAlertError p").remove();
  });
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

    var person = "";
    if ((typeof($("input[name=typePerson]:checked", '#feedbackForm').val())) != "undefined") {
      person = $("input[name=typePerson]:checked", '#feedbackForm').val();
    }

    // _runValidation(person);
    var dataForm = {};
    dataForm.firstName = $("#txtCustomerFirstName").val();
    dataForm.lastName = $("#txtCustomerLastName").val();
    dataForm.phone = $("#telCustomerPhone").val();
    dataForm.email = $("#txtCustomerEmail").val();
    dataForm.typePerson = person;

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
