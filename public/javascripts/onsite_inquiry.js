$(document).ready(function() {
  $("#submitForm").click(function(e){
    e.preventDefault;
    $.ajax({
      url: "/mailer-onsite-inquiry'",
      method: "POST",
      data: "Hello World"
    }).success(function(response){
      console.log(response);
    }).fail(function(response){
      console.log(response);
    });
  });
  $("#chkGSLocations").click(function() {
	   $("#selGSLocations").attr("disabled", !this.checked);
  });
  $("#chkYourLocations").click(function() {
	   $("#txtYourLocations").attr("disabled", !this.checked);
  });
  $("#chkOtherLocations").click(function() {
	   $("#txtOtherLocations").attr("disabled", !this.checked);
  });
});
