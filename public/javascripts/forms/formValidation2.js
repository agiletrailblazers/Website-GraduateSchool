var validate = {
  email: function(id, alertId, fieldName) {
    var email = $(id).val();
    var result = validations.email(false, email, fieldName);
    if (!result.status) {
      var idForError = id.substring(1);
      $(alertId).append("<p id='" + idForError + "-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>"
                   + result + "</p>");
    }
  },
  captcha: function(id, alertId) {
    if (!skipReCaptcha) {
      console.log("Performing reCaptcha validation");
      var idForError = id.substring(1);
      var googleResponse = $(id).val();
      if (!googleResponse) {
        $(alertId).append("<p id='" + idForError + "-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> For security, please verify you are a real person below.</p>");
      }
    }
    else {
      console.log("Skipping reCaptcha validation");
    }
  }
}
