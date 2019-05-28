var userAgent = navigator.userAgent;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");
var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
var selectedAdmins = [];
var gridAdminData = [];
var isFirstRequest = false;

$(document)
    .ready(function () {
        addPlacehoder("body");
        listUsersForAdminSelection();
        showWaitingPopup($(".startup-page-conatiner"));
        hideWaitingPopup($("#add_admins_grid"));
        $(".placeholder").css("display", "none");
        if (isSafari) {
            $("#search-ump-users").css("width", "1px");
        }
    });
function listUsersForAdminSelection() {
    var requestUrl = getAllUsersUrl;
    $("#add_admins_grid").ejGrid({
        dataSource: ej.DataManager({ url: requestUrl, adaptor: "UrlAdaptor" }),
        gridLines: ej.Grid.GridLines.None,
        allowPaging: true,
        allowSorting: true,
        enableAltRow: false,
        allowSearching: true,
        allowSelection: true,
        allowFiltering: true,
        pageSettings: { pageSize: 20, pageCount: 3},
        filterSettings: { filterType: "menu" },
        selectionType: ej.Grid.SelectionType.Multiple,
        selectionSettings: { selectionMode: ["row"] },
        enableRowHover: true,
        create: "fnCreateForAdmin",
        recordClick: "onAddAdminRecordClick",
        templateRefresh: "refreshTemplateForAdmin",
        actionBegin: "fnOnAddAdminGridActionBegin",
        actionComplete: "fnOnAddAdminGridActionComplete",
        rowDataBound: function () {
            var height = $(".e-gridcontent").height();
            if (height != null) {
                rowBound();
            }
        },
        dataBound: function () {
            $('[data-toggle="tooltip"]').tooltip();
        },
        columns: [
            {
                headerTemplateID: "#admin-checkbox-header-template",
                template: true,
                templateID: "#admin-checkbox-row-template",
                textAlign: ej.TextAlign.Center,
                width: 15,
                allowFiltering: false
            },
            {
                template: true,
                templateID: "#admin-template",
                headerText: "[[[Name]]]",
                width: 115,
                headerTemplateID: "#admin-header",
                field: "DisplayName",
                type: "string"
            }
        ]
    });
}

function fnCreateForAdmin() {
    $("#admin-checkbox-header").change(headCheckboxOnChangeForAdmin);
}

function onAddAdminRecordClick(args) {
    var gridObj = $("#add_admins_grid").data("ejGrid");
    var checkboxHeader = $("#admin-checkbox-header");
    var isChecked = args.row.find(".checkbox-row").is(":checked");
    $(".modal-dialog").addClass("fixed-pos");
    window.setTimeout('$(".modal-dialog").removeClass("fixed-pos");', 1);

    if (isChecked) {
        gridObj.multiSelectCtrlRequest = true;

        if (jQuery.inArray(JSON.stringify(args.data.UserId), $.map(selectedAdmins, JSON.stringify)) == -1) {
            selectedAdmins.push(args.data.UserId);
        } else {
            gridObj.selectRows(args.row.index());
        }
    }
    else {
        gridObj.multiSelectCtrlRequest = true;
        gridObj.selectRows(args.row.index());
        var index = jQuery.inArray(JSON.stringify(args.data.UserId), $.map(selectedAdmins, JSON.stringify));
        if (index != -1) {
            selectedAdmins.splice(index, 1);
            gridObj.selectRows(args.row.index());
        }
    }
    gridAdminData = gridObj.model.currentViewData;
    var userRowCheckedCount = 0;
    for (i = 0; i <= gridAdminData.length - 1; i++) {
        if ($($("#add_admins_grid .checkbox-row")[i]).is(":checked") == true) {
            userRowCheckedCount = userRowCheckedCount + 1;
        }
    }
    if (gridObj.getRows() != null) {
        if ((gridAdminData.length) === userRowCheckedCount)
            checkboxHeader.prop("checked", true);
        else
            checkboxHeader.prop("checked", false);
    }
    enableAccessButtonForAdmin();
}

function fnOnAddAdminGridActionBegin(args) {
    isFirstRequest = true;
    var searchValue = $("#search-ump-users").val();
    this.model.query._params.push({ key: "searchKey", value: searchValue });
    var filerSettings = [], i;

    if (args.model.filterSettings.filteredColumns.length > 0) {
        for (i = 0; i < args.model.filterSettings.filteredColumns.length; i++) {
            var column = args.model.filterSettings.filteredColumns[i];
            filerSettings.push({ "PropertyName": column.field, "FilterType": column.operator, "FilterKey": column.value });
        }

        this.model.query._params.push({ key: "filterCollection", value: filerSettings });
    }
}

function fnOnAddAdminGridActionComplete(args) {
    var gridObj = $("#add_admins_grid").data("ejGrid");
    var checkboxHeader = $("#admin-checkbox-header");
    checkboxHeader.prop("disabled", true).change(headCheckboxOnChangeForAdmin);
    gridObj.multiSelectCtrlRequest = true;
    gridObj.clearSelection();
    if (args.requestType == "paging" || args.requestType == "sorting" || args.requestType == "refresh" || args.requestType == "filtering" || args.requestType == "searching") {
        if (gridObj.model.currentViewData.length == 0) {
            checkboxHeader.prop("checked", false);
            checkboxHeader.prop("disabled", true);
            $(".no-user-warning").css("display", "block");
            window.setTimeout('$("#admin-account-submit-container").css("margin-top", $("#add_admins_grid").height() + $(".no-user-warning").height() + 155);');
        } else {
            $(".no-user-warning").css("display", "none");
            window.setTimeout('$("#admin-account-submit-container").css("margin-top", $("#add_admins_grid").height() + 135);');
        }
        if (window.innerWidth < 992) {
            window.setTimeout('$(".modal").css("top", $(".title").offset().top + $(".title").height() + 10 - $("#admin-account-submit-container").offset().top + "px");');
        }
        if ($(".modal").offset().top + $(".modal").height() > $("#admin-account-submit-container").offset().top) {
            window.setTimeout('$(".modal").css("bottom", $(".modal").offset().top + $(".modal").height() - $("#admin-account-submit-container").offset().top + "px");');
        }
        if (typeof gridObj.model.currentViewData != 'undefined') {
            for (var i = 0; i < gridObj.model.currentViewData.length; i++) {
                var record = gridObj.model.currentViewData[i];
                var rowUniId = record.UserId;
                var index = jQuery.inArray(JSON.stringify(record.UserId), $.map(selectedAdmins, JSON.stringify));
                if (index != -1) {
                    var rowIndex = $($("#add_admins_grid .checkbox-row[data-checked-id='" + rowUniId + "']").closest("td").parent()).index();
                    $("#add_admins_grid .checkbox-row#admin-row-check" + rowUniId).prop("checked", true);
                    gridObj.selectRows(rowIndex);
                }
            }
        }
        checkboxHeader.attr("disabled", gridObj.model.currentViewData.length == 0);
    }

    if (args.requestType === "paging" || args.requestType === "sorting" || args.requestType === "refresh" || args.requestType === "filtering") {
        if ((gridObj.model.selectedRecords.length) == gridObj.model.currentViewData.length && gridObj.model.currentViewData.length > 0) {
            checkboxHeader.prop("checked", true);
        } else {
            checkboxHeader.prop("checked", false);
        }
    }

    enableAccessButtonForAdmin();
    $("[data-toggle='tooltip']").tooltip();
    window.setTimeout('hideWaitingPopup($(".startup-page-conatiner"));', 500);
}

function refreshTemplateForAdmin() {
    $("#admin-checkbox-header").change(headCheckboxOnChangeForAdmin);
}

function headCheckboxOnChangeForAdmin() {
    var gridObj = $("#add_admins_grid").data("ejGrid");
    if ($("#admin-checkbox-header").prop("checked") == true) {
        $(".checkbox-row").prop("checked", true);
        gridObj.multiSelectCtrlRequest = true;
        gridObj.selectRows(0, $(".checkbox-row").length);
        gridAdminData = gridObj.model.currentViewData;
        for (var i = 0; i < gridAdminData.length; i++) {
            var index = jQuery.inArray(JSON.stringify(gridAdminData[i].UserId), $.map(selectedAdmins, JSON.stringify));
            if (index == -1) {
                selectedAdmins.push(gridAdminData[i].UserId);
            }
        }

        if (isSafari) {
            $(".admin-checkbox-header-label").addClass("check");
        }
    }
    else {
        $(".checkbox-row").prop("checked", false);
        gridObj.clearSelection();
        gridAdminData = gridObj.model.currentViewData;
        for (var i = 0; i < gridAdminData.length; i++) {
            var index = jQuery.inArray(JSON.stringify(gridAdminData[i].UserId), $.map(selectedAdmins, JSON.stringify));
            if (index != -1) {
                selectedAdmins.splice(index, 1);
            }
        }
        if (isSafari) {
            $(".admin-checkbox-header-label").removeClass("check");
        }
    }
    enableAccessButtonForAdmin();
}

function enableAccessButtonForAdmin() {
    $("#provide-admin-access-button").attr("disabled", selectedAdmins.length === 0);
}

function setSystemAdmins() {
    var requestUrl = addSystemAdminsUrl;
    if (selectedAdmins.length > 0) {
        var elem = $(".startup-page-conatiner");
        elem.ejWaitingPopup({ text: " " });
        $(".e-text").find(".configuration-status").remove();
        $(".e-text").append('<span class="configuration-status"></span>');
        elem.ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            data: { selectedAdmins: selectedAdmins, includeSampleResources: includeSampleResources },
            url: requestUrl,
            success: function (result) {
                hideWaitingPopup("add_admins_grid");
                $("#provide-admin-access-button").attr("disabled", "disabled");
                onAddAdminsDialogClose();
                if (result.status) {
                    window.location = loginPageUrl;
                } else {
                    location.reload(true);
                }
            }
        });
    }
}

function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = false;
    }
}

function onAddAdminsDialogClose() {
    var gridObj = $("#add_admins_grid").data("ejGrid");
    gridObj.clearSelection();
    selectedAdmins = [];
    $(".admin-checkbox-header").prop("checked", false);
    $(".checkbox-row").prop("checked", false);
}

$(document)
    .on("click",
        "#refresh-admin-grid",
        function () {
            showWaitingPopup($("#add_admins_grid"));
            var exUmpDetails = $("#ex-ump-details").val();
            $.post(retryFetchingUserUrl,
                { umpDetails: exUmpDetails },
                function () {
                    var gridObj = $("#add_admins_grid").data("ejGrid");
                    gridObj.clearSelection();
                    selectedAdmins = [];
                    listUsersForAdminSelection();
                    gridObj.refreshContent();
                    hideWaitingPopup($("#add_admins_grid"));
                });
        });

$(window)
    .resize(function () {
        if (window.innerWidth < 992) {
            window.setTimeout('$(".modal").css("top", $(".title").offset().top + $(".title").height() + 10 - $("#admin-account-submit-container").offset().top + "px");');
        } else {
            window.setTimeout('$(".modal").css("top", "");');
        }

        if ($(".modal").offset().top + $(".modal").height() > $("#admin-account-submit-container").offset().top) {
            window.setTimeout('$(".modal").css("bottom", $(".modal").offset().top + $(".modal").height() - $("#admin-account-submit-container").offset().top + "px");');
        }
    });

$(document).on("click", ".su-search", function () {
    $("#search-ump-users").addClass("search-width");
    $(".close-icon").css("display", "block");
    $(".su-search").css("display", "none");
    $(".placeholder").removeClass("hide").addClass("show");
});

$(document).on("click", "#clear-search", function () {
    $("#search-ump-users").removeClass("search-width");
    $(".close-icon").css("display", "none");
    $(".su-search").css("display", "block");
    $(".placeholder").removeClass("show").addClass("hide");
    listUsersForAdminSelection();
});

$(document).on("click", ".e-filtericon", function () {
    $(".e-caption").addClass("pull-left");
});