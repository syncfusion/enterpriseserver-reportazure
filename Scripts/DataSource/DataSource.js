var browser = ej.browserInfo();
$(function () {
    $("#datasource-edit-popup").ejDialog({
        width: "800px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        showHeader: false,
        enableModal: true,
        close: "onDataSourceEditDialogClose",
        closeOnEscape: true,
        open: "onDataSourceEditDialogOpen"
    });
    $("#datasource-edit-popup .datasource-popup-frame").css({ "height": window.innerHeight * 0.9 + "px" });
    $("#datasource-edit-popup_wrapper").ejWaitingPopup();
    $(document).on("click", ".item-edit", function(e) {
        var itemId = $(this).attr("data-item-id");
        $("#datasource-edit-popup").ejDialog("open");
        ShowWaitingProgress("#datasource-edit-popup_wrapper", "show");
        $("#datasource-edit-popup-iframe").attr("src", editdatasourceviewIframeUrl + "?itemId=" + itemId);
    });
    $(window).resize(function () {
        var gridObj = $("#items").data("ejGrid");
        (window.innerWidth < 1200) ? gridObj.hideColumns("Owner") : gridObj.showColumns("Owner");
    });
});

function IframeLoad() {
    if (browser.name.toLowerCase() == "webkit") {
        $("#datasource-edit-popup, #datasource-popup").find("iframe").contents().find(".e-spanicon").addClass("padding-top-adjust");
    }
    else {
        $("#datasource-edit-popup, #datasource-popup").find("iframe").contents().find(".e-spanicon").removeClass("padding-top-adjust");
    }
}

function onDataSourceEditDialogClose() {
    $("#datasource-edit-popup").find("iframe").contents().find("html").html("");
    $("#datasource-edit-popup").ejDialog("close");
}

$(document).on("click", ".items", function () {
    $(".e-waitpopup-pane").css("display", "none");
});
