$(document).ready(function() {
  $("#submitForm").click(function(event) {
    event.preventDefault();
    var dataForm = {};
    dataForm.firstName = $("#txtFirstName").val();
    dataForm.lastName = $("#txtLastName").val();
    dataForm.phone = $("#telPhone").val();
    dataForm.email = $("#email").val();
    dataForm.typePerson = $("input[name=typePerson]:checked", '#feedbackForm').val();
    dataForm.feedbackCategories = $('input:checkbox:checked.feedbackCategories').map(function () {
                                    return this.value;
                                  }).get();
    dataForm.feedbackText = $("#txtFeedback").val();
  });
});
