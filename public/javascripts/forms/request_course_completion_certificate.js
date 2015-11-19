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
    if (instructor.trim().length < 1) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please enter a valid instructor.</p>");
    }
  },
  courseCode: function() {
    var code = $("#txtCourseNumber").val();
    if (code.trim().length < 4) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Code must be atleast 4 characters.</p>");
    }
  },
  courseTitle: function() {
    var title = $("#txtCourseTitle").val();
    if (title.trim().length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Course title must be at least 3 characters.</p>");
    }
  },
  courseLocation: function() {
    var location = $("#txtCourseLocation").val();
    if (location.trim().length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Course Location must be at least 3 characters.</p>");
    }
  },
  courseStartDate: function() {
    var dateStart = $("#dateStart").val();
    if (dateStart== "" || $("#dateStart").datepicker("getDate") === null) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Please select the start date</p>");
    }
  },
  courseEndDate: function() {
    var dateEnd = $("#dateEnd").val();
    if (dateEnd == "" || $("#dateEnd").datepicker("getDate") === null) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Please select the End date</p>");
    }
  },
  dateTimeDiff: function() {
    var dateEnd = $("#dateEnd").datepicker("getDate") ;
    var dateStart = $("#dateStart").datepicker("getDate") ;
    if ($("#dateStart").val() != "" && dateStart !== null && $("#dateEnd").val() != "" && dateEnd != null &&  (dateEnd - dateStart)/1000/60/60/24<1) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Please select the course end date greater than course start date</p>");
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
  Validate.courseStartDate();
  Validate.courseEndDate();
  Validate.dateTimeDiff();
  Validate.courseLocation();
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
    formData.state = $("#selState").val();
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
    formData.courseType = $("#requestDuplicate input[type='radio']:checked").val();
    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-request-duplicate", formData)
      .done(function(data) {
        $(".loading").hide();
        alertify.success("Email sent!")
        $("#duplicateForm-information").toggle();
        $("#alertSuccess").slideDown();
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
  $("#radioCertificate").click(function(e) {
    $("#title, #breadcrumbTitle").text("Request Course Completion Certificate");
  });
  $("#radioGradeReport").click(function(e) {
    $("#title, #breadcrumbTitle").text("Request Official Grade Report");
  });
  function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
      re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
  }

  var navuser = getQueryString()["coursetype"];
  if (navuser && typeof(navuser != 'undefined') && ("ogr".indexOf(navuser.toLowerCase().trim()) > -1) ) {
    $("#radioGradeReport").prop("checked", true);
  } else {
    $("#radioCertificate").prop("checked", true);
  }

  $("#dateEnd").datepicker({beforeShow: setminDate});
  function setminDate() {
    var courseStartDate = $('#dateStart').datepicker('getDate');
    if (courseStartDate) {
      return {
        minDate: courseStartDate
      }
    };
  }
  //Scroll to the Alert Section/Confirmation message (height: 365px)
  $('#submitForm').click(function() {
    $("html, body").delay(400).animate({ scrollTop: 365 }, "slow");
  });
});
