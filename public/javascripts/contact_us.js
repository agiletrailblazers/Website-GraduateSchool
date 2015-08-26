var Validate = {
  firstName: function() {
    var input = $("#txtFirstName").val();
    if (input.length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>First Name</strong> should be at least 3 characters.</p>");
    }
  },
  lastName: function() {
    var input = $("#txtLastName").val();
    if (input.length < 3) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Last Name</strong> should be at least 3 characters.</p>");
    }
  },
  email: function(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (!pattern.test(email)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Email address is incorrect.</p>");
    }
  },
  phone: function(phone) {
    var pattern = new RegExp(/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/);
    if (!pattern.test(phone)) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Phone number is incorrect.</p>");
    }
  },
  communication: function() {
    if (!$("#radioEmail").is(':checked') && !$("#radioPhone").is(':checked')) {
      $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Please choose a mode of communication.</p>");
    }
    switch (true) {
      case ($("#radioEmail").is(':checked')):
        var address = $("#txtEmail").val();
        Validate.email(address);
        break;
      case ($("#radioPhone").is(':checked')):
        var number = $("#telPhone").val();
        Validate.phone(number);
        break;
    }
  }
}

var _runValidation = function() {
  $("#alertError").slideUp();
  $("#alertError p").remove();
  Validate.firstName();
  Validate.lastName();
  Validate.communication();
  if ($("#alertError p").length) {
    $("#alertError").slideDown("slow");
  }
}

$(document).ready(function() {
  $("#alertError").hide();
  $("#submitForm").click(function(e) {
    e.preventDefault();
    _runValidation();
    var data = {};
    data.firstName = $("#txtFirstName").val();
    data.lastName = $("#txtLastName").val();
    data.comEmail = $("#radioPhone").val();
    data.comPhone = $("#radioEmail").val();
    data.email = $("#txtEmail").val();
    data.phone = $("#telPhone").val();
    data.comments = $("#commentText").val();
    data.subject = $("#selInputSubject option:selected").text();
    if (!$("#alertError p").length) {
      $.post("/mailer-contact-us", data)
        .done(function(data) {
          alert("Success");
          //TODO: add a confirmation and actions
        })
        .fail(function(xhr, textStatus, errorThrown) {
          alert("Failed");
          console.log(xhr.responseJSON);
          var errors = xhr.responseJSON;
          for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
              $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + errors[key] +"</p>");
            }
          }
          $("#alertError").slideDown();
          //TODO: read data response and show some error/validation errors
        });
    }
  });
  $('input[name="communication"]:radio').change(function() {
    if (this.id == "radioEmail") {
      $("#phoneGroup").hide();
      $("#emailGroup").show();
      $("#txtEmail").focus();
      $("#txtEmail").setAttribute("required", "true");
      $("#telPhone").setAttribute("required", "false");
    } else {
      $("#emailGroup").hide();
      $("#phoneGroup").show();
      $("#phone").focus();
      $("#phone").setAttribute("required", "true");
      $("#txtEmail").setAttribute("required", "false");
    }
  });
  $('#inputSubject').change(function() {
    if (this.value == "Other") {
      $("#otherSubject").show();
      $("#inputOtherSubject").focus();
    } else {
      $("#otherSubject").hide();
      $("#inputOtherSubject").val("");
    }
  });
  $("#removeAlert").click(function() {
    $("#alertError").slideUp();
    $("#alertError p").remove();
  });
});
