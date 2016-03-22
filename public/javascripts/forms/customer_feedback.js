var Validate = {
  typePerson: function(person) {
    var result = customer_feedback_validations.typeOfPerson(validator, person);
    if (!result.status) {
      $("#customerFeedbackFormAlertError").append("<p id='typePerson-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
          + result.errMsg + "</p>");
    }
  },
  feedbackCategories: function(feedbackCategories) {
    var result = customer_feedback_validations.feedbackCategory(validator, feedbackCategories);
    if (!result.status) {
      $("#customerFeedbackFormAlertError").append("<p id='feedbackCategory-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
          + result.errMsg + "</p>");
    }
  },
  feedback: function() {
    var result = customer_feedback_validations.feedbackText(validator, $("#txtFeedback").val());
    if (!result.status) {
      $("#customerFeedbackFormAlertError").append("<p id='feedbackText-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
         + result.errMsg + "</p>");
    }
  },
  captcha: function (skipReCaptcha) {
    var googleResponse = grecaptcha.getResponse(customerFeedbackCaptchaID);
    var result = validations.captcha(googleResponse, skipReCaptcha);
    if (!result.status) {
      $("#customerFeedbackFormAlertError").append("<p id='g-recaptcha-response-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
         + result.errMsg + "</p>");
    }
  }
}
var _runValidation = function (person, feedbackCategories) {
  $("#customerFeedbackFormAlertError").slideUp();
  $("#customerFeedbackFormAlertError p").remove();
  Validate.captcha(skipReCaptcha);
  Validate.typePerson(person);
  Validate.feedbackCategories(feedbackCategories);
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

    feedbackCategories="";
    if ($('input:checkbox:checked.feedbackCategories') !=[] && $('input:checkbox:checked.feedbackCategories').length>0){
      feedbackCategories = $('input:checkbox:checked.feedbackCategories').map(function () {
        return this.value;
      }).get();
    }
    if (($('#other').is(":checked")) && $("#txtfeedbackCategoriesOther").val().trim() != "") {
      feedbackCategories.push($("#txtfeedbackCategoriesOther").val());
    }

    _runValidation(person, feedbackCategories);

    var dataForm = {};
    dataForm.firstName = $("#txtCustomerFirstName").val();
    dataForm.lastName = $("#txtCustomerLastName").val();
    dataForm.phone = $("#telCustomerPhone").val();
    dataForm.email = $("#txtCustomerEmail").val();
    dataForm.typePerson = person;
    dataForm.feedbackCategories = feedbackCategories;


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
          ga('send', 'event', 'feedback-form-completion', 'sign-up', this.href);
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
