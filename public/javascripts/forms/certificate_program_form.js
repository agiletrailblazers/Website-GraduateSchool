Validate = {
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
    var email = $("#txtEmail").val();
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (!pattern.test(email)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Email address is incorrect.</p>");
    }
  },
  phone: function() {
    var phone = $("#txtPhone").val();
    var pattern = new RegExp(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/);
    if (!pattern.test(phone)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Phone number is incorrect.</p>");
    }
  },
  city: function() {
    var input = $("#txtCity").val();
    if (input.trim().length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> City is incorrect.</p>");
    }
  },
  state: function() {
    var input = $("#selState").val();
    if (!input) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please select a state.</p>");
    }
  },
  zip: function() {
    var input = $("#txtZip").val();
    // TODO: Regex to see if it is only numbers.
    if (input.trim().length < 5) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Zip code is incorrect.</p>");
    }
  },
  streetAddress: function() {
    var input = $("#txtStreet").val();
    if (input.trim().length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Street address must be at least 3 characters.</p>");
    }
  },
  certificate: function() {
    var input = $("#txtCertName").val();
    if (input.trim().length < 1) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Name on certificate must be at least 1 character.</p>");
    }
  },
  captcha: function() {
    var googleResponse = $('#g-recaptcha-response').val();
    if (!googleResponse) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below</p>");
    }
  }
}


var _runValidation = function() {
  Validate.firstName();
  Validate.lastName();
  Validate.email();
  Validate.phone();
  Validate.streetAddress();
  Validate.city();
  Validate.state();
  Validate.zip();
  Validate.captcha();
  if (window.location.pathname == "/forms/certificate-completion") {
    Validate.certificate();
  }
}

$(document).ready(function() {
  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });
  $("#submitForm").click(function(e) {
    e.preventDefault();
    _runValidation();
    var data = {};
    data.formType = window.location.pathname;
    data.selectBox = $("#selectBox").val();
    data.other = $("#txtOther").val();
    data.firstName = $("#txtFirstName").val();
    data.lastName = $("#txtLastName").val();
    data.mi = $("#txtMI").val();
    data.formerLastName = $("#txtFormerLastName").val();
    data.ssn = $("#txtSSNa").val() +'-'+ $("#txtSSNb").val() +'-'+ $("#txtSSNc").val();
    if( $("#month").val() || $("#day").val() || $("#txtYear").val()) {
      data.dob = $("#month").val() +'/'+ $("#day").val() +'/'+ $("#txtYear").val();
    } else {
      data.dob = "";
    }

    data.email = $("#txtEmail").val();
    data.phone = $("#txtPhone").val();
    data.fax = $("#txtFax").val();
    data.city = $("#txtCity").val();
    data.state = $("#selState").val();
    data.country = $("#txtCountry").val();
    data.zip = $("#txtZip").val();
    data.streetAddress = $("#txtStreet").val();
    data.suite = $("#txtSuite").val();
    data.comment = $("#commentText").val();
    if (window.location.pathname == "/forms/certificate-completion") {
      data.certificate = $("#txtCertName").val();
    }
    data.captchaResponse = $("#g-recaptcha-response").val();
    if ($("#alertError p").length == 0) {
      $(".loading").show();
      $.post("/mailer-request-certificate-program", data)
        .done(function(data) {
          $(".loading").hide();
          alertify.success("Email sent!")
          $("#alertSuccess").toggle();
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
});
