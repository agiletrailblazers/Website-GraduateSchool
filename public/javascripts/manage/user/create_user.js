var clearErrorAlert = function (formData) {
    $("#gs-alert-error").slideUp();
    $("#gs-alert-error p").remove();

    if ($("#gs-alert-error p").length) {
        $("#gs-alert-error").slideDown("slow");
    }
};

$(document).ready(function () {
    $("#gs-alert-remove").css('cursor', 'pointer');
    $("#gs-alert-remove").click(function() {
        $("#gs-alert-error").slideUp();
        $("#gs-alert-error p").remove();
    });
    $("#dateOfBirth").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+0"
    });

    $("#create-user-form-submit").click(function (event) {
        event.preventDefault();
        $('.loading').show();
        var formData = {
            firstName: $("#firstName").val(),
            middleName: $("#middleName").val(),
            lastName: $("#lastName").val(),
            dateOfBirth: $("#dateOfBirth").val(),
            lastFourSSN: $("#lastFourSSN").val(),
            password: $("#password").val(),
            confirmPassword: $("#confirmPassword").val(),
            street: $("#street").val(),
            suite: $("#suite").val(),
            timezoneId: $("#timezone").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            zip: $("#zip").val(),
            email: $("#email").val(),
            phone: $("#phone").val()
        };

        clearErrorAlert(formData);

        if ($("#password").val().length < 5 || $("#password").val().length > 20){
            $(".loading").hide();
            $("#gs-alert-error").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Password is required and must be at least 5 characters.</p>");
            $("#gs-alert-error").slideDown();
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        }

        else if ($("#password").val() !== $("#confirmPassword").val()){
            $(".loading").hide();
            $("#gs-alert-error").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Password and Confirm Password must be the same.</p>");
            $("#gs-alert-error").slideDown();
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        }

        else {
            var nextPage = $("#nextPage").val();
            if (!$("#gs-alert-error p").length) {
                $.post("/manage/user/create_user", formData)
                    .done(function () {
                        // redirect to payment
                        window.location.href = nextPage;
                    })
                    .fail(function (xhr, textStatus, errorThrown) {
                        $(".loading").hide();

                        alertify.error("Error creating user.");
                        var errors = xhr.responseJSON;
                        for (var key in errors) {
                            if (key === "validationErrors") {
                                var validationErrors = errors[key];
                                for (var i = 0; i < validationErrors.length; i++) {
                                    if (validationErrors[i].fieldName === "person.emailAddress") continue;
                                    $("#gs-alert-error").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + errorMessageForFieldName(validationErrors[i].fieldName) + "</p>");
                                }
                            }
                            else if (errors.hasOwnProperty(key)) {
                                $("#gs-alert-error").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + errors[key] + "</p>");
                            }
                        }
                        $("#gs-alert-error").slideDown();
                        $("html, body").animate({
                            scrollTop: 0
                        }, "slow");
                    });
            }
        }
    });

});

function errorMessageForFieldName(fieldName) {
    switch(fieldName){
        case "username":
            return "Email is required and must be a properly formatted email address.";
        case "password":
            return "Password is required and must be at least 5 characters.";
        case "lastFourSSN":
            return "Last 4 digits of SSN are required and must be 4 characters.";
        case "timezoneId":
            return "Timezone is required.";
        case "person.firstName":
            return "First Name is required.";
        case "person.middleName":
            return "Middle Name";
        case "person.lastName":
            return "Last Name is required.";
        case "person.emailAddress":
            return "Email is required and must be a properly formatted email address.";
        case "person.primaryPhone":
            return "Daytime Phone Number is required.";
        case "person.dateOfBirth":
            return "Date of birth is required.";
        case "person.primaryAddress.address1":
            return "Street Address is required.";
        case "person.primaryAddress.address2":
            return "Suite, Mail Stop";
        case "person.primaryAddress.city":
            return "City is required.";
        case "person.primaryAddress.state":
            return "State is required.";
        case "person.primaryAddress.postalCode":
            return "Zip is required and must be at least 5 characters.";
        default:
            return fieldName;
    }
}
