$(function () {
    addPlacehoder("#search-area");
    $("#edit-file-popup").ejDialog({
        width: "650px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        title: "Update File",
        enableModal: true,
        showHeader: false,
        close: "OnEditFileDialogClose",
        closeOnEscape: true,
    });
    $("#edit-file-popup_wrapper").ejWaitingPopup();

    $(window).resize(function () {
        var gridObj = $("#items").data("ejGrid");
        (window.innerWidth < 1200) ? gridObj.hideColumns("Owner") : gridObj.showColumns("Owner");
    });
    refreshFooterPosition();
});

$(document).on('click', '.item-edit', function () {
    var itemId = $(this).attr("data-item-id");
    $("#edit-file-popup").ejDialog("open");
    ShowWaitingProgress("#edit-file-popup_wrapper", "show");
    $("#edit-file-popup-iframe").attr("src", EditFilePopupUrl + "?itemId=" + itemId);
});


function editFilePopup(Id, Name, Description) {
    $("#edit-file-popup").ejDialog("open");
    var iframe = $("#EditCategoryPopup_iframe").contents();
    iframe.find("#file_name").val(Name);
    iframe.find("#file-description").val(Description);
}

function OnEditFileDialogClose() {
    $("#edit-file-popup").find("iframe").contents().find("html").html("");
}

$(document).on("click", ".items", function () {
    $(".e-waitpopup-pane").css("display", "none");
});

function refreshFooterPosition(height) {
    var docHeight = $(window).height();
    var footerHeight = $("#base_footer_Div").height();
    $("#base_footer_Div").css("margin-top", "0");
    var footerTop = 322 + footerHeight;
    if (footerTop < docHeight) {
        $("#base_footer_Div").css("margin-top", (docHeight - footerTop - 40) + "px");
    }
}
