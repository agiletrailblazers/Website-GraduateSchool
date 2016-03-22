/**
 * Javascript used by the header login box
 */

$(document).ready(function(){

    //Add click function to post ajax call
    $(document).on('click','#header-login-submit', function () {
            var formData = {
                username: $("#header-login-popover").find("#username").val(),
                password: $("#header-login-popover").find("#credentials").val()
            };

            $.post("/manage/user/login", formData)
                .done(function () {
                    // reload current page on success
                    location.reload();
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $("#header-login-popover").find("#gs-alert-error").find('p').text(xhr.responseJSON.error);
                    $("#header-login-popover").find("#gs-alert-error").slideDown();
                });
    });

    //Add Keypress event to allow pressing enter from form
    $(document).on('keypress', '#username', function(event) {
        if(event.which == 13){
            $("#header-login-popover").find('#header-login-submit').click();
        }
    });
    $(document).on('keypress', '#credentials', function(event) {
        if(event.which == 13){
            $("#header-login-popover").find('#header-login-submit').click();
        }
    });

    //Click event to remove error popup
    $("#gs-alert-remove").css('cursor', 'pointer');
    $(document).on('click', '#gs-alert-remove', function (){
        $("#header-login-popover").find("#gs-alert-error").slideUp();
        //$("#header-login-popover").find("#gs-alert-error p").text("");
    });

    $('[data-toggle="popover"]').popover({
        html: true,
        content: function() {
            return "<div id='header-login-popover'>" + $('#header-login-content').html() + "</div>";
        }
    });

});

