$(document).ready(function() {
  $("#submitForm").click(function(e){
    var data = $("contactForm").serialize();
    console.log(data);
    e.preventDefault;
    $.ajax({
      url: "/mailer-contact-us",
      method: "POST",
      data: data
    }).success(function(response){
      console.log(response);
    }).fail(function(response){
      console.log(response);
    });
  });
});
