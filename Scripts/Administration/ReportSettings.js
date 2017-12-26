$(document).ready(function () {
    $("#body").ejWaitingPopup();
});

$(document).on("click", "#update-dashboard-settings", function () {
    $(".confirmationMessage").html("");

    var reportSettings = {
        IsMarkItemsPublic: $("#restrict-makepublic-dashboard").is(":checked")
    };
    $("#body").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: $(this).data("url"),
        data: { reportSettingsData: reportSettings },
        success: function (result) {
            if (result.status) {
                SuccessAlert("[[[Report Settings]]]", "[[[Settings has been updated successfully.]]]", 7000);
            } else {
                WarningAlert("[[[Report Settings]]]", "[[[Error while updating settings.]]]", 7000);
            }
            $("#body").ejWaitingPopup("hide");
        }
    });
});