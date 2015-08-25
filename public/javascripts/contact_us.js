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
    $.ajax({
      url: "/mailer-contact-us",
      cache: false,
      method: "POST",
      dataType: "json",
      data: data
    }).success(function(response) {
      console.log(response);
    }).fail(function(response) {
      console.log(response);
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
