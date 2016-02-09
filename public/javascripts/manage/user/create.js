
var _runValidation = function (formData) {
  $("#gs-form-alert-error").slideUp();
  $("#gs-form-alert-error p").remove();

  if ($("#gs-form-alert-error p").length) {
    $("#gs-form-alert-error").slideDown("slow");
  }
}

$(document).ready(function () {

  $("#gs-form-alert-remove").css('cursor', 'pointer');
  $("#gs-form-alert-remove").click(function() {
    $("#gs-form-alert-error").slideUp();
    $("#gs-form-alert-error p").remove();
  });

  $("#create-user-form-submit").click(function (event) {
    event.preventDefault();

    var formData = {
      firstName: $("#firstName").val(),
      middleName: $("#middleName").val(),
      lastName: $("#lastName").val(),
      birthMonth: $("#birthMonth").val(),
      birthDay: $("#birthDay").val(),
      birthYear: $("#birthYear").val(),
      lastFourSSN: $("#lastFourSSN").val(),
      password: $("#password").val(),
      confirmPassword: $("#confirmPassword").val(),
      street: $("#street").val(),
      suite: $("#suite").val(),
      city: $("#city").val(),
      state: $("#state").val(),
      zip: $("#zip").val(),
      email: $("#email").val(),
      phone: $("#phone").val()
    };

    _runValidation(formData);

    if (!$("#gs-form-alert-error p").length) {
      $(".loading").show();
      $.post("/manage/user/create", formData)
        .done(function () {
          $(".loading").hide();
          // redirect to payment
          window.location.href='/manage/cart/payment';
        })
        .fail(function (xhr, textStatus, errorThrown) {
          $(".loading").hide();
          alertify.error("Error creating user.")
          var errors = xhr.responseJSON;
          for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
              $("#gs-form-alert-error").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + errors[key] + "</p>");
            }
          }
          $("#gs-form-alert-error").slideDown();
          $("html, body").animate({
            scrollTop: 0
          }, "slow");
        });
    }
  });

  $('#toggle-create-account').click(function() {
      displayCreateAccount();
  });

  $('#toggle-already-have-account').click(function() {
      displayAlreadyHaveAccount();
  });

});

function displayAlreadyHaveAccount() {
  $('#create-account-section').fadeOut();
  $('#toggle-create-account-section').fadeIn();
  $('#toggle-already-have-account-section').fadeOut();
  $('#login-section').fadeIn();
}

function displayCreateAccount() {
  $('#create-account-section').fadeIn();
  $('#toggle-create-account-section').fadeOut();
  $('#toggle-already-have-account-section').fadeIn();
  $('#login-section').fadeOut();
}
