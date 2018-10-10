$(document).ready(function () {

    $("#base_container").ejWaitingPopup();
    $("#automatic_activation").ejRadioButton({ size: "medium", checked: usersettings == 0, change: onRadioButtonChange });
    $("#email_activation").ejRadioButton({ size: "medium", checked: usersettings == 1, change: onRadioButtonChange });
    function onRadioButtonChange() {
            var checkedVal = $("input[name='activation']:checked").val();
            if (checkedVal == 'EmailActivation') {
                $.ajax({
                    type: "POST",
                    url: checkMailSettingUrl,
                    success: function (result) {
                        if (result.result == "success") {
                            $(".message").html("");
                        }
                        else if (result.result == "failure" && result.isAdmin == true) {
                            $(".message").html("[[[Activation emails cannot be sent until the email settings are configured. You can select ‘Automatic Activation’ to activate the user without configuring email settings.]]]");
                        }
                    }
                });
                $(".message").show();
            }
            else {
                $(".message").hide();
            }
        }
    });
    $(document).on("click", "#update-usersettings-bottom", function () {
        $(".confirmationMessage").html("");

        var userSettings = {
            ActivationType: $('input:radio[name=activation]:checked').val()
        };
        $("#base_container").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: saveUserSettingsUrl,
            data: { userSettingsData: (userSettings) },
            success: function (result) {
                if (result.status) {
                    $(".confirmationMessage").html("<span class='validate-success'>[[[User Settings has been updated successfully]]]</span>");
                } else {
                    $(".confirmationMessage").html("<span class='validate-error'>[[[Error while updating User Settings]]]</span>");
                }
                $("#base_container").ejWaitingPopup("hide");
            }
        });
    });
