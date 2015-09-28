$(document).ready(function() {
  $("#submitForm").click(function(event) {
    event.preventDefault();
    var data = {};
    data.name = $("#name").val();
    data.email = $("#email").val();
    date.findInfo = $('input[name=optRadio]:checked', '#feedbackForm').val();
    data.siteInfo = $('textarea[name="findSiteInfo"]').val();
    data.generalComments = $('textarea[name="generalComments"]').val();
  });
});
