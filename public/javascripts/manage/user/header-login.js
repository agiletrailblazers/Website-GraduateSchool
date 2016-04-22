/**
 * Javascript used by the header login box
 */

$(document).ready(function(){

    //Add click function to post ajax call
    $(document).on('click','#header-login-submit', function () {
            var formData = {
                username: $("#header-login-popover").find("#header-username").val(),
                password: $("#header-login-popover").find("#header-credentials").val()
            };

            $.post("/manage/user/login_user", formData)
                .done(function () {
                    // reload current page on success
                    location.reload();
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $("#header-login-popover").find("#gs-alert-header-error").find('p').text(xhr.responseJSON.error);
                    $("#header-login-popover").find("#gs-alert-header-error").slideDown();
                });
    });

    //Add Keypress event to allow pressing enter from form
    $(document).on('keypress', '#header-username', function(event) {
        if(event.which == 13){
            $("#header-login-popover").find('#header-login-submit').click();
        }
    });
    $(document).on('keypress', '#header-credentials', function(event) {
        if(event.which == 13){
            $("#header-login-popover").find('#header-login-submit').click();
        }
    });

    //Click event to remove error popup
    $("#gs-alert-remove").css('cursor', 'pointer');
    $(document).on('click', '#gs-alert-header-remove', function (){
        $("#header-login-popover").find("#gs-alert-header-error").slideUp();
    });

    $('[data-toggle="popover"]').popover({
        html: true,
        content: function() {
            return "<div id='header-login-popover'>" + $('#header-login-content').html() + "</div>";
        }
    });

});

