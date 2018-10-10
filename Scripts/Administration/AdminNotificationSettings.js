$(document).ready(function () {
    $("#enable_system").ejCheckBox({ size: "medium", checked: notificationSettings.EnableSystemNotification == 0 });
    $("#enable_mail").ejCheckBox({ size: "medium", checked: notificationSettings.EnableMailNotification == 0 });
    $("#enable_autowatch_created").ejCheckBox({ checked: notificationSettings.EnableAutoWatchOfCommentsOfCreatedItems == 0, size: "medium" });
    $("#enable_autowatch_access").ejCheckBox({ checked: notificationSettings.EnableAutoWatchOfCommentsOfAccessibleItems == 0, size: "medium" });
    $("#restrict_system").ejCheckBox({ size: "medium", checked: window.notificationAdministration.EnableSystemNotification });
    $("#restrict_mail").ejCheckBox({ size: "medium", checked: window.notificationAdministration.EnableMailNotification });
    $("#restrict_autowatch_created").ejCheckBox({ size: "medium", checked: window.notificationAdministration.EnableAutoWatchOfCommentsOfCreatedItems });
    $("#restrict_autowatch_access").ejCheckBox({ size: "medium", checked: window.notificationAdministration.EnableAutoWatchOfCommentsOfAccessibleItems });
    $("#base_container").ejWaitingPopup();
    $(document).on("click", "#update_notification_settings", function () {
        $(".confirmatioMessage").html("");
        var notificationSettingsPost = {
            EnableSystemNotification: $("#enable_system").data("ejCheckBox").model.checked,
            EnableMailNotification: $("#enable_mail").data("ejCheckBox").model.checked,
            EnableAutoWatchOfCommentsOfCreatedItems: $("#enable_autowatch_created").data("ejCheckBox").model.checked,
            EnableAutoWatchOfCommentsOfAccessibleItems: $("#enable_autowatch_access").data("ejCheckBox").model.checked
        };
        var notificationAdministrationPost = {
            EnableSystemNotification: $("#restrict_system").data("ejCheckBox").model.checked,
            EnableMailNotification: $("#restrict_mail").data("ejCheckBox").model.checked,
            EnableAutoWatchOfCommentsOfCreatedItems: $("#restrict_autowatch_created").data("ejCheckBox").model.checked,
            EnableAutoWatchOfCommentsOfAccessibleItems: $("#restrict_autowatch_access").data("ejCheckBox").model.checked
        };
        $("#base_container").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: savenotificationsettingsUrl,
            data: { notificationSettings: JSON.stringify(notificationSettingsPost), notificationAdministration: JSON.stringify(notificationAdministrationPost) },
            success: function (result) {
                result.Status ? $(".confirmatioMessage").html("<span class='validate-success'>[[[Notification settings has been updated successfully]]]</span>") :
                    $(".confirmatioMessage").html("<span class='validate-error'>[[[Error while updating notification settings]]]</span>");
                $("#base_container").ejWaitingPopup("hide");
            }
        });
    });
});