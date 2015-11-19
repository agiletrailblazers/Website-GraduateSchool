
var validate = {
  name : function (id, alertId, fieldName) {
    var input = $(id).val();
    var idForError = id.substring(1);
    var noNumbersPattern = new RegExp(/^[^0-9]+$/);
    if (input.trim().length < 1) {
      $(alertId).append("<p id='" + idForError + "-empty'><span  class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>" + fieldName + "</strong> is empty.</p>");
    }
    else if (!noNumbersPattern.test(input)) {
      $(alertId).append("<p id='" + idForError + "-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>" + fieldName + "</strong> should not have numbers.</p>");
    }
  },
  email: function(id, alertId, fieldName) {
    var email = $(id).val();
    var idForError = id.substring(1);
    if (email.trim().length < 1) {
      $(alertId).append("<p id='" + idForError + "-empty'><span  class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>" + fieldName + "</strong> is empty.</p>");
    }
    else {
      var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
      if (!pattern.test(email)) {
          $(alertId).append("<p id='" + idForError + "-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>" + fieldName + "</strong>  is incorrect.</p>");
      }
    }
  },
  CheckEmptyString: function(id, alertId, fieldName) {
    var input = $(id).val();
    var idForError = id.substring(1);
    if (input.trim().length < 1) {
      $(alertId).append("<p id='" + idForError + "-empty'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>" + fieldName + "</strong> is empty</p>");
    }
  },
}
