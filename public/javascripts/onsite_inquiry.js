$(document).ready(function() {
  $("#submitForm").click(function(e){
    e.preventDefault;
    $.ajax({
      url: "/mailer-onsite-inquiry'",
      method: "POST",
      data: "Hello World",
    }).success(function(response){
      console.log(response);
    }).fail(function(response){
      console.log(response);
    });
  });
});
