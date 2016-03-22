var subscriptionFormValidate = {

  subscriptionAction: function() {
    if (!$("#radioSubscribe").is(':checked') && !$("#radioModify").is(':checked') && !$("#radioUnsubscribe").is(':checked')) {
      $("#alertError").append("<p id='radioSubscribe-missing' ><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please specify the subscription action to be performed.</p>");
    }
  },
  subscriptionType: function() {
    if (!$("#subscriptionTypeEmail").is(':checked') && !$("#subscriptionTypeMail").is(':checked')) {
      $("#alertError").append("<p id='subscriptionType-missing'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please choose a type of subscription.</p>");
    }
  }
}

var _runSubscriptionFormValidation = function() {
  $("#alertError").slideUp();
  $("#alertError p").remove();

  subscriptionFormValidate.subscriptionType()
  validate.name("#txtFirstName", "#alertError", "First Name");
  validate.name("#txtLastName", "#alertError", "Last Name");

  if($("#subscriptionTypeEmail").is(':checked')) {
    validate.email("#txtEmail","#alertError", "Email");
  }

  if($("#subscriptionTypeMail").is(':checked')) {
    validate.street("#txtStreet", "#alertError", "Street/P.O. Box");
    validate.city("#txtCity", "#alertError", "City");
    validate.state("#selState", "#alertError");
    validate.zip("#txtZip","#alertError", "Zip Code");
    validate.phone("#txtPhone", "#alertError", "Phone");
  }

  validate.captcha("#g-recaptcha-response", "#alertError");
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function() {
  $("#alertError").hide();
  $(".loading").hide();
  $("#removeAlert").css('cursor', 'pointer');

  $("#submitForm").click(function(e) {
    e.preventDefault();
    _runSubscriptionFormValidation();
    var data = {};
    data.firstName = $("#txtFirstName").val();
    data.middleName = $("#txtMiddleName").val();
    data.lastName = $("#txtLastName").val();
    data.subscriptionAction = $("[name='radSubscription']:checked").val()
    data.actionSubscribe = $("#radioSubscribe").val();
    data.actionModify = $("#radioModify").val();
    data.actionUnsubscribe = $("#radioUnsubscribe").val();
    var subscriptionAction = data.subscriptionAction;
    data.emailSubscription = $("#subscriptionTypeEmail").is(':checked');
    data.mailSubscription =  $("#subscriptionTypeMail").is(':checked');
    data.street = $("#txtStreet").val();
    data.city = $("#txtCity").val();
    data.state = $("#selState").val();
    data.zip = $("#txtZip").val();
    data.country = $("#txtCountry").val();
    data.apartment = $("#txtApt").val();
    data.phone = $("#txtPhone").val();
    data.organization = $("#txtOrganizaiton").val();
    data.email = $("#txtEmail").val();

    if ($('input:checkbox:checked.areaOfInterest') !=[] && $('input:checkbox:checked.areaOfInterest').length>0){
      data.areaOfInterest = $('input:checkbox:checked.areaOfInterest').map(function () {
        return this.value
      }).get();
    } else {
      data.areaOfInterest="";
    }

    data.captchaResponse = $("#g-recaptcha-response").val();
    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-subscription", data)
        .done(function(data) {
          $(".loading").hide();
          alertify.success("Email sent!");
          $("#form-wrap").toggle();
          switch (true) {
            case (subscriptionAction === $("#radioSubscribe").val()):
              $("#alertSuccessSubscribe").toggle();
              break;
            case (subscriptionAction === $("#radioUnsubscribe").val()):
              $("#alertSuccessUnsubscribe").toggle();
              break;
            case (subscriptionAction === $("#radioModify").val()):
              $("#alertSuccessModify").toggle();
              break;
          }
          ga('send', 'event', 'email-subscription-form-completion', 'sign-up', this.href);
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
  $("#subscriptionTypeEmail").click(function() {
    if ($("#subscriptionTypeEmail").is(':checked') == true) {
      $(".email-fieldSet").show();
      $("#submitForm").show();
    } else {
      $(".email-fieldSet").hide();
      if ($("#subscriptionTypeMail").is(':checked') == false) {
        $("#submitForm").hide();
      }
    }
  });
  $("#subscriptionTypeMail").click(function() {
    if ($("#subscriptionTypeMail").is(':checked') == true) {
      $(".mail-fieldSet").show();
      $("#submitForm").show();
    } else {
      $(".mail-fieldSet").hide();
      if ($("#subscriptionTypeEmail").is(':checked') == false) {
        $("#submitForm").hide();
      }
    }
  });
});
