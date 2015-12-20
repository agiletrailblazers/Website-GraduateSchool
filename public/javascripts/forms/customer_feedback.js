var Validate = {
   typePerson: function() {
    if (!$(".typePerson").is(':checked')) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Please select Which Best Describes You?</p>");
    }
  },
  feedbackCategories: function() {
    if (!$(".feedbackCategories").is(':checked')) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Please select or enter Area Of Feedback.</p>");
    }
  },
  comments: function() {
    var input = $("#txtFeedback").val();
    if (input == '' || input == null || typeof(input) == 'undefined' || input.trim().length < 3) {
      console.log("ll");
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please enter your Feedback.</p>");
      console.log("lll");
    }
  },
  captcha: function () {
    var googleResponse = grecaptcha.getResponse(customerFeedbackCaptchaID);
    if (!googleResponse) {
      $("#customerFeedbackFormAlertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below.</p>");
    }
  }
}
var _runValidation = function () {
  console.log("ifti");
  $("#customerFeedbackFormAlertError").slideUp();
  $("#customerFeedbackFormAlertError p").remove();
  // Validate.captcha();
  // Validate.typePerson();
  // Validate.feedbackCategories();
  Validate.comments();
  // validate.email("#txtCustomerEmail","#customerFeedbackFormAlertError", "Email");
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
