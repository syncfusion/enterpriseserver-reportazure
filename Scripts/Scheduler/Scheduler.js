var oldUserSelected = [];
var oldGroupSelected = [];
var oldExternalRecipientSelected = [];
var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");
var url = "";
var reportItemName = "";
var reportItemId = "";
var reportCategoryName = "";
var createdItemId = "";
var item = "";
var listReports = "";

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
function editSchedule(id, itemId, itemName, categoryName) {
    $("#schedule-submit").attr("data-schedule-id", id);
    $("#schedule-submit").attr("data-item-id", itemId);
    itemName != "" ? $(".schedule-popup-title").html(" " + itemName + " - Schedule") : $(".schedule-popup-title").html(" " + itemName + " Schedule");
    $(".schedule-popup-title").attr("title", itemName);
    createdItemId = itemId;
    $.ajax({
        type: "POST",
        url: getScheduleInfoUrl,
        data: { scheduleId: id },
        success: function (data) {
            item = data.ScheduleItem;
            $("#schedule-name").val(item.Name);
            parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
            $("#enable-schedule").prop("checked", item.IsEnabled);
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
            subscriberUser = data.SubscribedUser
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
    $(".subscribe-popup-body, #next-container, #submit-container,#time-intervals-div").css("display", "none");
    $(".schedule-popup-body").fadeIn();
    $("#next-container").css("display", "block");
    $("#schedule-back").css("display", "none");
    $("#windowCaption").text("[[[Choose a report to schedule]]]");
    if ($("#schedule-next").hasClass("subscribe-body") || $("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("subscribe-body");
        $("#schedule-next").removeClass("time-interval-body");
    }
}

function enableSubscribeOption() {
    $(".schedule-popup-body").css("display", "none");
    $(".subscribe-popup-body").fadeIn();
    $("#next-container").css("display", "none");
    $("#submit-container").css("display", "block");
    $(".schedule-dialog .modal-body #time-intervals-div").css("display", "none");
    $("#schedule-back").css("display", "inline");
    $("#windowCaption").text("[[[Choose the subscribers and export format]]]");
    className = "subscribers-panel";
    if ($(".schedule-dialog").find("#subscribers-panel").length <= 0) {
        partialPost(url, className);
    }

}

function enableTimeIntervalOption() {
    $(".schedule-popup-body").css("display", "none");
    $(".schedule-dialog .modal-body #time-intervals-div").css("display", "inline");
    $(".subscribe-popup-body").css("display", "none");
    $("#next-container").css("display", "block");
    $("#submit-container").css("display", "none");
    if ($("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("time-interval-body");
    }
    $("#schedule-next").addClass("subscribe-body");
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
            url = scheduleRecipients;
            enableSubscribeOption();
        }
        else {
            url = recurrenceType;
            enableTimeIntervalOption();
        }

    }
});

$(document).on("click", "#schedule-back", function (event) {
    if ($("#schedule-next").parent("div").css("display") == "none") {
        enableTimeIntervalOption();
    }
    else {
        if ($("#schedule-next").hasClass("subscribe-body")) {
            enableScheduleOption();
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
    filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: selected });
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
});

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
        $.ajax({
            type: "POST",
            url: url,
            data: {},
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
                parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
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
        filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: reportCategoryName });
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
            filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: reportCategoryName });
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
