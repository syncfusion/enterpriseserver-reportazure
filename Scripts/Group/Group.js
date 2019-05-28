var gridObj;
var selectedgroupIdValues = [];
var selectedActivedirectorygroupIdValues = [];

function fnCreateGrid(args) {
    $("#Grid .checkboxRow").ejCheckBox({ "change": checkboxOnChange });
    $("#checkboxHeader").ejCheckBox({ "change": headCheckboxOnChange });
}
function dataBound(args) {
    $("#Grid .checkboxRow").ejCheckBox({ "change": checkboxOnChange });
    $("#checkboxHeader").ejCheckBox({ "change": headCheckboxOnChange });
    this.model.indexes = {}; /* Additional property*/
}
function refreshTemplate(args) {
    $("#Grid .checkboxRow").ejCheckBox({ "change": checkboxOnChange });
    $("#checkboxHeader").ejCheckBox({ "change": headCheckboxOnChange });
}
function actionbegin(args) {
    //Stores the selected index on paging starts.
    if (args.requestType == "paging" || args.requestType == "sorting") {
        //if (this.selectedRowsIndexes.length > 0)
        //    this.model.indexes[args.previousPage] = this.selectedRowsIndexes.slice(0, 20);
    }
}
$(document).on("click", "#add-group", function () {
    var groupName = $("#GroupName").val().trim();
    $("#group-name").removeClass("has-error");
    var isValid = $(".group-form").valid();

    if (isValid) {
        parent.$("#new-group-area_wrapper").ejWaitingPopup("show");
            var values = "groupName=" + groupName + "&groupDescription=" + $("#group-description").val() + "&groupColor=";
            doAjaxPost("POST", addGroupUrl, values, function (data, result) {
                if ( data !== null && data !== "" && data.toLowerCase() === "true") {
                    var count = parent.$("#group-count-text").val();
                    var currentVal = parseInt(count) + 1;
                    parent.$("#group-count").html(currentVal);
                    parent.$("#group-count-text").val(currentVal);
                    parent.$("#new-group-area").ejDialog("close");
                    parent.$("#new-group-area_wrapper").ejWaitingPopup("hide");
                    parent.messageBox("su-group-1", "[[[Add Group]]]", "[[[New group has been created successfully.]]]", "success", function () {
                        var gridObj = parent.$("#Grid").data("ejGrid");
                        RefreshCurrentDataOfGroupList(gridObj);
                        parent.onCloseMessageBox();
                    });
                } else if (data !== null && data !== "" && data.toLowerCase() === "false") {
                    parent.$("#new-group-area_wrapper").ejWaitingPopup("hide");
                    $("#group-name").addClass("has-error");
                    $(".error-message").html("[[[Group already exists with this name]]]");
                }
                else if (data === null || data === "") {
                    parent.$("#new-group-area_wrapper").ejWaitingPopup("hide");
                    parent.messageBox("su-group-1", "[[[Add Group]]]", "[[[Failed to create group.]]]", "error", function () {
                        var gridObj = parent.$("#Grid").data("ejGrid");
                        RefreshCurrentDataOfGroupList(gridObj);
                        parent.onCloseMessageBox();
                    });
                }
        });
    }
});

//Events

function RefreshCurrentDataOfGroupList(gridObj) {
    gridObj.refreshContent();
}

$(document).ready(function () {
    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value)
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $(".group-form").validate({
        errorElement: 'span',
        onkeyup: function (element, event) { if (event.keyCode != 9) $(element).valid(); else true; },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "groupname": {
                isRequired: true,
                isValidName: true
            }
        },
        highlight: function (element) {
            $(element).closest('div').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('div').removeClass('has-error');
            $(element).closest('div').find("span").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest('div').find("span").html(error.html());
        },
        messages: {
            "groupname": {
                isRequired: "[[[Please enter group name]]]"
            }
        }
    });

    $("#GroupName").bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if ($("#cancel-group").is(":focus")) {
                parent.$("#new-group-area").ejDialog("close");
            } else {
                $("#add-group").trigger("click");
            }
            return false;
        }
    });

    var isFirstRequest = false;
    addPlacehoder("#group-name");
    $(document).on("click", "#new-group-button", function () {
        eDialog = $("#new-group-area").data("ejDialog");
        eDialog.open();
        $("#new-group-iframe").attr("src", addGroupViewUrl);
        $("#new-group-area_wrapper").ejWaitingPopup("show");
    });

    $("#new-user-dropdown, .link-button, #new-group-button, #import-group-ad").tooltip();
});

function fnOnGroupGridLoad(args) {
    args.model.dataSource.adaptor = new ej.UrlAdaptor();
    args.model.enableTouch = false;
}

function fnGroupRowSelected(args) {
    var groupgrid = $('#Grid').data("ejGrid");
    var selectedGroups = groupgrid.getSelectedRecords();

    if (groupgrid.getSelectedRecords().length == 1) {
        jQuery.each(selectedGroups, function (index, record) {
            if (record.GroupId == $(".group-delete-button").attr("data-groupid")) {
                $("#add-user-in-groups").removeClass("hide").addClass("show");
                $(".group-delete-button").css("display", "none");
            }
            else {
                $("#add-user-in-groups").removeClass("hide").addClass("show");
                $(".group-delete-button").css("display", "block");
            }
        });
    }
    else if (groupgrid.getSelectedRecords().length > 1) {
        $('#add-user-in-groups').removeClass("hide").addClass("show");
        $(".group-delete-button").css("display", "none");
        jQuery.each(selectedGroups, function (index, record) {
            if (record.GroupId != $(".group-delete-button").attr("data-groupid")) {
                $(".group-delete-button").css("display", "block");
                return false;
            }
        });
    }
    else {
        $('#add-user-in-groups').removeClass("show").addClass("hide");
    }
}

function fnGroupRecordClick(args) {
    var checkbox = args.row.find('.groupList-grid-chkbx');
    checkbox.prop("checked", !checkbox.prop("checked"));
}

function fnOnGroupGridActionBegin(args) {
    isFirstRequest = true;
    var searchValue = $("#search-groups").val();
    refreshGroupFooterPosition();
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

function fnOnGroupGridActionComplete(args) {
    $('[data-toggle="tooltip"]').tooltip();
    if (args.model.currentViewData.length == 0) {
        rowBound(38);
    }
    var groupgrid = $('#Grid').data("ejGrid");
    if (groupgrid.getSelectedRecords().length != 0) {
        $("#add-user-in-groups").removeClass("hide").addClass("show");
    }
    else {
        $("#add-user-in-groups").removeClass("show").addClass("hide");
    }
}
function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = false;
        if (location.pathname.toLowerCase() === "/" || location.pathname.split("/")[location.pathname.split("/").length - 1].toLowerCase() == "dashboards") {
            refreshScroller();
        }
    }
}

$(document).on("click", ".search-group", function () {
    var gridObj = $("#Grid").data("ejGrid");
    gridObj.model.pageSettings.currentPage = 1;
    gridObj.refreshContent();
});

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        parent.$("#new-group-area").ejDialog("close");
    }
});

function refreshGroupFooterPosition(height) {
    var docHeight = $(window).height();
    var footerHeight = $("#base_footer_Div").height();
    $("#base_footer_Div").css("margin-top", "0");
    var footerTop = 322 + footerHeight;
    if (footerTop < docHeight) {
        $("#base_footer_Div").css("margin-top", (docHeight - footerTop - 40) + "px");
    }
}

$(document).on("click", ".ums-group-synchronization", function () {
    $("body").ejWaitingPopup();
    $("body").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: getAllGroupsUrl,
        data: { reqList: "groups" },
        success: function (result) {
            if (result.isSuccess) {
                SuccessAlert("[[[Group Synchronization]]]", "[[[Groups has been synchronized successfully.]]]", 7000);
                var gridObj = $("#Grid").data("ejGrid");
                gridObj.refreshContent();
                $("#group-count").val(result.count);
                $("#group-count").html(result.count);
            }
            else {
                WarningAlert("[[[Group Synchronization]]]", "[[[Error while synchronizing groups.]]]", 7000);
            }
            $("body").ejWaitingPopup("hide");
        }
    });
});