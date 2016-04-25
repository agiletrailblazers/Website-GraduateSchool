
$(document).ready(function () {
    $("#gs-alert-remove").css('cursor', 'pointer');
    $("#gs-alert-remove").click(function () {
        $("#gs-alert-error").slideUp();
        $("#gs-alert-error p").remove();
    });
});