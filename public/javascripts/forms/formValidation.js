var length = function (id, alertId, fieldName, length) {
  var input = $(id).val();
  var idForError = id.substring(1);
  var noNumbersPattern = new RegExp(/^[^0-9]+$/);
  if (input.trim().length < length) {
    $(alertId).append("<p id='" + idForError + "-length'><span  class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>" + fieldName + "</strong> must be at least " + length + " characters.</p>");
  }
}


var validate = {

  name : function (id, alertId, fieldName) {
    length(id, alertId, fieldName, 2);
  },
  city : function (id, alertId, fieldName) {
    length(id, alertId, fieldName, 3);
  },
  street : function (id, alertId, fieldName) {
    length(id, alertId, fieldName, 5);
  },
  zip : function (id, alertId, fieldName) {
    length(id, alertId, fieldName, 5);
  },
  state: function(id, alertId) {
    var input = $(id).val();
    var idForError = id.substring(1);
    if (!input) {
      $(alertId).append("<p id='" + idForError + "-length'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please select a <strong>state</strong>.</p>");
    }
  },
  phone: function(id, alertId, fieldName) {
    length(id, alertId, fieldName, 1);
  },
  email: function(id, alertId, fieldName) {
    var email = $(id).val();
    var idForError = id.substring(1);
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (!pattern.test(email)) {
        $(alertId).append("<p id='" + idForError + "-format'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>" + fieldName + "</strong>  is incorrect.</p>");
    }
  }
}
