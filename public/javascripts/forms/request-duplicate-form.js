$(document).ready(function() {
  $("requestDuplicateForm").submit(function(event) {
    event.preventDefault();
    formData = {};
    formData.firstName = $("#txtFirstName").val();
    formData.lastName = $("#txtLastName").val();
    formData.street = $("#txtStreet").val();
    formData.suite = $("#txtSuite").val();
    formData.city = $("#txtCity").val();
    formData.zip = $("#txtZip").val();
    formData.country = $("#txtCountry").val();
    formData.phone = $("#telPhone").val();
    formData.fax = $("#txtFax").val();
    formData.email = $("#txtEmail").val();
  });
});
