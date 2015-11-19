var subscriptionFormValidate = {
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
  validate.name("#txtFirstName", "#alertError", "First Name");
  validate.name("#txtLastName", "#alertError", "Last Name");

  if($("#subscriptionTypeEmail").is(':checked')) {
    validate.email("#txtEmail","#alertError", "Email");
  }

  if($("#subscriptionTypeMail").is(':checked')) {
    validate.CheckEmptyString("#txtStreet","#alertError", "Street/P.O.Box");
    validate.CheckEmptyString("#txtCity","#alertError", "City");
    // subscriptionFormValidate.city();
    subscriptionFormValidate.state();
    //subscriptionFormValidate.zip();
    validate.CheckEmptyString("#txtZip","#alertError", "Zip code");
    validate.CheckEmptyString("#txtPhone","#alertError", "Phone number");
    //subscriptionFormValidate.phone();
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

    data.captchaResponse = $("#g-recaptcha-response").val();
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
