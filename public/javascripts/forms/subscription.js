var subscriptionFormValidate = {
  firstName: function() {
    var input = $("#txtFirstName").val();
    var noNumbersPattern = new RegExp(/^[^0-9]+$/);
    if (!noNumbersPattern.test(input)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>First Name</strong> should not have numbers.</p>");
    }
    if ((input.trim()).length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>First Name</strong> should be at least 3 characters.</p>");
    }
  },
  middleName: function() {
    var input = $("#txtMiddleName").val();
    var noNumbersPattern = new RegExp(/^[^0-9]+$/);
    if (!noNumbersPattern.test(input)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Last Name</strong> should not have numbers.</p>");
    }
    if ((input.trim()).length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Last Name</strong> should be at least 3 characters.</p>");
    }
  },
  lastName: function() {
    var input = $("#txtLastName").val();
    var noNumbersPattern = new RegExp(/^[^0-9]+$/);
    if (!noNumbersPattern.test(input)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Last Name</strong> should not have numbers.</p>");
    }
    if ((input.trim()).length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Last Name</strong> should be at least 3 characters.</p>");
    }
  },
  email: function() {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    var email = $("#txtEmail").val();
    if (!pattern.test(email)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Email address is incorrect.</p>");
    }
  },
  phone: function() {
    var pattern = new RegExp(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/);
    var phone = $("#txtPhone").val();
    if (!pattern.test(phone)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Phone number is incorrect.</p>");
    }
  },
  subscriptionAction: function() {
    if (!$("#radioSubscribe").is(':checked') && !$("#radioModify").is(':checked') && !$("#radioUnsubscribe").is(':checked')) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please specify the subscription action to be performed.</p>");
    }
  },
  subscriptionType: function() {
    if (!$("#subscriptionTypeEmail").is(':checked') && !$("#subscriptionTypeMail").is(':checked')) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please choose a type of subscription.</p>");
    }
  },
  city: function() {
    var input = $("#txtCity").val();
    if (input.trim().length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>City</strong> is incorrect.</p>");
    }
  },
  state: function() {
    var input = $("#txtState").val();
    if (!input) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Please select a <strong>state</strong>.</p>");
    }
  },
  zip: function() {
    var input = $("#txtZip").val();
    // TODO: Regex to see if it is only numbers.
    if (input.trim().length < 5) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Zip code</strong> is incorrect.</p>");
    }
  },
  streetAddress: function() {
    var input = $("#txtStreet").val();
    if (input.trim().length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Street address</strong> must be at least 3 characters.</p>");
    }
  },
  captcha: function(){
    var googleResponse = $('#g-recaptcha-response').val();
    if (!googleResponse) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below</p>");
    }
  }
}

var _runSubscriptionFormValidation = function() {
  $("#alertError").slideUp();
  $("#alertError p").remove();

  subscriptionFormValidate.subscriptionType()
  subscriptionFormValidate.firstName();
  subscriptionFormValidate.lastName();

  if($("#subscriptionTypeEmail").is(':checked')) {
    subscriptionFormValidate.email();
  }

  if($("#subscriptionTypeMail").is(':checked')) {
    subscriptionFormValidate.streetAddress();
    subscriptionFormValidate.city();
    subscriptionFormValidate.state();
    subscriptionFormValidate.zip();
    subscriptionFormValidate.phone();
  }

  subscriptionFormValidate.captcha();

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
    console.log("emailSubscription");
    data.mailSubscription =  $("#subscriptionTypeMail").is(':checked');
    data.street = $("#txtStreet").val();
    data.city = $("#txtCity").val();
    data.state = $("#txtState").val();
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

    // data.captchaResponse = $("#g-recaptcha-response").val();
    if (!$("#alertError p").length) {
      console.log("going to post");
      $(".loading").show();
      $.post("/mailer-subscription", data)
        .done(function(data) {
          $(".loading").hide();
          alertify.success("Email sent!")
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
    } else {
      $(".email-fieldSet").hide();
    }
  });
  $("#subscriptionTypeMail").click(function() {
    if ($("#subscriptionTypeMail").is(':checked') == true) {
      $(".mail-fieldSet").show();
    } else {
      $(".mail-fieldSet").hide();
    }
  });
});
