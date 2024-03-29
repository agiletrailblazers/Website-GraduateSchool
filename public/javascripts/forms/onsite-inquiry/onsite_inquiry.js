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
  studentCount: function() {
	    var studentCount = $("#txtStudentCount").val();
	    digits = new RegExp(/^[0-9]*$/);
	    if ((studentCount.trim()).length < 1) {
	    	$("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please enter a number in <strong>Student Count</strong>.</p>");
	 	}
	    if(!digits.test(studentCount)) {
	      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please enter a number in <strong>Student Count</strong>.</p>");
	    }
	    if (parseInt(studentCount) < 1) {
	      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Student Count</strong> should be at least 1 digit.</p>");
	    }
	  },
  courses: function() {
    var inputSelCourses = $("[name='selCourses']").val();
    var inputOtherCourse = $("#txtOtherCourse").val();
    if (inputSelCourses == null) {
      if(inputOtherCourse.length < 3){
        $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please select or enter a course.</p>");
      }
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
  Validate.phone();
  Validate.studentCount();
  Validate.courses();
  validate.captcha("#g-recaptcha-response", "#alertError");
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function() {
  $(".loading").hide();
  $("#alertError").hide();
  $("#removeAlert").css('cursor', 'pointer');

  $('#ms').change(function() {
  }).multipleSelect({
    width: '100%'
  });

  $( "#txtDeliveryStartDate" ).datepicker();
  $( "#txtDeliveryEndDate" ).datepicker();


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
    data.location.gs = $('#chkGSLocations').prop('checked');
    data.location.customer = $("#txtYourLocations").val();
    data.location.other = $("#txtOtherLocations").val();
    var courseNames = "";
    if ($("[name='selCourses']").val() !== null && $("[name='selCourses']").val() !== "") {
      courseNames = "" + $("[name='selCourses']").val();
    }
    if ($("#txtOtherCourse").val() !== null && $("#txtOtherCourse").val() !== "") {
      var otherName = $("#txtOtherCourse").val();
      courseNames = courseNames.replace("OTHER", otherName);
    }
    data.course.names = courseNames;
    data.course.studentCount = $("#txtStudentCount").val();
    data.course.customization = $("#txtCustomization").val();
    data.course.deliveryStartDate = $("#txtDeliveryStartDate").val();
    data.course.deliveryEndDate = $("#txtDeliveryEndDate").val();
    data.course.instructor = $("#txtInstructor").val();
    data.course.deliveryMethod = $("[name='radDeliveryMethod']:checked").val()
    data.course.helpWithEnrollment = $("#chkHelpWithEnrollment").is(':checked');
    if ($("#chkHelpWithEnrollment").is(':checked')){
      data.course.helpWithEnrollment = 'Yes';
    } else {
      data.course.helpWithEnrollment = 'No';
    }
    if ($("#selHearAbout").val().slice(0, 5) == "Other") {
      data.hearAbout = $("#txtHearAboutOther").val();
    } else if ($("#selHearAbout").val().slice(0, 10) == "Select One") {
      data.hearAbout = "";
    } else if ($("#selHearAbout").val() !== null) {
      data.hearAbout = $("#selHearAbout").val();
    }
    data.comments = $("#txtComments").val();
    data.captchaResponse = $("#g-recaptcha-response").val();

    if (!$("#alertError p").length) {
      $(".loading").show();
      $.post("/mailer-onsite-inquiry", data)
      .done(function(data) {
        $(".loading").hide();
        alertify.success("Email sent!");
        $("#accordion").toggle();
        $("#alertSuccess").toggle();
        ga('send', 'event', 'contact-training-form-completion', 'sign-up', this.href);

        var iframe = document.createElement('iframe');
        iframe.src = "http://img-cdn.mediaplex.com/0/29005/universal.html?page_name=onsite_inquiry_thank_you_page&Onsite_Inquiry_Thank_You_Page=1&mpuid=";
        iframe.width = 1;
        iframe.height = 1;
        iframe.frameborder = 0;
        var ref = document.getElementsByTagName('script')[0];
        ref.parentNode.insertBefore(iframe, ref);
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
  $("#chkYourLocations").click(function() {
    $("#txtYourLocations").toggle();
  });
  $("#chkOtherLocations").click(function() {
    $("#txtOtherLocations").toggle();
  });
  $("#selHearAbout").change(function() {
    if (this.value.slice(0, 5) == "Other") {
      $("#hearAboutOther").show();
      $("#txtHearAboutOther").focus();
    } else {
      $("#hearAboutOther").hide();
      $("#txtHearAboutOther").val("");
    }
  });
  $("#ms").change(function() {
    if (($("[name='selCourses']").val() !== null) && ($("[name='selCourses']").val() !== "")&&
      (($("[name='selCourses']").val()).indexOf("OTHER")>-1)) {
      $("#txtOtherCourseDiv").toggle();
      $("#txtOtherCourse").toggle();
      $('[for="txtOtherCourse"]').toggle();
    } else {
      $("#txtOtherCourseDiv").hide();
      $("#txtOtherCourse").hide();
      $('[for="txtOtherCourse"]').hide();
      $("#txtOtherCourse").val("");
    }
  });
  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });

  $("#collapse1").addClass("in");


});
