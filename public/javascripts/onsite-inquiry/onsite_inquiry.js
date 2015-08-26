$(document).ready(function() {
  $("#submitForm").click(function(e){
    e.preventDefault;
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

    $.post( "/mailer-onsite-inquiry", data )
      .done(function(data) {
        alertify.("Email sent successfully.")
        //TODO: add a confirmation and actions
      })
      .fail(function(xhr, textStatus, errorThrown) {
        alertify.failure("Email has failed.")
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
});
