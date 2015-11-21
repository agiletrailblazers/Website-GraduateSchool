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
  proctorFirstName: function() {
    var input = $("#txtProctorFirstName").val();
    var noNumbersPattern = new RegExp(/^[^0-9]+$/);
    if (!noNumbersPattern.test(input)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Proctor's First Name</strong> should not have numbers.</p>");
    }
    if ((input.trim()).length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Proctor's First Name</strong> should be at least 3 characters.</p>");
    }
  },
  proctorLastName: function() {
    var input = $("#txtProctorLastName").val();
    var noNumbersPattern = new RegExp(/^[^0-9]+$/);
    if (!noNumbersPattern.test(input)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Proctor's Last Name</strong> should not have numbers.</p>");
    }
    if ((input.trim()).length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Proctor's Last Name</strong> should be at least 3 characters.</p>");
    }
  },
  proctorEmail: function() {
    var email = $("#txtProctorEmail").val();
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (!pattern.test(email)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Proctor's Email address is incorrect.</p>");
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
  Validate.proctorFirstName();
  Validate.proctorLastName();
  Validate.proctorEmail();
  Validate.captcha();
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}


$(document).ready(function() {
  // Click through form.
  $("#toPanel2Button").click(function() {
    $("#collapse2Link").trigger('click');
    $("html, body").delay(400).animate({ scrollTop:$("#collapse1Link").offset().top }, "slow");
  });
  $("#toPanel3Button").click(function() {
    $("#collapse3Link").trigger('click');
    $("html, body").delay(400).animate({ scrollTop:$("#collapse1Link").offset().top }, "slow");
  });
  $("#toPanel1Button").click(function() {
    $("#collapse1Link").trigger('click');
    $("html, body").delay(400).animate({ scrollTop:$("#collapse1Link").offset().top }, "slow");
  });
  $("#toPanel2Button-2").click(function() {
    $("#collapse3Link").trigger('click');
    $("#collapse2Link").trigger('click');
    $("html, body").delay(400).animate({ scrollTop:$("#collapse1Link").offset().top }, "slow");
  });
  $("#toPanel3Button-2").click(function() {
    $("#collapse3Link").trigger('click');
    $("html, body").delay(400).animate({ scrollTop:$("#collapse1Link").offset().top }, "slow");
  });
  $("#toPanel4Button").click(function() {
    $("#collapse4Link").trigger('click');
    $("html, body").delay(400).animate({ scrollTop:$("#collapse1Link").offset().top }, "slow");
  });
  $("#removeAlert").css('cursor', 'pointer');
  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });
  $("#submitForm").click(function(event) {
    event.preventDefault();
    _runValidation();
    var dataForm = {};
    dataForm.student ={};
    dataForm.student.phone ={};
    dataForm.proctor ={};
    dataForm.proctor.phone ={};
    dataForm.student.firstName = $("#txtFirstName").val();
    dataForm.student.lastName = $("#txtLastName").val();
    dataForm.student.street = $("#txtStreet").val();
    dataForm.student.suite = $("#txtSuite").val();
    dataForm.student.city = $("#txtCity").val();
    dataForm.student.state = $("#selState").val();
    dataForm.student.zip = $("#txtZip").val();
    dataForm.student.phone.day = $("#telPhone").val();
    dataForm.student.phone.home = $("#telHomePhone").val();
    dataForm.student.email = $("#txtEmail").val();
    dataForm.student.instructor = $("#txtInstructor").val();
    dataForm.student.courseCode = $("#txtCourseNumber").val();
    dataForm.student.courseTitle = $("#txtCourseTitle").val();
    dataForm.student.courseLocation = $("#txtCourseLocation").val();

    dataForm.proctor.firstName =$("#txtProctorFirstName").val();
    dataForm.proctor.lastName =$("#txtProctorLastName").val();
    dataForm.proctor.employmentLocation =$("#txtProctorEmploymentPlace").val();
    dataForm.proctor.profession =$("#txtProctorProfession").val();
    dataForm.proctor.studentRelationship =$("#txtProctorStudentRelation").val();
    dataForm.proctor.email =$("#txtProctorEmail").val();
    dataForm.proctor.phone.work =$("#telProctorPhone").val();
    dataForm.proctor.phone.fax =$("#txtProctorFax").val();
    dataForm.proctor.emailTo =$("#txtProctorEmailTo").val();
    dataForm.proctor.organizationName =$("#txtProctorOrganizaiton").val();
    dataForm.proctor.attentionName =$("#txtProctorAttentionName").val();
    dataForm.proctor.street =$("#txtProctorStreet").val();
    dataForm.proctor.suite =$("#txtProctorSuite").val();
    dataForm.proctor.city =$("#txtProctorCity").val();
    dataForm.proctor.state=$("#selProctorState").val();
    dataForm.proctor.zip = $("#txtProctorZip").val();
    dataForm.captchaResponse = $("#g-recaptcha-response").val();
    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-request-proctor", dataForm)
        .done(function(data) {
          $(".loading").hide();
          alertify.success("Email sent!")
          $("#ProctorForm-information").toggle();
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
});
