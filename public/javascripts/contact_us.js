$(document).ready(function() {
  $("#submitForm").click(function(e) {
    e.preventDefault();
    var data = {};
    data.firstName = $("#txtFirstName").val();
    data.lastName = $("#txtLastName").val();
    data.comEmail = $("radioPhone").val();
    data.comPhone = $("radioEmail").val();
    data.email = $("#txtEmail").val();
    data.phone = $("#telPhone").val();
    data.comments = $("#commentText").val();
    data.subject = $("#selInputSubject option:selected").text();
    data.captchaResponse = $("#g-recaptcha-response").val();
    $.post( "/mailer-contact-us", data )
      .done(function(data) {
        alert("Success");
        //TODO: add a confirmation and actions
      })
      .fail(function(xhr, textStatus, errorThrown) {
         alert("Failed");
         console.log(xhr.responseJSON);
         //TODO: read data response and show some error/validation errors
      });
  });
  $('input[name="communication"]:radio').change(function() {
	  if (this.id == "radioEmail") {
		  $("#phoneGroup").hide();
		  $("#emailGroup").show();
		  $("#txtEmail").focus();
		  $("#txtEmail").setAttribute("required", "true");
		  $("#telPhone").setAttribute("required", "false");
	  } else {
		  $("#emailGroup").hide();
		  $("#phoneGroup").show();
		  $("#phone").focus();
		  $("#phone").setAttribute("required", "true");
		  $("#txtEmail").setAttribute("required", "false");
	  }
  });
  $('#inputSubject').change(function() {
	  if (this.value == "Other") {
		  $("#otherSubject").show();
		  $("#inputOtherSubject").focus();
	  }
	  else {
		  $("#otherSubject").hide();
		  $("#inputOtherSubject").val("");
	  }
  });
});
