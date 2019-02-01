var isFirstRequest = false;
var ScheduleId, ItemId, ItemName;

$(document).ready(function () {

    $("#messageBox").ejDialog({
        width: "450px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        showHeader: false,
        enableModal: true,
        close: "onMessageDialogClose"
    });

    $("#schedule-delete-confirmation").ejDialog({
        width: "450px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        title: "Delete item",
        showHeader: false,
        enableModal: true
    });

    $("#editpopup-container").ejDialog({
        allowDraggable: false,
        enableResize: false,
        enableModal: true,
        showHeader: false,
        showOnInit: false,
        close: "onSchedulerEditDialogClose",
        open: "onSchedulerEditDialogOpen",
        width: "876px"
    });

    $("#permission-popup").ejDialog({
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        width: "900px",
        title: "",
        showHeader: false,
        enableModal: true,
        close: "DialogBoxClose",
        closeOnEscape: true
    });

    $("#editpopup-container_wrapper").ejWaitingPopup();
    $("#schedule-delete-confirmation_wrapper").ejWaitingPopup();
    $("#permissionPopup_wrapper").ejWaitingPopup();
});

$(document).on("click", ".item-permissions", function () {
    $("#permission-popup").find("iframe").attr("src", window.permissionIframeUrl + "?itemId=" + $(this).attr("data-itemId"));
    $("#permission-popup").ejDialog("open");
    ShowWaitingProgress("#permissionPopup_wrapper", "show");
});

$(document).on("click", ".search-schedule", function () {
    if ($("#search-schedules").css("display") === "block" || $("#search-schedules").css("display") === "inline-block") {
        $(".search-schedule").removeClass("add-background");
    }
    else {
        $(".search-schedule").addClass("add-background");
    }
    if (window.innerWidth < 401) {
        $("#search-schedules").val("");
        $("#search-schedules").toggle();
        $(".page-heading").toggle();
        $("#scheduleGrid").toggleClass("height-adjust");
    }
    else {
        var gridObj = $("#scheduleGrid").data("ejGrid");
        gridObj.search($("#search-schedules").val());
    }
});

$(document).on("click", "#clear-search", function () {
    var searchScheduleInput = $("#search-schedules");

    if (searchScheduleInput.css("display") === "block" || searchScheduleInput.css("display") === "inline-block") {
        searchScheduleInput.addClass("add-background");
    }
    else {
        searchScheduleInput.removeClass("add-background");
    }
});

$(window).on("resize", function () {
    var gridObj = $("#scheduleGrid").data("ejGrid");
    if (window.innerWidth < 1200) {
        if (typeof gridObj.model.columns[6] != "undefined") {
            gridObj.model.columns[6].width = 50;
            gridObj.columnsWidthCollection[6] = 50;
            gridObj.hideColumns("Last Run");
        }
    }
    else {
        if (typeof gridObj.model.columns[6] != "undefined") {
            gridObj.model.columns[6].width = 50;
            gridObj.columnsWidthCollection[6] = 50;
            gridObj.showColumns("Last Run");
        }
    }
    if (window.innerWidth < 1041) {
        gridObj.hideColumns("ItemName");
        gridObj.hideColumns("NextScheduleString");
        gridObj.hideColumns("Status");
        gridObj.hideColumns("ExportPath");
        gridObj.hideColumns("ScheduleParameter");
    }
    else {
        gridObj.showColumns("ItemName");
        gridObj.showColumns("NextScheduleString");
        gridObj.showColumns("Status");
        gridObj.showColumns("ExportPath");
        gridObj.showColumns("ScheduleParameter");
    }
    if ($("#clear-search").css("display") === "block") {
        $("#search-schedules").css("display", "block");
    }
    gridObj.setWidthToColumns();
    var scheduleDialogObj = $("#editpopup-container").data("ejDialog");
    if (scheduleDialogObj.isOpened()) {
        scheduleDialogObj._dialogPosition();
    }
});

$(window).on("load", function () {
    var gridObj = $("#scheduleGrid").data("ejGrid");
    if (window.innerWidth < 1200 && window.innerWidth > 1040) {
        gridObj.hideColumns("Last Run");
    }
    else if (window.innerWidth > 1040) {
        gridObj.showColumns("Last Run");
    }
});

function manageSchedule(scheduleName, dataScheduleId, dataItemName, itemCategoryName, itemId, className) {
    var currentSelection = className;
    var scheduleId = "";
    if (dataScheduleId !== "") {
        scheduleId = dataScheduleId;
    }

    switch (currentSelection) {
        case "edit-schedule":
        case "su su-edit":
            var itemName = dataItemName;
            ScheduleId = scheduleId;
            ItemId = itemId;
            CategoryName = itemCategoryName;
            ItemName = itemName;
            $("#editpopup-container").ejDialog("open");
            break;
        case "remove-schedule":
        case "su su-delete":
            removeSchedule(scheduleId);
            break;
        case "enable-schedule":
        case "su su-folder85":
            enableSchedule(scheduleId);
            break;
        case "disable-schedule":
        case "su su-folder85":
            disableSchedule(scheduleId);
            break;
        case "su su-play":
        case "on-demand-schedule":
            ShowWaitingProgress("#server-app-container", "show");
            onDemandSchedule(scheduleId, scheduleName);
            break;
    }
}

function enableSchedule(id) {
    ShowWaitingProgress("#server-app-container", "show");
    $.ajax({
        type: "POST",
        url: window.enableScheduleUrl,
        data: { scheduleId: id },
        async: false,
        success: function () {
            refreshScheduleGrid();
            ShowWaitingProgress(".share-popup-header", "hide");
        }
    });
}

function disableSchedule(id) {
    ShowWaitingProgress("#server-app-container", "show");
    $.ajax({
        type: "POST",
        url: window.disableScheduleUrl,
        data: { scheduleId: id },
        async: false,
        success: function () {
            refreshScheduleGrid();
            ShowWaitingProgress(".share-popup-header", "hide");
        }
    });
}

function onDemandSchedule(id, scheduleName) {
    $.ajax({
        type: "POST",
        url: window.ondemandScheduleUrl,
        data: { scheduleId: id },
        success: function () {
            ShowWaitingProgress("#server-app-container", "hide");
            var sizeobj = $("#messageBox").data("ejDialog");
            var previousHeight = sizeobj.option("height");
            sizeobj.option("height", "200px");
            messageBox("su-play", "[[[Run Now]]]", "[[[Schedule]]]—<span class='highlight-name'>" + scheduleName + "</span> [[[has been started successfully.]]]", "success", function () {
                sizeobj.option("height", previousHeight);
                parent.onCloseMessageBox();
            });
        }
    });
}

function fnActionBegin() {
    isFirstRequest = true;
}

function rowBound(height){
	if(isFirstRequest){
		isFirstRequest=false;
	}
}

function removeSchedule(id) {
    $("#schedule-delete-confirmation").ejDialog("open");
    $("#schedule-delete-confirmation_wrapper").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: window.deleteScheduleUrl,
        data: { scheduleId: id },
        success: function (data) {
            $("#schedule-delete-confirmation").html(data);
            $("#delete-popup-container .dialog-body").addClass("text-left").removeClass("text-center");
            $("#delete-schedule").attr("data-schedule-id", id);
            $("#schedule-delete-confirmation_wrapper").ejWaitingPopup("hide");
        }
    });
}

$(document).on("click", "#delete-schedule", function () {
    $("#schedule-delete-confirmation_wrapper").ejWaitingPopup("show");
    var id = $(this).attr("data-schedule-id");
    $.ajax({
        type: "POST",
        url: window.removeScheduleUrl,
        data: { scheduleId: id },
        success: function (data) {
            if (data) {
                $("#schedule-delete-confirmation_wrapper").ejWaitingPopup("hide");
                $("#delete-popup-container .dialog-body").addClass("text-center").removeClass("text-left");
                $(".dialog-footer .validation-area").css("display", "none");
                $(".dialog-footer .success-area").css("display", "block");
                $(".popup-close").attr("onclick", "deleteSuccess()");
                $(".delete-schedule-content").html("[[[Schedule has been deleted successfully.]]]");
                $(document).keyup(function (es) {
                    if (es.keyCode === 27) {
                        deleteSuccess();
                    }
                });
            }
        }
    });
});

function deleteScheduleDialogClose() {
    $("#schedule-delete-confirmation").ejDialog("close");
}

$(document).on("click", ".popup-close", function () {
    $("#schedule-delete-confirmation").ejDialog("close");
});

function deleteSuccess() {
    $(this).removeAttr("onclick");
    var scheduleGridObj = $("#scheduleGrid").data("ejGrid");
    var currentPage = scheduleGridObj.model.pageSettings.currentPage;
    var pageSize = scheduleGridObj.model.pageSettings.pageSize;
    var totalRecordsCount = scheduleGridObj.model.pageSettings.totalRecordsCount;
    var lastPageRecordCount = totalRecordsCount % pageSize;

    if (lastPageRecordCount !== 0 && lastPageRecordCount <= 1) {
        scheduleGridObj.model.pageSettings.currentPage = currentPage - 1;
    }
    refreshScheduleGrid();
}

function onSchedulerEditDialogClose() {
    $("#editpopup-container").find("iframe").contents().find("html").html("");
}
function onSchedulerEditDialogOpen() {
    $("#editscheduler-popup-iframe").attr("src", window.schedulerIframeUrl + "?itemName=" + ItemName + "&&itemId=" + ItemId + "&&categoryName=" + CategoryName + "&&scheduleId=" + ScheduleId + "&&actionType=Edit");
    $("#editpopup-container_wrapper").ejWaitingPopup("show");
}
function refreshScheduleGrid() {
    var scheduleGridObj = $("#scheduleGrid").data("ejGrid");
    var sortingInfo = scheduleGridObj.model.sortSettings.sortedColumns;
    $.ajax({
        type: "POST",
        url: window.getSchedulesUrl,
        beforeSend: ShowWaitingProgress("#server-app-container", "show"),
        success: function (result) {
            $("#scheduleGrid").ejGrid("option", "model.dataSource", result);
            var currentGridObj = $("#scheduleGrid").data("ejGrid");
            if (sortingInfo != null) {
                if (sortingInfo[0] != null) {
                    currentGridObj.sortColumn(sortingInfo[0].field, sortingInfo[0].direction);
                }
            }
            ShowWaitingProgress("#server-app-container", "hide");
        }
    });
}
$.views.converters("toLowerCase", function (name) {
    return name.toLowerCase();
});