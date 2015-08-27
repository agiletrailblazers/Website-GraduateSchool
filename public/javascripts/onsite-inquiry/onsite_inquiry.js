var Validate = {
  firstName: function() {
    var input = $("#txtFirstName").val();
    if (input.length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>First Name</strong> should be at least 3 characters.</p>");
    }
  },
  lastName: function() {
    var input = $("#txtLastName").val();
    if (input.length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Last Name</strong> should be at least 3 characters.</p>");
    }
  },
  organization: function() {
	    var input = $("#txtOrganizaiton").val();
	    if (input.length < 3) {
	      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Organization</strong> should be at least 3 characters.</p>");
	    }
	  },  
  email: function() {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (!pattern.test("#txtEmail")) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Email</strong> address is incorrect.</p>");
    }
  },
  phone: function() {
    var pattern = new RegExp(/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/);
    if (!pattern.test("#txtPhone")) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Phone</strong> number is incorrect.</p>");
    }
  },
  captcha:function(){
    var googleResponse = $('#g-recaptcha-response').val();
    if (!googleResponse) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please select recaptcha</p>");
    }
  },
  studentCount: function() {
	    var input = $("#txtStudentCount").val();
	    if (input.length < 1) {
	      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Student Count</strong> should be at least 3 characters.</p>");
	    }
	  },
}

var _runValidation = function() {
  $("#alertError").slideUp();
  $("#alertError p").remove();
  $("#alertError").slideDown("slow");
  Validate.firstName();
  Validate.lastName();
  Validate.organization();
  Validate.email(); 
  Validate.phone(); 
  Validate.studentCount();
  Validate.captcha();
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function() {
$("#alertError").hide();
$("#submitForm").click(function(e) {
	e.preventDefault();
    _runValidation();
    var data = {};
    data.address = {};
    data.location = {};
    data.contact = {};
    data.course = {};
    data.address.firstName = $("#txtFirstName").val();
    data.address.lastName = $("#txtLastName").val();
    data.address.organization = $("#txtOrganizaiton").val();
    data.address.street = $("#txtStreet").val();
    data.address.suite = $("#txtSuite").val();
    data.address.city = $("#txtCity").val();
    data.address.state = $("#selState").val();
    data.address.zip = $("#txtZip").val();
    data.address.country = $("#txtCountry").val();
    data.contact.phone = $("#txtPhone").val();
    data.contact.fax = $("#txtFax").val();
    data.contact.email = $("#txtEmail").val();
    data.location.gs = $("#selGSLocations").val();
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
    data.course.customizaiton = $("#txtCustomization").val();
    data.course.deliveryDate = $("#v").val();
    data.course.instructor = $("#txtInstructor").val();
    data.course.deliveryMethod = $("[name='radDeliveryMethod']:checked").val()
    if ($("#selHearAbout").val().startsWith("Other")) {
    	data.hearAbout = $("#txtHearAboutOther").val();
  	} else if ($("#selHearAbout").val() !== null) {
  		data.hearAbout = $("#selHearAbout").val();
  	}
    data.comments = $("#txtComments").val();
    data.captchaResponse = $("#g-recaptcha-response").val();
    console.log($("#alertError p").length);

    $.post( "/mailer-onsite-inquiry", data )
      .done(function(data) {
        alertify.success("Email sent successfully.");
        //TODO: add a confirmation and actions
      })
      .fail(function(xhr, textStatus, errorThrown) {
        alertify.failure("Email has failed.");
         console.log(xhr.responseJSON);
         //TODO: read data response and show some error/validation errors
      });
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
});
