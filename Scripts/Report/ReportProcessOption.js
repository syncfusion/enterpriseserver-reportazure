$(document).ready(function () {

    $("#NoCache").prop("checked", true);
    $("#default").prop("checked", true);
    $("#SnapshotScheduleCache").prop("checked", true);
    $("#SnapshotScheduleCache").attr("disabled", true);
    $("input[name='Configureschedule']").prop({ "checked": true });
    $("input[name='Configureschedule']").attr("disabled", true);
    $("#SnapshotCache").prop("checked", "False" == "True" ? true : false);

    $(document).on("change", "#SnapshotCache", function () {
        checkboxChange($(this).prop("checked"));
    });

    $(document).on("change", "#NoCache, #CacheWithTime, #CacheWithSchedule, input[name='Configureschedule']", function () {
        onCacheNeedChange($(this).val());
    });

    $(document).on("change", "#default, #donotTimeout, #timeoutLimit", function (args) {
        onTimeOutChange($(this).val());
    });

    $(document).on("change", "#SnapshotScheduleCache", function (args) {
        onSnapshotScheduleChange($(this).val());
    });

    $(document).on("change", "input[name='DataRender']", function (args) {
        onChangeDateRender($(this).val());
    });

    var processOption = option.Data;
    if (processOption.data != "") {

        if (processOption.data.RenderRecentData.DoNotCache) {
            $("#NoCache").prop("checked", processOption.data.RenderRecentData.DoNotCache);
            $("#NoCache").removeAttr("disabled");
        }
        if (processOption.data.RenderRecentData.CacheAfterNMin.IsCached) {
            $("#CacheWithTime").prop("checked", processOption.data.RenderRecentData.CacheAfterNMin.IsCached);
            $(".minutesInput").val(processOption.data.RenderRecentData.CacheAfterNMin.CacheInMinutes);
            $("#CacheWithTime").removeAttr("disabled");
            $("input[name='Minutes']").attr("disabled", false);
        }
        if (option.Data.data.RenderRecentData.CacheWithSchedule.ScheduleInfo != null) {
            var jsonData = MakeScheduleItem(option.Data.data.RenderRecentData.CacheWithSchedule.ScheduleInfo);
            $("#hiddenprocessSchedule").val(JSON.stringify(jsonData));
            $("#CacheWithSchedule").prop("checked", true);
            $("#ScheduleCache").removeAttr("disabled");
            $("#CacheWithSchedule").removeAttr("disabled");
            $(".configure[data-form='recentdata']").attr("disabled", false);
            $("#ScheduleContent").html("Occurs on " + option.Data.nextScheduleDate);
        }
        if (option.Data.data.RenderSnapshot.ReportScheduleSnapshot.ScheduleInfo != null) {
            var jsonData = MakeScheduleItem(option.Data.data.RenderSnapshot.ReportScheduleSnapshot.ScheduleInfo);
            $("#snapshothiddenprocessSchedule").val(JSON.stringify(jsonData));
            $("#CacheWithSchedule").prop("checked", true);
            $("#ScheduleCache").attr("disabled", true);
            $("#CacheWithSchedule").attr("disabled", true);
            $(".configure[data-form='recentdata']").attr("disabled", true);
            $("#CacheWithTime").attr("disabled", true);
            $("#NoCache").attr("disabled", true);
            $("#SnapShotData").prop("checked", true);
            $("#SnapshotCache").prop("checked", true);
            $("#SnapshotCache").attr("disabled", false);
            $("#SnapshotScheduleCache").attr("disabled", false);
            $(".configure[data-form='snapshot']").attr("disabled", false);
            $("#snapshotScheduleContent").html("Occurs on " + option.Data.data.RenderSnapshot.ReportScheduleSnapshot.ScheduleInfo.NextScheduleString);
        }
    }

    $("#ConfigureMultipleItem").on("click", function () {
        $("#Report_process_Option_holder,#saveProcessButton").hide();
        $("#SubscribersPanel,#nextProcessButton").show();
    });

    $("#next_report_option").on("click", function () {
        if ($("#categoryList option:selected").length > 0 || $("#itemList option:selected").length > 0) {
            $("#SubscribersPanel,#nextProcessButton").hide();
            $("#Report_process_Option_holder,#saveProcessButton").show();
            $("#selectedUsersValidation").css("visibility", "hidden");
        } else {
            $("#selectedUsersValidation").css("visibility", "visible");
        }
    });

    $("#save_report_option").click(function () {
        var reportsList = $("#reportList").val();
        var errors = "";
        if (reportsList == null)
        {
            errors += "Should  Report Length ";
            $("#reportListValidation").css("display", "block");
        }
        else
            $("#reportListValidation").css("display", "none");

        $(".property-error-messages").css("display", "none");

        if ($("input[name='DataRender']:checked").val() == "0")
        {
            if($("input[name='IsNeedCache']:checked").val() == "1")
            {
                if($(".minutesInput").val()<1)
                {
                    errors += "Should  Report Length ";
                    $("#minutesInputValidation").css("display", "block");
                }
            }
            if ($("input[name='IsNeedCache']:checked").val() == "2") {
                if (parent.$("#ReportProcessOption_popup").find("iframe").contents().find(".recentDataContainer .hiddenprocessSchedule").val() == '')
                {
                    errors += "Should  Report Length ";
                    $("#cacheValidation").css("display", "block");
                }
            }
        }
        if ($("input[name='DataRender']:checked").val() == "1") {
            if (parent.$("#ReportProcessOption_popup").find("iframe").contents().find(".snapshotContainer .hiddenprocessSchedule").val() == '') {
                errors += "Should  Report Length ";
                $("#snapshotValidation").css("display", "block");
            }
        }

        if (errors == "") {
            window.parent.$('#ReportProcessOption_popup_wrapper').ejWaitingPopup("show");
            var itemId = $("#itemId").val();
            var report = {
                RenderRecentData: {
                    DoNotCache: $("input[name='DataRender']:checked").val() == "0" ? $("input[name='IsNeedCache']:checked").val() == "0" ? true : false : false,
                    CacheAfterNMin: {
                        IsCached: $("input[name='DataRender']:checked").val() == "0" ? $("input[name='IsNeedCache']:checked").val() == "1" ? true : false : false,
                        CacheInMinutes: $(".minutesInput").val()
                    },
                    CacheWithSchedule: {
                        ScheduleInfo: $("input[name='DataRender']:checked").val() == "0" ? $("input[name='IsNeedCache']:checked").val() == "2" ? JSON.parse(parent.$("#ReportProcessOption_popup").find("iframe").contents().find(".recentDataContainer .hiddenprocessSchedule").val()) : null : null
                    }
                },
                RenderSnapshot: {
                    ReportScheduleSnapshot: {
                        ScheduleInfo: $("input[name='DataRender']:checked").val() == "1" ? JSON.parse(parent.$("#ReportProcessOption_popup").find("iframe").contents().find(".snapshotContainer .hiddenprocessSchedule").val()) : null
                    }
                }
            };
            $.ajax({
                type: "POST",
                url: saveReportOptionUrl,
                data: {
                    ReportProcessData: JSON.stringify(report),
                    ReportScheduleInfo: JSON.stringify({
                        ScheduleItem: ($("input[name='DataRender']:checked").val() == "1") ? JSON.parse(parent.$("#ReportProcessOption_popup").find("iframe").contents().find(".snapshotContainer .hiddenprocessSchedule").val()) : $("input[name='IsNeedCache']:checked").val() == "2" ? JSON.parse(parent.$("#ReportProcessOption_popup").find("iframe").contents().find(".recentDataContainer .hiddenprocessSchedule").val()) : null
                    }),
                    Reports: JSON.stringify($("#reportList").val()),
                    Categories: JSON.stringify($("#categoryList").val()),
                    ReportId: itemId
                },
                success: function (result) {
                    window.parent.$('#ReportProcessOption_popup_wrapper').ejWaitingPopup("hide");
                    parent.messageBox("su-report", "[[[Report Processing Option]]]", "[[[Report Processing Option has been saved successfully.]]]", "success", function () {
                        parent.$("#ReportProcessOption_popup").ejDialog("close");
                        parent.onCloseMessageBox();
                    });
                }
            });
        }
    });

    if ($("#reportList option").length > 0)
        $(".share-popup #report_Container .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
    else
        $(".share-popup #report_Container .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");

    if ($("#categoryList option").length > 0)
        $(".share-popup #category_Container .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
    else
        $(".share-popup #category_Container .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");

    $("#report_Container").on('click', '.bs-select-all-custom', function (e) {
        $("#report_Container").addClass("valueChanged");
        $('#reportList').data("selectpicker").selectAll();
        $(this).removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
        $($(this).children("span")[0]).text("[[[Clear All]]]");
        e.stopPropagation();
    });

    $("#category_Container").on('click', '.bs-select-all-custom', function (e) {
        $("#category_Container").addClass("valueChanged");
        $('#categoryList').data("selectpicker").selectAll();
        $(this).removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
        $($(this).children("span")[0]).text("[[[Clear All]]]");
        e.stopPropagation();
    });

    $("#report_Container").on('click', '.bs-deselect-all-custom', function (e) {
        $("#report_Container").addClass("valueChanged");
        $('#reportList').data("selectpicker").deselectAll();
        $(this).removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        $($(this).children("span")[0]).text("[[[Select All]]]");
        e.stopPropagation();
    });

    $("#category_Container").on('click', '.bs-deselect-all-custom', function (e) {
        $("#category_Container").addClass("valueChanged");
        $('#categoryList').data("selectpicker").deselectAll();
        $(this).removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        $($(this).children("span")[0]).text("[[[Select All]]]");
        e.stopPropagation();
    });

    $("#category_Container").on('click', '.bootstrap-select li a', function (e) {
        $("#category_Container").addClass("valueChanged");

        var thisValue = $("#categoryList").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        var isSelected = $(this).parent().hasClass("selected");
        var itemList = categoryItems[$(thisValue).val()];
        if (isSelected) {
            $(thisValue).attr("selected", true);
            for (var t = 0; t < itemList.length; t++) {
                if ($("#reportList option[value='" + itemList[t] + "']:selected").length == 0) {
                    $("#reportList option[value='" + itemList[t] + "']").attr("selected", true);
                    var selectedReport = $("#reportList option[value='" + itemList[t] + "']");
                    var userTile = $("<div>").attr("id", $(selectedReport).val()).attr("data-searchtype", "reportSearch").addClass("SelectedShareItems");
                    userTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedReport).text() + "'>" + $(selectedReport).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                    $("#SelectedUsers").append(userTile);
                }
            }
        }
        else {
            $(thisValue).attr("selected", false);
            for (var t = 0; t < itemList.length; t++) {
                $("#reportList option[value='" + itemList[t] + "']").attr("selected", false);
                var selectedReport = $("#reportList option[value='" + itemList[t] + "']");
                $(".SelectedShareItems[id='" + $(selectedReport).val() + "']").remove();
                $($('#report_Container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
                $("#report_Container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
            }
        }
        if ($(this).parent().hasClass("selected")) {
            var selectedCategory = $("#categoryList").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            var userTile = $("<div>").attr("id", $(selectedCategory).val()).attr("data-searchtype", "categorySearch").addClass("SelectedShareItems");
            userTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedCategory).text() + "'>" + $(selectedCategory).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            $("#SelectedUsers").append(userTile);
        }
        else {
            var selectedCategory = $("#categoryList").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            $(".SelectedShareItems[id='" + $(selectedCategory).val() + "']").remove();
            $($('#category_Container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
            $("#category_Container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        }
        var html = $("#reportList").html();
        $("#reportList").html("");
        $("#reportList").selectpicker("refresh");
        $("#reportList").append(html);

        selectedItemsCount();
        $(this).parent().addClass("active");
        e.stopPropagation();
        $("#reportList").selectpicker("refresh");
        selectReportList();
    });

    $("#report_Container").on('click', '.bootstrap-select .dropdown-menu .selectpicker li a', function (e) {
        $("#report_Container").addClass("valueChanged");
       

        var selectedIndex = $("#reportList").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        var categoryId = $(selectedIndex).attr("data-CategoryId");
        var isSelected = $(this).parent().hasClass("selected");
        if (isSelected) {
            $(selectedIndex).attr("selected", true);
            if ($("#categoryList option[value='" + categoryId + "']:selected").length == 0) {
                var selectedCategory = $("#categoryList option[value='" + categoryId + "']");
                var userTile = $("<div>").attr("id", $(selectedCategory).val()).attr("data-searchtype", "categorySearch").addClass("SelectedShareItems");
                userTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedCategory).text() + "'>" + $(selectedCategory).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                $("#SelectedUsers").append(userTile);
            }
            $("#categoryList option[value='" + categoryId + "']").attr("selected", true);
        }
        else {
            $(selectedIndex).attr("selected", false);
            var reportCount = $("#reportList option[data-CategoryId='" + categoryId + "']:selected").length;
            if (reportCount == 0) {
                $("#categoryList option[value='" + categoryId + "']").attr("selected", false);
                var selectedCategory = $("#categoryList option[value='" + categoryId + "']");
                $(".SelectedShareItems[id='" + $(selectedCategory).val() + "']").remove();
                $($('#category_Container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
                $("#category_Container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
            }
        }

        if ($(this).parent().hasClass("selected")) {
            var selectedReport = $("#reportList").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            var userTile = $("<div>").attr("id", $(selectedReport).val()).attr("data-searchtype", "reportSearch").addClass("SelectedShareItems");
            userTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedReport).text() + "'>" + $(selectedReport).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            $("#SelectedUsers").append(userTile);
        }
        else {
            var selectedReport = $("#reportList").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            $(".SelectedShareItems[id='" + $(selectedReport).val() + "']").remove();
            $($('#report_Container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
            $("#report_Container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        }

            var html = $("#categoryList").html();
        $("#categoryList").html("");
        $("#categoryList").selectpicker("refresh");
        $("#categoryList").append(html);
        selectedItemsCount();

        $(this).parent().addClass("active");
        e.stopPropagation();
        $("#categoryList").selectpicker("refresh");
        selectReportList();
    });

    $(document).on('click', '.configure', function () {
        var itemId = $("#itemId").val();
        var origin = $(this).attr("data-form");
        window.parent.$("#ReportProcessOption_schedule_popup").ejDialog("open");
        parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("show");
        window.parent.$("#ReportProcessOption_schedule_popup_iframe").attr("src", window.reportProcessOptionScheduleUrl + "?itemId=" + itemId + "&origin=" + origin);
    });

    $(document).on("click", "#SubscribersPanel .i-selected-cancel", function (event) {
        var key = $(this).parents(".SelectedShareItems").attr("id");
        var searchType = $(this).parents(".SelectedShareItems").attr("data-searchtype");
        if (searchType == "reportSearch") {
            currentElementIndex = $("#reportList").find("[value='" + key + "']").index();
            $("#report_Container .bootstrap-select li").filter("[data-original-index='" + currentElementIndex + "']").find("a").click();
        }
        else if (searchType == "categorySearch") {
            currentElementIndex = $("#categoryList").find("[value='" + key + "']").index();
            $("#category_Container .bootstrap-select li").filter("[data-original-index='" + currentElementIndex + "']").find("a").click();
        }
        else {
            if (searchType == "externalRecipient") {
                $(".SelectedShareItems[id='" + key + "']").remove();
            }
        }
        selectedItemsCount();
    });

    $(document).on("click", ".css-radio", function () {
        $(this).siblings("label").removeClass("notransition");
    });

});

function checkboxChange(isChecked) {
    if (isChecked) {
        $("#SnapshotScheduleCache").removeAttr("disabled");
        $(".configure[data-form='snapshot']").attr("disabled", false);
    } else {
        $("#SnapshotScheduleCache").attr("disabled", true);
        $(".configure[data-form='snapshot']").attr("disabled", true);
    }
}

function selectedItemsCount() {
    $("#selectedReportsInfo").html("<span class='pull-left'>" + $("#categoryList option:selected").length + " [[[Categories]]], " + $("#reportList option:selected").length + " [[[Reports selected]]]").css({ "padding-top": "10px", "padding-left": "15px", "margin-top": "0" });
}

function selectReportList()
{
    var selectedCount = $("#category_Container .bootstrap-select li.selected").length;
    var allListCount = $("#category_Container .bootstrap-select li").length;

    if (selectedCount == allListCount && selectedCount != 0) {
        $($('#category_Container div.bs-select-all-custom').children("span")[0]).text("[[[Clear All]]]");
        $('#category_Container div.bs-select-all-custom').removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    } else {
        $($('#category_Container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
        $("#category_Container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
    }

    var selectedCount = $("#report_Container .bootstrap-select li.selected").length;
    var allListCount = $("#report_Container .bootstrap-select li").length;
    if (selectedCount == allListCount && selectedCount != 0) {
        $($('#report_Container div.bs-select-all-custom').children("span")[0]).text("[[[Clear All]]]");
        $('#report_Container div.bs-select-all-custom').removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    } else {
        $($('#report_Container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
        $("#report_Container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
    }
}

function onreportProcessOptionDialogClose() {
    parent.$("#ReportProcessOption_popup").find("iframe").contents().find("html").html("");
}

function onreportProcessOptionScheduleDialogClose() {
    $("#ReportProcessOption_schedule_popup").find("iframe").contents().find("html").html("");
}

function MakeScheduleItem(data) {
    var scheduleItem = {};
    switch (data.RecurrenceType) {
        case "Daily":
        case "DailyWeekDay":
            if (data.Recurrence.DailySchedule != null) {
                scheduleItem.RecurrenceType = "Daily";
                scheduleItem.RecurrenceInterval = data.Recurrence.DailySchedule.DaysInterval;
            }
            else {
                scheduleItem.RecurrenceType = "DailyWeekDay";
            }
            break;
        case "Weekly":
            scheduleItem.RecurrenceType = "Weekly";
            scheduleItem.RecurrenceInterval = data.Recurrence.WeeklySchedule.WeeksInterval;
            scheduleItem.Sunday = data.Recurrence.WeeklySchedule.DaysOfWeek.Sunday;
            scheduleItem.Monday = data.Recurrence.WeeklySchedule.DaysOfWeek.Monday;
            scheduleItem.Tuesday = data.Recurrence.WeeklySchedule.DaysOfWeek.Tuesday;
            scheduleItem.Wednesday = data.Recurrence.WeeklySchedule.DaysOfWeek.Wednesday;
            scheduleItem.Thursday = data.Recurrence.WeeklySchedule.DaysOfWeek.Thursday;
            scheduleItem.Friday = data.Recurrence.WeeklySchedule.DaysOfWeek.Friday;
            scheduleItem.Saturday = data.Recurrence.WeeklySchedule.DaysOfWeek.Saturday;

            break;
        case "Monthly":
        case "MonthlyDOW":
            if (data.Recurrence.MonthlySchedule != null) {
                scheduleItem.RecurrenceType = "Monthly";
                scheduleItem.DaysOfMonth = data.Recurrence.MonthlySchedule.DayOfMonth;
                scheduleItem.RecurrenceInterval = data.Recurrence.MonthlySchedule.Months;
            }
            else {
                scheduleItem.RecurrenceType = "MonthlyDOW";
                scheduleItem.WeekOfMonth = data.Recurrence.MonthlyDowSchedule.WeeksOfTheMonth;
                scheduleItem.DayOfWeek = data.Recurrence.MonthlyDowSchedule.DaysOfTheWeek;
                scheduleItem.RecurrenceInterval = data.Recurrence.MonthlyDowSchedule.Months;
            }
            break;
        case "Yearly":
        case "YearlyDOW":
            if (data.Recurrence.YearlySchedule != null) {
                scheduleItem.RecurrenceType = "Yearly";
                scheduleItem.DaysOfMonth = data.Recurrence.YearlySchedule.DayOfMonth;
                scheduleItem.MonthOfYear = data.Recurrence.YearlySchedule.MonthsOfTheYear;
                scheduleItem.RecurrenceInterval = data.Recurrence.YearlySchedule.YearsInterval;
            }
            else {
                scheduleItem.RecurrenceType = "YearlyDOW";
                scheduleItem.WeekOfMonth = data.Recurrence.YearlyDowSchedule.WeeksOfTheMonth;
                scheduleItem.DayOfWeek = data.Recurrence.YearlyDowSchedule.DaysOfTheWeek;
                scheduleItem.MonthOfYear = data.Recurrence.YearlyDowSchedule.MonthsOfTheYear;
                scheduleItem.RecurrenceInterval = data.Recurrence.YearlyDowSchedule.YearsInterval;
            }
            break;
    }

    scheduleItem.IsEnabled = data.IsEnabled;

    scheduleItem.StartDate = data.StartDateString;

    switch (data.EndType) {
        case "NoEndDate":
            scheduleItem.ScheduleEndType = "NoEnd";
            break;
        case "EndAfter":
            scheduleItem.ScheduleEndType = "EndAfter";
            scheduleItem.RecurrenceFactor = data.Recurrence.Occurrences;
            break;
        case "EndBy":
            scheduleItem.ScheduleEndType = "EndBy";
            scheduleItem.EndDate = data.Recurrence.EndBoundary;
            break;
        case "EndDate":
            scheduleItem.ScheduleEndType = "EndBy";
            scheduleItem.EndDate = data.EndDateString;
            break;
    }
    return scheduleItem;
}
function onChangeDateRender(value) {
    $(".property-error-messages").css("display", "none");
    if (value == "0") {
        $(".recentDataContainer").removeClass("disabled");
        $(".snapshotContainer").addClass("disabled");
        $("#SnapshotCache").attr("disabled", true);
        $("#SnapshotScheduleCache").attr("disabled", true);
        $(".configure[data-form='snapshot']").attr("disabled", true);

        $("#NoCache").removeAttr("disabled");
        $("#CacheWithTime").removeAttr("disabled");
        $("#CacheWithSchedule").removeAttr("disabled");
        if ($("#CacheWithSchedule").prop("checked")) {
            $("#ScheduleCache").removeAttr("disabled");
            $(".configure[data-form='recentdata']").attr("disabled", false);
        }
        if ($("#CacheWithTime").prop("checked")) {
            $("input[name='Minutes']").attr("disabled", false);
        }
    } else {
        $(".snapshotContainer").removeClass("disabled");
        $(".recentDataContainer").addClass("disabled");

        $("#NoCache").attr("disabled", true);
        $("#CacheWithTime").attr("disabled", true);
        $("#CacheWithSchedule").attr("disabled", true);
        $("#ScheduleCache").attr("disabled", true);
        $("#ScheduleCache").attr("disabled", true);
        $(".minutesInput").attr("disabled", true);
        $(".configure[data-form='recentdata']").attr("disabled", true);
        $("input[name='Minutes']").attr("disabled", true);

        $("#SnapshotCache").removeAttr("disabled");
        if ($("#SnapshotCache").prop("checked")) {
            $("#SnapshotScheduleCache").removeAttr("disabled");
            $(".configure[data-form='snapshot']").attr("disabled", false);
        }
    }
}
function onCacheNeedChange(value) {
    if (value == "1")
        $("input[name='Minutes']").attr("disabled", false);
    else
        $("input[name='Minutes']").attr("disabled", true);

    if (value == "2") {
        $("#ScheduleCache").removeAttr("disabled");
        $(".configure[data-form='recentdata']").attr("disabled", false);
    }
    else {
        $("#ScheduleCache").attr("disabled", true);
        $(".configure[data-form='recentdata']").attr("disabled", true);
    }
}
function onTimeOutChange(value) {
    if (value == "2")
        $("input[name='Seconds']").attr("disabled", false);
    else
        $("input[name='Seconds']").attr("disabled", true);
}
function onSnapshotScheduleChange() {

}
function closePopup() {
    $("#ReportProcessOption_popup").find("iframe").contents().find("html").html("");
    eDialog = parent.$("#ReportProcessOption_popup").data("ejDialog");
    eDialog.close();
}
window.parent.$('#ReportProcessOption_popup_wrapper').ejWaitingPopup("hide");
function closeReportOptionPopup() {
    closePopup();
}


