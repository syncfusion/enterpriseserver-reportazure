$(function() {
    $(window).resize(function () {
        var gridObj = $("#items").data("ejGrid");
        (window.innerWidth < 1200) ? gridObj.hideColumns("Owner") : gridObj.showColumns("Owner");
    });
    refreshFooterPosition();
});

$(document).on('click', '.item-edit', function () {
    var itemId = $(this).attr("data-item-id");
    $("#addDataSetDom").ejDialog("open");
    ShowWaitingProgress("#addDataSetDom_wrapper", "show");
    $("#dataset_popup").attr("src", window.getDatasetDetailsUrl + "?itemId=" + itemId);
});

function OnEditDataSetDialogClose() {
    $("#addDataSetDom").find("iframe").contents().find("html").html("");
}

$(document).on("click", ".items", function () {
    $(".e-waitpopup-pane").css("display", "none");
});

//To hide the dropdown after selecting options
$(document).on("mouseleave", ".dataset-designer-page-views, #itemgrid-dropdown", function () {
    $(".dataset-designer-page-views").hide();
});

$(document).on("mouseover", ".dataset-designer-page-views, #itemgrid-dropdown", function () {
    $(".dataset-designer-page-views").show().focus();
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
