var oldUserSelected = [];
var oldGroupSelected = [];
var oldExternalRecipientSelected = [];
var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");
var url = "";
var reportItemName = "";
var reportItemId = "";
var reportParameterItemId = "";
var isReportIdChanged = false;
var reportCategoryName = "";
var createdItemId = "";
var item = "";
var listReports = "";

var isSafariOrEdge = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) || (navigator.userAgent.indexOf("Edge") != -1);


var timeFormat = "";
var dateFormat = "";

$(document).ready(function () {
    dateFormat = $("#dateFormat").val();
    timeFormat = $("#timeFormat").val();
});


function createSchedule(itemId, itemName, categoryName) {
    ShowWaitingProgress("#server-app-container", "show");
    oldUserSelected = [];
    oldGroupSelected = [];
    oldExternalRecipientSelected = [];
    reportItemName = itemName;
    reportItemId = itemId;
    reportParameterItemId = itemId;
    reportCategoryName = categoryName;
    parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
    itemName != "" ? $(".schedule-popup-title").html(" " + itemName + " - Schedule") : $(".schedule-popup-title").html(" " + itemName + " Schedule");
    $(".schedule-popup-title").attr("title", itemName);
    createdItemId = itemId;
}

$("#scheduleSearch_global").on("keyup", "#scheduleSearch_formfield", function () {
    var searchText = $(this).val();
    if (searchText.length > 2) {
        $("#scheduleGrid").data("ejGrid").search(searchText);
    } else {
        $("#scheduleGrid").data("ejGrid").search("");
    }
});

var recurrence = "";
var endType = "";
var endDate = "";
var endAfter = "";
var startDate = "";
var itemRecurrence = "";
var exportType = "";
var subscriberExternalRecipient = "";
var subscriberGroup = "";
var subscriberUser = "";
var exportFilesettingInEdit = "";
function editSchedule(id, itemId, itemName, categoryName) {
    $("#schedule-submit").attr("data-schedule-id", id);
    $("#schedule-submit").attr("data-item-id", itemId);
    itemName != "" ? $(".schedule-popup-title").html(" " + itemName + " - Schedule") : $(".schedule-popup-title").html(" " + itemName + " Schedule");
    $(".schedule-popup-title").attr("title", itemName);
    reportParameterItemId = id;
    createdItemId = itemId;
    reportItemName = itemName;
    reportItemId = itemId;
    reportCategoryName = categoryName;
    $.ajax({
        type: "POST",
        url: getScheduleInfoUrl,
        data: { scheduleId: id },
        success: function (data) {
            item = data.ScheduleItem;
            $("#schedule-name").val(item.Name);
            parent.$("#editpopup-container_wrapper").ejWaitingPopup("hide");
            $("#enable-schedule").prop("checked", item.IsEnabled);

            $("#enable-parameter").prop("checked", item.IsParameterEnabled);

            recurrence = item.RecurrenceType;
            endType = item.EndType;
            endDate = item.EndDateString;
            endAfter = item.EndAfter;
            startDate = item.StartDateString;
            createdItemId = item.ItemId;
            itemRecurrence = item.Recurrence;
            exportType = item.ExportType;
            subscriberExternalRecipient = data.SubscribedExternalRecipient;
            subscriberGroup = data.SubscribedGroup;
            subscriberUser = data.SubscribedUser;

            //Export File Setting Info
            exportFilesettingInEdit = data.ExportFileSetting;
        }
    });

    $("#group-search-container").click(function () {
        $("#group-search-container").addClass("value-changed");
        $("#group-search").next("div").find(".dropdown-menu").addClass("dropdown-width");
        var selectedCount = $("#group-search-container .bootstrap-select li.selected").length;
        var allListCount = $("#group-search-container .bootstrap-select li").length;
        if (selectedCount == allListCount) {
            $($("#group-search-container div.bs-deselect-all-custom").children("span")[0]).text("Clear All");
        }
    });
    $("#user-search-container").click(function () {
        $("#user-search-container").addClass("value-changed");
        $("#user-search").next("div").find(".dropdown-menu").addClass("dropdown-width");
        var selectedCount = $("#user-search-container .bootstrap-select li.selected").length;
        var allListCount = $("#user-search-container .bootstrap-select li").length;
        if (selectedCount == allListCount) {
            $($("#user-search-container div.bs-deselect-all-custom").children("span")[0]).text("Clear All");
        }
    });
}

function scheduleNameCheck(scheduleId, scheduleName) {
    $("#schedule-name-error-container").css("display", "none");
    $("#schedule-name-error-container").parent().append($("<span class='col-sm-4 no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); margin-left:-73px'></span>"));
    $.ajax({
        type: "POST",
        url: checkScheduleNameExistUrl,
        data: { scheduleId: scheduleId, scheduleName: scheduleName },
        success: function (data) {
            if (data.Result) {
                $("span.loader-gif").remove();
                $("#schedule-name").closest("div").addClass("has-error");
                $("#schedule-name-error-container").css("display", "block");
                $("#schedule-name-error-container").css("margin-left", "-30px");
                $("#schedule-name-validator").html("[[[Schedule name already exists]]]");
            } else {
                $("#schedule-name").closest("div").removeClass("has-error");
                $("span.loader-gif").remove();
                $("#schedule-name-error-container").css("display", "none");
            }
        }
    });
}

function refreshScheduleGridItem(scheduleId) {
    //change the loading icon to play icon
    var scheduleGridObj = $("#scheduleGrid").data("ejGrid");
    for (var i = 0; i < scheduleGridObj.model.currentViewData.length; i++) {
        if (scheduleGridObj.model.currentViewData[i].Id == scheduleId) {
            $("span span[data-scheduleid =" + scheduleId + "]").removeClass("loader-gif").addClass("su-play-folder");
        }
    }
}

function enableScheduleOption() {
    $(".subscribe-popup-body, #next-container, #submit-container,#time-intervals-div, #parameters-panel").css("display", "none");
    $(".schedule-popup-body").fadeIn();
    $("#next-container").css("display", "block");
    $("#schedule-back").css("display", "none");
    $("#windowCaption").text("[[[Choose a report to schedule]]]");
    if ($("#schedule-settings-body").length > 0) {
        $("#schedule-settings-body").css("display", "none");
    }
    if ($("#schedule-next").hasClass("subscribe-body") || $("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("subscribe-body");
        $("#schedule-next").removeClass("time-interval-body");
        $("#schedule-next").removeClass("schedule-settings-password-body");
    }
}

function enableSubscribeOption() {
    $(".schedule-popup-body").css("display", "none");
    $(".subscribe-popup-body").fadeIn();
    $("#next-container").css("display", "none");
    $("#submit-container").css("display", "block");
    $(".schedule-dialog .modal-body #time-intervals-div, #parameters-panel").css("display", "none");
    $("#schedule-back").css("display", "inline");
    $("#windowCaption").text("[[[Choose the subscribers and export format]]]");   
    if ($("#schedule-settings-body").length > 0) {
        $("#schedule-settings-body").css("display", "none");
    }
    className = "subscribers-panel";
    if ($(".schedule-dialog").find("#subscribers-panel").length <= 0) {
        partialPost(url, className);
    }
}

function enableParameterOption() {
    $(".schedule-popup-body, .subscribe-popup-body").css("display", "none");
    $(".parameter-popup-body").fadeIn();
    $("#next-container").css("display", "block");
    $("#submit-container").css("display", "none");
    $(".schedule-dialog .modal-body #time-intervals-div").css("display", "none");
    $("#schedule-back").css("display", "inline");
    $("#schedule-next").addClass("recurrence-class-body");
    $("#windowCaption").text("Specify the report parameter values to use with this schedule");
    className = "parameters-panel";
    if (isReportIdChanged) {
        $(".schedule-dialog").find("#parameters-panel").remove();
    }
    if ($(".schedule-dialog").find("#parameters-panel").length <= 0) {
        partialPost(url, className);
    }
}

function enablePasswordOption() {
    $(".schedule-popup-body").css("display", "none");
    $(".schedule-password-body").fadeIn();
    $("#next-container").css("display", "block");
    $("#submit-container").css("display", "none");
    $(".schedule-dialog .modal-body #time-intervals-div").css("display", "none");
    $(".subscribe-popup-body").css("display", "none");
    $("#schedule-back").css("display", "inline");
    $("#windowCaption").text("[[[Enables/disables the password for compressed exported report file]]]");
    $("#schedule-next").addClass("subscribe-body");
    $("#schedule-next").removeClass("schedule-settings-password-body");

    className = "schedule-settings-body";
    if ($(".schedule-dialog").find("#schedule-settings-body").length <= 0) {
        partialPost(url, className);

    }
}

function enableTimeIntervalOption() {
    $(".schedule-popup-body, #parameters-panel, .subscribe-popup-body").css("display", "none");
    $(".schedule-dialog .modal-body #time-intervals-div").css("display", "inline");
    $(".subscribe-popup-body").css("display", "none");
    $("#next-container").css("display", "block");
    $("#submit-container").css("display", "none");
    if ($("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("time-interval-body");
    }
    if ($("#schedule-settings-body").length > 0) {
        $("#schedule-settings-body").css("display", "none");
    }
    $("#schedule-next").addClass("schedule-settings-password-body");
    $("#schedule-next").removeClass("recurrence-class-body");
    $("#schedule-back").css("display", "inline");
    $("#windowCaption").text("[[[Choose the recurrence intervals for the report server to start scheduling]]]");
    className = "schedule-recurrence";
    if ($(".schedule-dialog").find("#time-intervals-div").length <= 0) {
        partialPost(url, className);
    }
}

function validateSchedule(current) {
    var scheduleName = $("#schedule-name").val();
    if (!($("#schedule-name-error-container").css("display") == "block") && !($("body .loader-gif").length) && $("#selected_category option:selected").val() != "" && $("#selected_report option:selected").val() != "" && scheduleName) {
        if (!parent.IsValidName("name", scheduleName)) {
            $("#schedule-name-error-container").css("display", "block");
            $("#schedule-name-error-container").css("margin-left", "-44px");
            $("#schedule-name-validator").html("[[[Please avoid special characters]]]");
            return false;
        }
        if ($(current).hasClass("recurrence-class-body")) {
            return validateParameters();
        }
    } else {
        if ($("#selected_category option:selected").val() == "") {
            $("#category-message").css("display", "block");
        }
        if ($("#selected_report option:selected").val() == "") {
            $("#report-message").css("display", "block");
        }
        if (!scheduleName) {
            $("#schedule-name-error-container").css("display", "block");
            $("#schedule-name-error-container").css("margin-left", "-44px");
            $("#schedule-name-validator").html("[[[Please enter schedule name]]]");
        }
        return false;
    }
    return true;
}

function enableScheduleWaitingPopup(id) {
    ShowWaitingProgress(id, "show");
}

$(document).on("focusout", "#schedule-name", function (event) {
    var scheduleName = $("#schedule-name").val().trim();
    var scheduleId = $("#schedule-submit").attr("data-schedule-id");
    if ($.trim(scheduleName) != "") {
        $("#schedule-name").closest("div").removeClass("has-error");
        $("#schedule-name-error-container").css("display", "none");
        if (scheduleName) {
            scheduleNameCheck(scheduleId, scheduleName);
        } else {
            $("#schedule-name-error-container").css("display", "none");
        }
    }
    else {
        $("#schedule-name").closest("div").addClass("has-error");
        $("#schedule-name-error-container").css("display", "block");
        $("#schedule-name-error-container").css("margin-left", "-30px");
        $("#schedule-name-validator").html("[[[Please enter schedule name]]]");
    }
});

$(document).on("keyup", "#schedule-name", function (event) {
    if ($.trim($("#schedule-name").val()) != "") {
        $("#schedule-name").closest("div").removeClass("has-error");
        $("#schedule-name-error-container").css("display", "none");
    }
    else {
        $("#schedule-name").closest("div").addClass("has-error");
        $("#schedule-name-error-container").css("display", "block");
        $("#schedule-name-error-container").css("margin-left", "-30px");
        $("#schedule-name-validator").html("[[[Please enter schedule name]]]");
    }
});

$(document).on("click", "#schedule-next", function (event) {
    var scheduleMessage = "";
    if (validateSchedule(this)) {
        if ($(this).hasClass("time-interval-body")) {
            url = recurrenceType;
            enableTimeIntervalOption();
        }
        else if ($(this).hasClass("subscribe-body")) {
            $("#error-filedkey-info").remove();
            var scheduleExportFileSettings = GetExportFileSettingInfo();
            if (scheduleExportFileSettings == null) {
                return;
            }
            url = scheduleRecipients;
            enableSubscribeOption();
        }
        else if ($(this).hasClass("schedule-settings-password-body")) {
            url = passwordOptions;       
            enablePasswordOption();
        }
        else if ($(this).hasClass("recurrence-class-body")) {
            url = recurrenceType;
            enableTimeIntervalOption();
        }
        else if ($(this).hasClass("parameter-body")) {       
        }
        else {
            if ($("#enable-parameter").prop("checked")) {
                if (actionType == "Edit") {
                    url = isReportIdChanged ? getSchedulerParameter : editSchedulerParameter;
                } else {
                    url = getSchedulerParameter;
                }
                if (parameterObj !== undefined && parameterObj.length == 0) {
                    url = recurrenceType;
                    enableTimeIntervalOption();
                } else {
                    enableParameterOption();
                }
            } else {
                url = recurrenceType;
                enableTimeIntervalOption();
            }
        }
    }
});

$(document).on("click", "#schedule-back", function (event) {
    if ($("#schedule-next").parent("div").css("display") == "none") {
        enablePasswordOption();
    }
    else if ($("#schedule-next").hasClass("schedule-settings-password-body")) {
        if ($("#enable-parameter").prop("checked")) {
            if (parameterObj.length == 0) {
                enableScheduleOption();
            } else {
                url = getSchedulerParameter;
                enableParameterOption();
            }
        } else {
            enableScheduleOption();
        }
        $("#schedule-next").removeClass("schedule-settings-password-body");
    } else {
        if ($("#schedule-next").hasClass("recurrence-class-body")) {
            enableScheduleOption();
            $("#schedule-next").removeClass("recurrence-class-body");
        }
        else if ($("#schedule-next").hasClass("subscribe-body")) {
            enableTimeIntervalOption();
            $("#schedule-next").removeClass("subscribe-body");
        }    
    }
});

$(document).on("change", "#selected_category", function () {
    var selected = $(this).find("option:selected").text();
    if ($(this).find("option:selected").val() == "" || $(this).find("option:selected").val() != "") {
        $(".schedule-popup-title").html(" [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", "");
    }
    $("#selected_report").attr("disabled", true);
    $(".report-dropdown").append($("<span class='col-sm-4 no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:255px; position:absolute; height:30px; width:30px; top:3px'></span>"));
    var filterSettings = [];
    filterSettings.push({ PropertyName: "CategoryName", FilterType: "equal", FilterKey: selected });
    var invalid = undefined;
    listReports = "";
    $.ajax({
        type: "POST",
        url: getReportUrl,
        data: { searchKey: invalid, skip: 0, take: 20, sorted: invalid, filterCollection: filterSettings, displayCategory: "SpecificCategory" },
        success: function (result, data) {
            $("#selected_report").attr("disabled", false);
            $("span.loader-gif").remove();
            var reports = result.result;
            for (var t = 0; t < reports.length; t++) {
                listReports += '<option value="' + reports[t].Id + '">' + reports[t].Name + '</option>';
            }
            $("#selected_report").html("");
            $("#selected_report").html('<option value="" selected="selected" class="hide-option" disabled>Select Report</option>' + listReports).selectpicker("refresh");
            addTitleForReport();
        }
    });
    if ($("#selected_category option:selected").val() != "") {
        $("#category-message").css("display", "none");
    }
});

$(document).on("change", "#selected_report", function () {
    var selected = $(this).find("option:selected").text();
    var itemId = $(this).find("option:selected").val();
    createdItemId = itemId;
    if (itemId != "") {
        $(".schedule-popup-title").html(" " + selected + " - [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", selected);
    }
    else {
        $(".schedule-popup-title").html(" [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", "");
    }
    if ($("#selected_report option:selected").val() != "") {
        $("#report-message").css("display", "none");
    }

    isReportHasParameter(itemId);
});

function isReportHasParameter(itemId) {
    if (reportParameterItemId !== "" && reportParameterItemId !== itemId) {
        isReportIdChanged = true;
    }
    reportParameterItemId = itemId;
    $.ajax({
        type: "POST",
        url: reportHasParameterUrl,
        async: false,
        data: { itemId: itemId },
        success: function (data) {
            $("#enable-parameter").prop("checked", false);
            if (data.Result) {
                $(".reportparameter-tag").css("display", "none");
                $("#enable-parameter").prop("disabled", false);
            } else {
                $("#enable-parameter").prop("disabled", true);
                $(".reportparameter-tag").css("display", "block");
            }
        }
    });
}

function addTitleForCategory() {
    $("#selected_category").selectpicker("refresh");
    for (var i = 0; i < $(".category-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".category-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".category-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function addTitleForReport() {
    $("#selected_report").selectpicker("refresh");
    for (var i = 0; i < $(".report-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".report-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".report-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

$(document).on("click", "#schedule-submit-cancel,#schedule-popup,#schedule-next-cancel", function (event) {
    closePopupContainer();
});

$(document).keyup(function (e) {
    if (e.keyCode == 27) closePopupContainer();
});

function closePopupContainer() {
    parent.$("#popup-container").ejDialog("close");
    parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
    parent.$("#editpopup-container").ejDialog("close");
    parent.$("#editpopup-container_wrapper").ejWaitingPopup("hide");
}

//To  stop animation in radio-button on page rendering
$(document).on("click", ".css-radio", function () {
    $(this).siblings("label").removeClass("notransition");
});

$(document).on("click", "#schedule-next, #schedule-back", function () {
    $(".css-radio").siblings("label").addClass("notransition");
});
$(document).on("ready", function () {
    if (regexIe8.test(userAgent)) {
        $(".form-control").css("line-height", "0.5");
    }
});

function partialPost(url, className) {
    if (!$(".schedule-dialog").hasClass(className)) {
        parent.$("#popup-container_wrapper").ejWaitingPopup("show");
        parent.$("#editpopup-container_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: url,
            data: { itemId: reportParameterItemId },
            cache: false,
            dataType: 'html',
            success: function (data) {
                $(".modal-body").append(data);
                if (className == "subscribers-panel") {
                    $(".schedule-dialog #subscribers-panel").css("display", "inline");
                    getAllStaticData();
                    if (actionType == "Create") {
                        $("select#user-search option").each(function (i) {
                            if ($(this).val().toLowerCase() == $("#userName").val().toLowerCase()) {
                                var currentuser = $(this).text();
                                $(this).attr("selected", true);
                                $("#user-search").selectpicker("refresh");
                                var userTile = $("<div>").attr("id", $(this).val()).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
                                userTile.html("<div class='InstantSearch'><span class='details' title='" + currentuser + "'>" + currentuser
                                    + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                                $("#selected-users").append(userTile);
                            }
                        });
                    }
                    else {
                        for (var i = 0; i < subscriberUser.length; i++) {
                            $("#user-search option[value='" + subscriberUser[i] + "']").attr("selected", true);
                            $("#user-search").selectpicker("refresh");
                            var user = $("#user-search option[value='" + subscriberUser[i] + "']").text();
                            var userTile = $("<div>").attr("id", subscriberUser[i]).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
                            userTile.html("<div class='InstantSearch'><span class='details' title='" + user.trim() + "'>" + user.trim() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                            $("#selected-users").append(userTile);
                        }

                        oldUserSelected = $("#user-search").val();
                        for (var i = 0; i < subscriberGroup.length; i++) {
                            $("#group-search option[value='" + subscriberGroup[i] + "']").attr("selected", true);
                            $("#group-search").selectpicker("refresh");
                            var group = $("#group-search option[value='" + subscriberGroup[i] + "']").text();
                            var groupTile = $("<div>").attr("id", subscriberGroup[i]).attr("data-searchtype", "groupSearch").addClass("SelectedShareItems");
                            groupTile.html("<div class='InstantSearch'><span class='details' title='" + group.trim() + "'>" + group.trim() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                            $("#selected-users").append(groupTile);
                        }
                        oldGroupSelected = $("#group-search").val();

                        for (var i = 0; i < subscriberExternalRecipient.length; i++) {
                            var emailid = subscriberExternalRecipient[i];
                            var externalRecipientTile = $("<div>").attr("id", subscriberExternalRecipient[i]).attr("data-searchtype", "externalRecipient").addClass("SelectedShareItems");
                            externalRecipientTile.html("<div class='InstantSearch'><span class='details'title='" + emailid + "'>" + emailid + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                            $("#selected-users").append(externalRecipientTile);
                        }

                        var selectedCountGroup = $("#group-search-container .bootstrap-select li.selected").length;
                        var allListCountGroup = $("#group-search-container .bootstrap-select li").length;
                        var selectedCountUser = $("#user-search-container .bootstrap-select li.selected").length;
                        var allListCountUser = $("#user-search-container .bootstrap-select li").length;
                        if (selectedCountGroup === allListCountGroup) {
                            $("#group-search-container .bs-select-all-custom").removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
                        }
                        if (selectedCountUser === allListCountUser) {
                            $("#user-search-container .bs-select-all-custom").removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
                        }
                        $("#pdf-export").prop("checked", item.ExportType.toLowerCase() == "pdf");
                        $("#excel-export").prop("checked", item.ExportType.toLowerCase() == "excel");
                        $("#word-export").prop("checked", item.ExportType.toLowerCase() == "word");
                        $("#html-export").prop("checked", item.ExportType.toLowerCase() == "html");
                        $("#ppt-export").prop("checked", item.ExportType.toLowerCase() == "ppt");
                        $("#csv-export").prop("checked", item.ExportType.toLowerCase() == "csv");
                        $("#save-as-file").prop("checked", item.IsSaveAsFile);
                        $("#enable-send-mail").prop("checked", item.IsSendAsMail);
                        if (item.IsSaveAsFile) {
                            $(".save-as-file-type").css("display", "block");
                        }
                        else {
                            $(".save-as-file-type").css("display", "none");
                        }
                        if (item.IsSendAsMail) {
                            $(".send-mail-block").css("display", "block");
                        }
                        else {
                            $(".send-mail-block").css("display", "none");
                        }
                        if (!item.IsSaveAsFile && !item.IsSendAsMail) {
                            $("#enable-send-mail").prop("checked", true);
                            $(".send-mail-block").css("display", "block");
                        }

                        $("#export-path").val(item.ExportPath);
                        $("#max-report-count").val(item.ReportCount);
                    }
                    selectedItemsCount();
                    validateExternalRecipient();
                    addTitleForUsersAndGroups();
                }
                else if (className == "schedule-recurrence") {
                    $(".schedule-dialog #time-intervals-div").css("display", "inline");
                    $("#daily-schedule-option,#weekly-schedule-option,#monthly-schedule-option,#yearly-schedule-option").css("display", "none");
                    if (actionType == "Edit") {
                        $("#hourly-schedule-option").css("display", "none");
                        switch ((recurrence).toLowerCase()) {
                            case "hourly":
                                recurrenceType = "Hourly";
                                $("#hourly-schedule-option").css("display", "block");
                                var frequency = item.Recurrence.HourlySchedule.MinutesInterval;
                                var mins = (frequency % 60) < 10 ? ("0" + (frequency % 60)) : frequency % 60;
                                var hours = (parseInt(frequency / 60) < 10) ? ("0" + parseInt(frequency / 60)) : parseInt(frequency / 60);
                                conversionToMinutes = hours + ":" + mins;
                                $("#every-x-hours-value").val(conversionToMinutes);
                                break;
                            case "daily":
                                recurrence = "Daily";
                                $("#daily-schedule-option").css("display", "block");
                                $("#daily-every-x-days").prop("checked", true);
                                var everyXDaysObj = $("#every-x-days").data("ejNumericTextbox");
                                everyXDaysObj.option("value", itemRecurrence.DailySchedule.DaysInterval);
                                break;
                            case "dailyweekday":
                                recurrence = "Daily";
                                $("#daily-schedule-option").css("display", "block");
                                $("#daily-weekdays").prop("checked", true);
                                break;

                            case "weekly":
                                recurrence = "Weekly";
                                $("#weekly-schedule-option").css("display", "block");
                                var everyXWeeksObj = $("#every-x-weeks").data("ejNumericTextbox");
                                everyXWeeksObj.option("value", itemRecurrence.WeeklySchedule.WeeksInterval);
                                $("#sun").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Sunday);
                                $("#mon").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Monday);
                                $("#tues").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Tuesday);
                                $("#wed").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Wednesday);
                                $("#thu").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Thursday);
                                $("#fri").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Friday);
                                $("#sat").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Saturday);
                                break;

                            case "monthly":
                                recurrence = "Monthly";
                                $("#monthly-schedule-option").css("display", "block");
                                $("#monthly").prop("checked", true);
                                var monthlyDateObj = $("#monthly-date").data("ejNumericTextbox");
                                monthlyDateObj.option("value", itemRecurrence.MonthlySchedule.DayOfMonth);
                                var monthlyEveryXMonthsObj = $("#monthly-every-x-months").data("ejNumericTextbox");
                                monthlyEveryXMonthsObj.option("value", itemRecurrence.MonthlySchedule.Months);
                                break;

                            case "monthlydow":
                                recurrence = "Monthly";
                                $("#monthly-schedule-option").css("display", "block");
                                $("#monthly-dow").prop("checked", true);
                                $("#monthly-dow-week option[value='" + itemRecurrence.MonthlyDowSchedule.WeeksOfTheMonth + "']").attr("selected", true);
                                $("#monthly-dow-week").selectpicker("refresh");
                                $("#monthly-dow-day option[value='" + itemRecurrence.MonthlyDowSchedule.DaysOfTheWeek + "']").attr("selected", true);
                                $("#monthly-dow-day").selectpicker("refresh");
                                var monthlyDOWEveryXMonthsObj = $("#monthly-dow-every-x-months").data("ejNumericTextbox");
                                monthlyDOWEveryXMonthsObj.option("value", itemRecurrence.MonthlyDowSchedule.Months);
                                break;

                            case "yearly":
                                recurrence = "Yearly";
                                $("#yearly-schedule-option").css("display", "block");
                                $("#yearly").prop("checked", true);
                                var everyXYearsObj = $("#every-x-years").data("ejNumericTextbox");
                                everyXYearsObj.option("value", itemRecurrence.YearlySchedule.YearsInterval);
                                $("#yearly-month option[value='" + itemRecurrence.YearlySchedule.MonthsOfTheYear + "']").attr("selected", true);
                                $("#yearly-month").selectpicker("refresh");
                                var yearlyDayObj = $("#yearly-day").data("ejNumericTextbox");
                                yearlyDayObj.option("value", itemRecurrence.YearlySchedule.DayOfMonth);
                                break;

                            case "yearlydow":
                                recurrence = "Yearly";
                                $("#yearly-schedule-option").css("display", "block");
                                $("#yearly-dow").prop("checked", true);
                                var everyXYearsObj = $("#every-x-years").data("ejNumericTextbox");
                                everyXYearsObj.option("value", itemRecurrence.YearlyDowSchedule.YearsInterval);
                                $("#yearly-dow-week option[value='" + itemRecurrence.YearlyDowSchedule.WeeksOfTheMonth + "']").attr("selected", true);
                                $("#yearly-dow-week").selectpicker("refresh");
                                $("#yearly-dow-day option[value='" + itemRecurrence.YearlyDowSchedule.DaysOfTheWeek + "']").attr("selected", true);
                                $("#yearly-dow-day").selectpicker("refresh");
                                $("#yearly-dow-month option[value='" + itemRecurrence.YearlyDowSchedule.MonthsOfTheYear + "']").attr("selected", true);
                                $("#yearly-dow-month").selectpicker("refresh");
                                break;
                        }
                        $("#enable-sunday,#enable-monday,#enable-tuesday,#enable-wednesday,#enable-thursday,#enable-friday,#enable-saturday").on("click", function () {
                            if (isSafari) {
                                $(this).find("label").toggleClass("check");
                            }
                        });

                        $("#recurrence-type option[value='" + recurrence + "']").attr("selected", true);
                        $("#recurrence-type").selectpicker("refresh");
                        $("#start-date").ejDateTimePicker({ value: startDate });
                        switch (endType.toString().toLowerCase()) {
                            case "noenddate":
                                $("#no-end-date").prop("checked", true);
                                var startObj = $("#start-date").data("ejDateTimePicker").model.value;
                                break;
                            case "enddate":
                                $("#endBy").prop("checked", true);
                                $("#end-date").ejDateTimePicker({ value: endDate });
                                break;
                            case "endafter":
                                $("#end-after").prop("checked", true);
                                var occurenceCountObj = $("#occurence-count").data("ejNumericTextbox");
                                occurenceCountObj.option("value", endAfter);
                                break;
                        }
                    }
                    addTitleForRecurrenceType();
                }

                else if (className == "schedule-settings-body") {
                    $(".schedule-dialog #schedule-settings-body").css("display", "inline");
                    if (actionType == "Create") {

                        var exportFilesetting = "";
                        $.ajax({
                            type: "POST",
                            url: getExportFileSettingInfoUrl,
                            success: function (data) {
                                if (data !== null && data !== "") {
                                    exportFilesetting = data.ExportFileSetting;
                                    if (exportFilesetting != null && exportFilesetting != undefined) {
                                        //Assiging values to the field.
                                        var length = exportFilesetting.PasswordProtocols.PasswordKeyProtocol.length;
                                        for (var t = 1; t <= length; t++) {
                                            var ele = $(".password-condition-section:nth-child(" + t + ")");
                                            if (!ele.length) {
                                                AddNewElementAndIntialize();
                                                ele = $(".password-condition-section:nth-child(" + t + ")");
                                            }

                                            ele.find(".field-key-position").prop("disabled", false);
                                            ele.find(".field-key-position")
                                                .find("option[value='" +
                                                    exportFilesetting.PasswordProtocols.PasswordKeyProtocol[t - 1]
                                                    .FieldKeyPosition +
                                                    "']").prop("selected", "selected");
                                            ele.find(".field-key-position").selectpicker("refresh");
                                            var fieldKeyPosition = ele.find(".field-key-count").data("ejNumericTextbox");
                                            fieldKeyPosition.enable();
                                            fieldKeyPosition.option("value",
                                                exportFilesetting.PasswordProtocols.PasswordKeyProtocol[t - 1].NumberOfFieldKeys);
                                            ele.find(".field-key").prop("disabled", false);
                                            ele.find(".field-key")
                                                .find("option[value='" +
                                                    exportFilesetting.PasswordProtocols.PasswordKeyProtocol[t - 1].FieldKey +
                                                    "']").prop("selected", "selected");
                                            ele.find(".field-key").selectpicker("refresh");
                                        }
                                        switch (exportFilesetting.PasswordType) {
                                            case "CustomPassword":
                                                $("#custom-password").prop("checked", true).trigger("change");
                                                $("#password-condition-container").show();
                                                $("#default-password-info").hide();
                                                break;
                                            default:
                                                $("#default-password").prop("checked", true).trigger("change");
                                                $("#password-condition-container").hide();
                                                $("#default-password-info").show();
                                        }
                                        $("#enable-password-protection").prop("checked", exportFilesetting.IsPasswordProtected)
                                            .trigger("change");
                                        $("#enable-compression").prop("checked", exportFilesetting.IsCompressionEnabled).trigger("change");

                                        if ($("#password-condition-section").find(".password-condition-section").length >= 3) {
                                            $(".pwd-condition-btn").addClass("pointer-events");
                                        }
                                    } else {
                                        //Enabling Default Password and unchecking the Compression and Password protection option
                                        $("#default-password").prop("checked", true).trigger("change");
                                        $("#password-condition-container").hide();
                                        $("#default-password-info").show();
                                        $("#enable-password-protection").prop("checked", false)
                                            .trigger("change");
                                        $("#enable-compression").prop("checked", false).trigger("change");
                                    }
                                }
                            },
                            error: handleAjaxError()
                        });

                    }
                    if (actionType == "Edit") {
                        if (exportFilesettingInEdit != null && exportFilesettingInEdit != undefined) {
                            //Assiging values to the field.
                            var length = exportFilesettingInEdit.PasswordProtocols.PasswordKeyProtocol.length;
                            for (var t = 1; t <= length; t++) {
                                var ele = $(".password-condition-section:nth-child(" + t + ")");
                                if (!ele.length) {
                                    AddNewElementAndIntialize();
                                    ele = $(".password-condition-section:nth-child(" + t + ")");
                                }

                                ele.find(".field-key-position").prop("disabled", false);
                                ele.find(".field-key-position")
                                    .find("option[value='" +
                                        exportFilesettingInEdit.PasswordProtocols.PasswordKeyProtocol[t - 1]
                                        .FieldKeyPosition +
                                        "']").prop("selected", "selected");
                                ele.find(".field-key-position").selectpicker("refresh");
                                var fieldKeyPosition = ele.find(".field-key-count").data("ejNumericTextbox");
                                fieldKeyPosition.enable();
                                fieldKeyPosition.option("value",
                                    exportFilesettingInEdit.PasswordProtocols.PasswordKeyProtocol[t - 1].NumberOfFieldKeys);
                                ele.find(".field-key").prop("disabled", false);
                                ele.find(".field-key")
                                    .find("option[value='" +
                                        exportFilesettingInEdit.PasswordProtocols.PasswordKeyProtocol[t - 1].FieldKey +
                                        "']").prop("selected", "selected");
                                ele.find(".field-key").selectpicker("refresh");
                            }
                            switch (exportFilesettingInEdit.PasswordType) {
                                case "CustomPassword":
                                    $("#custom-password").prop("checked", true).trigger("change");
                                    $("#password-condition-container").show();
                                    $("#default-password-info").hide();
                                    break;
                                default:
                                    $("#default-password").prop("checked", true).trigger("change");
                                    $("#password-condition-container").hide();
                                    $("#default-password-info").show();
                            }
                            $("#enable-password-protection").prop("checked", exportFilesettingInEdit.IsPasswordProtected)
                                        .trigger("change");
                            $("#enable-compression").prop("checked", exportFilesettingInEdit.IsCompressionEnabled).trigger("change");

                            if ($("#password-condition-section").find(".password-condition-section").length >= 3) {
                                $(".pwd-condition-btn").addClass("pointer-events");
                            }
                        } else {
                            //Enabling Default Password and unchecking the Compression and Password protection option
                            $("#default-password").prop("checked", true).trigger("change");
                            $("#password-condition-container").hide();
                            $("#default-password-info").show();
                            $("#enable-password-protection").prop("checked", false)
                                .trigger("change");
                            $("#enable-compression").prop("checked", false).trigger("change");
                        }
                    }
                }

                parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
                parent.$("#editpopup-container_wrapper").ejWaitingPopup("hide");
            }
        });
    }
}

function addTitleForUsersAndGroups() {
    $("#user-search").selectpicker("refresh");
    for (var i = 0; i < $("#user-search-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#user-search-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#user-search-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#group-search").selectpicker("refresh");
    for (var i = 0; i <= $("#group-search-container .btn-group .dropdown-menu  li").length; i++) {
        var hoveredtext = $("#group-search-container .btn-group .dropdown-menu  li").eq(i).find("a .text").text();
        $("#group-search-container .btn-group .dropdown-menu li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function addTitleForRecurrenceType() {
    $("#recurrence-type").selectpicker("refresh");
    $("#recurrence-type-container").find(".dropdown-menu").addClass("dropdown-height");
    for (var i = 0; i < $("#recurrence-type-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#recurrence-type-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#recurrence-type-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }

    $("#monthly-dow-week").selectpicker("refresh");
    for (var i = 0; i < $("#monthly-dow-week-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#monthly-dow-week-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#monthly-dow-week-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#monthly-dow-day").selectpicker("refresh");
    $("#monthly-dow-day-container").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#monthly-dow-day-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#monthly-dow-day-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#monthly-dow-day-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-dow-week").selectpicker("refresh");
    for (var i = 0; i < $("#yearly-dow-week-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-dow-week-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("yearly-dow-week-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-dow-day").selectpicker("refresh");
    $("#yearly-dow-day-container").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#yearly-dow-day-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-dow-day-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearly-dow-day-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-dow-month").selectpicker("refresh");
    $("#yearly-dow-month-ccontainer").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#yearly-dow-month-ccontainer .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-dow-month-ccontainer .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearly-dow-month-ccontainer .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-month").selectpicker("refresh");
    $("#yearly-month").next("div").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#yearly-schedule-option .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-schedule-option .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearly-schedule-option .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

var listCategories = "";
$(document).on('show.bs.dropdown', '.category-dropdown', function () {
    if (listCategories == "") {
        $(".category-dropdown .bootstrap-select").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:110px; position:absolute; height:30px; width:30px; top:0px;z-index:10001'></span>"));
        $(".category-dropdown .bootstrap-select .open").hide();
        var filterSettings = [];
        filterSettings.push({ PropertyName: "CategoryName", FilterType: "equal", FilterKey: reportCategoryName });
        var invalid = undefined;
        $.ajax({
            type: "POST",
            url: getCategoryUrl,
            success: function (data) {
                var categories = data;
                for (var t = 0; t < categories.data.length; t++) {
                    if (categories.data[t].Name == reportCategoryName) {
                        listCategories += '<option value="' + categories.data[t].Id + '" selected= "selected">' + categories.data[t].Name + '</option>';
                    }
                    else {
                        listCategories += '<option value="' + categories.data[t].Id + '">' + categories.data[t].Name + '</option>';
                    }
                }
                $("#selected_category").html("");
                if (reportItemId == "") {
                    $("#selected_category").html('<option value="" disabled="disabled" class="hide-option" selected="selected">Select Category</option>' + listCategories)
                  .selectpicker("refresh");
                }
                else {
                    $("#selected_category").html(listCategories)
                                  .selectpicker("refresh");
                }
                addTitleForCategory();
                $(".category-dropdown .bootstrap-select ul li").each(function () {
                    if ($(this).hasClass("selected")) {
                        $(this).addClass("active");
                    }
                })
                if (listCategories != "") {
                    $(".category-dropdown .bootstrap-select .open").show();
                }
                $(".category-dropdown span.loader-gif").remove();
            }
        });
    }
});

$(document).on('show.bs.dropdown', '.report-dropdown', function () {
    $(".report-dropdown").find(".open,.bootstrap-select").removeClass("dropdown-alignment");
    if ($("#selected_category").find("option:selected").val() == "") {
        $("#category-message").css("display", "block");
        $("#selected_report").attr("disabled", false);
    }
    else {
        if (listReports == "") {
            $(".report-dropdown .bootstrap-select").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:110px; position:absolute; height:30px; width:30px; top:0px;z-index:10001'></span>"));
            $(".report-dropdown .bootstrap-select .open").hide();

            var filterSettings = [];
            filterSettings.push({ PropertyName: "CategoryName", FilterType: "equal", FilterKey: reportCategoryName });
            var invalid = undefined;
            if ((reportItemId == "" || reportItemId != "") && (itemName != "" && reportCategoryName != "")) {
                $.ajax({
                    type: "POST",
                    url: getReportUrl,
                    data: { searchKey: invalid, skip: 0, take: 20, sorted: invalid, filterCollection: filterSettings, displayCategory: "SpecificCategory" },
                    success: function (result, data) {
                        var reports = result.result;
                        for (var t = 0; t < reports.length; t++) {
                            if (reports[t].Id == reportItemId) {
                                listReports += '<option value="' + reports[t].Id + '" selected="selected">' + reports[t].Name + '</option>';
                            }
                            else {
                                listReports += '<option value="' + reports[t].Id + '">' + reports[t].Name + '</option>';
                            }
                        }
                        $("#selected_report").html("");
                        if (reportItemId == "") {
                            $("#selected_report").html('<option value="" disabled="disabled" class="hide-option"selected="selected">Select Report</option>' + listReports).selectpicker("refresh");
                        }
                        else {
                            $("#selected_report").html(listReports).selectpicker("refresh");
                        }
                        addTitleForReport();
                        $(".report-dropdown ul li").each(function () {
                            if ($(this).hasClass("selected")) {
                                $(this).addClass("active");
                            }
                        });
                        if (listReports != "") {
                            $(".report-dropdown .bootstrap-select .open").show();
                        }

                        $(".report-dropdown span.loader-gif").remove();
                    }
                });
            }
            else {
                $("#selected_report").html('<option value="" disabled="disabled" class="hide-option"selected="selected">[[[Select Report]]]</option>').selectpicker("refresh");
                $(".report-dropdown .bootstrap-select .open").show();
                $(".report-dropdown .btn-group .dropdown-menu.open").removeAttr("style");
                $(".report-dropdown .btn-group .dropdown-menu.open").css("overflow", "hidden");
                $(".report-dropdown span.loader-gif").remove();
            }
        }
    }
    $(".report-dropdown").find(".open").addClass("dropdown-alignment");
});


//Export File Setting

$(document).on("click", ".pwd-condition-btn", function () {
    $("#error-filedkey-info").remove();
    AddNewElementAndIntialize();
    if ($("#password-condition-section").find(".password-condition-section").length >= 3) {
        $(".pwd-condition-btn").addClass("pointer-events");
    }
});

$(document).on("click", "#remove-pwd-condition", function () {
    $("#error-filedkey-info").remove();
    $(this).parent().closest('.password-condition-section').remove();
    $(".pwd-condition-btn, .remove-condition-btn").removeClass("pointer-events");
});

$(document).on("change", "#enable-compression", function () {
    if (isSafariOrEdge) {
        $(this).find("label").toggleClass("check");
        $("#custom-password, #default-password, #enable-password-protection").next().toggleClass("check");
    }
    if ($(this).is(":checked")) {
        $("#enable-password-protection").prop("disabled", false);
        EnablePasswordProtectionSection();
    }
    else {
        $("#enable-password-protection").prop("disabled", true);
        DisablePasswordProtectionSection();
    }
});

$(document).on("change", "#enable-password-protection", function () {
    if (isSafariOrEdge) {
        $("#custom-password, #default-password").next().toggleClass("check");
    }
    if ($(this).is(":checked")) {
        EnablePasswordProtectionSection();
    }
    else {
        DisablePasswordProtectionSection();
    }
});

function EnablePasswordProtectionSection() {
    if ($("#enable-password-protection").is(":checked")) {
        $("#default-password, #custom-password").prop("disabled", false);
        if ($("#custom-password").is(":checked") && (!$("#custom-password").hasClass("disabled"))) {
            EnablePasswordConditionSection();
        } else {
            DisablePasswordConditionSection();
        }
    }
}

function DisablePasswordProtectionSection() {
    $("#default-password, #custom-password").prop("disabled", true);
    DisablePasswordConditionSection();
}

function EnablePasswordConditionSection() {
    $(".select-picker").removeAttr("disabled").selectpicker("refresh");
        $(".numeric-text-box")
            .each(function() {
                var obj = $(this).data("ejNumericTextbox");
                obj.enable();
            });
    if ($("#password-condition-section").find(".password-condition-section").length < 3) {
        $(".pwd-condition-btn").removeClass("pointer-events");
    }
    $(".remove-condition-btn").removeClass("pointer-events");
}

function DisablePasswordConditionSection() {
    $(".select-picker").attr("disabled", true).selectpicker("refresh");
        $(".numeric-text-box")
            .each(function() {
                var obj = $(this).data("ejNumericTextbox");
                obj.disable();
            });
    $(".pwd-condition-btn, .remove-condition-btn").addClass("pointer-events");
}

function initializeFileSetting(count) {

    var fieldKeyPosition = "";
    var fieldKeys = "";
    $.ajax({
        type: "POST",
        url: getScheduleFileSettingTypeUrl,
        async: false,
        success: function (data) {

            for (var t = 0; t < data.FieldKeyPosition.length; t++) {
                fieldKeyPosition += "<option value= " + data.FieldKeyPosition[t] + ">" + data.FieldKeyPosition[t] + "</option>";
            }

            for (var t = 0; t < data.FieldKey.length; t++) {
                fieldKeys += "<option value= '" + data.FieldKey[t] + "'>" + data.FieldKey[t] + "</option>";
            }
        },
        complete: function () {
        }
    });

    var passwordConditionLength = $("#password-condition-section").find(".password-condition-section").length;
    for (var t = count; t <= passwordConditionLength; t++) {
        var ele = $(".password-condition-section:nth-child(" + t + ")");
        ele.find(".field-key-position").append(fieldKeyPosition);
        ele.find(".field-key-count").ejNumericTextbox({ name: "numeric", value: 4, minValue: 4, maxValue: 8, width: "65px", height: "32px" });
        ele.find(".field-key").append(fieldKeys);
        ele.find(".field-key, .field-key-position").selectpicker("refresh");
    }
}

function createPasswordConditionElement() {
    var ele =
        '<div class="password-condition-section col-lg-12 col-md-12 col-sm-12 cls-margin-bot pointer-events"><div class="i-search-fields pull-left"><select data-width="50px" class="select-picker no-padding field-key-position" data-size="2"></select></div><div class="pull-left cls-margin"><input class="form-control field-key-count pull-left numeric-text-box" name="field-key-count" /></div><div class="pull-left"><label class="pull-left app-textbox-label no-margin" for="field-key-label">character of</label><div class="i-search-fields  pull-left cls-padleft10"><select class="select-picker field-key" data-width="100px" data-size="4"></select></div></div><span id="remove-pwd-condition" class="su-close remove-condition-btn app-textbox-label no-margin" data-toggle="tooltip" data-placement="right" title="[[[Remove]]]"></span></div>';

    return ele;
}

function CreateFieldKeyErrorElement() {
    return '<span class="col-lg-8 col-md-8 col-sm-8" id="error-filedkey-info">[[[Custom password conditions should have either a First Name or Username field.]]]</span>';
}

function AddNewElementAndIntialize() {
    var ele = "";
    var btnCount = $("#password-condition-section").find(".password-condition-section").length;
    if (($("#password-condition-section").find(".password-condition-section").length) < 3) {
        ele = createPasswordConditionElement();
        $(ele).appendTo($("#password-condition-section"));
        initializeFileSetting(btnCount + 1);
        $(".password-condition-section").removeClass("pointer-events");
    }

    $('[data-toggle="tooltip"]').tooltip();
}

function GetExportFileSettingInfo() {
    var scheduleExportFileSettings = {};
    var value = [];
    var passwordConditionLength = $("#password-condition-section").find(".password-condition-section").length;
    for (var t = 1; t <= passwordConditionLength; t++) {
        var ele = $(".password-condition-section:nth-child(" + t + ")");
        var passwordKeyProtocol = {};
        passwordKeyProtocol.FieldKeyPosition = ele.find(".field-key-position").val();
        passwordKeyProtocol.NumberOfFieldKeys = ele.find(".field-key-count").val();
        passwordKeyProtocol.FieldKey = ele.find(".field-key").val();
        value.push(passwordKeyProtocol);
    }
    scheduleExportFileSettings.IsCompressionEnabled = $("#enable-compression").is(":checked");
    scheduleExportFileSettings.IsPasswordProtected = $("#enable-password-protection").is(":checked");
    if ($("#enable-compression").is(":checked") && $("#enable-password-protection").is(":checked") && $("#custom-password").is(":checked")) {
        scheduleExportFileSettings.PasswordType = "CustomPassword";
        var result = value;
        var hasFirstOrLastName = false;
        for (i = 0; i < result.length; i++) {
            if (result[i].FieldKey.toLowerCase() == "first name" || result[i].FieldKey.toLowerCase() == "username") {
                hasFirstOrLastName = true;
            }
        }
        if (!hasFirstOrLastName) {
            var ele = CreateFieldKeyErrorElement();
            $(ele).appendTo($("#password-condition-section"));
            hideWaitingPopup($("#body"));
            return null;
        }
    } else {
        scheduleExportFileSettings.PasswordType = "DefaultPassword";
    }
    scheduleExportFileSettings.PasswordProtocols = { PasswordKeyProtocol: value };

    return scheduleExportFileSettings;
}

//recepient page scripts
$(document).on("change", "#save-as-file", function () {
    $("#checkbox-validation").css("visibility", "hidden");
    if ($(this).is(":checked")) {
        $(".save-as-file-type").css("display", "block");
        if ($(".save-as-file-type").find("#export-path").val() == "") {
            $(".save-as-file-type").find("#export-path").val($("#edit-export-path").val());
        }
        if ($(".save-as-file-type").find("#max-report-count").val() == "0") {
            $(".save-as-file-type").find("#max-report-count").val($("#export-report-count").val());
        }
     }
    else {
        $(".save-as-file-type").css("display", "none");
    }
});

$(document).on("change", "#enable-send-mail", function () {
    $("#checkbox-validation").css("visibility", "hidden");
    if ($(this).is(":checked")) {
        $(".send-mail-block").css("display", "block");
    }
    else {
        $(".send-mail-block").css("display", "none");
    }
});

$(document).on("focusout", "#export-path", function (event) {
    var path = $("#export-path").val();
    if (path != "") {
        exportPathExistCheck(path);
    }
    else {
        $(".directory-check").css("display", "block");
        $(".directory-check").html("[[[Please enter a valid directory path]]]").css({ "color": "#a94442", "font-size": "12px" });
        return;
    }
});

$(document).on("focusout", "#max-report-count", function (event) {
    if ($.isNumeric(parseInt($("#max-report-count").val()))) {
        $("#report-count-validation").css("visibility", "hidden");
    } else {
        $("#report-count-validation").css("visibility", "visible").css({ "color": "#a94442", "font-size": "12px" });
    }
});

function exportPathExistCheck(exportReportPath) {
    $.ajax({
        type: "POST",
        url: exportPathExistUrl,
        async: false,
        data: { exportPath: exportReportPath },
        success: function (data) {
            if (data.Result) {
                $(".directory-check").removeClass("directory-exist");
                $(".directory-check").css("display", "none");
            } else {
                $(".directory-check").css("display", "block");
                $(".directory-check").addClass("directory-exist");
                $(".directory-check").html("[[[directory path does not exist]]]").css({ "color": "#a94442", "font-size": "12px" });
                return;
            }
        }
    });
}
