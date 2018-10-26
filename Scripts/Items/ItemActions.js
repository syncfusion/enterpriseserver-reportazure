$(document).ready(function () {
    $.validator.addMethod("isValidName", function (value, element) {      
            return IsValidName("name", value);     
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $("#item_action_form").validate({
        errorElement: 'span',
        onkeyup: function (element, event) { if (event.keyCode != 9) $(element).valid(); else true; },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "itemName": {
                isRequired: true,
                isValidName: true              
            }
        },
        messages: {
            "itemName": {
                isRequired: "[[[Please enter report name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest('div').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('div').removeClass('has-error');
            $(element).closest('div').find("span.validation-error").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest('div').find("span.validation-error").html(error.html());
        }
    });



    $("#move_report_form").validate({
        errorElement: 'span',
        onkeyup: function (element, event) { if (event.keyCode != 9) $(element).valid(); else true; },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "itemName": {
                isRequired: true,
                isValidName: true               
            }
        },
        messages: {
            "itemName": {
                isRequired: "[[[Please enter report name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest('div').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('div').removeClass('has-error');
            $(element).closest('div').find("span.validation-error").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest('div').find("span.validation-error").html(error.html());
        }
    });


    $(document).on("click", "#MoveButton", function () {
        var categoryScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
        var toCategory = $("#CategoryList").val();
        var itemId = $("#ItemIdHidden").val();
        var itemName = $("#item_name").val().trim();
        if (toCategory != null && $("#move_report_form").valid()) {
            parent.$("#ItemAction_wrapper").ejWaitingPopup("show");
            doAjaxPost("POST", moveItemUrl,
                {
                    itemid: itemId,
                    tocategoryId: toCategory,
                    itemname: itemName
                },
                function (data, result) {
                    parent.$("#ItemAction_wrapper").ejWaitingPopup("hide");
                    if (data.status) {
                        window.parent.$("#ItemAction").ejDialog("close");
                        parent.messageBox("su-move", "[[[Move Report]]]", "[[[Report has been moved successfully.]]]", "success", function () {
                            categoryScope.refreshCategorySection(toCategory);
                            parent.onCloseMessageBox();
                        });
                    } else {
                        if (data.isNameExist) {
                            $(".validation-error").closest("div").addClass("has-error");
                            $(".validation-error").html("[[[Report name already exists]]]");
                        }
                        else if (data.isException)
                            $(".ErrorMessage").html("[[[There is an moving the report. Please try again later.]]]");
                    }
                }
            );
        }
    });
    $(document).on("click", "#CopyButton", function () {
        var categoryScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
        var toCategory = $("#CategoryList").val();
        var itemId = $("#ItemIdHidden").val();
        var userId = $("#userIdHidden").val();
        var itemName = $("#item_name").val().trim();
        if (toCategory != null && $("#item_action_form").valid()) {
            parent.$("#ItemAction_wrapper").ejWaitingPopup("show");
            doAjaxPost("POST", copyItemUrl,
                {
                    itemid: itemId,
                    tocategoryId: toCategory,
                    itemname: itemName,
                    userid: userId
                },
                function (data, result) {
                    parent.$("#ItemAction_wrapper").ejWaitingPopup("hide");
                    if (data.status) {
                        window.parent.$("#ItemAction").ejDialog("close");
                        parent.messageBox("su-copy", "[[[Copy Report]]]", "[[[Report has been copied successfully.]]]", "success", function () {
                            categoryScope.refreshCategorySection(toCategory);
                            parent.onCloseMessageBox();
                        });
                    } else {
                        if (data.isNameExist) {
                            $(".validation-error").closest("div").addClass("has-error");
                            $(".validation-error").html("[[[Report name already exists]]]");
                        }
                        else if (data.isException)
                            $(".ErrorMessage").html("[[[There is an error in copying the report. Please try again later.]]]");
                    }
                }
            );
        }
    });
    $(document).on("click", "#CloneButton", function () {
        var categoryScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
        var toCategory = $("#CategoryList").val();
        var itemId = $("#ItemIdHidden").val();
        var userId = $("#userIdHidden").val();
        var itemName = $("#item_name").val().trim();
        if (toCategory != null && $("#item_action_form").valid()) {
            parent.$("#ItemAction_wrapper").ejWaitingPopup("show");
            doAjaxPost("POST", cloneItemUrl,
                {
                    itemid: itemId,
                    tocategoryId: toCategory,
                    itemname: itemName,
                    userid: userId
                },
                function (data, result) {
                    parent.$("#ItemAction_wrapper").ejWaitingPopup("hide");
                    if (data.status) {
                        window.parent.$("#ItemAction").ejDialog("close");
                        parent.messageBox("su-clone", "[[[Clone Report]]]", "[[[Report has been cloned successfully.]]]", "success", function () {
                            categoryScope.refreshCategorySection(toCategory);
                            parent.onCloseMessageBox();
                        });
                    } else {
                        if (data.isNameExist) {
                            $(".validation-error").closest("div").addClass("has-error");
                            $(".validation-error").html("[[[Report name already exists]]]");
                        }
                        else if (data.isException)
                            $(".ErrorMessage").html("[[[There is an error in cloning the report. Please try again later.]]]");
                    }
                }
            );
        }
    });
});


$(document).on("click", "#CancelButton", function () {
    window.parent.$("#ItemAction").ejDialog("close");
});
$(document).on("click", ".PopupClose", function () {
    var categoryScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
    if ($("#CancelButton").val() == "Close") {
        parent.$("#ItemAction iframe").attr("src", "");
        categoryScope.refreshCategorySection($("#CancelButton").attr("data-target-id"));
    }
    window.parent.$("#ItemAction").ejDialog("close");
});

function ResetGrid(gridObj) {
    gridObj.refreshContent();
    gridObj.model.sortSettings.sortedColumns = [];
    gridObj.model.filterSettings.filteredColumns = [];
    parent.$("#searchItems").find("input[type=text]").val('');
}

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        window.parent.$("#ItemAction").ejDialog("close");
    }
});