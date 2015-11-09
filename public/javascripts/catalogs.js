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
  city: function() {
    var input = $("#txtCity").val();
    if (input.trim().length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>City</strong> is incorrect.</p>");
    }
  },
  state: function() {
    var input = $("#selState").val();
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
  catlogCopies: function() {

    digits = new RegExp(/^[0-9]*$/);
    $(".txtCatalogHardCopy").each(function() {
      var catalogattrVal = $(this).attr("data-id");
      var catalogVal = $('input[ data-id="' + catalogattrVal + '"]').val().trim();
      if (typeof(catalogVal) !='undefined') {
        if ((catalogVal.trim()).length < 1) {
          $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please enter a number in <strong>Request for catalogs</strong>.</p>");
          return false;
        }
        if (!digits.test(catalogVal)) {
          $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please enter a number in <strong>Request for catalogs</strong>.</p>");
          return false;
        }
        if (parseInt(catalogVal) < 1) {
          $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Request for catalogs</strong> should be at least 1 digit.</p>");
          return false;
        }
      }
    });
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
  Validate.streetAddress();
  Validate.city();
  Validate.state();
  Validate.zip();
  Validate.email();
  Validate.phone();
  Validate.catlogCopies();
  Validate.captcha();
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function() {
  $(".txtCatalogHardCopy").hide();
  $(".txtCatalogHardCopy").val("1");
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
  $('.catalogHardCopyTitles').click(function () {
    $('.catalogHardCopyTitles:checked').each(function() {
      $('input[ data-id="' + this.value + '"]').show();
    });
    $('.catalogHardCopyTitles:not(:checked)').each(function() {
      $('input[ data-id="' + this.value + '"]').val("1");
      $('input[ data-id="' + this.value + '"]').hide();
    });
  });
  // Click through form.
  $("#toCDIButton").click(function() {
    $("#collapse2Link").trigger('click');
  });
  $("#backToCDIButton").click(function() {
    $("#collapse1Link").trigger('click');
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
    data.address.middleName = $("#txtMiddleName").val();
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
    if ($('input:checkbox:checked.catalogHardCopyTitles') !=[] && $('input:checkbox:checked.catalogHardCopyTitles').length>0){
      data.catalogHardCopyTitles = $('input:checkbox:checked.catalogHardCopyTitles').map(function () {
        return this.value
      }).get();
    } else {
      data.catalogHardCopyTitles="";
    }
    var catalogHardCopyTitleArray = data.catalogHardCopyTitles;
    var catalogHardCopyTitles =[];
    if (catalogHardCopyTitleArray.length>0) {
      catalogHardCopyTitleArray.forEach(function(catalogHardCopyTitle) {
        catalogHardCopyTitle =catalogHardCopyTitle + "|" + $('input[ data-id="' + catalogHardCopyTitle + '"]').val();
        catalogHardCopyTitles.push(catalogHardCopyTitle);
      });
      data.catalogHardCopyTitlesList = catalogHardCopyTitles;
    }

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

  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });
  $("#collapse1").addClass("in");
});
