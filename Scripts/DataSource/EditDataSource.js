$(function () {
    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");


    $.validator.addMethod("requiredConnectionString", function (value, element) {
        var connectUsing = $(element).closest('table').find('input:radio[name=connect_using]:checked').val();
        if (connectUsing != "None" && $.trim(value) == '' && $(element).closest('table').find("#datasource-type").val() != "XML")
            return false;
        else
            return true;

    }, "[[[Connection string should not be empty]]]");

    $("#new_datasource_tab_content").validate({
        errorElement: 'span',
        onkeyup: function (element, event) {
            if ($(element).attr('id') == "connection_stored_password") {
                passwordField = true;
            } else if ($(element).attr('id') == "connection_stored_username") {
                if (($("#connection_stored_password").val() == "")) {
                    $("#connection_stored_password").parent().addClass("has-error");
                    $(element).closest('div').find("span#datasource_credential_validation_error2").html("[[[Credentials are required]]]");
                }
                userField = true;
            }
            if (event.keyCode != 9) {
                var validation = $(element).valid();
                if (validation) {
                    if (($("#connection_stored_username").val() != "") && ($("#connection_stored_password").val() != "") && ($("#new_datasource_connectionstring").val() != "")) {
                        if ($("#datasource-type").val() != "XML") {
                            $("#test_connection").removeAttr("disabled");
                        }
                    }

                } else {
                    if ($("#datasource-type").val() != "XML") {
                        $("#test_connection").attr("disabled", "disabled");
                    }
                }
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#datasource_name_validation_error").parent('span').removeClass('has-error');
                $("#datasource_name_validation_error").html("");
            } else true;
        },
        onfocusout: function (element) {
            var validation = $(element).valid();
            if (validation) {
                if (($("#connection_stored_username").val() != "") && ($("#connection_stored_password").val() != "") && ($("#new_datasource_connectionstring").val() != "")) {
                    if ($("#datasource-type").val() != "XML") {
                        $("#test_connection").removeAttr("disabled");
                    }
                }

            } else {
                if ($("#datasource-type").val() != "XML") {
                    $("#test_connection").attr("disabled", "disabled");
                }
            }
        },
        rules: {
            "new_datasource_name": {
                isRequired: true,
                isValidName: true
            },
            "new_datasource_connectionstring": {
                isRequired: true,
                requiredConnectionString: true
            },
            "connection_stored_username": {
                isRequired: true

            },
            "connection_stored_password": {
                isRequired: true
            }
        },
        messages: {
            "new_datasource_name": {
                isRequired: "[[[Please enter data source name]]]"
            },
            "new_datasource_connectionstring": {
                isRequired: "[[[Connection string should not be empty]]]"
            },
            "connection_stored_username": {
                isRequired: "[[[Credentials are required]]]"

            },
            "connection_stored_password": {
                isRequired: "[[[Credentials are required]]]"
            }

        },
        highlight: function (element) {
            $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('td').removeClass('has-error');
            $(element).closest('td').find("div.datasource-validation-messages").html("");
            if ($(element).attr('id') == "connection_stored_username") {
                $(element).closest('div').find("span#datasource_credential_validation_error1").html("");
                if ($("#connection_stored_password").val() == "" && passwordField) {
                    $("#connection_stored_password").parent().addClass("has-error");
                    $(element).closest('div').find("span#datasource_credential_validation_error2").html("[[[Credentials are required]]]");
                }

            }
            else if ($(element).attr('id') == "connection_stored_password") {
                $(element).closest('div').find("span#datasource_credential_validation_error2").html("");
                if ($("#connection_stored_username").val() == "" && userField) {
                    $("#connection_stored_username").parent().addClass("has-error");
                    $(element).closest('div').find("span#datasource_credential_validation_error1").html("[[[Credentials are required]]]");
                }
            }
        },
        errorPlacement: function (error, element) {
            if ($(element).attr('id') == "connection_stored_username") {
                $(element).closest('div').find("span#datasource_credential_validation_error2").html("");
                $(element).closest('div').find("span#datasource_credential_validation_error1").html(error.html());
            }
            else if ($(element).attr('id') == "connection_stored_password") {
                $(element).closest('div').find("span#datasource_credential_validation_error1").html("");
                $(element).closest('div').find("span#datasource_credential_validation_error2").html(error.html());
            }
            else
                $(element).closest('td').find("div").html(error.html());
        }
    });

});
function createEditDataSourcePopup(itemDetail, dataSourceDefinition) {
    window.editData = {
        ItemId: itemDetail.Id,
        Name: itemDetail.Name,
        Description: itemDetail.Description,
        CategoryId: itemDetail.CategoryId,
        DataSourceDefinition: dataSourceDefinition
    }
    window.editData.IsNameChanged = false;
    window.editData.IsDescriptionChanged = false;
    window.editData.IsDataSourceDefinitionChanged = false;
    window.isEdited = false;
    $("#publish_datasource").attr("disabled", true);
    $("#new_datasource_name").val(window.editData.Name);
    $("#new_datasource_description").val(window.editData.Description);
    $("#new_datasource_connectionstring").val(window.editData.DataSourceDefinition.ConnectString);
    $('#datasource-type').val(window.editData.DataSourceDefinition.Extension);
    $("#datasource-type").selectpicker("refresh");
    var connectUsing;
    switch (window.editData.DataSourceDefinition.CredentialRetrieval) {
        case 0:
            connectUsing = "Prompt";
            $("#prompt_text").val(window.editData.DataSourceDefinition.Prompt);
            window.editData.DataSourceDefinition.WindowsCredentials ? $("#enable_windows_prompt").prop({ "checked": true }) : $("#enable_windows_prompt").prop({ "checked": false });
            $(".connection-type-server").attr("disabled", "disabled");
            $("#enable_impersonate").prop("checked", false);
            $("#enable_windows_stored").prop("checked", false);
            break;
        case 1:
            connectUsing = "Store";
            $("#connection_stored_username").val(window.editData.DataSourceDefinition.UserName);
            window.editData.DataSourceDefinition.WindowsCredentials ? $("#enable_windows_stored").prop("checked", true) : $("#enable_windows_stored").prop("checked", false);
            window.editData.DataSourceDefinition.ImpersonateUser ? $("#enable_impersonate").prop("checked", true) : $("#enable_impersonate").prop("checked", false);
            $(".connection-type-server").removeAttr("disabled");
            break;
        case 2:
            connectUsing = "Integrated";
            $(".connection-type-server").attr("disabled", "disabled");
            $("#enable_impersonate").prop("checked", false);
            $("#enable_windows_stored").prop("checked", false);
            break;
        case 3:
            connectUsing = "None";
            $(".connection-type-server").attr("disabled", "disabled");
            $("#enable_impersonate").prop("checked", false);
            $("#enable_windows_stored").prop("checked", false);
            break;
    }
    window.editData.DataSourceDefinition.ConnectUsing = connectUsing;
    $('input:radio[name=connect_using]').filter('[value="' + connectUsing + '"]').prop("checked", true);
    $(".connection-type-server").closest('td').removeClass("has-error");

    $(".showHidePassword").on("mousedown", function () {
        if ($(this).siblings("input").is(":password")) {
            $(this).siblings("input").attr('type', 'text');
        }
        else {
            $(this).siblings("input").attr('type', 'password');
        }
    });

    $(".showHidePassword").on("mouseup", function () {
        if ($(this).siblings("input").is(":password")) {
            $(this).siblings("input").attr('type', 'text');
        }
        else {
            $(this).siblings("input").attr('type', 'password');
        }
    });

    $(".showHidePassword").mouseleave(function () {
        $(this).siblings("input").attr('type', 'password');
    });

    var dataSourceType = $("#datasource-type").val();

    if (dataSourceType === "XML") {
        $(".disable_connections").css('display', 'none');
    } else {
        $(".disable_connections").removeAttr("style");
    }

    if (dataSourceType === "SQLCE" || dataSourceType === "OLEDB" || dataSourceType === "Oracle" || dataSourceType === "ODBC" || dataSourceType === "OData" || dataSourceType === "PostgreSQL") {
        $(".disable_impersonate").css('display', 'none');
    } else {
        $(".disable_impersonate").css('display', 'block');
    }
}

function dataSourceEditValidation() {
    if ((window.editData.IsNameChanged || window.editData.IsDescriptionChanged)) {
        window.isEdited = true;
    }
    else {
        window.isEdited = false;
    }
    validateDataSourceDefinitionChange();
    (window.editData.IsDataSourceDefinitionChanged) ? $("#comment").attr("readonly", false) : $("#comment").attr("readonly", true);
    (window.isEdited) ? $("#publish_datasource").removeAttr("disabled") : $("#publish_datasource").attr("disabled", true);
}

var userField = false;
var passwordField = false;


function onConnectionTypeChange(args) {
    $("#connect_prop .datasource-validation-messages").html("");
    switch (args) {
        case "connect_option_prompt":
            $(".connection-type-server").attr("disabled", "disabled");
            $(".connection-type-server").closest('td').removeClass("has-error");
            $(".connection-type-prompt").removeAttr("disabled");
            $("#enable_windows_prompt").prop("checked", false);;
            $("#enable_impersonate").prop("checked", false);
            $("#enable_windows_stored").prop("checked", false);
            if ($("#datasource-type").val() != "XML" && $("#new_datasource_connectionstring").val() === "") {
                $("#test_connection").attr("disabled", "disabled");
            } else {
                $("#test_connection").removeAttr("disabled");
            }

            $("#datasource_credential_validation_error").html("");
            break;
        case "connect_option_store":
            userField = false;
            passwordField = false;
            $(".connection-type-server").removeAttr("disabled");
            $(".connection-type-prompt").attr("disabled", "disabled");
            $("#enable_windows_prompt").prop("checked", false);
            $("#enable_impersonate").prop("checked", false);
            $("#enable_windows_stored").prop("checked", false);
            if (($("#connection_stored_username").val() != "") && ($("#connection_stored_password").val() != "") && ($("#new_datasource_connectionstring").val() != "")) {
                if ($("#datasource-type").val() != "XML") {
                    $("#test_connection").removeAttr("disabled");
                }
            } else if ($("#datasource-type").val() != "XML") {
                $("#test_connection").attr("disabled", "disabled");
            }
            break;
        case "connect_option_windows":
            $(".connection-type-server").attr("disabled", "disabled");
            $(".connection-type-server").closest('td').removeClass("has-error");
            $(".connection-type-prompt").attr("disabled", "disabled");
            $("#enable_windows_prompt").prop("checked", false);
            $("#enable_impersonate").prop("checked", false);
            $("#enable_windows_stored").prop("checked", false);
            if ($("#datasource-type").val() != "XML" && $("#new_datasource_connectionstring").val() != "") {
                $("#test_connection").removeAttr("disabled");
            }
            $("#datasource_credential_validation_error").html("");
            break;
        case "connect_option_none":
            $(".connection-type-server").attr("disabled", "disabled");
            $(".connection-type-server").closest('td').removeClass("has-error");
            $(".connection-type-prompt").attr("disabled", "disabled");
            $("#enable_windows_prompt").prop("checked", false);
            $("#enable_impersonate").prop("checked", false);
            $("#enable_windows_stored").prop("checked", false);
            if ($("#datasource-type").val() != "XML" && $("#new_datasource_connectionstring").val() != "") {
                $("#test_connection").removeAttr("disabled");
            }
            $("#datasource_credential_validation_error").html("");
            break;
    }
    if (window.editData != undefined) {
        dataSourceEditValidation();
    }
}

function updateDataSource() {
    window.parent.$("#datasource-edit-popup_wrapper").ejWaitingPopup("show");
    if (!$("#new_datasource_tab_content").valid()) {
        window.parent.$("#datasource-edit-popup_wrapper").ejWaitingPopup("hide");
        return;
    }
    else {
        var postData = getUpdatedDataSourceFields();
        $.ajax({
            type: "POST",
            url: editdatasourceUrl,
            data: postData,
            success: function (data) {
                window.parent.$("#datasource-edit-popup_wrapper").ejWaitingPopup("hide");
                if (data.result.IsNameExist) {
                    $("#datasource_name_validation_error").parent('span').addClass('has-error');
                    $("#datasource_name_validation_error").html("[[[Data Source name already exists]]]");
                }
                else {
                    if (data.result.ConnectionStringStatus) {
                        if (data.result.Status) {
                            parent.onDataSourceEditDialogClose();
                            parent.messageBox("su-datasource", "[[[Update Data Source]]]", "[[[Data Source has been updated successfully.]]]", "success", function () {
                                var gridName = window.parent.$('#item-grid-container').attr("data-grid-name");
                                if (gridName == "datasources") {
                                    parent.ResetGrid();
                                }
                                parent.onCloseMessageBox();
                            });
                        }
                        else {
                            $("#connection_test_validation_error").html("[[[Error while updating data source]]]");
                        }
                    }
                    else {
                       
                        $("#datasource_connstring_validation_error").html(data.result.Message);
                    }
                }
            }
        });
    }
    window.parent.$("#datasource-edit-popup_wrapper").ejWaitingPopup("hide");
}


function getUpdatedDataSourceFields() {
    var dataSourceName = $("#new_datasource_name").val();
    var dataSourceDescription = $("#new_datasource_description").val();
    var itemId = window.editData.ItemId;
    var categoryId = window.editData.CategoryId;
    if (window.editData.IsDataSourceDefinitionChanged) {
        var connectionString = $("#new_datasource_connectionstring").val();
        var connectUsing = $('input:radio[name=connect_using]:checked').val();
        var storedUserName = $("#connection_stored_username").val();
        var storedPassword = $("#connection_stored_password").val();
        var promptText = $("#prompt_text").val();
        var promptWindowsEnabled = $("#enable_windows_prompt").prop("checked");
        var storedWindowsEnabled = $("#enable_windows_stored").prop("checked");
        var userImpersonate = $("#enable_impersonate").prop("checked");
        var dataSourceType = $("#datasource-type").val();
        var versionComment = $("#comment").val();
        var postData = {
            IsNameChanged: window.editData.IsNameChanged,
            IsDescriptionChanged: window.editData.IsDescriptionChanged,
            IsDataSourceDefinitionChanged: window.editData.IsDataSourceDefinitionChanged,
            Name: dataSourceName,
            Description: dataSourceDescription,
            DataSourceType: dataSourceType,
            ConnectionString: connectionString,
            ConnectUsing: connectUsing,
            UserName: storedUserName,
            Password: storedPassword,
            PromptText: promptText,
            EnablePromptWindowsAuth: promptWindowsEnabled,
            EnableStoredWindowsAuth: storedWindowsEnabled,
            ImpersonateUser: userImpersonate,
            ItemId: itemId,
            CategoryId: categoryId,
            versionComment: versionComment
        }
    }
    else {
        var postData = {
            IsNameChanged: window.editData.IsNameChanged,
            IsDescriptionChanged: window.editData.IsDescriptionChanged,
            IsDataSourceDefinitionChanged: window.editData.IsDataSourceDefinitionChanged,
            Name: dataSourceName,
            Description: dataSourceDescription,
            ItemId: itemId,
            CategoryId: categoryId
        }
    }
    return postData;
}

function onTestDataSourceConnection() {
    $("#connection_test_validation_error").html("");
    window.parent.$("#datasource-edit-popup_wrapper").ejWaitingPopup("show");
    var connectionString = $("#new_datasource_connectionstring").val();
    var connectUsing = $('input:radio[name=connect_using]:checked').val();
    var storedUserName = $("#connection_stored_username").val();
    var storedPassword = $("#connection_stored_password").val();
    var promptText = $("#prompt_text").val();
    var promptWindowsEnabled = $("#enable_windows_prompt").prop("checked");
    var userImpersonate = $("#enable_impersonate").prop("checked");
    if ($("#new_datasource_tab_content").valid()) {
        var storedWindowsEnabled = $("#enable_windows_stored").prop("checked");
        var dataSourceType = $("#datasource-type").val();
        var postData = {
            DataSourceType: dataSourceType,
            ConnectionString: connectionString,
            ConnectUsing: connectUsing,
            UserName: storedUserName,
            Password: storedPassword,
            EnableStoredWindowsAuth: storedWindowsEnabled,
            PromptText: promptText,
            EnablePromptWindowsAuth: promptWindowsEnabled,
            ImpersonateUser: userImpersonate,
        }
        $.ajax({
            type: "POST",
            url: testdatasourceconnectionUrl,
            data: postData,
            success: function (data) {
                parent.$("#datasource-edit-popup_wrapper").ejWaitingPopup("hide");
                if (data.result.ConnectionStringStatus) {
                    if (data.result.Status) {
                        $("#connection_test_validation_error").html("<span style='color:green'>" + data.result.Message + "</span>");
                    }
                    else {
                        $("#connection_test_validation_error").html("<span style='color:red'>" + data.result.Message + "</span>");
                    }
                }
                else {
                    $("#datasource_connstring_validation_error").closest('td').addClass("has-error");
                    $("#datasource_connstring_validation_error").html(data.result.Message);
                }
            }
        });
    }
    else {
        $("#datasource_connstring_validation_error").closest('td').removeClass("has-error");
        window.parent.$("#datasource-edit-popup_wrapper").ejWaitingPopup("hide");
    }
}

function validateDataSourceDefinitionChange() {
    window.editData.IsDataSourceDefinitionChanged = false;
    var needPassword = false;
    if ($("#datasource-type").val() != window.editData.DataSourceDefinition.Extension) {
        window.editData.IsDataSourceDefinitionChanged = true;
        window.isEdited = true;
        if (($('input:radio[name=connect_using]:checked').val().toLowerCase() == "store")) {
            needPassword = true;
        }
    }
    if ($("#new_datasource_connectionstring").val() != window.editData.DataSourceDefinition.ConnectString) {
        window.editData.IsDataSourceDefinitionChanged = true;
        window.isEdited = true;
        if ($('input:radio[name=connect_using]:checked').val().toLowerCase() == "store") {
            needPassword = true;
        }
    }
    if (window.editData.DataSourceDefinition.ConnectUsing != $('input:radio[name=connect_using]:checked').val()) {
        window.editData.IsDataSourceDefinitionChanged = true;
        window.isEdited = true;
    }
    else if ($('input:radio[name=connect_using]:checked').val().toLowerCase() == "store") {
        if (($("#connection_stored_username").val() != window.editData.DataSourceDefinition.UserName) || ($("#enable_windows_stored").prop("checked") != window.editData.DataSourceDefinition.WindowsCredentials) || ($("#enable_impersonate").prop("checked") != window.editData.DataSourceDefinition.ImpersonateUser)) {
            window.editData.IsDataSourceDefinitionChanged = true;
            window.isEdited = true;
            needPassword = true;
        }
        if ($("#connection_stored_password").val() != "") {
            window.editData.IsDataSourceDefinitionChanged = true;
            window.isEdited = true;
            needPassword = false;
        } else {
            needPassword = true;
        }
    }
    else if ($('input:radio[name=connect_using]:checked').val().toLowerCase() == "prompt") {
        if (($("#enable_windows_prompt").prop("checked") != window.editData.DataSourceDefinition.WindowsCredentials) || ($("#prompt_text").val() != window.editData.DataSourceDefinition.Prompt)) {
            window.editData.IsDataSourceDefinitionChanged = true;
            window.isEdited = true;
        }
    }
    if (needPassword) {        
        $("#datasource_credential_validation_error").html("Credentials are required");
        return needPassword;
    }
    $("#connection_stored_password").closest('td').removeClass("has-error");
    $("#datasource_credential_validation_error").html("");
    return needPassword;
}

function onCheckboxChange() {
    dataSourceEditValidation();
}
$(document).keyup(function (e) {
    if (e.keyCode == 27) $('.PopupClose').click();
});

$(document).ready(function() {
    $("#datasource_popup_module input").keypress(function (e) {
        if (e.which == 13 && $("#publish_datasource").attr("disabled") != "disabled" && e.target.Id != "publish_datasource") {
            if ($(".btn-link").is(":focus")) {
                parent.onDataSourceEditDialogClose();
            } else {
                updateDataSource();
            }
        }
    });
});

$(document).on('click', '#datasource-dropdown .bootstrap-select ul.dropdown-menu li', function () {
    var dataSourceType = $("#datasource-type").val();

    if (dataSourceType === "XML") {
        $(".disable_connections").css('display', 'none');
    } else {
        $(".disable_connections").removeAttr("style");
    }

    if (dataSourceType === "SQLCE" || dataSourceType === "OLEDB" || dataSourceType === "Oracle" || dataSourceType === "ODBC" || dataSourceType === "OData" || dataSourceType === "PostgreSQL") {
        $(".disable_impersonate").css('display', 'none');
    } else {
        $(".disable_impersonate").css('display', 'block');
    }
});

$(document).on("click", ".css-radio", function () {
    $(this).siblings("label").removeClass("notransition");
});