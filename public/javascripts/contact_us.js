$(document).ready(function() {
  $("#submitForm").click(function(e) {
    e.preventDefault();
    var data = {};
    data.firstName = $("#first-name").val();
    data.lastName = $("#last-name").val();
    data.comEmail = $("radioPhone").val();
    data.comPhone = $("radioEmail").val();
    data.email = $("#email").val();
    data.phone = $("#phone").val();
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
		  $("#email").focus();
		  $("#email").setAttribute("required", "true");
		  $("#phone").setAttribute("required", "false");
	  } else {
		  $("#emailGroup").hide();
		  $("#phoneGroup").show();
		  $("#phone").focus();
		  $("#phone").setAttribute("required", "true");
		  $("#email").setAttribute("required", "false");
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
