var oldUserSelected = [];
var oldGroupSelected = [];
var oldExternalRecipientSelected = [];

function createSchedule(itemId) {
    ShowWaitingProgress("#page_content_Div", "show");
    oldUserSelected = [];
    oldGroupSelected = [];
    oldExternalRecipientSelected = [];
    var reportItemId = itemId;
    renderSchedulePopUp(reportItemId);
    parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("hide");
    $("select#UserSearch option").each(function (i) {
        if ($(this).val().toLowerCase() == parent.$("#userName").val().toLowerCase()) {
            var currentuser = $(this).text();
            $(this).attr("selected", true);
            $('#UserSearch').selectpicker("refresh");
            var userTile = $("<div>").attr("id", $(this).val()).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
            userTile.html("<div class='InstantSearch'><span class='details' title='" + currentuser + "'>" + currentuser
                + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            $("#SelectedUsers").append(userTile);
        }
    });

    var addScheduleDetail;

    $("#schedule_Submit").on('click', function () {
        var scheduleItem = {};
        var origin = $("#origin").val();
        scheduleItem.ItemId = $(this).attr("data-report-id");
        switch ($('#recurrenceType').val().toString()) {
            case "Daily":
                if ($('#dailyEveryXdays').prop("checked")) {
                    scheduleItem.RecurrenceType = "Daily";
                    scheduleItem.RecurrenceInterval = $("#everyXDays").val();
                    if (scheduleItem.RecurrenceInterval == 1)
                        addScheduleDetail = "[[[Occurs every day]]]";
                    else
                        addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[days]]]";
                }
                else {
                    scheduleItem.RecurrenceType = "DailyWeekDay";
                    addScheduleDetail = "[[[Occures every weekday]]]";
                }
                break;
            case "Weekly":
                scheduleItem.RecurrenceType = "Weekly";
                scheduleItem.RecurrenceInterval = $("#everyXWeeks").val();
                scheduleItem.Sunday = $("#sun").prop("checked");
                scheduleItem.Monday = $("#mon").prop("checked");
                scheduleItem.Tuesday = $("#tues").prop("checked");
                scheduleItem.Wednesday = $("#wed").prop("checked");
                scheduleItem.Thursday = $("#thu").prop("checked");
                scheduleItem.Friday = $("#fri").prop("checked");
                scheduleItem.Saturday = $("#sat").prop("checked");
                var daysDetail = "";
                var selectDays = $('.daygroup:checked');
                for (var i = 0; i < selectDays.length; i++)
                {
                    if (selectDays.length == 1 || i == 0)
                        daysDetail = $(selectDays[i]).parent().next().text();
                    else if (i > 0 && i != selectDays.length - 1)
                        daysDetail = daysDetail+", "+$(selectDays[i]).parent().next().text();
                    else
                        daysDetail = daysDetail+" and " + $(selectDays[i]).parent().next().text();   
                }
                 if (scheduleItem.RecurrenceInterval == 1)
                     addScheduleDetail = "[[[Occurs every]]] "+ daysDetail;
                 else
                     addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() +" [[[week(s) on]]] " + daysDetail;
                break;
            case "Monthly":
                if ($('#monthly').prop("checked")) {
                    scheduleItem.RecurrenceType = "Monthly";
                    scheduleItem.DaysOfMonth = $('#monthlyDate').val();
                    scheduleItem.RecurrenceInterval = $('#monthlyEveryXMonths').val();
                    addScheduleDetail = "[[[Occurs day]]] " + scheduleItem.DaysOfMonth.toString() + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";

                }
                else {
                    scheduleItem.RecurrenceType = "MonthlyDOW";
                    scheduleItem.WeekOfMonth = $("#monthlyDOWWeek").val();
                    scheduleItem.DayOfWeek = $("#monthlyDOWDay").val();
                    scheduleItem.RecurrenceInterval = $('#monthlyDOWEveryXMonths').val();
                    addScheduleDetail = "[[[Occurs the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#monthlyDOWDay option:selected").text() + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";
                }
                break;
            case "Yearly":
                scheduleItem.RecurrenceInterval = $('#everyXYears').val();
                if ($('#yearly').prop("checked")) {
                    scheduleItem.RecurrenceType = "Yearly";
                    scheduleItem.DaysOfMonth = $('#yearlyDay').val();
                    scheduleItem.MonthOfYear = $('#yearlyMonth').val();
                    if (scheduleItem.RecurrenceInterval == 1)
                        addScheduleDetail = "[[[Occurs every ]]]" + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
                    else
                        addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
                }
                else {
                    scheduleItem.RecurrenceType = "YearlyDOW";
                    scheduleItem.WeekOfMonth = $("#yearlyDOWWeek").val();
                    scheduleItem.DayOfWeek = $("#yearlyDOWDay").val();
                    scheduleItem.MonthOfYear = $('#yearlyDOWMonth').val();
                    if (scheduleItem.RecurrenceInterval == 1)
                        addScheduleDetail = "[[[Occurs the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearlyDOWDay option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
                    else
                        addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearlyDOWDay option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
                }
                break;
        }

        scheduleItem.IsEnabled = $("#enableSchedule").prop("checked");

        scheduleItem.StartDate = $('#StartDate').val();

        switch ($('input[name=EndType]:checked', '#scheduleEndType').val().toString()) {
            case "never":
                scheduleItem.ScheduleEndType = "NoEnd";
                break;
            case "endAfter":
                scheduleItem.ScheduleEndType = "EndAfter";
                scheduleItem.RecurrenceFactor = $("#occurenceCount").val();
                break;
            case "endBy":
                scheduleItem.ScheduleEndType = "EndBy";
                scheduleItem.EndDate = $('#EndDate').val();
                break;
        }


        $.ajax({
            type: "POST",
            url: addProcessScheduleUrl,
            data: { optionScheduleSettings: JSON.stringify({ ScheduleItem: scheduleItem }) },
            beforeSend: function() {
                parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("show");
            },
            success: function(data) {
                switch ($('input[name=EndType]:checked', '#scheduleEndType').val().toString()) {
                case "never":
                    addScheduleDetail = addScheduleDetail  + " [[[effective]]] " + data.NextSchedule;
                    break;
                case "endAfter":
                    addScheduleDetail = addScheduleDetail  + " [[[effective]]] " + data.NextSchedule + " [[[until]]] " + data.EndDate.toString();
                    break;
                case "endBy":
                    addScheduleDetail = addScheduleDetail  + " [[[effective]]] " + data.NextSchedule + " [[[until]]] " + data.EndDate.toString();
                    break;
                }
                parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("hide");
                closePopupContainer();
                if (origin == "recentdata")
                    parent.$("#ReportProcessOption_popup_iframe").contents().find("#hiddenprocessSchedule").val(data.scheduleResult);
                else
                    parent.$("#ReportProcessOption_popup_iframe").contents().find("#snapshothiddenprocessSchedule").val(data.scheduleResult);

                parent.$("#ReportProcessOption_popup_iframe").contents().find(".configure[data-form='" + origin + "']").parents(".column").next(".ScheduleContent").html(addScheduleDetail);
                parent.$("#ReportProcessOption_popup_iframe").contents().find("#snapshotValidation, #cacheValidation").css("display", "none");
            }
        });

    });

    $(".share-popup .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok' ></span></div>");

    $("#userSearch_container").on('click', '.bs-select-all-custom', function (e) {
        $("#userSearch_container").addClass("valueChanged");
        $('#UserSearch').data("selectpicker").selectAll();
        $(this).removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
        $($(this).children("span")[0]).text("[[[Clear All]]]");
        e.stopPropagation();
    });

    $("#groupSearch_container").on('click', '.bs-select-all-custom', function (e) {
        $("#groupSearch_container").addClass("valueChanged");
        $('#GroupSearch').data("selectpicker").selectAll();
        $(this).removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
        $($(this).children("span")[0]).text("[[[Clear All]]]");
        e.stopPropagation();
    });

    $("#userSearch_container").on('click', '.bs-deselect-all-custom', function (e) {
        $("#userSearch_container").addClass("valueChanged");
        $('#UserSearch').data("selectpicker").deselectAll();
        $(this).removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        $($(this).children("span")[0]).text("[[[Select All]]]");
        $(".SelectedShareItems[data-searchtype='userSearch']").remove();
        e.stopPropagation();
    });

    $("#groupSearch_container").on('click', '.bs-deselect-all-custom', function (e) {
        $("#groupSearch_container").addClass("valueChanged");
        $('#GroupSearch').data("selectpicker").deselectAll();
        $(this).removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        $($(this).children("span")[0]).text("[[[Select All]]]");
        $(".SelectedShareItems[data-searchtype='groupSearch']").remove();
        e.stopPropagation();
    });

    $("#userSearch_container").on('click', '.bootstrap-select li a', function (e) {
        $("#userSearch_container").addClass("valueChanged");;
        var selectedCount = $("#userSearch_container .bootstrap-select li.selected").length;
        var allListCount = $("#userSearch_container .bootstrap-select li").length;

        if (selectedCount == allListCount) {
            $($('#userSearch_container div.bs-select-all-custom').children("span")[0]).text("[[[Clear All]]]");
            $('#userSearch_container div.bs-select-all-custom').removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
        }
        if ($(this).parent().hasClass("selected")) {
            var selectedUser = $("#UserSearch").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            var userTile = $("<div>").attr("id", $(selectedUser).val()).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
            userTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedUser).text() + "'>" + $(selectedUser).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            $("#SelectedUsers").append(userTile);
        }
        else {
            var selectedUser = $("#UserSearch").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            $(".SelectedShareItems[id='" + $(selectedUser).val() + "']").remove();
            $($('#userSearch_container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
            $("#userSearch_container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        }
        $(this).parent().addClass("active");
        e.stopPropagation();
    });

    $("#groupSearch_container").on('click', '.bootstrap-select .dropdown-menu .selectpicker li a', function (e) {
        $("#groupSearch_container").addClass("valueChanged");;
        var selectedCount = $("#groupSearch_container .bootstrap-select li.selected").length;
        var allListCount = $("#groupSearch_container .bootstrap-select li").length;
        if (selectedCount == allListCount) {
            $($('#groupSearch_container div.bs-select-all-custom').children("span")[0]).text("[[[Clear All]]]");
            $('#groupSearch_container div.bs-select-all-custom').removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
        }

        if ($(this).parent().hasClass("selected")) {
            var selectedGroup = $("#GroupSearch").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            var groupTile = $("<div>").attr("id", $(selectedGroup).val()).attr("data-searchtype", "groupSearch").addClass("SelectedShareItems");
            groupTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedGroup).text() + "'>" + $(selectedGroup).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            $("#SelectedUsers").append(groupTile);
        }
        else {
            var selectedGroup = $("#GroupSearch").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            $(".SelectedShareItems").filter("[data-searchtype='groupSearch']").filter("#" + $(selectedGroup).val()).remove();
            $($('#groupSearch_container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
            $("#groupSearch_container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        }
        $(this).parent().addClass("active");
        e.stopPropagation();
    });



    parent.$("#PopupContainer_wrapper").ejWaitingPopup("hide");
}

$("#scheduleSearch_global").on("keyup", "#scheduleSearch_formfield", function () {
    var searchText = $(this).val();
    if (searchText.length > 2) {
        $("#scheduleGrid").data("ejGrid").search(searchText);
    } else {
        $("#scheduleGrid").data("ejGrid").search("");
    }
});

$(document).on("click", ".css-radio", function () {
    $(this).siblings("label").removeClass("notransition");
});

function renderSchedulePopUp(reportItemId) {
    //remove Dialog box and its elements
    $("#StartDate_popup").remove();
    $("#EndDate_popup").remove();
    $("#PopupContainer_wrapper").remove();
    $("#PopupContainer_overLay").remove();

    var recurrenceTypeList = "";
    var days = "";
    var weeks = "";
    var months = "";
    var zoneDateTime = "";

    var time = new Date();
    var sysTime = DateCustomFormat("MM/dd/yyyy" + " hh:mm", time);
    sysTime += (time.getHours() >= 12) ? " PM" : " AM";

    $.ajax({
        type: "POST",
        data: { date: sysTime },
        url: getRecurrenceTypeUrl,
        async: false,
        success: function (data) {
            ShowWaitingProgress(".share-popup-header", "hide");
            for (var t = 0; t < data.RecurrenceType.length; t++) {
                recurrenceTypeList = "<option value= " + data.RecurrenceType[0] + ">" + "[[[Daily]]]" + "</option>"
                                    + "<option value= " + data.RecurrenceType[1] + ">" + "[[[Weekly]]]" + "</option>"
                                    + "<option value= " + data.RecurrenceType[2] + ">" + "[[[Monthly]]]" + "</option>"
                                    + "<option value= " + data.RecurrenceType[3] + ">" + "[[[Yearly]]]" + "</option>";
            }

            for (var t = 0; t < data.Days.length; t++) {
                if (data.Days[t].toString().toLowerCase() == "weekendday"
                    || data.Days[t].toString().toLowerCase() == "day"
                    || data.Days[t].toString().toLowerCase() == "weekday") {
                    if (data.Days[t].toString().toLowerCase() == "weekendday") {
                        days += "<option value= " + data.Days[t] + ">[[[weekend day]]]</option>";
                    } else {
                        if (data.Days[t].toString().toLowerCase() == "weekday") {
                            days += "<option value= " + data.Days[t] + ">" + "[[[weekday]]]" + "</option>";
                        }
                        if (data.Days[t].toString().toLowerCase() == "day") {
                            days += "<option value= " + data.Days[t] + ">" + "[[[day]]]" + "</option>";
                        }
                    }
                }
            }

            for (var t = 0; t < data.Days.length; t++) {
                if (data.Days[t].toString().toLowerCase() != "weekendday"
                    && data.Days[t].toString().toLowerCase() != "day"
                    && data.Days[t].toString().toLowerCase() != "weekday") {
                    if (data.Days[t].toString().toLowerCase() == "sunday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Sunday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "monday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Monday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "tuesday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Tuesday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "wednesday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Wednesday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "thursday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Thursday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "friday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Friday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "saturday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Saturday]]]" + "</option>";
                    }
                }
            }

            weeks = "<option value= " + data.Weeks[0] + ">" + "[[[first]]]" + "</option>"
		            + "<option value= " + data.Weeks[1] + ">" + "[[[second]]]" + "</option>"
		            + "<option value= " + data.Weeks[2] + ">" + "[[[third]]]" + "</option>"
		            + "<option value= " + data.Weeks[3] + ">" + "[[[fourth]]]" + "</option>"
		            + "<option value= " + data.Weeks[4] + ">" + "[[[last]]]" + "</option>";

            months = "<option value= " + data.Months[0] + ">" + "[[[January]]]" + "</option>"
				    + "<option value= " + data.Months[1] + ">" + "[[[February]]]" + "</option>"
				    + "<option value= " + data.Months[2] + ">" + "[[[March]]]" + "</option>"
				    + "<option value= " + data.Months[3] + ">" + "[[[April]]]" + "</option>"
				    + "<option value= " + data.Months[4] + ">" + "[[[May]]]" + "</option>"
				    + "<option value= " + data.Months[5] + ">" + "[[[June]]]" + "</option>"
				    + "<option value= " + data.Months[6] + ">" + "[[[July]]]" + "</option>"
				    + "<option value= " + data.Months[7] + ">" + "[[[August]]]" + "</option>"
				    + "<option value= " + data.Months[8] + ">" + "[[[September]]]" + "</option>"
				    + "<option value= " + data.Months[9] + ">" + "[[[October]]]" + "</option>"
				    + "<option value= " + data.Months[10] + ">" + "[[[November]]]" + "</option>"
				    + "<option value= " + data.Months[11] + ">" + "[[[December]]]" + "</option>";

            var dateTime = data.TimeZoneDateTime.toString();
            var zoneTime = new Date(dateTime);
            var applicationTime = DateCustomFormat("MM/dd/yyyy" + " hh:mm", zoneTime);
            applicationTime += (zoneTime.getHours() >= 12) ? " PM" : " AM";

            zoneDateTime = applicationTime;

            $("#time").html(sysTime);
            $("#zone").html(String(String(time).split("(")[1]).split(")")[0]);
            $("#hourDifference").val(data.HourDifference);
            $("#minuteDifference").val(data.MinuteDifference);
        }
    });

    $('#recurrenceType').append(recurrenceTypeList);


    $('#monthlyDOWWeek').append(weeks);
    $("#monthlyDOWDay").append(days);

    $("#yearlyMonth").append(months);

    $("#yearlyDOWWeek").append(weeks);
    $("#yearlyDOWDay").append(days)
    $("#yearlyDOWMonth").append(months);


    $("#UserSearch").append(window.userList);
    $("#GroupSearch").append(window.groupList)

    $("#PopupContainer_wrapper").ejWaitingPopup("hide");
    $('#schedule_Submit').attr("data-report-id", reportItemId);

    $("#dailyEveryXdays").prop("checked", true);

    $("#monthly").prop("checked", true);

    $("#yearly").prop("checked", true);

    $("#pdfExport").prop("checked", true);

    $('#everyXDays').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 31, width: "65px", height: "34px" });
    $('#everyXWeeks').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 99, width: "65px", height: "34px" });
    $('#monthlyDate').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 31, width: "65px", height: "34px" });
    $('#monthlyEveryXMonths').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 99, width: "65px", height: "34px" });
    $('#monthlyDOWEveryXMonths').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 99, width: "65px", height: "34px" });
    $('#everyXYears').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 99, width: "65px", height: "34px" });
    $('#yearlyDay').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 31, width: "65px", height: "34px" });
    $('#occurenceCount').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 999, width: "65px", height: "34px" });

    Globalize.addCultureInfo("en-US", "default", {
        name: "en-US",
        englishName: "English (United States)",
        nativeName: "English (United States)",
        language: "en",
        calendars: {
            standard: {
                "/": ".",
                firstDay: 1,
                days: {
                    names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    namesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                },
                months: {
                    names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
                },
            }
        }
    });

    $('#StartDate').ejDateTimePicker({
        interval: 10,
        value: zoneDateTime,
        change: validateDateTimePicker,
        enableStrictMode: false,
        dateTimeFormat: "MM/dd/yyyy hh:mm tt",
        locale: "en-US",
        timePopupWidth: 108,
        buttonText: { today: "Today", timeNow: "Now", done: "Done", timeTitle: "Time" }
    });
    $('#EndDate').ejDateTimePicker({
        interval: 10,
        value: zoneDateTime,
        enableStrictMode: false,
        dateTimeFormat: "MM/dd/yyyy hh:mm tt",
        locale: "en-US",
        timePopupWidth: 108,
        buttonText: { today: "Today", timeNow: "Now", done: "Done", timeTitle: "Time" }
    });

    $("#StartDate").attr("disabled", "disabled");
    $("#EndDate").attr("disabled", "disabled");
    $("#StartDate").css({ cursor: "default" });
    $("#EndDate").css({ cursor: "default" });

    $("#recurrenceType").selectpicker("refresh");
    for (var i = 0; i < $("#recurrenceType_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#recurrenceType_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#recurrenceType_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#UserSearch').selectpicker("refresh");
    for (var i = 0; i < $("#userSearch_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#userSearch_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#userSearch_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#GroupSearch').selectpicker("refresh");
    for (var i = 0; i < $("#groupSearch_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#groupSearch_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#groupSearch_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#monthlyDOWWeek').selectpicker("refresh");
    for (var i = 0; i < $("#monthlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#monthlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#monthlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#monthlyDOWDay').selectpicker("refresh");
    for (var i = 0; i < $("#monthlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#monthlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#monthlyDOWDay_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#yearlyDOWWeek').selectpicker("refresh");
    for (var i = 0; i < $("#yearlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("yearlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#yearlyDOWDay').selectpicker("refresh");
    for (var i = 0; i < $("#yearlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearlyDOWDay_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#yearlyDOWMonth').selectpicker("refresh");
    for (var i = 0; i < $("#yearlyDOWMonth_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearlyDOWMonth_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearlyDOWMonth_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $('#yearlyMonth').selectpicker("refresh");
    for (var i = 0; i < $("#yearlyScheduleOption .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearlyScheduleOption .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearlyScheduleOption .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }                                 
}

function editSchedule(itemId,data) {
    renderSchedulePopUp(itemId);
    $("#schedule_Submit").attr("data-item-id", itemId);

    var item = "";
    var recurrenceType = "";
            item = data;
            $('#schedule_name').val(item.Name);
            $('#dailyScheduleOption').css('display', 'none');
            $('#weeklyScheduleOption').css('display', 'none');
            $('#monthlyScheduleOption').css('display', 'none');
            $('#yearlyScheduleOption').css('display', 'none');
            switch (item.RecurrenceType) {
                case "Daily":
                    recurrenceType = "Daily";
                    $('#dailyScheduleOption').css('display', 'block');
                    $("#dailyEveryXdays").prop("checked", true);
                    var everyXDaysObj = $("#everyXDays").data('ejNumericTextbox');
                    everyXDaysObj.option("value", item.Recurrence.DailySchedule.DaysInterval);
                    break;

                case "DailyWeekDay":
                    recurrenceType = "Daily";
                    $('#dailyScheduleOption').css('display', 'block');
                    $("#dailyWeekdays").prop("checked", true);
                    break;

                case "Weekly":
                    recurrenceType = "Weekly";
                    $('#weeklyScheduleOption').css('display', 'block');

                    var everyXWeeksObj = $("#everyXWeeks").data('ejNumericTextbox');
                    everyXWeeksObj.option("value", item.Recurrence.WeeklySchedule.WeeksInterval);
                    $("#sun").prop("checked", item.Recurrence.WeeklySchedule.DaysOfWeek.Sunday);
                    $("#mon").prop("checked", item.Recurrence.WeeklySchedule.DaysOfWeek.Monday);
                    $("#tues").prop("checked", item.Recurrence.WeeklySchedule.DaysOfWeek.Tuesday);
                    $("#wed").prop("checked", item.Recurrence.WeeklySchedule.DaysOfWeek.Wednesday);
                    $("#thu").prop("checked", item.Recurrence.WeeklySchedule.DaysOfWeek.Thursday);
                    $("#fri").prop("checked", item.Recurrence.WeeklySchedule.DaysOfWeek.Friday);
                    $("#sat").prop("checked", item.Recurrence.WeeklySchedule.DaysOfWeek.Saturday);

                    break;
                case "Monthly":
                    recurrenceType = "Monthly";
                    $('#monthlyScheduleOption').css('display', 'block');

                    $("#monthly").prop("checked", true);

                    var monthlyDateObj = $("#monthlyDate").data('ejNumericTextbox');
                    monthlyDateObj.option("value", item.Recurrence.MonthlySchedule.DayOfMonth);

                    var monthlyEveryXMonthsObj = $("#monthlyEveryXMonths").data('ejNumericTextbox');
                    monthlyEveryXMonthsObj.option("value", item.Recurrence.MonthlySchedule.Months);

                    break;
                case "MonthlyDOW":
                    recurrenceType = "Monthly";
                    $('#monthlyScheduleOption').css('display', 'block');
                    $("#monthlyDOW").prop("checked", true);
                    $("#monthlyDOWWeek option[value='" + item.Recurrence.MonthlyDowSchedule.WeeksOfTheMonth + "']").attr("selected", true);
                    $('#monthlyDOWWeek').selectpicker("refresh");

                    $("#monthlyDOWDay option[value='" + item.Recurrence.MonthlyDowSchedule.DaysOfTheWeek + "']").attr("selected", true);
                    $('#monthlyDOWDay').selectpicker("refresh");

                    var monthlyDOWEveryXMonthsObj = $("#monthlyDOWEveryXMonths").data('ejNumericTextbox');
                    monthlyDOWEveryXMonthsObj.option("value", item.Recurrence.MonthlyDowSchedule.Months);

                    break;
                case "Yearly":
                    recurrenceType = "Yearly";
                    $('#yearlyScheduleOption').css('display', 'block');
                    $("#yearly").prop("checked", true);

                    var everyXYearsObj = $("#everyXYears").data('ejNumericTextbox');
                    everyXYearsObj.option("value", item.Recurrence.YearlySchedule.YearsInterval);

                    $("#yearlyMonth option[value='" + item.Recurrence.YearlySchedule.MonthsOfTheYear + "']").attr("selected", true);
                    $('#yearlyMonth').selectpicker("refresh");

                    var yearlyDayObj = $("#yearlyDay").data('ejNumericTextbox');
                    yearlyDayObj.option("value", item.Recurrence.YearlySchedule.DayOfMonth);

                    break;
                case "YearlyDOW":
                    recurrenceType = "Yearly";
                    $('#yearlyScheduleOption').css('display', 'block');
                    $("#yearlyDOW").prop("checked", true);

                    var everyXYearsObj = $("#everyXYears").data('ejNumericTextbox');
                    everyXYearsObj.option("value", item.Recurrence.YearlyDowSchedule.YearsInterval);

                    $("#yearlyDOWWeek option[value='" + item.Recurrence.YearlyDowSchedule.WeeksOfTheMonth + "']").attr("selected", true);
                    $('#yearlyDOWWeek').selectpicker("refresh");

                    $("#yearlyDOWDay option[value='" + item.Recurrence.YearlyDowSchedule.DaysOfTheWeek + "']").attr("selected", true);
                    $('#yearlyDOWDay').selectpicker("refresh");

                    $("#yearlyDOWMonth option[value='" + item.Recurrence.YearlyDowSchedule.MonthsOfTheYear + "']").attr("selected", true);
                    $('#yearlyDOWMonth').selectpicker("refresh");

                    break;
            }
            $("#recurrenceType option[value='" + recurrenceType + "']").attr("selected", true);
            $('#recurrenceType').selectpicker("refresh");

            $("#enableSchedule").prop("checked", item.IsEnabled);

            $('#StartDate').ejDateTimePicker({ value: item.StartDateString });

            switch (item.EndType) {
                case "NoEndDate":
                    $("#noEndDate").prop("checked", true);
                    var startObj = $('#StartDate').data('ejDateTimePicker').model.value;
                    break;
                case "EndDate":
                    $("#endBy").prop("checked", true);
                    $('#EndDate').ejDateTimePicker({ value: item.EndDateString });
                    break;
                case "EndAfter":
                    $("#endAfter").prop("checked", true);
                    var occurenceCountObj = $("#occurenceCount").data('ejNumericTextbox');
                    occurenceCountObj.option("value", item.EndAfter);
                    break;
            }

            var selectedCountGroup = $("#groupSearch_container .bootstrap-select li.selected").length;
            var allListCountGroup = $("#groupSearch_container .bootstrap-select li").length;
            var selectedCountUser = $("#userSearch_container .bootstrap-select li.selected").length;
            var allListCountUser = $("#userSearch_container .bootstrap-select li").length;
            if (selectedCountGroup === allListCountGroup) {
                $("#groupSearch_container .bs-select-all-custom").removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
            }
            if (selectedCountUser === allListCountUser) {
                $("#userSearch_container .bs-select-all-custom").removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
            }

           
            parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("hide");
            $("#recurrenceType").selectpicker("refresh");
            for (var i = 0; i < $("#recurrenceType_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#recurrenceType_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#recurrenceType_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#UserSearch').selectpicker("refresh");
            for (var i = 0; i < $("#userSearch_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#userSearch_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#userSearch_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#GroupSearch').selectpicker("refresh");
            for (var i = 0; i < $("#groupSearch_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#groupSearch_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#groupSearch_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#monthlyDOWWeek').selectpicker("refresh");
            for (var i = 0; i < $("#monthlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#monthlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#monthlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#monthlyDOWDay').selectpicker("refresh");
            for (var i = 0; i < $("#monthlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#monthlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#monthlyDOWDay_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#yearlyDOWWeek').selectpicker("refresh");
            for (var i = 0; i < $("#yearlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#yearlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("yearlyDOWWeek_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#yearlyDOWDay').selectpicker("refresh");
            for (var i = 0; i < $("#yearlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#yearlyDOWDay_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#yearlyDOWDay_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#yearlyDOWMonth').selectpicker("refresh");
            for (var i = 0; i < $("#yearlyDOWMonth_container .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#yearlyDOWMonth_container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#yearlyDOWMonth_container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
            $('#yearlyMonth').selectpicker("refresh");
            for (var i = 0; i < $("#yearlyScheduleOption .btn-group .dropdown-menu .selectpicker li").length; i++) {
                var hoveredtext = $("#yearlyScheduleOption .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $("#yearlyScheduleOption .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
            }
       

            var updateSchedueleDetail;

            $("#schedule_Submit").on('click', function () {
                var scheduleItem = {};
                var origin = $("#origin").val();
                scheduleItem.ItemId = $(this).attr("data-report-id");
                switch ($('#recurrenceType').val().toString()) {
                    case "Daily":
                        if ($('#dailyEveryXdays').prop("checked")) {
                            scheduleItem.RecurrenceType = "Daily";
                            scheduleItem.RecurrenceInterval = $("#everyXDays").val();
                            if (scheduleItem.RecurrenceInterval == 1)
                                addScheduleDetail = "[[[Occurs every day]]]";
                            else
                                addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[days]]]";
                        }
                        else {
                            scheduleItem.RecurrenceType = "DailyWeekDay";
                            addScheduleDetail = "[[[Occures every weekday]]]";
                        }
                        break;
                    case "Weekly":
                        scheduleItem.RecurrenceType = "Weekly";
                        scheduleItem.RecurrenceInterval = $("#everyXWeeks").val();
                        scheduleItem.Sunday = $("#sun").prop("checked");
                        scheduleItem.Monday = $("#mon").prop("checked");
                        scheduleItem.Tuesday = $("#tues").prop("checked");
                        scheduleItem.Wednesday = $("#wed").prop("checked");
                        scheduleItem.Thursday = $("#thu").prop("checked");
                        scheduleItem.Friday = $("#fri").prop("checked");
                        scheduleItem.Saturday = $("#sat").prop("checked");
                        var daysDetail = "";
                        var selectDays = $('.daygroup:checked');
                        for (var i = 0; i < selectDays.length; i++) {
                            if (selectDays.length == 1 || i == 0)
                                daysDetail = $(selectDays[i]).parent().next().text();
                            else if (i > 0 && i != selectDays.length - 1)
                                daysDetail = daysDetail + ", " + $(selectDays[i]).parent().next().text();
                            else
                                daysDetail = daysDetail + " and " + $(selectDays[i]).parent().next().text();
                        }
                        if (scheduleItem.RecurrenceInterval == 1)
                            addScheduleDetail = "[[[Occurs every]]] " + daysDetail;
                        else
                            addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[week(s) on]]] " + daysDetail;
                        break;
                    case "Monthly":
                        if ($('#monthly').prop("checked")) {
                            scheduleItem.RecurrenceType = "Monthly";
                            scheduleItem.DaysOfMonth = $('#monthlyDate').val();
                            scheduleItem.RecurrenceInterval = $('#monthlyEveryXMonths').val();
                            addScheduleDetail = "[[[Occurs day]]] " + scheduleItem.DaysOfMonth.toString() + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";

                        }
                        else {
                            scheduleItem.RecurrenceType = "MonthlyDOW";
                            scheduleItem.WeekOfMonth = $("#monthlyDOWWeek").val();
                            scheduleItem.DayOfWeek = $("#monthlyDOWDay").val();
                            scheduleItem.RecurrenceInterval = $('#monthlyDOWEveryXMonths').val();
                            addScheduleDetail = "[[[Occurs the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#monthlyDOWDay option:selected").text() + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";
                        }
                        break;
                    case "Yearly":
                        scheduleItem.RecurrenceInterval = $('#everyXYears').val();
                        if ($('#yearly').prop("checked")) {
                            scheduleItem.RecurrenceType = "Yearly";
                            scheduleItem.DaysOfMonth = $('#yearlyDay').val();
                            scheduleItem.MonthOfYear = $('#yearlyMonth').val();
                            if (scheduleItem.RecurrenceInterval == 1)
                                addScheduleDetail = "[[[Occurs every ]]]" + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
                            else
                                addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
                        }
                        else {
                            scheduleItem.RecurrenceType = "YearlyDOW";
                            scheduleItem.WeekOfMonth = $("#yearlyDOWWeek").val();
                            scheduleItem.DayOfWeek = $("#yearlyDOWDay").val();
                            scheduleItem.MonthOfYear = $('#yearlyDOWMonth').val();
                            if (scheduleItem.RecurrenceInterval == 1)
                                addScheduleDetail = "[[[Occurs the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearlyDOWDay option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
                            else
                                addScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearlyDOWDay option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
                        }
                        break;
                }

                scheduleItem.IsEnabled = $("#enableSchedule").prop("checked");

                scheduleItem.StartDate = $('#StartDate').val();

                switch ($('input[name=EndType]:checked', '#scheduleEndType').val().toString()) {
                    case "never":
                        scheduleItem.ScheduleEndType = "NoEnd";
                        break;
                    case "endAfter":
                        scheduleItem.ScheduleEndType = "EndAfter";
                        scheduleItem.RecurrenceFactor = $("#occurenceCount").val();
                        break;
                    case "endBy":
                        scheduleItem.ScheduleEndType = "EndBy";
                        scheduleItem.EndDate = $('#EndDate').val();
                        break;
                }


                $.ajax({
                    type: "POST",
                    url: addProcessScheduleUrl,
                    data: { optionScheduleSettings: JSON.stringify({ ScheduleItem: scheduleItem }) },
                    beforeSend: function () {
                        parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("show");
                    },
                    success: function (data) {
                        switch ($('input[name=EndType]:checked', '#scheduleEndType').val().toString()) {
                            case "never":
                                addScheduleDetail = addScheduleDetail + " [[[effective]]] " + data.NextSchedule;
                                break;
                            case "endAfter":
                                addScheduleDetail = addScheduleDetail + " [[[effective]]] " + data.NextSchedule + " [[[until]]] " + data.EndDate.toString();
                                break;
                            case "endBy":
                                addScheduleDetail = addScheduleDetail + " [[[effective]]] " + data.NextSchedule + " [[[until]]] " + data.EndDate.toString();
                                break;
                        }
                        parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("hide");
                        closePopupContainer();
                        if (origin == "recentdata")
                            parent.$("#ReportProcessOption_popup_iframe").contents().find("#hiddenprocessSchedule").val(data.scheduleResult);
                        else
                            parent.$("#ReportProcessOption_popup_iframe").contents().find("#snapshothiddenprocessSchedule").val(data.scheduleResult);

                        parent.$("#ReportProcessOption_popup_iframe").contents().find(".configure[data-form='" + origin + "']").parents(".column").next(".ScheduleContent").html(addScheduleDetail);
                    }
                });

            });

    $(".share-popup .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
 
}

function enableScheduleOption() {
    $(".subscribe-popup-body").css("display", "none");
    $(".schedule-popup-body").fadeIn();
    $('#next_Container').css("display", "none");
    $('#submit_Container').css("display", "none");
    $('#next_Container').css("display", "block");
}

function enableSubscribeOption() {
    $(".schedule-popup-body").css("display", "none");
    $(".subscribe-popup-body").fadeIn();
    $('#next_Container').css("display", "none");
    $('#submit_Container').css("display", "block");
}

function validateSchedule() {
    var startDateTimeObj = $('#StartDate').data("ejDateTimePicker");
    var scheduleName = $('#schedule_name').val();
    if (!($('#scheduleNameErrorContainer').css('display') == "block") && !($('body .loader-gif').length)) {
        if (!scheduleName) {
            $('#scheduleNameErrorContainer').css('display', 'block');
            $('#scheduleNameErrorContainer').css('margin-left', '-44px');
            $('#scheduleNameValidator').html("[[[Please enter schedule name]]]");
            return false;
        }
        else if (!parent.IsValidName("name", scheduleName)) {
            $('#scheduleNameErrorContainer').css('display', 'block');
            $('#scheduleNameErrorContainer').css('margin-left', '-44px');
            $('#scheduleNameValidator').html("[[[Please avoid special characters]]]");
            return false;
        }
        else {
            $('#scheduleNameErrorContainer').css('display', 'none');
        }

        switch ($('#recurrenceType').val().toString()) {
            case "Daily":
                break;
            case "Weekly":
                if (!$('#daysCheckBox input[type="checkbox"]').is(':checked')) {
                    $('#weeklyDayErrorContainer').css('display', 'block');
                    $('#weeklyDaysValidator').html("[[[Please select at least one day.]]]");
                    return false;
                }
                else {
                    $('#weeklyDayErrorContainer').css('display', 'none');
                }
                break;
            case "Monthly":
                break;
            case "Yearly":
                var currentMonth = $('#yearlyMonth').val().toString();
                var day = parseInt($('#yearlyDay').val());
                var dayObject = $("#yearlyDay").data("ejNumericTextbox");
                switch (currentMonth) {
                    case "February":
                        if (day > 28) {
                            dayObject.option("value", 28);
                        }
                        break;

                    case "April":
                    case "June":
                    case "September":
                    case "November":
                        if (day > 30) {
                            dayObject.option("value", 30);
                        }
                        break;

                    case "January":
                    case "March":
                    case "May":
                    case "July":
                    case "August":
                    case "October":
                    case "December":
                        if (day > 31) {
                            dayObject.option("value", 31);
                        }
                        break;
                }
                break;
        }

        if (!startDateTimeObj.model.dateTimeFormat == "M/d/yyyy h:mm tt") {
            $('#startDateErrorContainer').css('display', 'block');
            $('#startDateValidator').html("[[[Please enter schedule name]]]");
            return false;
        }
        else {
            $('#startDateErrorContainer').css('display', 'none');
        }

        switch ($('input[name=EndType]:checked', '#scheduleEndType').val().toString()) {
            case "endBy":
                var endDateTimeObj = $('#EndDate').data("ejDateTimePicker");
                if (!endDateTimeObj.model.dateTimeFormat == "M/d/yyyy h:mm tt") {
                    $('#endDateErrorContainer').css('display', 'block');
                    $('#endDateValidator').html("[[[Please enter schedule name]]]");
                    return false;
                }
                else {
                    $('#endDateErrorContainer').css('display', 'none');
                }
                break;
        }
        return true;
    } else {
        return false;
    }
}

function validateDateTimePicker() {
    var startDate = $('#StartDate').data("ejDateTimePicker");
    var endDate = $('#EndDate').data("ejDateTimePicker");
    var startValue = $('#StartDate').data("ejDateTimePicker").getValue();
    var mindateVal = new Date(startValue);
    $('#EndDate').ejDateTimePicker({ minDateTime: new Date(mindateVal.getFullYear(), mindateVal.getMonth(), mindateVal.getDate()), value: new Date(startValue) });
   
    var hours = parseInt($("#hourDifference").val());
    var mins = parseInt($("#minuteDifference").val());
    mindateVal.setHours(mindateVal.getHours() + hours);
    mindateVal.setMinutes(mindateVal.getMinutes() + mins);
    var formattedString = DateCustomFormat("MM/dd/yyyy" + " hh:mm", mindateVal);
    formattedString += (mindateVal.getHours() >= 12) ? " PM" : " AM";
    $("#time").html(formattedString);
}

function DateTimeParser(dateTime) {
    if (dateTime == undefined) {
        return "";
    }
    var pattern = /Date\(([^)]+)\)/;
    var resultStrs = pattern.exec(dateTime);

    if (resultStrs != null) {
        var dtObj = new Date(parseInt(resultStrs[1]));
        return dtObj;
    }
    else {
        return dateTime;
    }
}

function enableScheduleWaitingPopup(id) {
    ShowWaitingProgress(id, "show");
}

function disableScheduleWaitingPopup() {
    $(".reports-waitingPopup").remove();
}


$(document).on('click', "#schedule_Next", function (event) {
    if (validateSchedule()) {
        enableSubscribeOption();
    }
});

$(document).on('click', "#schedule_Back", function (event) {
    $("#selectedUsersValidation").css("visibility", "hidden");
    enableScheduleOption();
});

$(document).on('change', '#recurrenceType', function () {
    var selected = $(this).find("option:selected").val();
    $('#dailyScheduleOption').css('display', 'none');
    $('#weeklyScheduleOption').css('display', 'none');
    $('#monthlyScheduleOption').css('display', 'none');
    $('#yearlyScheduleOption').css('display', 'none');
    switch (selected.toString()) {
        case "Daily":
            $('#dailyScheduleOption').css('display', 'block');
            break;
        case "Weekly":
            $('#weeklyScheduleOption').css('display', 'block');
            break;
        case "Monthly":
            $('#monthlyScheduleOption').css('display', 'block');
            break;
        case "Yearly":
            $('#yearlyScheduleOption').css('display', 'block');
            break;
    }
});



$(document).on("click", "#schedule_Submit_Cancel,#schedulePopup", function (event) {
    closePopupContainer();
});
$(document).keyup(function (e) {
    if (e.keyCode == 27) closePopupContainer();
});
function closePopupContainer() {
    parent.$("#ReportProcessOption_schedule_popup").ejDialog("close");
    parent.$("#ReportProcessOption_schedule_popup_wrapper").ejWaitingPopup("hide");
}

//To  stop animation in radio-button on page rendering
$(document).on("click", ".css-radio", function () {
    $(this).siblings("label").removeClass("notransition");
});