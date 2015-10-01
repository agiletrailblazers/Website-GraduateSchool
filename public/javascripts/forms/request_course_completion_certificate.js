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
    var pattern = new RegExp(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/);
    var phone = $("#telPhone").val();
    if (!pattern.test(phone)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Phone number is incorrect.</p>");
    }
  },
  instructor: function() {
    var instructor = $("#txtInstructor").val();
    if (instructor.length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please enter a valid instructor.</p>");
    }
  },
  courseCode: function() {
    var code = $("#txtCourseNumber").val();
    if (code.length < 4) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Code must be atleast 4 characters.</p>");
    }
  },
  courseTitle: function() {
    var title = $("#txtCourseTitle").val();
    if (title.length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Course title must be at least 3 characters.</p>");
    }
  },
  captcha: function(){
    var googleResponse = $('#g-recaptcha-response').val();
    if (!googleResponse) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below</p>");
    }
  }
}

var _runValidation = function() {
  $("#alertError").slideUp();
  $("#alertError p").remove();
  Validate.firstName();
  Validate.lastName();
  Validate.email();
  Validate.phone();
  Validate.instructor();
  Validate.courseCode();
  Validate.courseTitle();
  Validate.captcha();
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}


$(document).ready(function() {
  $("#removeAlert").css('cursor', 'pointer');
  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });
  $("#submitForm").click(function(event) {
    event.preventDefault();
    _runValidation();
    formData = {};
    formData.firstName = $("#txtFirstName").val();
    formData.lastName = $("#txtLastName").val();
    formData.street = $("#txtStreet").val();
    formData.suite = $("#txtSuite").val();
    formData.city = $("#txtCity").val();
    formData.zip = $("#txtZip").val();
    formData.phone = $("#telPhone").val();
    formData.email = $("#txtEmail").val();
    formData.instructor = $("#txtInstructor").val();
    formData.courseCode = $("#txtCourseNumber").val();
    formData.courseTitle = $("#txtCourseTitle").val();
    formData.startDate = $("#dateStart").val();
    formData.endDate = $("#dateEnd").val();
    formData.courseLocation = $("#txtCourseLocation").val();
    formData.captchaResponse = $("#g-recaptcha-response").val();
    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-request-duplicate", formData)
      .done(function(data) {
        $(".loading").hide();
        alertify.success("Email sent!")
        $("#contact-information").toggle();
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
