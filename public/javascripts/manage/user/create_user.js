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

    $("#create-user-form-submit").click(function (event) {
        event.preventDefault();

        var formData = {
            firstName: $("#firstName").val(),
            middleName: $("#middleName").val(),
            lastName: $("#lastName").val(),
            birthMonth: $("#birthMonth").val(),
            birthDay: $("#birthDay").val(),
            birthYear: $("#birthYear").val(),
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

        if ($("#password").val() !== $("#confirmPassword").val()){
            $("#gs-alert-error").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>Passwords must be the same</p>");
            $("#gs-alert-error").slideDown();
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        }

        else {
            var nextPage = $("#nextPage").val();
            if (!$("#gs-alert-error p").length) {
                $(".loading").show();
                $.post("/manage/user/create_user", formData)
                    .done(function () {
                        $(".loading").hide();
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
                                    $("#gs-alert-error").append("<p><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " + validationErrors[i].errorMessage + ": " + convertFieldName(validationErrors[i].fieldName) + "</p>");
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

function convertFieldName(fieldName) {
    switch(fieldName){
        case "username":
            return "Email";
        case "password":
            return "Password";
        case "lastFourSSN":
            return "Last 4 digits of SSN";
        case "timezoneId":
            return "Timezone";
        case "person.firstName":
            return "First Name";
        case "person.middleName":
            return "Middle Name";
        case "person.lastName":
            return "Last Name";
        case "person.emailAddress":
            return "Email";
        case "person.primaryPhone":
            return "Daytime Phone Number";
        case "person.dateOfBirth":
            return "Date of birth";
        case "person.primaryAddress.address1":
            return "Street Address";
        case "person.primaryAddress.address2":
            return "Suite, Mail Stop";
        case "person.primaryAddress.city":
            return "City";
        case "person.primaryAddress.state":
            return "State";
        case "person.primaryAddress.postalCode":
            return "Zip";
        default:
            return fieldName;
    }
}