$(document).ready(function () {
  $('#customer_feedback_form').hide();
  $('a[data-toggle="tab"]').on('click', function (e) {
    if($(e.target).attr("href")=="#customer-feedback") {
      $('#contact_us_form').hide();
      $('#customer_feedback_form').show();
    }else {
      $('#customer_feedback_form').hide();
      $('#contact_us_form').show();
    }
  });

});