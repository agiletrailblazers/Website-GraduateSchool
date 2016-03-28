var _runValidation = function (formData) {
  $("#gs-alert-error").slideUp();
  $("#gs-alert-error p").remove();

  if ($("#gs-alert-error p").length) {
    $("#gs-alert-error").slideDown("slow");
  }
}

$(document).ready(function () {
  $('#create-account-section').hide();
  $("#gs-alert-remove").css('cursor', 'pointer');
  $("#gs-alert-remove").click(function() {
    $("#gs-alert-error").slideUp();
    $("#gs-alert-error p").remove();
  });

  $('#toggle-create-account').click(function() {
      displayCreateAccount();
  });
  $('#toggle-create-account-image').click(function() {
    displayCreateAccount();
  });

  $('#toggle-already-have-account').click(function() {
      displayAlreadyHaveAccount();
  });

});

function displayAlreadyHaveAccount() {
  $("#gs-alert-error").remove();
  $('#create-account-section').fadeOut();
  $('#toggle-create-account-section').fadeIn();
  $('#toggle-already-have-account-section').fadeOut();
  $('#login-section').fadeIn();
  $('#login-divider').fadeIn();

}

function displayCreateAccount() {
  $('#create-account-section').fadeIn();
  $('#toggle-create-account-section').fadeOut();
  $('#toggle-already-have-account-section').fadeIn();
  $('#login-section').fadeOut();
  $('#login-divider').fadeOut();

}
