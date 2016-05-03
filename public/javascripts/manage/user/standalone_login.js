/**
 * Javascript used by the standalone login page
 */

$(document).ready(function(){

    //Add click function to post ajax call
    $(document).on('click','#login-submit', function () {
        var formData = {
            username: $("#username").val(),
            password: $("#credentials").val()
        };

        $.post("/manage/user/login_user", formData)
            .done(function () {
                // go to home page on success
                window.location = "/";
            })
            .fail(function (xhr, textStatus, errorThrown) {
                if (xhr.responseJSON.passwordChangeRequired){
                    location = "/manage/user/password/change";
                } else {
                    $("#header-login-popover").find("#gs-alert-header-error").find('p').text(xhr.responseJSON.error);
                    $("#header-login-popover").find("#gs-alert-header-error").slideDown();
                }
            });
    });

    //Add Keypress event to allow pressing enter from form
    $(document).on('keypress', '#username', function(event) {
        if(event.which == 13){
            $('#login-submit').click();
        }
    });
    $(document).on('keypress', '#credentials', function(event) {
        if(event.which == 13){
            $('#login-submit').click();
        }
    });

    //Click event to remove error popup
    $("#gs-alert-remove").css('cursor', 'pointer');
    $(document).on('click', '#gs-alert-remove', function (){
        $("#gs-alert-error").slideUp();
    });
});

