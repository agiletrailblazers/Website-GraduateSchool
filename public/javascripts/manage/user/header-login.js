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
                    if (xhr.responseJSON.passwordChangeRequired){
                        location = "/manage/user/password/change";
                    } else {
                        $("#header-login-popover").find("#gs-alert-header-error").find('p').text(xhr.responseJSON.error);
                        $("#header-login-popover").find("#gs-alert-header-error").slideDown();
                    }
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

    //Login Popovers for Desktop Login buttons - slim and regular header
    $("#login-non-mob-slim, #login-non-mob").popover({
        html: true,
        content: function() {
            return "<div id='header-login-popover'>" + $('#header-login-content').html() + "</div>";
        }
    });

    //Login Popover for Mobile Login button
    $("#login-mob").popover({
        html: true,
        content: function() {
            return "<div id='header-login-popover'>" + $('#header-login-content').html() + "</div>";
        }
    }).click(function() {
      $('.popover').css({
        "left":"0",
	       "max-width":"100%",
         "width":"100%"
      });
      $('.arrow').css({
        "left":"unset",
	       "right":"55px"
      });
    });

    //Displays Logged Box for MyAccount button on mobile
    $("#login-mob-logged").click(function() {
        $("#logged-box").toggle();
        $(".arrow-up-mobile").toggle();
    });

});
