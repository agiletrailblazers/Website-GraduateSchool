
$(document).ready(function () {

  $("#cart-form-continue").click(function (event) {
    event.preventDefault();
    // continue to the user page
    window.location.href='/manage/user/create?sessionId=' + $("#sessionId").val();
  });

});
