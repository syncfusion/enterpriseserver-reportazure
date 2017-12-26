$(document).ready(function () {
    $("#body").ejWaitingPopup();
});

$(document).on("click", "#update-notification-settings", function () {
    var notificationSettingsPost = {
        EnableSystemNotification: $("#enable-system-notification").is(":checked"),
        EnableMailNotification: $("#enable-mail-notification").is(":checked"),
        EnableAutoWatchOfCommentsOfCreatedItems: $("#enable-autowatch-created").is(":checked"),
        EnableAutoWatchOfCommentsOfAccessibleItems: $("#enable-autowatch-access").is(":checked")
    };

    var notificationAdministrationPost = {
        EnableSystemNotification: $("#restrict-system-notification").is(":checked"),
        EnableMailNotification: $("#restrict-mail-notification").is(":checked"),
        EnableAutoWatchOfCommentsOfCreatedItems: $("#restrict-autowatch-created").is(":checked"),
        EnableAutoWatchOfCommentsOfAccessibleItems: $("#restrict-autowatch-access").is(":checked")
    };

    $("#body").ejWaitingPopup("show");

    $.ajax({
        type: "POST",
        url: $(this).data("url"),
        data: { notificationSettings: JSON.stringify(notificationSettingsPost), notificationAdministration: JSON.stringify(notificationAdministrationPost) },
        success: function (result) {
            if (result.Status) {
                SuccessAlert("[[[Notification Settings]]]", "[[[Settings has been updated successfully.]]]", 7000);
            }
            else {
                WarningAlert("[[[Notification Settings]]]", "[[[Error while updating settings.]]]", 7000);
            }
            $("#body").ejWaitingPopup("hide");
        }
    });
});