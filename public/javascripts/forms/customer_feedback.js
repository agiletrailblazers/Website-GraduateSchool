var Validate = {
  inputs: function() {
    $("#feedbackForm input").blur(function() {
      if (!$(this).val()) {
        $("#alertError").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> <strong>Please add content.</p>");
      }
    });
  }
}

$(document).ready(function() {
  $("#submitForm").click(function(event) {
    event.preventDefault();
    Validate.inputs();
    var dataForm = {};
    dataForm.firstName = $("#txtFirstName").val();
    dataForm.lastName = $("#txtLastName").val();
    dataForm.phone = $("#telPhone").val();
    dataForm.email = $("#email").val();
    dataForm.typePerson = $("input[name=typePerson]:checked", '#feedbackForm').val();
    dataForm.feedbackCategories = $('input:checkbox:checked.feedbackCategories').map(function() {
      return this.value;
    }).get();
    dataForm.feedbackText = $("#txtFeedback").val();
  });
});
