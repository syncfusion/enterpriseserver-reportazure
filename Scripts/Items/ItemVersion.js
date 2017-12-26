$(document).ready(function () {

    if (($(parent.window).width()) > 1400) {
        $("#version-container").addClass("versions");
    }

    if (($(parent.window).width()) < 1400) {
        $("#version-container").removeClass("versions");
    }

    $(document).on("click", "#version-tab", function (e) {
        $(this).parent("li").addClass("active");
        $("#item-log-tab").parent("li").removeClass("active");
        $("#item-version-container").removeClass("hidden").addClass("show");
        $("#item-log-container").removeClass("show").addClass("hidden");
    });

    $(document).on("click", "#item-log-tab", function (e) {
        $(".down-arrow").css("left", "185px");
        $(this).parent("li").addClass("active");
        $("#version-tab").parent("li").removeClass("active");
        $("#item-version-container").removeClass("show").addClass("hidden");
        $("#item-log-container").removeClass("hidden").addClass("show");
    });

    $(document).on("click", ".version-popup-close", function (e) {
        $("#item-version-controller").css("display", "none");
        eDialog = parent.$("#version-window-container").data("ejDialog");
        eDialog.close();
        $("#version-window-container iframe").attr("src", "");
    });

    $(document).on("click", ".item-roll-back", function (e) {
        var versionId = $(this).attr("data-item-version");
        var itemId = $(this).attr("data-itemid");

        doAjaxPost("POST", rollBackUrl, { ItemId: itemId, versionId: versionId },
            function (data, result) {
                var gridObj = $("#grid").data("ejGrid");
                gridObj.refreshContent();
                var loggridObj = $("#loggrid").data("ejGrid");
                loggridObj.refreshContent();
                $("#loggrid").ejWaitingPopup("hide");
            }, null, null, null, null, null, true);
    });
});

$(document).on("click", ".popup-close", function () {
    window.parent.$("#version-window-container").ejDialog("close");
});
$(document).on("click", "#close-button", function () {
    window.parent.$("#version-window-container").ejDialog("close");
});

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        window.parent.$("#version-window-container").ejDialog("close");
    }
});