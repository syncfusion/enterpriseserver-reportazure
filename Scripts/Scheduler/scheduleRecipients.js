function getAllStaticData() {
    if (window.userList == undefined) {
        $.ajax({
            type: "POST",
            url: getActiveandInactiveUserUrl,
            data: {},
            async: false,
            success: function (result) {
                window.userList = result.data.users;
                window.groupList = result.data.groups;
            }
        });
    }
    $("#user-search").append(window.userList);
    $("#group-search").append(window.groupList);
    $("#pdf-export").prop("checked", true);
    $(".selectpicker").selectpicker("refresh");
    $("#schedule-submit").attr("data-report-id", createdItemId);
    $("#schedule-submit").attr("data-item-id", createdItemId);
    $(".share-popup .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok' ></span></div>");
}

function validateExternalRecipient() {
    $(document).on("keypress", "#external-email", function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#external-submit").click();
        }
    });

    $(document).on("click", "#external-submit", function (e) {
        var emailid = $("#external-email").val().toLowerCase();
        var selectedItems = $(".selected-recipients").children();
        if (IsEmail(emailid)) {
            var externalRecipientTile = $("<div>").attr("id", emailid).attr("data-searchtype", "externalRecipient").addClass("SelectedShareItems");
            externalRecipientTile.html("<div class='InstantSearch'><span class='details' title='" + emailid + "'>" + emailid
                + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            for (var i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i].getAttribute("data-searchtype") == "externalRecipient") {
                    if (emailid == selectedItems[i].id) {
                        $("#external-email").addClass("inactive-box");
                        $("#external-submit").addClass("inactive-icon");
                        $("#external-email-validation").html("<span class='validate-fail'>[[[Email address already exists]]]</span>");
                        return;
                    }
                }
            }
            $("#selected-users").append(externalRecipientTile);
            $("#external-email").val("");
            selectedItemsCount();
        }
        else {
            if (emailid != "") {
                $("#external-email").addClass("inactive-box");
                $("#external-submit").addClass("inactive-icon");
                $("#external-email-validation").html("<span class='validate-fail'>[[[Please enter a valid email address]]]</span>");
            }
            else {
                $("#external-email").removeClass("inactive-box");
                $("#external-submit").removeClass("inactive-icon");
                $("#external-email-validation").html();
            }
        }
    });

    $(document).on("keyup", "#external-email", function (e) {
        if (e.keyCode != 13) {
            $("#external-email").removeClass("inactive-box");
            $("#external-submit").removeClass("inactive-icon");
            $("#external-email-validation").html("");
        }
    });
}

function selectedItemsCount() {
    $("#selected-users-info").html("<span class='pull-left'>" + $(".SelectedShareItems[data-searchtype='userSearch']").length + " [[[User(s)]]] " + $(".SelectedShareItems[data-searchtype='groupSearch']").length + " [[[Group(s)]]] " + $(".SelectedShareItems[data-searchtype='externalRecipient']").length + " [[[External Recipient(s)]]]<span>").css({ "padding-top": "10px", "padding-left": "15px", "margin-top": "0" });
}

$(document).on("click", "#user-search-container .bs-select-all-custom", function (e) {
    $("#user-search-container").addClass("value-changed");
    $("#user-search").data("selectpicker").selectAll();
    $(this).removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    $($(this).children("span")[0]).text("[[[Clear All]]]");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#group-search-container .bs-select-all-custom", function (e) {
    $("#group-search-container").addClass("value-changed");
    $("#group-search").data("selectpicker").selectAll();
    $(this).removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    $($(this).children("span")[0]).text("[[[Clear All]]]");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#user-search-container .bs-deselect-all-custom", function (e) {
    $("#user-search-container").addClass("value-changed");
    $("#user-search").data("selectpicker").deselectAll();
    $(this).removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    $($(this).children("span")[0]).text("[[[Select All]]]");
    $(".SelectedShareItems[data-searchtype='userSearch']").remove();
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#group-search-container .bs-deselect-all-custom", function (e) {
    $("#group-search-container").addClass("value-changed");
    $("#group-search").data("selectpicker").deselectAll();
    $(this).removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    $($(this).children("span")[0]).text("[[[Select All]]]");
    $(".SelectedShareItems[data-searchtype='groupSearch']").remove();
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#user-search-container .bootstrap-select li a", function (e) {
    $("#user-search-container").addClass("value-changed");;
    var selectedCount = $("#user-search-container .bootstrap-select li.selected").length;
    var allListCount = $("#user-search-container .bootstrap-select li").length;

    if (selectedCount == allListCount) {
        $($("#user-search-container div.bs-select-all-custom").children("span")[0]).text("[[[Clear All]]]");
        $("#user-search-container div.bs-select-all-custom").removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    }
    if ($(this).parent().hasClass("selected")) {
        var selectedUser = $("#user-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        var userTile = $("<div>").attr("id", $(selectedUser).val()).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
        userTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedUser).text() + "'>" + $(selectedUser).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
        $("#selected-users").append(userTile);
    }
    else {
        var selectedUser = $("#user-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        $(".SelectedShareItems[id='" + $(selectedUser).val() + "']").remove();
        $($("#user-search-container .bs-deselect-all-custom").children("span")[0]).text("[[[Select All]]]");
        $("#user-search-container .bs-deselect-all-custom").removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    }
    $(this).parent().addClass("active");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#group-search-container .bootstrap-select .dropdown-menu .selectpicker li a", function (e) {
    $("#group-search-container").addClass("value-changed");;
    var selectedCount = $("#group-search-container .bootstrap-select li.selected").length;
    var allListCount = $("#group-search-container .bootstrap-select li").length;
    if (selectedCount == allListCount) {
        $($("#group-search-container div.bs-select-all-custom").children("span")[0]).text("[[[Clear All]]]");
        $("#group-search-container div.bs-select-all-custom").removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    }

    if ($(this).parent().hasClass("selected")) {
        var selectedGroup = $("#group-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        var groupTile = $("<div>").attr("id", $(selectedGroup).val()).attr("data-searchtype", "groupSearch").addClass("SelectedShareItems");
        groupTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedGroup).text() + "'>" + $(selectedGroup).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
        $("#selected-users").append(groupTile);
    }
    else {
        var selectedGroup = $("#group-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        $(".SelectedShareItems").filter("[data-searchtype='groupSearch']").filter("#" + $(selectedGroup).val()).remove();
        $($("#group-search-container .bs-deselect-all-custom").children("span")[0]).text("[[[Select All]]]");
        $("#group-search-container .bs-deselect-all-custom").removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    }
    $(this).parent().addClass("active");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#subscribers-panel .i-selected-cancel", function (event) {
    var key = $(this).parents(".SelectedShareItems").attr("id");
    var searchType = $(this).parents(".SelectedShareItems").attr("data-searchtype");
    if (searchType == "userSearch") {
        currentElementIndex = $("#user-search").find("[value='" + key + "']").index();
        $("#user-search-container .bootstrap-select li").filter("[data-original-index='" + currentElementIndex + "']").find("a").click();
    }
    else if (searchType == "groupSearch") {
        currentElementIndex = $("#group-search").find("[value='" + key + "']").index();
        $("#group-search-container .bootstrap-select li").filter("[data-original-index='" + currentElementIndex + "']").find("a").click();
    }
    else {
        if (searchType == "externalRecipient") {
            $(".SelectedShareItems[id='" + key + "']").remove();
        }
    }
    selectedItemsCount(); 
});

$(document).on("hide.bs.dropdown", "#user-search-container", function (e) {
    if ($("#user-search-container").hasClass("value-changed")) {
        $("#user-search-container").removeClass("value-changed");
        e.stopPropagation();
    }
});

$(document).on("hide.bs.dropdown", "#group-search-container", function (e) {
    if ($("#group-search-container").hasClass("value-changed")) {
        $("#group-search-container").removeClass("value-changed");
        e.stopPropagation();
    }
});

$(document).on("show.bs.dropdown", "#user-search-container", function (e) {
    $("#user-search").next("div").find(".dropdown-menu").addClass("dropdown-width");
});

$(document).on("show.bs.dropdown", "#group-search-container", function (e) {
    $("#group-search").next("div").find(".dropdown-menu").addClass("dropdown-width");
});

$(document).on("click", "#schedule-submit", function () {
    //ScheduleFileSettingInfo
    $("#error-filedkey-info").remove();
    var scheduleExportFileSettings = GetExportFileSettingInfo();
    if (scheduleExportFileSettings == null) {
        return;
    }
		
    validateSubscriber();
    var scheduleUrl = "";
    var scheduleItem = {};
    scheduleItem.ScheduleName = $("#schedule-name").val();
    scheduleItem.ItemId = $(this).attr("data-report-id");
    scheduleItem.ExportType = $("input[name=exportFormats]:checked", "#export-format-container").val().toString();
    if (actionType == "Create") {
        successMessage = "[[[Report has been scheduled successfully. ]]]";
        scheduleUrl = addScheduleUrl;
    }
    else {
        successMessage = "[[[Schedule has been updated successfully. ]]]";
        scheduleItem.ScheduleId = $(this).attr("data-schedule-id");
        scheduleUrl = updateScheduleUrl;
    }
    switch ($("#recurrence-type").val().toString().toLowerCase()) {
        case "daily":
            if ($("#daily-every-x-days").prop("checked")) {
                scheduleItem.RecurrenceType = "Daily";
                scheduleItem.RecurrenceInterval = $("#every-x-days").val();
                if (scheduleItem.RecurrenceInterval == 1)
                    ScheduleDetail = "[[[Occurs every day]]]";
                else
                    ScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[days]]]";
            }
            else {
                scheduleItem.RecurrenceType = "DailyWeekDay";
                ScheduleDetail = "[[[Occurs every weekday]]]";
            }
            break;
        case "weekly":
            scheduleItem.RecurrenceType = "Weekly";
            scheduleItem.RecurrenceInterval = $("#every-x-weeks").val();
            scheduleItem.Sunday = $("#sun").prop("checked");
            scheduleItem.Monday = $("#mon").prop("checked");
            scheduleItem.Tuesday = $("#tues").prop("checked");
            scheduleItem.Wednesday = $("#wed").prop("checked");
            scheduleItem.Thursday = $("#thu").prop("checked");
            scheduleItem.Friday = $("#fri").prop("checked");
            scheduleItem.Saturday = $("#sat").prop("checked");
            var daysDetail = "";
            var selectDays = $(".daygroup:checked");
            for (var i = 0; i < selectDays.length; i++) {
                if (selectDays.length == 1 || i == 0)
                    daysDetail = $(selectDays[i]).parent().text().trim();
                else if (i > 0 && i != selectDays.length - 1)
                    daysDetail = daysDetail + ", " + $(selectDays[i]).parent().text().trim();
                else
                    daysDetail = daysDetail + " [[[and]]] " + $(selectDays[i]).parent().text().trim();
            }
            if (scheduleItem.RecurrenceInterval == 1)
                ScheduleDetail = "Occurs every " + daysDetail;
            else
                ScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[week(s) on]]] " + daysDetail;
            break;
        case "monthly":
            if ($("#monthly").prop("checked")) {
                scheduleItem.RecurrenceType = "Monthly";
                scheduleItem.DaysOfMonth = $("#monthly-date").val();
                scheduleItem.RecurrenceInterval = $("#monthly-every-x-months").val();
                ScheduleDetail = "[[[Occurs day]]] " + scheduleItem.DaysOfMonth.toString() + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";
            }
            else {
                scheduleItem.RecurrenceType = "MonthlyDOW";
                scheduleItem.WeekOfMonth = $("#monthly-dow-week").find('option:selected').text();
                scheduleItem.DayOfWeek = $("#monthly-dow-day").find('option:selected').text();
                scheduleItem.RecurrenceInterval = $("#monthly-dow-every-x-months").val();
                ScheduleDetail = "[[[Occurs the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#monthly-dow-day").find('option:selected').text(); + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";
            }
            break;
        case "yearly":
            scheduleItem.RecurrenceInterval = $("#every-x-years").val();
            if ($("#yearly").prop("checked")) {
                scheduleItem.RecurrenceType = "Yearly";
                scheduleItem.DaysOfMonth = $("#yearly-day").val();
                scheduleItem.MonthOfYear = $("#yearly-month").find('option:selected').text();
                if (scheduleItem.RecurrenceInterval == 1)
                    ScheduleDetail = "[[[Occurs every]]] " + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
                else
                    ScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
            }
            else {
                scheduleItem.RecurrenceType = "YearlyDOW";
                scheduleItem.WeekOfMonth = $("#yearly-dow-week").find('option:selected').text();
                scheduleItem.DayOfWeek = $("#yearly-dow-day").find('option:selected').text();
                scheduleItem.MonthOfYear = $("#yearly-dow-month").find('option:selected').text();
                if (scheduleItem.RecurrenceInterval == 1)
                    ScheduleDetail = "[[[Occurs the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearly-dow-day option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
                else
                    ScheduleDetail = "[[[Occurs every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearly-dow-day option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
            }
            break;
        case "hourly":
            scheduleItem.RecurrenceType = "Hourly";
            scheduleItem.Frequency = $(".time-width").val();
            scheduleItem.RecurrenceInterval = $("#every-x-hours-value").val();
            var timesplit = scheduleItem.Frequency.split(':');
            var minutes = (timesplit[0]) + timesplit[1];
            var timeText = "";
            if (parseInt(timesplit[0]) > 0)
                timeText += timesplit[0] + " hour(s) ";
            if (parseInt(timesplit[1]) > 0)
                timeText += timesplit[1] + " minute(s)";
            ScheduleDetail = "[[[Occurs every ]]]" + timeText;
            break;

    }


    scheduleItem.IsEnabled = $("#enable-schedule").prop("checked");

    scheduleItem.IsParameterEnabled = $("#enable-parameter").prop("checked");

    scheduleItem.StartDate = $("#start-date").val();
    var scheduleEndType = $("input[name=end-type]:checked", "#schedule-end-type").val() != undefined ? $("input[name=end-type]:checked", "#schedule-end-type").val().toString() : "";
    switch (scheduleEndType) {
        case "never":
            scheduleItem.ScheduleEndType = "NoEnd";
            break;
        case "endafter":
            scheduleItem.ScheduleEndType = "EndAfter";
            scheduleItem.RecurrenceFactor = $("#occurence-count").val();
            break;
        case "endBy":
            scheduleItem.ScheduleEndType = "EndBy";
            scheduleItem.EndDate = $("#end-date").val();
            break;
    }

    var selectedItems = $(".selected-recipients").children();

    var userlist = Array();
    var grouplist = Array();
    var externalrecipientlist = Array();
    var a = 0, b = 0, c = 0;
    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].getAttribute("data-searchtype") == "userSearch") {
            if (a != -1) {
                userlist[a] = selectedItems[i].id;
                a++;
            }
        }
        if (selectedItems[i].getAttribute("data-searchtype") == "groupSearch") {
            if (b != -1) {
                grouplist[b] = selectedItems[i].id;
                b++;
            }
        }
        if (selectedItems[i].getAttribute("data-searchtype") == "externalRecipient") {
            if (c != -1) {
                externalrecipientlist[c] = selectedItems[i].id;
                c++;
            }
        }
    }

    var reportParamType = window.reportParameterType;
    var parameterList = [];
    if ($("#enable-parameter").prop("checked")) {
        parameterList = reportparameterObj;
        for (var par = 0; par < reportparameterObj.length; par++) {
            var parameterHasValue = !isEmptyOrWhitespace($("#" + parameterObj[par].Name).val());
            parameterList[par].Hidden = $("#" + parameterObj[par].Name + "-use-default").is(":checked");
            if (parameterHasValue && $("#" + parameterObj[par].Name + "-use-default").is(":checked") === false) {
                if (parameterList[par].DefaultValue === null) {
                    var obj = { Values: [] };
                    parameterList[par].DefaultValue = obj;
                }

                if (typeof ($("#" + parameterObj[par].Name).val()) != "object") {
                    parameterList[par].DefaultValue.Values = $("#" + parameterObj[par].Name).val().split(',');
                } else {
                    parameterList[par].DefaultValue.Values = $("#" + parameterObj[par].Name).val();
                }
            } else if (parameterList[par].DataType == reportParamType.Boolean && parameterList[par].DefaultValue != null) {
                $("#true-" + window.parameterObj[par].Name).ejRadioButton({
                    size: "medium", checked: true, change: function (args) {
                        $("#true-" + window.parameterObj[par].Name).val(args.model.enabled.toString());
                    }
                });
                parameterList[par].DefaultValue.Values[0] = $("#true-" + window.parameterObj[par].Name).val();
                $("#false-" + window.parameterObj[par].Name).ejRadioButton({
                    size: "medium", checked: true, change: function (args) {
                        $("#false-" + window.parameterObj[par].Name).val(args.model.enabled.toString());
                    }
                });
                parameterList[par].DefaultValue.Values[0] = $("#false-" + window.parameterObj[par].Name).val();
            }
        }
    }

    //checkbox checked condition before submit
    if (($("#save-as-file").is(":checked") || $("#enable-send-mail").is(":checked")) === false) {
        $("#checkbox-validation").css("visibility", "visible").css({ "color": "#a94442", "font-size": "12px" });
        return;
    } else if (($("#save-as-file").is(":checked") && $("#enable-send-mail").is(":checked"))) {
        $("#checkbox-validation").css("visibility", "hidden");
    }
    else if (($("#save-as-file").is(":checked") || $("#enable-send-mail").is(":checked"))) {
        $("#checkbox-validation").css("visibility", "hidden");
    } else {
        $("#checkbox-validation").css("visibility", "hidden");
    }

    scheduleItem.IsSaveAsFile = false;
    scheduleItem.IsSendAsMail = false;

    //export path and max report count values
    var saveasfile = false;
    if ($("#save-as-file").is(":checked")) {
        if ($("#export-path").val() === "") {
            $(".directory-check").css("display", "block");
            $(".directory-check").html("[[[Please enter a valid directory path]]]").css({ "color": "#a94442", "font-size": "12px" });
            return;
        }
        var path = $("#export-path").val();
        exportPathExistCheck(path);
        if ($(".directory-check").hasClass("directory-exist")) {
            $(".directory-check").css("display", "block");
            $(".directory-check").html("[[[Directory path does not exist]]]").css({ "color": "#a94442", "font-size": "12px" });
            return;
        }
        scheduleItem.ExportPath = $("#export-path").val();
        if ($.isNumeric(parseInt($("#max-report-count").val()))) {
            scheduleItem.ReportCount = parseInt($("#max-report-count").val());
            $("#report-count-validation").css("visibility", "hidden");
        } else {
            $("#report-count-validation").css("visibility", "visible").css({ "color": "#a94442", "font-size": "12px" });
            return;
        }

        scheduleItem.IsSaveAsFile = true;
        saveasfile = true;
    }

    var isSendMail = false;
    if ($("#enable-send-mail").is(":checked")) {
        if (selectedItems.length) {
            scheduleItem.IsSendAsMail = true;
            isSendMail = true;
        } else {
            $("#selected-users-validation").css("visibility", "visible");
            return;
        }
    }

    if (($("#save-as-file").is(":checked") || $("#enable-send-mail").is(":checked"))) {
        $.ajax({
            type: "POST",
            url: scheduleUrl,
            data: {
                scheduleList: JSON.stringify({ ScheduleItem: scheduleItem, UserList: userlist, GroupList: grouplist, ExternalRecipientList: externalrecipientlist, ParameterList: parameterList }), scheduleExportFileSettingsData: JSON.stringify({ ExportFileSetting: scheduleExportFileSettings })
            },
            beforeSend: function () {
                parent.$("#popup-container_wrapper").ejWaitingPopup("show");
            },
            success: function (data) {
                var scheduleEndType = $("input[name=end-type]:checked", "#schedule-end-type").val() != undefined ? $("input[name=end-type]:checked", "#schedule-end-type").val().toString() : "";
                switch (scheduleEndType) {
                    case "never":
                        ScheduleDetail = ScheduleDetail + "</br>" + "[[[effective from]]] " + data.NextSchedule;
                        break;
                    case "endafter":
                        ScheduleDetail = ScheduleDetail + "</br>" + "[[[effective from]]] " + data.NextSchedule + " [[[and ends after]]] " + scheduleItem.RecurrenceFactor + " [[[occurrences.]]]";
                        break;
                    case "endBy":
                        ScheduleDetail = ScheduleDetail + "</br>" + "[[[effective from]]] " + data.NextSchedule + " [[[until]]] " + data.EndDate.toString();
                        break;
                }
                parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
                var scheduleName = $(".schedule-popup-title").text();
                closePopupContainer();
                var sizeobj = parent.$("#messageBox").data("ejDialog");
                var previousHeight = sizeobj.option("height");
                sizeobj.option("height", "200px");
                parent.messageBox("su-calendar-1", scheduleName, successMessage + "</br>" + ScheduleDetail, "success", function () {
                    sizeobj.option("height", previousHeight);
                    parent.onCloseMessageBox();
                    if (typeof parent.refreshScheduleGrid === "function") {
                        parent.refreshScheduleGrid();
                    }
                });

            }
        });
    }
    else {
        $("#selected-users-validation").css("visibility", "visible");
    }
});

function validateSubscriber() {
    if (!$("#selected-users").children().length > 0) {
        $("#selectedRecipientErrorContainer").css("display", "block");
        $("#selectedRecipientValidator").html("[[[Please select atleast one recipient]]]");
        return false;
    } else {
        $("#selectedRecipientErrorContainer").css("display", "none");
    }
}

$(document).ready(function () {
    if ($("#enable-send-mail").is(":checked")) {
        $(".send-mail-block").css("display", "block");
    } else {
        $(".send-mail-block").css("display", "none");
    }
    if ($("#save-as-file").is(":checked")) {
        $(".save-as-file-type").css("display", "block");
    } else {
        $(".save-as-file-type").css("display", "none");
    }
});
