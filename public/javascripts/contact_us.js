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
});
