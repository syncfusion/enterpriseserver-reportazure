var isKeyUp = false;

$(document).ready(function () {
    var isFirstRequest = false;
    addPlacehoder("#user-add-dialog");
    addPlacehoder("#search-area");
    $("#user-add-dialog").ejDialog({
        width: "500px",
        height: "auto",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        title: "Add User",
        showHeader: false,
        enableModal: true,
        close: "onUserAddDialogClose",
        closeOnEscape: true,
        open: "onUserAddDialogOpen"
    });

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $.validator.addMethod("isValidUserName", function (value, element) {
        return IsValidName("username", value)
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("hasWhiteSpace", function (value, element) {
        return HasWhiteSpace(value)
    }, "[[[Username should not contain white space]]]");

    $.validator.addMethod("isValidEmail", function (value, element) {
        if (value.trim() == "") {
            return true;
        } else {
            return IsEmail(value);
        }
    }, "[[[Invalid email address]]]");

    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value)
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("additionalSpecialCharValidation", function (value, element) {
        if (/^[a-zA-Z_0-9`~!\$\^()=\-\.\{\} ]+$/.test(value) || value === "") {
            return true;
        }
    }, "[[[Please avoid special characters]]]");

    $("#dialog-container").validate({
        errorElement: 'span',
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                $(element).valid();
                isKeyUp = false;
            }
            else
                true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "username": {
                isRequired: true,
                hasWhiteSpace: true,
                isValidUserName: true
            },
            "email-address": {
                isValidName: true,
                isValidEmail: true
            },
            "first-name": {
                isRequired: true,
                isValidName: true,
                additionalSpecialCharValidation: true
            },
            "last-name": {
                isValidName: true,
                additionalSpecialCharValidation: true
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
            $(element).closest('div').find("span").html(error.html()).css("display", "block");
        },
        messages: {
            "username": {
                isRequired: "[[[Please enter username]]]"
            },
            "first-name": {
                isRequired: "[[[Please enter first name]]]"
            }
        }
    });

    $(document).ready(function () {
        if (document.getElementById("existing-user-count") != null) {
            if ($("#existing-user-count").attr("data-value").toLowerCase() == "true" && $("#csv-file-error").attr("data-value").toLowerCase() != "error") {
                parent.messageBox("su-user-1", "[[[Import users from CSV]]]", "[[[There is no data in the uploaded file. Please check and try uploading again.]]]", "success", function () {
                    parent.onCloseMessageBox();
                });
                $("#import-button").attr("disabled", "disabled");
            }
        }
    });

    $("#dialog-container").keyup(function (e) {
        if (e.keyCode == 13) {
            if ($("#cancel-user").is(":focus")) {
                onUserAddDialogClose();
            } else if ($("#add-user").is(":focus")) { e.preventDefault(); }
            else {
                $("input#add-user").trigger("click");
            }
        }
    });

    $(document).on("click", "#create-user", function () {
        $("#add-user").removeAttr("disabled");
        $(".form input[type='text']").val('');
        var usergrid = $('#user_grid').data("ejGrid");
        usergrid.clearSelection();
        $("#add-user-in-group").removeClass("show").addClass("hide");
        $(".validation").closest("div").removeClass("has-error");
        $(".useradd-validation-messages").css("display", "none");
    });

    $("input#add-user").on('click', function () {
        var userName = $("#username").val().trim();
        var firstName = $("#firstname").val().trim();
        var emailid = $('#mailid').val().trim();
        var isValid = $("#dialog-container").valid();
        if (isValid) {
            $(".useradd-validation-messages").css("display", "none");
            var g = $('#user_grid').data("ejGrid");

            showWaitingPopup("user-add-dialog_wrapper");

            var lastName = $('#lastname').val().trim();
            var values = "&username=" + userName + "&emailid=" + emailid + "&firstname=" + firstName + "&lastname=" + lastName;

            $.ajax({
                type: "POST", url: postactionUrl, data: values,
                success: function (data, result) {
                    if ($.type(data) === "object") {
                        if (data.Data.error_message !== null && data.Data.error_message !== undefined && data.Data.error_message.toLowerCase() === "username exists") {
                            $('#username').closest('div').addClass("has-error");
                            $("#invalid-username").html("[[[Username already exists]]]").css("display", "block");
                            $(".useradd-validation-messages").css("display", "block");
                            hideWaitingPopup("user-add-dialog_wrapper");
                            return;
                        }
                        if (data.Data.error_message !== null && data.Data.error_message !== undefined && data.Data.error_message.toLowerCase() === "email exists") {
                            $('#mailid').closest('div').addClass("has-error");
                            $("#invalid-email").html("[[[Email address already exists]]]").css("display", "block");
                            $(".useradd-validation-messages").css("display", "block");
                            hideWaitingPopup("user-add-dialog_wrapper");
                            return;
                        }
                        if (data.Data.result === "success") {
                            hideWaitingPopup("user-add-dialog_wrapper");
                            $("#add-user").attr("disabled", "disabled");
                            $("#create-user").removeClass("hide").addClass("show");
                            $(".form input[type='text']").val('');
                            var count = parent.$("#user-count-text").val();
                            var currentVal = parseInt(count) + 1;
                            parent.$("#user-count").html(currentVal);
                            parent.$("#user-count-text").val(currentVal);
                            onUserAddDialogClose();
                            messageBox("su-user-add", "[[[Add User]]]", data.Data.message, "success", function () {
                                g.refreshContent();
                                onCloseMessageBox();
                            });
                        }
                        else if (data.IsUserLimitExceed) {
                            hideWaitingPopup("user-add-dialog_wrapper");
                            $("#limit-user").ejDialog("open");
                            $("#zero-user-acc").show();
                        }
                        else {
                            hideWaitingPopup("user-add-dialog_wrapper");
                            onUserAddDialogClose();
                            messageBox("su-user-add", "[[[Add User]]]", "Internal Server Error. please try again.", "error", function () {
                                g.refreshContent();
                                onCloseMessageBox();
                            });
                        }
                    }
                }
            });
        }
        else {
            $(".useradd-validation-messages").css("display", "block");
        }
    });

    $(document).on("click", "#addnew-group", function () {
        $(".group-validation").closest("div").removeClass("has-error");
        $("#existing-group").hide();
        $("#addnew-group").hide();
        $("#add-existing-group").show();
        $("#new-group").show();
    });

    $(document).on("click", "#add-existing-group", function () {
        $(".group-validation").css("display", "none");
        $("#existing-group").show();
        $("#add-existing-group").hide();
        $("#addnew-group").show();
        $("#new-group").hide();
    });

    $(document).on("click", "#cancel-addgroup-button,#group-close-button", function () {
        parent.$(".modal[data-dialog='add-users-in-group'], .modal-backdrop, #user-add-dialog-wrapper").remove();
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            parent.$(".modal[data-dialog='add-users-in-group'], .modal-backdrop, #user-add-dialog-wrapper").remove();
        }
        if (e.keyCode == 13 && ($("#new-group").css("display") == "none")) {
            return false;
        } else if (e.keyCode == 13 && $("#existing-group").css("display") == "none") {
            AddUserGroup();
            return false;
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 13 && ($("#new-group").css("display") == "none")) {
            return false;
        } else if (e.keyCode == 13 && $("#existing-group").css("display") == "none") {
            AddUserGroup();
            return false;
        }
    });

    $(document).on("click", "#add-user-group-button", function () {
        AddUserGroup();
    });

    function AddUserGroup() {
        $("#group-name-validation").closest("div").addClass("has-error");
        var g = $('#user_grid').data("ejGrid");
        showWaitingPopup("movable-dialog");
        if ($("#new-group").css("display") == "none") {
            var GroupNameDropdown = $("#groupname-dropdown").val();

            var GroupUsers = document.getElementsByName("hiddenUserName[]");
            var GrList = '';
            for (var t = 0; t < GroupUsers.length; t++) {
                if (GrList == '')
                    GrList = GroupUsers[t].value;
                else
                    GrList = GrList + "," + GroupUsers[t].value;
            }
            var values = "GroupId=" + GroupNameDropdown + "&GroupUsers=" + GrList;
            var msg = '';

            if (GroupNameDropdown == '') {
                msg += "Test";
                $("#groupname-dropdown").css("border", "1px solid #ff0000");
            } else
                $("#groupName-dropdown").css("border", "");
            doAjaxPost("POST", updateUserIntoGroupUrl, values, function (data) {
                hideWaitingPopup("movable-dialog");
                if ($.type(data) == "string") {
                    CloseGroup();
                    $("#success-message").append(data);
                    g.refreshContent();
                } else {
                }
            });
        } else if ($("#existing-group").css("display") == "none") {
            var g = $('#user_grid').data("ejGrid");
            var isValid = $(".new-group-form").valid();
            if (isValid) {
                doAjaxPost("POST", checkGroupnameUrl, { GroupName: $("#group-name").val() }, function (data) {
                    if (data.toLowerCase() != "true") {
                        var GroupName = $("#group-name").val();
                        var GroupColor = "";
                        var GroupDescription = $("#group-description").val();
                        var GroupUsers = document.getElementsByName("hiddenUserName[]");
                        var GrList = '';
                        for (var t = 0; t < GroupUsers.length; t++) {
                            if (GrList == '')
                                GrList = GroupUsers[t].value;
                            else
                                GrList = GrList + "," + GroupUsers[t].value;
                        }
                        var values = "GroupName=" + GroupName + "&GroupColor=" + GroupColor + "&GroupDescription=" + GroupDescription + "&GroupUsers=" + GrList;
                        doAjaxPost("POST", saveUserIntoGroupUrl, values, function (data) {
                            if ($.type(data) == "object") {
                                hideWaitingPopup("movable-dialog");
                                if (data.Data.status) {
                                    CloseGroup();
                                    $("#existing-group").show();
                                    $("#new-group").hide();
                                    g.refreshContent();
                                } else {
                                }
                            }
                        });
                    } else {
                        hideWaitingPopup("movable-dialog");
                        $("#group-name-validation").html("[[[Group already exists with this name]]]").css("display", "block");
                        $("#group-name-validation").closest("div").addClass("has-error");
                    }
                });
            }
            else {
                hideWaitingPopup("movable-dialog");
            }
        }
    }
});

function EmptyFile() {
    $("#grid-nodata-validation").css("display", "block");
}

function editUser(fulldata) {
    var specficuserdetails = fulldata;
    $("#user_name").val(specficuserdetails.UserName);
    $("#user_email").val(specficuserdetails.Email);
    var dtObj = new Date(parseInt((specficuserdetails.ModifiedDate).substring(6, ((specficuserdetails.ModifiedDate).length) - 2)));
    var formattedString = DateCustomFormat(window.dateFormat + " hh:mm:ss", dtObj);
    formattedString += (dtObj.getHours() >= 12) ? " PM" : " AM";
    $("#LastModified").html(formattedString);
    $("#user-profile-picture").attr('src', avatarUrl + "?Username=" + specficuserdetails.UserName + "&ImageSize=150");
    $("#upload-picture").attr("data-filename", specficuserdetails.Avatar.replace("Content//images//ProfilePictures//" + specficuserdetails.UserName + "//", ""));

    if (fulldata.FirstName != null && fulldata.FirstName != "") {
        $("#user_firstname").val(fulldata.FirstName);
    }
    else {
        $("#user_firstname").val(specficuserdetails.FullName);
    }
    if (fulldata.LastName != null && fulldata.LastName != "") {
        $("#user_lastname").val(fulldata.LastName);
    }
    if (fulldata.ContactNumber != null && fulldata.ContactNumber != "") {
        $("#contact_no").val(fulldata.ContactNumber);
    }
}

function fnOnUserGridLoad(args) {
    args.model.dataSource.adaptor = new ej.UrlAdaptor();
    args.model.enableTouch = false;
}

function fnUserRowSelected(args) {
    var usergrid = $('#user_grid').data("ejGrid");
    var selectedUsers = usergrid.getSelectedRecords();
    var loggeduser = $(".user-delete-button").attr("data-log-user").toLowerCase();
    if (usergrid.getSelectedRecords().length == 1) {
        jQuery.each(selectedUsers, function (index, record) {
            if (record.UserName.toLowerCase() == loggeduser) {
                $("#add-user-in-group").removeClass("hide").addClass("show");
                $(".user-delete-button").css("display", "none");
            }
            else {
                $("#add-user-in-group").removeClass("hide").addClass("show");
                $(".user-delete-button").css("display", "block");
            }
        });
    }
    else if (usergrid.getSelectedRecords().length > 1) {
        $('#add-user-in-group').removeClass("hide").addClass("show");
        $(".user-delete-button").css("display", "block");
        jQuery.each(selectedUsers, function (index, record) {
            if (record.UserName.toLowerCase() == loggeduser) {
                $(".user-delete-button").css("display", "block");
                return false;
            }
        });
    }
    else {
        $('#add-user-in-group').removeClass("show").addClass("hide");
    }
}

function fnUserRecordClick(args) {
    var checkbox = args.row.find('.userList-grid-chkbx');
    checkbox.prop("checked", !checkbox.prop("checked"));
}

function fnOnUserGridActionBegin(args) {
    isFirstRequest = true;
    var searchValue = $("#search-users").val();
    this.model.query._params.push({ key: "searchKey", value: searchValue });
    var filerSettings = [], i;

    if (args.model.filterSettings.filteredColumns.length > 0) {
        for (i = 0; i < args.model.filterSettings.filteredColumns.length; i++) {
            var column = args.model.filterSettings.filteredColumns[i];
            filerSettings.push({ 'PropertyName': column.field, 'FilterType': column.operator, 'FilterKey': column.value });
        }

        this.model.query._params.push({ key: "filterCollection", value: filerSettings });
    }
}

function fnOnUserGridActionComplete(args) {
    $('[data-toggle="tooltip"]').tooltip();
    if (args.model.currentViewData.length == 0) {
        rowBound();
    }
    var usergrid = $('#user_grid').data("ejGrid");
    if (usergrid.getSelectedRecords().length != 0) {
        $("#add-user-in-group").removeClass("hide").addClass("show");
    }
    else {
        $("#add-user-in-group").removeClass("show").addClass("hide");
    }
}

function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = false;
    }
}
$(document).on("click", ".user-add-group", function () {

    $("body").ejWaitingPopup();
    $("body").ejWaitingPopup("show");

    setTimeout(function () {
        var container;
        $.ajax({
            type: "POST",
            url: getAddUserInGroupDialogUrl,
            data: {},
            async: false,
            success: function (result) {
                container = result;
            }
        });

        $("#content-area").append(container);
        var usergrid = $("#user_grid").data("ejGrid");
        addPlacehoder("#new-group");

        $.validator.addMethod("isValidName", function (value, element) {
            return IsValidName("name", value)
        }, "[[[Please avoid special characters]]]");

        $(".new-group-form").validate({
            errorElement: 'span',
            onkeyup: function (element) { $(element).valid(); },
            onfocusout: function (element) { $(element).valid(); },
            rules: {
                "group-name": {
                    isRequired: true,
                    isValidName: true
                }
            },
            highlight: function (element) {
                $(element).closest('div').addClass("has-error");
                $(".group-validation").css("display", "block");
            },
            unhighlight: function (element) {
                if ($(element).attr('name') == 'group-name') {
                    $(element).closest('div').removeClass('has-error');
                    $(element).closest('div').find("span").html("");
                }
            },
            errorPlacement: function (error, element) {
                $(element).closest('div').find("span").html(error.html());
            },
            messages: {
                "group-name": {
                    isRequired: "[[[Please enter group name]]]"
                }
            }
        });
        var selectedUsers = usergrid.getSelectedRecords();
        var UserList = "";
        var GroupList = "";
        var groupList;
        $("#usersCount").html(selectedUsers.length);
        $("#add-existing-group").css("display", "none");
        jQuery.each(selectedUsers, function (index, record) {
            UserList += "<div class='RoleItems'><input type='hidden' name='hiddenUserName[]' value='" + record.UserId + "'>" + record.FirstName + " " + record.LastName + "</div>";
        });
        $("#modal-footer").append(UserList);
        $("#confirm-modal, .modal").css("display", "block");
        $(".modal-backdrop").fadeIn(function () {
            $(".modal-dialog").fadeIn();
            $(".modal.fade.in").css("display", "block");
        });
        $.ajax({
            type: "POST",
            url: getAllActiveGroupListUrl,
            data: {},
            async: false,
            success: function (result) {
                groupList = result;
            }
        });
        for (var g = 0; g < groupList.length; g++) {
            GroupList += "<option value='" + groupList[g].GroupId + "'>" + groupList[g].GroupName + "</option>";
        }
        $("#groupname-dropdown").append(GroupList);
        $("#groupname-dropdown").selectpicker("refresh");
        for (var i = 0; i < $("#existing-group .btn-group .dropdown-menu .selectpicker li").length; i++) {
            var hoveredtext = $("#existing-group .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
            $("#existing-group .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
        }
        //$("#groupname-dropdown").focus();
        $("body").ejWaitingPopup("hide");
    }, 1500);
});

function onConfirmDeleteUser(count) {
    var usergrid = $('#user_grid').data("ejGrid");
    var currentPage = usergrid.model.pageSettings.currentPage;
    var pageSize = usergrid.model.pageSettings.pageSize;
    var totalRecordsCount = usergrid.model.pageSettings.totalRecordsCount;
    var lastPageRecordCount = usergrid.model.pageSettings.totalRecordsCount % usergrid.model.pageSettings.pageSize;
    if (lastPageRecordCount != 0 && lastPageRecordCount <= count) {
        usergrid.model.pageSettings.currentPage = currentPage - 1;
    }
    usergrid.refreshContent();
}

function returntoUserPage() {
    window.location.href = userPageUrl;
}

function CloseGroup() {
    parent.$("#popup-container,.modal-backdrop").text("");
    parent.$(".modal,.modal-backdrop").css("display", "none");
}

function onUserAddDialogClose() {
    $("#user-add-dialog").ejDialog("close");
}

function onUserAddDialogOpen() {
    $(".dropdown").removeClass("open");
    $("#user-add-dialog").ejDialog("open");
    $(".e-dialog-icon").attr("title", "Close");
}

function checkUserImported(t) {
    var ejGrid = $("#user_import_grid").data("ejGrid");
    var gridRows = ejGrid.getRows();
    if (gridRows.length > 0) {
        $("#messageBox_wrapper, .e-dialog-scroller, #messageBox").removeClass("failed-msg-box-height").addClass("msg-box-height"); //Message box height adjustment 
        $(".message-content").removeClass("text-center");
        messageBox("su-user-1", "[[[Import users from CSV]]]", "[[[User import incomplete. Do you want to continue?]]]", "error", function () {
            parent.onCloseMessageBox();
            window.location.href = $(t).attr("href");
        }, function () {
            parent.onCloseMessageBox();
            return false;
        });
        return false;
    } else {
        return true;
    }
}
function SaveUserListFromCSV() {
    $(".user-import-validation").hide();
    $("#grid-validation").css("display", "none");
    showWaitingPopup("content-area");
    var allUserList = $("#all-user-list").val();
    var userNames = "";
    var emailIds = "";
    for (var i = 0; i < $("td.user-name").length; i++) {
        if (userNames == "") {
            userNames = $("td.user-name")[i].textContent;
            emailIds = $("td.email-id")[i].textContent.toLowerCase();
        }
        else {
            userNames = userNames + "," + $("td.user-name")[i].textContent;
            emailIds = emailIds + "," + $("td.email-id")[i].textContent.toLowerCase();
        }
    }
    $.ajax({
        type: "POST",
        url: saveSelectedCSVUserUrl,
        data: "&userNames=" + userNames + "&emailIds=" + emailIds + "&AllUSerList=" + allUserList,
        success: function (result) {
            if (result.Status.toString().toLowerCase() == 'true') {
                if ($.type(result) == "object" && result.Data.length != 0) {
                    var gridObj = $("#user_import_grid").data("ejGrid");
                    gridObj.showColumns("Error");
                    var nameObj = $("td.user-name");
                    for (var i = 0; i < result.Data.length; i++) {
                        if (!result.Data[i].IsExist && result.Data[i].DisplayMessage != "") {
                            var obj = $(nameObj[i]).siblings(":last");
                            obj.html(result.Data[i].DisplayMessage);
                        }
                    }
                    $('[data-toggle="tooltip"]').tooltip();
                    hideWaitingPopup("content-area");
                    $("#messageBox_wrapper, .e-dialog-scroller, #messageBox").removeClass("failed-msg-box-height").addClass("msg-box-height");//Message box height adjustment
                    $(".message-content").addClass("text-center");
                    messageBox("su-user-1", "[[[Import users from CSV]]]", "[[[Duplicate or Invalid data is found. Please change the data accordingly and re-upload the file.]]]", "success", function () {
                        parent.onCloseMessageBox();
                    });
                    $("#import-button").attr("disabled", "disabled");
                } else {
                    $(".import-file #user-import-validation-msg").css("display", "none");
                    $("#user_import_grid").ejGrid("option", { dataSource: [] });
                    $("#messageBox_wrapper, .e-dialog-scroller, #messageBox").removeClass("failed-msg-box-height").addClass("msg-box-height");//Message box height adjustment
                    $(".message-content").addClass("text-center");
                    messageBox("su-user-1", "[[[Import users from CSV]]]", result.Count + result.Message, "success", function () {
                        parent.onCloseMessageBox();
                        window.location.href = userPageUrl;
                    });
                    $("#import-button").attr("disabled", "disabled");
                    hideWaitingPopup("content-area");
                }
            } else {
                $("#messageBox_wrapper, .e-dialog-scroller, #messageBox").removeClass("msg-box-height").addClass("failed-msg-box-height");//Message box height adjustment               
                $(".message-content").addClass("text-center");
                messageBox("su-user-1", "[[[Import users from CSV]]]", result.Message, "success", function () {
                    parent.onCloseMessageBox();
                });
                hideWaitingPopup("content-area");
            }
        }
    });
}

$(document).on("click", ".option-icon", function () {
    var loggeduser = $(".user-delete-button").attr("data-log-user");

    if ($(this).attr("data-content") == loggeduser) {
        $(".delete-class").parent().css("display", "none");
    }
    else {
        $(".delete-class").parent().css("display", "block");
    }
});

function HasWhiteSpace(value) {
    if (/\s/g.test(value)) {
        return false;
    }
    else {
        return true;
    }
}

$(document).on("click", "#trigger-file,#filename", function () {
    $("#filename").trigger("focus");
    $("#grid-validation-messages span").css("display", "none");
    $("#csvfile").trigger("click");
});

$(document).on("change", "#csvfile", function (e) {
    var value = $(this).val();
    if ($(this).val().substring($(this).val().lastIndexOf('.') + 1) != "csv") {
        $("#csv-upload").attr("disabled", true);
        $("#filename").val("Please upload a valid csv file.").css("color", "#c94442");
        $("#filename,#trigger-file").addClass("error-file-upload");
    } else {
        $("#csv-upload").attr("disabled", false);
        $("#filename,#trigger-file").removeClass("error-file-upload");
        $("#filename").val(value).css("color", "#333");
        $('#csvfile').attr('title', value);
    }
});

$(document).on("click", ".search-user", function () {
    var gridObj = $("#user_grid").data("ejGrid");
    gridObj.model.pageSettings.currentPage = 1;
    gridObj.refreshContent();
});

$(document).on("click", ".ums-user-synchronization", function () {
    $("body").ejWaitingPopup();
    $("body").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: getAllUsersUrl,
        data: { reqList: "users" },
        success: function (result) {
            if (result.isSuccess) {
                SuccessAlert("[[[User Synchronization]]]", "[[[Users has been synchronized successfully.]]]", 7000);
                var gridObj = $("#user_grid").data("ejGrid");
                gridObj.refreshContent();
                $("#user-count").val(result.count);
                $("#user-count").html(result.count);
            }
            else {
                WarningAlert("[[[User Synchronization]]]", "[[[Error while synchronizing users.]]]", 7000);
            }
            $("body").ejWaitingPopup("hide");
        }
    });
});


