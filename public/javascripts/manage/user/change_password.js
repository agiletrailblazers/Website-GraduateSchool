$(document).ready(function(){

    //Add click function to post ajax call
    $(document).on('click','#pwChange-form-submit', function () {
        var formData = {
            username: $("#username").val(),
            oldPassword: $("#oldPassword").val(),
            newPassword: $("#newPassword").val()
        };

        if ($("#newPassword").val() !== $("#confirmNewPassword").val()){
            $("#gs-alert-error").find('p').text("New Password and Confirm New Password must be the same.");
            $("#gs-alert-error").slideDown();
        } else {
            $.post("/manage/user/password/change", formData)
                .done(function () {
                    location.reload();
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $("#gs-alert-error").find('p').text(xhr.responseJSON.error);
                    $("#gs-alert-error").slideDown();
                });
        }
    });

    //Add Keypress event to allow pressing enter from form
    $(document).on('keypress', '#username', function(event) {
        if(event.which == 13){
            $('#pwChange-form-submit').click();
        }
    });
    $(document).on('keypress', '#oldPassword', function(event) {
        if(event.which == 13){
            $('#pwChange-form-submit').click();
        }
    });
    $(document).on('keypress', '#newPassword', function(event) {
        if(event.which == 13){
            $('#pwChange-form-submit').click();
        }
    });
    $(document).on('keypress', '#confirmNewPassword', function(event) {
        if(event.which == 13){
            $('#pwChange-form-submit').click();
        }
    });

    //Click event to remove error popup
    $("#gs-alert-remove").css('cursor', 'pointer');
    $(document).on('click', '#gs-alert-remove', function (){
        $("#gs-alert-error").slideUp();
    });
});

