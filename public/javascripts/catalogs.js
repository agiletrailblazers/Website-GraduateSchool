var Validate = {
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
  organization: function() {
    var input = $("#txtOrganizaiton").val();
    if ((input.trim()).length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Organization</strong> should be at least 3 characters.</p>");
    }
  },
  email: function() {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    var input = $("#txtEmail").val();
    if (!pattern.test(input)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Email</strong> address is incorrect.</p>");
    }
  },
  phone: function() {
    var pattern = new RegExp(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/);
    var input = $("#txtPhone").val();
    if (!pattern.test(input)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Phone</strong> number is incorrect.</p>");
    }
  },
  captcha: function() {
    var googleResponse = $('#g-recaptcha-response').val();
    if (!googleResponse) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>For security, please verify you are a real person below.</p>");
    }
  }
}

var _runValidation = function() {
  $("#alertError").slideUp();
  $("#alertError p").remove();
  Validate.firstName();
  Validate.lastName();
  Validate.organization();
  Validate.email();
  Validate.captcha();
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function() {

  $("ul#filterCatalogs li").on("click", function (e) {
    e.preventDefault();
    name = $(this).attr('name').toLowerCase();
    if (name !== "all") {
      var assets = $("p.asset");
      assets.each(function (index, element) {
        contentTypeArray = $(this).data('contenttype').replace(/ /g, '').split(',');
        if (jQuery.inArray(name, contentTypeArray) === -1) {
          $(this).hide();
        } else {
          $(this).show();
        }

      });
    } else {
      $("p.asset").show();
    }
    headers = $(".assets").find("h3");
    $(headers).each(function (i, e) {
      if ($(this).siblings(":visible").length > 0) {
        $(this).show();
      }
      else {
        $(this).hide();
      }
    })

  });

  $(".loading").hide();
  $("#alertError").hide();
  $("#removeAlert").css('cursor', 'pointer');

  $("form").keyup(function(e) {
    var code = e.keyCode || e.which;
    if (code === 9) {
      selectedInput = $(":focus");
      if (selectedInput.attr('type') === "button") {
        $(selectedInput).css('border', '1px dotted #be0f34').blur(function(event) {
          $(selectedInput).css('border', '');
        });
      }

    }
  });

  // Click through form.
  $("#toCDIButton").click(function() {
    $("#collapse2Link").trigger('click');
  });
  $("#toFormSubButton").click(function() {
    $("#collapse3Link").trigger('click');
  });
  $("#toContactButton").click(function() {
    $("#collapse1Link").trigger('click');
  });
  $("#backToCDIButton").click(function() {
    $("#collapse2Link").trigger('click');
  });
  $("#submitForm").click(function(e) {
    e.preventDefault();
    _runValidation();
    var data = {};
    data.address = {};
    data.location = {};
    data.contact = {};
    data.course = {};
    data.address.prefix = $("#prefix").val();
    data.address.firstName = $("#txtFirstName").val();
    data.address.lastName = $("#txtLastName").val();
    data.address.organization = $("#txtOrganizaiton").val();
    data.address.street = $("#txtStreet").val();
    data.address.suite = $("#txtSuite").val();
    data.address.city = $("#txtCity").val();
    data.address.state = $("#selState").val();
    data.address.zip = $("#txtZip").val();
    data.address.country = $("#txtCountry").val();
    data.contact.fax = $("#txtFax").val();
    data.contact.email = $("#txtEmail").val();
    data.contact.phone = $("#txtPhone").val();
    data.captchaResponse = $("#g-recaptcha-response").val();

    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-request-catalog", data)
        .done(function(data) {
          $(".loading").hide();
          alertify.success("Email sent!");
          $("#accordion").toggle();
          $("#alertSuccess").toggle();
        })
        .fail(function(xhr, textStatus, errorThrown) {
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
  $("#chkGSLocations").click(function() {
    $("#selGSLocations").toggle();
  });
  $("#chkYourLocations").click(function() {
    $("#txtYourLocations").toggle();
  });
  $("#chkOtherLocations").click(function() {
    $("#txtOtherLocations").toggle();
  });
  $("#selHearAbout").change(function() {
    if (this.value.startsWith("Other")) {
      $("#hearAboutOther").show();
      $("#txtHearAboutOther").focus();
    } else {
      $("#hearAboutOther").hide();
      $("#txtHearAboutOther").val("");
    }
  });
  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });
  $("#collapse1").addClass("in");
});

