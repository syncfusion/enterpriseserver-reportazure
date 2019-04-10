$(function () {
    $("#ReportProcessOption_popup").ejDialog({
        width: "750px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        showHeader: false,
        enableModal: true,
        close: "onreportProcessOptionDialogClose",
        open: "onreportProcessOptionDialogOpen"
    });
    $("#ReportProcessOption_schedule_popup").ejDialog({
        width: "800px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        showHeader: false,
        enableModal: true,
        close: "onreportProcessOptionScheduleDialogClose",
        open: "onreportProcessOptionScheduleDialogOpen"
    });
    $("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup();
    $("#ReportProcessOption_popup_wrapper").ejWaitingPopup();

    $("#update-data-source-popup").ejDialog({
        width: "760px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        title: "Update Datasource",
        enableModal: true,
        showHeader: false
    });
    $("#update-data-source-popup_wrapper").ejWaitingPopup();

    $(document).on('click', '.ProcessOption', function () {
        var itemId = $(this).attr("data-itemid");
        $("#ReportProcessOption_popup").ejDialog("open");
        ShowWaitingProgress("#ReportProcessOption_popup_wrapper", "show");
        $("#ReportProcessOption_popup_iframe").attr("src", window.processOptionUrl + "?itemId=" + itemId);
    });

    $(document).on("click", ".item-edit", function(event) {
        $("#report_popup").ejDialog("open");
        ShowWaitingProgress("#report_popup_wrapper", "show");
        $("#report_iframe").attr("src", editreportviewUrl + "?itemId=" + $(this).attr("data-item-id"));
        $("#report_popup_title .e-title").html("Update RDL report");
    });

    $(document).on("click", ".update-datasource", function () {
        var itemId = $(this).attr("data-item-id");
        $("#update-data-source-popup").ejDialog("open");
        ShowWaitingProgress("#update-data-source-popup_wrapper", "show");
        $("#update-data-source-popup-iframe").attr("src", getDataSourceDetailsUrl + "?itemId=" + itemId + "&&itemName=" + $(this).attr("data-itemname") + "&&categoryName=" + $(this).attr("data-category-name"));
        $("#update-data-source-popup-iframe").attr("data-item-id", itemId);
    });

    $(window).resize(function () {
        var gridObj = $("#items").data("ejGrid");
        var actionsDialogObj = $("#ItemAction").data("ejDialog");
        if (actionsDialogObj.isOpened()) {
            actionsDialogObj._dialogPosition();
        }
        var scheduleDialogObj = $("#popup-container").data("ejDialog");
        if (scheduleDialogObj != undefined) {
            if (scheduleDialogObj.isOpened()) {
                scheduleDialogObj._dialogPosition();
            }
        }
    });
    $(".collapseIcon").on("click", function (e) {
        ($(this).hasClass("collapse-category")) ? collapeGrid() : expandGrid();
    });
});

function collapeGrid() {
    $(".collapseIcon").removeClass("collapse-category");
    $(".collapseIcon").addClass("expand-category");
    if (window.innerWidth < 1041) {
        $(".collapseIcon").html('<span class="su su-category-collapse-mobile"><i class="su su-category-collapse-mobile path1"></i><i class="su su-category-collapse-mobile path2"></i></span>');
    }
    else {
        $(".collapseIcon").html("<span class='su su-sidebar-collapse'></span>");
    }
    $(".item-listing").removeClass("expandedGrid");
    $("#base_footer_Div").removeClass("expandedGrid");
    refreshScroller();
}

function expandGrid() {
    $(".collapseIcon").removeClass("expand-category");
    $(".collapseIcon").addClass("collapse-category");
    if (window.innerWidth < 1041) {
        $(".collapseIcon").html('<span class="su su-category-expand-mobile"><i class="su su-category-expand-mobile path1"></i><i class="su su-category-expand-mobile path2"></i></span>');
    }
    else {
        $(".collapseIcon").html("<span class='su su-sidebar-expand'></span>");
    }
    $(".item-listing").addClass("expandedGrid");
    $("#base_footer_Div").addClass("expandedGrid");
}

function initLayoutRender(onResize) {
    if (window.innerWidth < 1025) {
        expandGrid();
        $(".collapseIcon").show();
    }
    else {
        $(".collapseIcon").hide();
        collapeGrid();
    }
}


