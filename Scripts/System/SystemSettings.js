var userAgent = navigator.userAgent;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");
var isKeyUp = false;
var ruleName;
var rules;
$(document).ready(function () {
    $("#file-storage").prop("checked",$("#file-storage").val().toLowerCase() == storageType.toLowerCase());
    $("#blob-storage").prop("checked", $("#blob-storage").val().toLowerCase() == storageType.toLowerCase());
    $("#https").prop("checked", $("#https").val().toLowerCase() == connectionType.toLowerCase());   

    $("#http").prop("checked", $("#http").val().toLowerCase() == connectionType.toLowerCase());    
    $("#custom-endpoint").prop({ "checked": $("#custom-endpoint").val().toLowerCase() == connectionType.toLowerCase() });
    //enable default
    if (!$("#https").prop("checked") && !$("#http").prop("checked") && !$("#custom-endpoint").prop("checked")) {
        $("#https").prop("checked", true);
    }
    //Make the connection string if the application is Azure App
    var checkedVal = $("input[name='Connection']:checked").val();
    var accountName = $("#txt-accountname").val();
    var accessKey = $("#txt-accesskey").val();

    if (checkedVal == "http" || checkedVal == "https") {
        $(".custom-endpoint-form-element").hide();
        var finalValue = "DefaultEndpointsProtocol=" + checkedVal + ";AccountName=" + accountName + ";AccountKey=" + accessKey;
        $("#connection-string").val(finalValue);

    } else {
        var blobUrl = $("#txt-bloburl").val();

        var finalValue = "BlobEndpoint=" + blobUrl + ";AccountName=" + accountName + ";AccountKey=" + accessKey;
        $("#connection-string").val(finalValue);
        $(".custom-endpoint-form-element").show();
    }
    if (isAzureApplication) {
        if (storageType == "0") {
            //File Storage
            $("#blob-storage").prop("disabled", true);
        }
        else if (storageType == "1") {
            // Azure blob Storage
            $("#file-storage").prop("disabled", true);

        $("#blob-storage-form").find("input").attr("readonly", true);          
        $("#blob-storage-form").slideDown("slow");
        $("#https").prop({ "checked": $("#https").val().toLowerCase() == connectionType.toLowerCase(), disabled: $("#https").val().toLowerCase() != connectionType.toLowerCase() });
        $("#http").prop({ "checked": $("#http").val().toLowerCase() == connectionType.toLowerCase(), disabled: $("#http").val().toLowerCase() != connectionType.toLowerCase() });
        $("#custom-endpoint").prop({ "checked": $("#custom-endpoint").val().toLowerCase() == connectionType.toLowerCase(), disabled: $("#custom-endpoint").val().toLowerCase() != connectionType.toLowerCase() });
        $(".file-storage-button").hide();
    }
        $("#move-to-next").hide();
        $("#db-content-holder,#db-config-submit").show();
        $(".sqlcenot").show();  
        $("#new-db").prop("checked", true);
        $(".sql-server-existing-db, #sql-existing-db-submit").hide();
    }

    $("#information-icon").on("click", function () {
        $("#help-message").toggle();
    });

    $(window).resize(function () {
        changeFooterPostion();
    });

    changeFooterPostion();
    var height = $(document).height();
    $("#startup-page-conatiner").css("height", height);

    $("#database-type").on("change", function () {
        $(".validation-txt-errors").hide();
        $(".validation-errors").css("display", "none");
        $("#information-icon").css("display", "none");
        $(".has-error").removeClass("has-error");
        var checkedVal = $("#database-type").val().toLowerCase();
        switch (checkedVal) {
            case "mssql":
                $(".txt-holder input[type='text'], .txt-holder input[type='password']").val("");
                $("#new-db").prop("checked", true).trigger("change");
                $(".databse-dropdown ul").html("");
                $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>");
                $("#database-name").selectpicker("refresh");
                $(".content-display").hide();
                $(".show-sql-content").slideDown("slow");
                $("div.placeholder").remove();
                DomResize();
                break;
            case "mssqlce":
                $(".content-display").hide();
                $(".show-sqlce-content").slideDown("slow");
                DomResize();
                break;
            case "mysql":
                $(".txt-holder input[type='text'], .txt-holder input[type='password']").val("");
                $("#mysql-odbc-dsn>option:eq(0)").prop("selected", true);
                $("#mysql-odbc-dsn").selectpicker("refresh");
                $(".database-dropdown-mysql ul").html("");
                $("#database-name-mysql").html("<option value='' class='display-none'>[[[Select a database]]]</option>");
                $("#database-name-mysql").selectpicker("refresh");
                $("#new-db-mysql").prop("checked", true).trigger("change");
                $(".content-display").hide();
                $(".show-mysql-content").slideDown("slow");
                $("div.placeholder").remove();
                DomResize();
                break;
            case "oracle":
                $(".txt-holder input[type='text'], .txt-holder input[type='password']").val("");
                $("#oracle-dsn>option:eq(0)").prop("selected", true);
                $("#oracle-dsn").selectpicker("refresh");
                $(".database-dropdown-oracle ul").html("");
                $("#database-name-oracle").html("<option value='' class='display-none'>[[[Select a database]]]</option>");
                $("#database-name-oracle").selectpicker("refresh");
                $("#new-db-oracle").prop("checked", true).trigger("change");
                $(".content-display").hide();
                $(".show-oracle-content").slideDown("slow");
                $("div.placeholder").remove();
                DomResize();
                break;
            case "postgresql":
                $(".txt-holder input[type='text'], .txt-holder input[type='password']").val("");
                $("#new-db-postgresql").prop("checked", true).trigger("change");
                $(".database-dropdown-postgresql ul").html("");
                $("#database-name-postgresql").html("<option value='' class='display-none'>[[[Select a database]]]</option>");
                $("#database-name-postgresql").selectpicker("refresh");
                $(".content-display").hide();
                $(".show-postgresql-content").slideDown("slow");
                $("div.placeholder").remove();
                DomResize();
                break;
        }
        $(".txt-holder input[type='text'], .txt-holder input[type='password']").val("");
        addPlacehoder("#system-settings-db-selection-container");
        changeFooterPostion();
    });

    $("input[name='Connection']").on("click change", function () {
        var checkedVal = $("input[name='Connection']:checked").val();
        var accountName = $("#txt-accountname").val();
        var accessKey = $("#txt-accesskey").val();

        if (checkedVal == "http" || checkedVal == "https") {
            $(".custom-endpoint-form-element").hide();
            var finalValue = "DefaultEndpointsProtocol=" + checkedVal + ";AccountName=" + accountName + ";AccountKey=" + accessKey;
            $("#connection-string").val(finalValue);

        } else {
            var blobUrl = $("#txt-bloburl").val();

            var finalValue = "BlobEndpoint=" + blobUrl + ";AccountName=" + accountName + ";AccountKey=" + accessKey;
            $("#connection-string").val(finalValue);
            $(".custom-endpoint-form-element").show();
        }
        $("div.placeholder").remove();
        addPlacehoder("#system-settings-filestorage-container");
        changeFooterPostion();
    });

    $("#txt-bloburl,#txt_tableurl,#txt_queueurl,#txt-accountname,#txt-accesskey").on("keyup", function () {
        var checkedVal = $("input[name='Connection']:checked").val();
        var accountName = $("#txt-accountname").val();
        var accessKey = $("#txt-accesskey").val();
        if (checkedVal == "http" || checkedVal == "https") {
            var finalValue = "DefaultEndpointsProtocol=" + checkedVal + ";AccountName=" + accountName + ";AccountKey=" + accessKey;
            $("#connection-string").val(finalValue);

        } else {
            var blobUrl = $("#txt-bloburl").val();

            var finalValue = "BlobEndpoint=" + blobUrl + ";AccountName=" + accountName + ";AccountKey=" + accessKey;
            $("#connection-string").val(finalValue);
        }
    });

    $("input[name='IsBlobStorage']").on("click change", function () {
        var checkedVal = $("input[name='IsBlobStorage']:checked").val();
        if (checkedVal == "0") {
            $("#blob-storage-form").hide("slow");
            $(".file-storage-button").slideDown("slow");
            $(".azure-validation").css("display", "none");
        } else {
            $(".file-storage-button").hide();
            $("#blob-storage-form").slideDown("slow");
            $(".validation-txt-errors").hide();
            $(".azure-validation").css("display", "none");
            $(".has-error").removeClass("has-error");
            $("div.placeholder").remove();
        }
        addPlacehoder("#system-settings-filestorage-container");
        changeFooterPostion();
    });


    $("#check-windows").on("click change", function () {
        var windowsCheck = $("#check-windows").val() == "windows";
        var databaseType = $("#database-type").val();
        if (windowsCheck && databaseType == "MSSQL") {
            $("#txt-login").val("").attr("disabled", true);
            $("#txt-password-db").val("").attr("disabled", true);
        }
        else if (databaseType == "MSSQL") {
            $("#txt-login").attr("disabled", false);
            $("#txt-password-db").attr("disabled", false);
        }
        $(".has-error").removeClass("has-error");
        $(".validation-txt-errors").hide();
    });

    $("#db-config-submit").on("click", function () {
        $(".has-error").removeClass("has-error");
        $(".validation-txt-errors").hide();
        $(".validation-errors").html("");
        $("#information-icon").css("display", "none");
        var canProceed = $("#db-content-holder").valid();
        if (canProceed) {
            showWaitingPopup($(".startup-page-conatiner"));
            $(this).prop("disabled", true);
            $("#db_loader").show();
            window.serverName = $("#txt-servername").val();
            window.IsWindowsAuthentication = $("#check-windows").val() == "windows";
            window.login = $("#txt-login").val();
            window.password = $("#txt-password-db").val();
            var databaseType = $("#database-type").val();
            window.databaseName = $("#txt-dbname").val();
            doAjaxPost("POST", connectDatabaseUrl,
                {
                    data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName })
                },
                function (result) {


                    if (result.Data.key) {
                        var databaseType = $("#database-type").val();
                        doAjaxPost("POST", generateDatabaseUrl,
                            {
                                data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName })
                            },
                            function (result) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                if (result.Data.key) {
                                    $(".selected").removeClass("selected");
                                    $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                    $("#db_loader").hide();
                                    $("#system-settings-db-selection-container").hide();
                                    StorageSettings();
                                    $("#txt-username").focus();
                                    window.connectionString = result.Data.value;
                                    delete window.serverName;
                                    delete window.login;
                                    delete window.password;
                                    delete window.databaseName;
                                }
                                else {
                                    $("#db-config-submit").prop("disabled", false);
                                    $("#db_loader").hide();
                                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                    $("#information-icon").css("display", "inline");
                                }
                                changeFooterPostion();
                                $("#startup-page-conatiner").css("height", $(document).height());
                            }
                        );
                        $(".db-connect-outer-container").find(".title").html("[[[Database Creation]]]!");
                        $("#txt-dbname").focus();
                    }
                    else {
                        hideWaitingPopup($(".startup-page-conatiner"));
                        $("#db_config_generate").hide();
                        $("#db-config-submit").show();
                        $("#db-config-submit").prop("disabled", false);
                        $("#db_loader").hide();
                        $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                        $("#information-icon").css("display", "inline");
                    }
                }
            );
        }
    });

    $("#postgresql-config-submit").on("click", function () {
        $(".has-error").removeClass("has-error");
        $(".validation-txt-errors").hide();
        $(".validation-errors").html("");
        $("#information-icon").css("display", "none");
        var canProceed = $("#postgresql-content-holder").valid();
        if (canProceed) {
            showWaitingPopup($(".startup-page-conatiner"));
            $(this).prop("disabled", true);
            $("#db_loader").show();
            window.serverName = $("#postgresql-servername").val();
            window.login = $("#postgresql-login").val();
            window.port = $("#postgresql-port").val();
            window.password = $("#postgresql-password-db").val();
            window.databaseName = $("#postgresql-dbname").val();
            var databaseType = $("#database-type").val();
            doAjaxPost("POST", connectDatabaseUrl,
                {
                    data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, port: window.port, userName: window.login, password: window.password, databaseName: window.databaseName })
                },
                function (result) {


                    if (result.Data.key) {
                        doAjaxPost("POST", generatePostgreSqlDatabaseUrl,
                            {
                                data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, port: window.port, userName: window.login, password: window.password, databaseName: window.databaseName })
                            },
                            function (result) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                if (result.Data.key) {
                                    $(".selected").removeClass("selected");
                                    $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                    $("#db_loader").hide();
                                    $("#system-settings-db-selection-container").hide();
                                    StorageSettings();
                                    $("#txt-username").focus();
                                    window.connectionString = result.Data.value;
                                    delete window.serverName;
                                    delete window.port;
                                    delete window.login;
                                    delete window.password;
                                    delete window.databaseName;
                                }
                                else {
                                    $("#postgresql-config-submit").prop("disabled", false);
                                    $("#db_loader").hide();
                                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                    $("#information-icon").css("display", "inline");
                                }
                                changeFooterPostion();
                                $("#startup-page-conatiner").css("height", $(document).height());
                            }
                        );
                        $(".db-connect-outer-container").find(".title").html("[[[Database Creation]]]!");
                        $("#txt-dbname").focus();
                    }
                    else {
                        hideWaitingPopup($(".startup-page-conatiner"));
                        $("#db_config_generate").hide();
                        $("#postgresql-config-submit").show();
                        $("#postgresql-config-submit").prop("disabled", false);
                        $("#db_loader").hide();
                        $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                        $("#information-icon").css("display", "inline");
                    }
                }
            );
        }
    });

    $("#mysql-config-submit").on("click", function () {
        $(".has-error").removeClass("has-error");
        $(".validation-txt-errors").hide();
        $(".validation-errors").html("");
        $("#information-icon").css("display", "none");
        var canProceed = $("#mysql-content-holder").valid();
        if ($("#mysql-odbc-dsn").val() == "") {
            $("#dsn-validate").html("[[[Please select DSN]]]");
            $("#dsn-validate").show();
            return;
        }
        changeFooterPostion();
        if (canProceed) {
            showWaitingPopup($(".startup-page-conatiner"));
            $(this).prop("disabled", true);
            $("#db_loader").show();
            window.dsn = $("#mysql-odbc-dsn").val();
            window.login = $("#mysql-username").val();
            window.password = $("#mysql-password").val();
            window.databaseName = $("#mysql-database-name").val();
            doAjaxPost("POST", connectDatabaseUrl,
                {
                    data: JSON.stringify({ DSN: window.dsn, userName: window.login, password: window.password, databaseName: window.databaseName, ServerType: "MySQL" })
                },
                function (result) {
                    if (result.Data.key) {
                        var databaseType = $("#database-type").val();
                        doAjaxPost("POST", generateMySqlDatabaseUrl,
                            {
                                data: JSON.stringify({ DSN: window.dsn, userName: window.login, password: window.password, databaseName: window.databaseName, ServerType: "MySQL" })
                            },
                            function (result) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                if (result.Data.key) {
                                    $(".selected").removeClass("selected");
                                    $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                    $("#db_loader").hide();
                                    $("#system-settings-db-selection-container").hide();
                                    StorageSettings();
                                    $("#txt-username").focus();
                                    window.connectionString = result.Data.value;
                                    delete window.serverName;
                                    delete window.login;
                                    delete window.password;
                                    delete window.databaseName;
                                }
                                else {
                                    $("#mysql-config-submit").prop("disabled", false);
                                    $("#db_loader").hide();
                                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                    $("#information-icon").css("display", "inline");
                                }
                                changeFooterPostion();
                                $("#startup-page-conatiner").css("height", $(document).height());
                            }
                        );
                        $(".db-connect-outer-container").find(".title").html("[[[ Creation]]]!");
                        $("#txt-dbname").focus();
                    }
                    else {
                        hideWaitingPopup($(".startup-page-conatiner"));
                        $("#db_config_generate").hide();
                        $("#mysql-config-submit").prop("disabled", false);
                        $("#db_loader").hide();
                        $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                        $("#information-icon").css("display", "inline");
                        changeFooterPostion();
                    }
                }
            );
        }
    });

    $("#oracle-config-submit").on("click", function () {
        $(".has-error").removeClass("has-error");
        $(".validation-txt-errors").hide();
        $(".validation-errors").html("");
        $("#information-icon").css("display", "none");
        var canProceed = $("#oracle-content-holder").valid();
        var databaseType = $("input[name='OracledatabaseType']").val();
        var clientPassword = $("#database-password").val();
        if (databaseType == 0)
            clientPassword = $("#client-password").val();

        if ($("#oracle-dsn").val() == "") {
            $("#oracle-dsn-validate").html("[[[Please select DSN]]]");
            $("#oracle-dsn-validate").show();
            canProceed = false;
            return;
        }
        if (canProceed) {
            showWaitingPopup($(".startup-page-conatiner"));
            $(this).prop("disabled", true);
            $("#db_loader").show();
            var databaseType = $("#database-type").val();
            doAjaxPost("POST", connectOracleDatabaseUrl,
                {
                    data: JSON.stringify({ ServerType: databaseType, DSN: $("#oracle-dsn").val(), AdminUserName: $("#admin-username").val(), AdminPassword: $("#admin-password").val(), ClientUserName: $("#client-username").val(), ClientPassword: clientPassword, RoleName: $("#role-name").val() })
                },
                function (result) {
                    if (result.Data.key) {
                        var databaseType = $("#database-type").val();
                        doAjaxPost("POST", generateOracleDatabaseUrl,
                            {
                                data: JSON.stringify({ ServerType: databaseType, DSN: $("#oracle-dsn").val(), AdminUserName: $("#admin-username").val(), AdminPassword: $("#admin-password").val(), ClientUserName: $("#client-username").val(), ClientPassword: clientPassword, RoleName: $("#role-name").val() })
                            },
                            function (result) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                if (result.Data.key) {
                                    $(".selected").removeClass("selected");
                                    $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                    $("#db_loader").hide();
                                    $("#system-settings-db-selection-container").hide();
                                    StorageSettings();
                                    $("#txt-username").focus();
                                    window.connectionString = result.Data.value;
                                }
                                else {
                                    $("#oracle-config-submit").prop("disabled", false);
                                    $("#db_loader").hide();
                                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                    $("#information-icon").css("display", "inline");
                                }
                                changeFooterPostion();
                                $("#startup-page-conatiner").css("height", $(document).height());
                            }
                        );
                        $(".db-connect-outer-container").find(".title").html("Database Creation!");
                        $("#txt-dbname").focus();
                    }
                    else {
                        hideWaitingPopup($(".startup-page-conatiner"));
                        $("#db_config_generate").hide();
                        $("#oracle-config-submit").show();
                        $("#oracle-config-submit").prop("disabled", false);
                        $("#db_loader").hide();
                        $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                        $("#information-icon").css("display", "inline");
                        changeFooterPostion();
                    }
                }
            );
        }
    });


    $("#db-content-holder").on("keyup", "input", function (event) {
        if (event.keyCode == 13) {
            $("input[name='databaseType']:checked").val() === "1" ? $("#sql-existing-db-submit").click() : $("#db-config-submit").click();
        }
    });

    $("#oracle-content-holder").on("keyup", "input", function (event) {
        if (event.keyCode == 13) {
            $("input[name='OracledatabaseType']:checked").val() === "1" ? $("#oracle-existing-db-submit").click() : $("#oracle-config-submit").click();
        }
    });

    $("#mysql-content-holder").on("keyup", "input", function (event) {
        if (event.keyCode == 13) {
            $("input[name='MySqldatabaseType']:checked").val() === "1" ? $("#mysql-existing-db-submit").click() : $("#mysql-config-submit").click();
        }
    });

    $("#postgresql-content-holder").on("keyup", "input", function (event) {
        if (event.keyCode == 13) {
            $("input[name='PostgreSqlDatabaseType']:checked").val() === "1" ? $("#postgresql-existing-db-submit").click() : $("#postgresql-config-submit").click();
        }
    });

    $(document).on("click", "#move-to-next", function () {
        showWaitingPopup($(".startup-page-conatiner"));
        var databaseType = $("#database-type").val();
        $("#db_loader").show();
        doAjaxPost("POST", generateDatabaseUrl,
            {
                data: JSON.stringify({ ServerType: databaseType })
            },
            function (result) {
                $("#startup-page-conatiner").css("height", "");
                hideWaitingPopup(".startup-page-conatiner");
                if (result.Data.key) {
                    $(".selected").removeClass("selected");
                    $("ul li[data-move-to='startup-page-two']").addClass("selected");
                    $("#db_loader").hide();
                    $("#system-settings-db-selection-container").hide();
                    StorageSettings();
                    window.connectionString = result.Data.value;
                    changeFooterPostion();
                    delete window.serverName;
                    delete window.login;
                    delete window.password;
                    delete window.databaseName;
                    addPlacehoder("body")
                }
                else {
                    $("#db_config_generate").prop("disabled", false);
                    $("#db_loader").hide();
                    $("#connection-validation").find(".validation-errors").html(result.Data.value);
                    $("#information-icon").css("display", "inline");
                }
            }
        );
    });
   
    $("#btn_proceed_page1").on("click", function () {
        $("#steps-container").find(".selected").removeClass("selected");
        $("li[data-move-to='startup-page-two']").addClass("selected");

        $("#system-settings-db-selection-container").hide();
        $("#system-settings-filestorage-container").slideDown("slow");
        $("#txt-username").focus();
        changeFooterPostion();
    });

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $.validator.addMethod("hasWhiteSpace", function (value, element) {
        return /\s/.test(value);
    }, "[[[Username contains space]]]");

    $.validator.addMethod("isValidUser", function (value, element) {
        return isValidUserName(value)
    }, "[[[Username contains invalid characters]]]");

    $.validator.addMethod("isValidEmail", function (value, element) {
         if (value.trim() == "") {
            return true;
        } else {
            return IsEmail(value);
        }
    }, "[[[Please enter a valid email address]]]");

    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isValidadminPassword", function (value, element) {
        var validateMethods = new Array();
        validateMethods.push(validateUserpassword.p_policy_uppercase);
        validateMethods.push(validateUserpassword.p_policy_lowercase);
        validateMethods.push(validateUserpassword.p_policy_number);
        validateMethods.push(validateUserpassword.p_policy_specialcharacter);
        validateMethods.push(validateUserpassword.p_policy_length);
        for (var n = 0; n < validateMethods.length ; n++) {
            var currentMethodName = validateMethods[n];
            if (currentMethodName(value) != "" && currentMethodName(value) != undefined) {
                ruleName = currentMethodName(value);
                if ($("#password_policy_rules").find("li#" + ruleName + " span").attr("class") != "su-tick") {
                    $("#password_policy_rules").find("li#" + ruleName + " span").addClass("su su-tick").removeClass("su su-close");
                    $("#password_policy_rules").find("li#" + ruleName).addClass("clear-error");
                    ruleName = ""
                }
            }
            else {
                ruleName = name;
                $(element).closest(".form-group").addClass("has-error");
                if ($("#password_policy_rules").find("li#" + ruleName + " span").attr("class") == "su-tick") {
                    $("#password_policy_rules").find("li#" + ruleName + " span").addClass("su su-close").removeClass("su-tick");
                    $("#password_policy_rules").find("li#" + ruleName).removeClass("clear-error");
                    ruleName = "";
                }
            }
        }
        if ($("#password_policy_rules li>span.su-tick").length == $("#password_policy_rules").find("li>span").length)
            return true;
    }, "");

    $.validator.addMethod("isValidPrefix", function (value, element) {
        if (/^[a-zA-Z\_]+$/g.test(value) || value === "") {
            return true;
        } else {
            return false;
        }
    }, "[[[Please avoid special characters, numbers and white spaces]]]");


    $.validator.addMethod("isValidDatabaseName", function(value, element) {
        if (/^[a-zA-Z_0-9@~!#\$\^&()+=\-,\.\/\{\} ]+$/.test(value) && !/^[\s]+|[\s]+$/g.test(value)) {
            return true;
        }
    }, "[[[Please avoid special characters, Leading and Trailing spaces]]]");

    $.validator.addMethod("sqlUsernamevalidation", function (value, element) {
        if (/^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\\\',\.\/\{\}\|:<>\? ]+$/.test(value) && !/^[\s]/g.test(value)) {
            return true;
        }
    }, "[[[Please avoid special characters and Leading spaces]]]");

    $.validator.addMethod("isValidCredentials", function(value, element) {
        return /^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\\\',\.\/\{\}\|:<>\? ]+$/.test(value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("mySqlCredentials", function (value, element) {
        if ((/^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\\\',\.\/\{\}\|\":<>\? ]+$/.test(value) && !/^[\s]+|[\s]+$/g.test(value)) || value === "") {
            return true;
        }
    }, "[[[Please avoid special characters, Leading and Trailing spaces]]]");

    $.validator.addMethod("oraclePasswordValidation", function (value, element) {
        if (/^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\\,\.\/\{\}\|:<>\? ]+$/.test(value) && !/^[\s]+|[\s]+$/g.test(value)) {
            return true;
        }
    }, "[[[Please avoid special characters, Leading and Trailing spaces]]]");

    $.validator.addMethod("oracleUsernameValidation", function (value, element) {
        if (/^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\\,\.\/\{\}\|:<>\? ]+$/.test(value)) {
            return true;
        }
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("additionalSpecialCharValidation", function (value, element) {
        if (/^[a-zA-Z_0-9`~!\$\^()=\-\.\{\} ]+$/.test(value) || value === "") {
            return true;
        }
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("postgresqlUsernamevalidation", function (value, element) {
        if (/^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\',\.\/\{\}\|:<>\? ]+$/.test(value) && !/^[\s]+|[\s]+$/g.test(value)) {
            return true;
        }
    }, "[[[Please avoid special characters, Leading and Trailing spaces]]]");

    $.validator.addMethod("isValidPostgresqlCredentials", function (value, element) {
        return /^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\',\.\/\{\}\|:<>\? ]+$/.test(value);
    }, "[[[Please avoid special characters");

    $.validator.addMethod("isValidPortNumber", function (value, element) {
        return /^\d{1,5}$/.test(value) && value < 65536 && !/^[\s]/g.test(value);
    }, "[[[Please enter valid port number]]]");

    $(".admin-account-fields-container").validate({
        focusInvalid: false,
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                $(element).valid();
                isKeyUp = false;
            }
            else
                true;
        },
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            username: {
                isRequired: true,
                hasWhiteSpace: false,
                isValidName: true,
                isValidUser: true,
                additionalSpecialCharValidation:true
            },
            firstname: {
                isRequired: true,
                isValidName: true,
                additionalSpecialCharValidation: true
            },
            lastname: {
                additionalSpecialCharValidation: true
            },
            email: {
                isValidName:true,
                isValidEmail: true
            },
            password: {
                required: true,
                isValidadminPassword: true
            },
            confirm: {
                required: true,
                equalTo: "#txt-password"
            }
        },
        highlight: function (element) {
            $(element).closest(".form-group").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
            if ($(element).attr("id") == "txt-password") {
                for (var i = 0; i < $("#password_policy_rules").find("li>span").length; i++) {
                    if ($($("#password_policy_rules").find("li>span")[i]).attr("class") == "su-tick")
                        $(element).closest(".form-group").removeClass("has-error");
                    else
                        rules = "unsatisfied-rule";
                }
                if (rules != "" && rules != undefined) {
                    $(element).closest(".form-group").addClass("has-error");
                    rules = "";
                }
            }
        },
        unhighlight: function (element) {
            $(element).closest(".form-group").removeClass("has-error");
            if ($(element).attr("id") == "txt-password") {
                for (var i = 0; i < $("#password_policy_rules").find("li>span").length; i++) {
                    if ($($("#password_policy_rules").find("li>span")[i]).attr("class") != "su-tick")
                        rules = "unsatisfied-rule";
                    if ($($("#password_policy_rules").find("li>span")[i]).attr("class") == "su-tick")
                        $(element).closest(".form-group").removeClass("has-error");
                }
                if (rules != "" && rules != undefined) {
                    $(element).closest(".form-group").addClass("has-error");
                    rules = "";
                }
            }
            $(element).parent().find(">.startup-validation").hide();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").text(error.html());
        },
        messages: {
            username: {
                isRequired: "[[[Please enter username]]]"
            },
            firstname: {
                isRequired: "[[[Please enter first name]]]"
            },
            lastname: {
                isValidName: "[[[Please avoid special characters]]]"
            },
            password: {
                required: "[[[Please enter password]]]"
            },
            confirm: {
                required: "[[[Please confirm password]]]",
                equalTo: "[[[Passwords Mismatch]]]"
            }
        }
    });

    $("#txt-password").bind("keyup", function (e) {
        if ($("#txt-password").val() == $("#txt-confirm-password").val()) {
            $("#txt-confirm-password").closest(".form-group").removeClass("has-error");
            $("#txt-confirm-password").parent().find(">.startup-validation").hide();
        }
        createPasswordPolicyRules();
    });

    $("#txt-password").on("change", function () {
        createPasswordPolicyRules();
        $("#txt-password").valid();
    })

    function createPasswordPolicyRules() {
        if ($("#txt-password").val() != "" && $("#txt-password").next("ul").length == 0) {
            $("#txt-password").after("<ul id='password_policy_rules'></ul>");
            $("#password_policy_rules").append("<li id='p_policy_heading'>[[[Password must meet the following requirements. It must contain,]]]</li>")
            $("#password_policy_rules").append("<li id='p_policy_length'><span class='su su-close'></span>[[[at least 6 characters.]]]</li>")
            $("#password_policy_rules").append("<li id='p_policy_uppercase'><span class='su su-close'></span>[[[1 uppercase.]]]</li>")
            $("#password_policy_rules").append("<li id='p_policy_lowercase'><span class='su su-close'></span>[[[1 lowercase.]]]</li>")
            $("#password_policy_rules").append("<li id='p_policy_number'><span class='su su-close'></span>[[[1 numeric.]]]</li>")
            $("#password_policy_rules").append("<li id='p_policy_specialcharacter'><span class='su su-close'></span>[[[1 special character.]]]</li>")
            $("#confirm-password-section").css("margin-top", "-80px")
        }
        if ($("#txt-password").val() == "" && $("#txt-password").next("ul").length != 0) {
            $("#txt-password").next("ul").remove();
            $("#confirm-password-section").css("margin-top", "5px")
        }
    }
    $("#oracle-content-holder").validate({
        errorElement: "span",
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
            servername: {
                isRequired: true
            },
            adminUserName: {
                isRequired: true,
                oracleUsernameValidation: true
            },
            adminPassword: {
                required: true,
                oraclePasswordValidation: true
            },
            clientUserName: {
                required: {
                    depends: function () {
                        return ($("input[name='OracledatabaseType']:checked").val() === "0");
                    }
                },
                isValidDatabaseName: {
                    depends: function () {
                        return ($("input[name='OracledatabaseType']:checked").val() === "0");
                    }
                }
            },
            clientPassword: {
                required: true,
                oraclePasswordValidation:true
            },
            confirmClientPassword: {
                required: {
                    depends: function () {
                        if ($("input[name='OracledatabaseType']:checked").val() === "0") {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                equalTo: ".oracle-new-db #client-password"
            },
            tablePrefix: {
                isValidPrefix: true
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).closest(".text-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).closest(".text-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").html(error.html());
        },
        messages: {
            servername: {
                isRequired: "[[[Please enter server name]]]"
            },
            adminUserName: {
                isRequired: "[[[Please enter admin username]]]"
            },
            adminPassword: {
                required: "[[[Please enter admin password]]]"
            },
            clientUserName: {
                required: "[[[Please enter database name]]]"
            },
            clientPassword: {
                required: "[[[Please enter the database password]]]"
            },
            confirmClientPassword: {
                required: "[[[Please confirm password]]]",
                equalTo: "[[[Passwords Mismatch]]]"
            }
        }
    });



    $.validator.addMethod("IsValidEndPoint", function (value, element) {
        return IsValidEndPoint(value);
    }, "[[[Invalid Blob Service endpoint]]]");

    $.validator.addMethod("IsCustomEndpoint", function (value, element) {
        return IsCustomEndPoint(value, element);
    }, "[[[Invalid End point]]]");
    $.validator.addMethod("IsValidCustomEndPoint", function (value, element) {
        return IsValidCustomEndPoint(value, element);
    }, "[[[Invalid custom End point]]]");

    $("#blob-storage-form").validate({
        focusInvalid: false,
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                $(element).valid();
                isKeyUp = false;
            }
            else
                true;
        },
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            accountname: {
                isRequired: true,
                hasWhiteSpace: false
            },
            endpoint: {
                isRequired: true,
                IsValidEndPoint: true
            },
            accesskey: {
                isRequired: true
            },
            containername: {
                required: true
            },
            bloburl: {
                IsCustomEndpoint: true,
                IsValidEndPoint: true,
                IsValidCustomEndPoint: true
            }
        },
        highlight: function (element) {
            $(element).closest(".form-group").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".form-group").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
            changeFooterPostion();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").text(error.html());
            changeFooterPostion();
        },
        messages: {
            accountname: {
                isRequired: "[[[Please enter Storage Account name]]]"
            },
            endpoint: {
                isRequired: "[[[Please enter Blob Service endpoint]]]"
            },
            accesskey: {
                isRequired: "[[[Please enter Access key]]]"
            },
            containername: {
                required: "[[[Please enter Container name]]]"
            },
            bloburl: {
                IsCustomEndpoint: "[[[Please enter Blob URL]]]",
                IsValidEndPoint: "[[[Please enter valid Blob URL]]]",
                IsValidCustomEndPoint: "[[[Subdomain name should match with the Account name]]]"
            }
        }

    });

    $("#oracle-dsn,#mysql-odbc-dsn").change(function () {
        if ($("#oracle-dsn,#mysql-odbc-dsn").val() != "") {
            $("#oracle-dsn-validate.validation-txt-errors,#dsn-validate.validation-txt-errors").hide();
            changeFooterPostion();
        }
    });

    $("#txt-password-db").validate({
        errorElement: "span",
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            password: {
                isRequired: true
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
            changeFooterPostion();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").text(error.html());
            changeFooterPostion();
        },
        messages: {
            password: {
                isRequired: "[[[Please enter password]]]"
            }
        }
    });

    $("#txt-servername").validate({
        errorElement: "span",
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            servername: {
                isRequired: true
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
            changeFooterPostion();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").text(error.html());
            changeFooterPostion();
        },
        messages: {
            servername: {
                isRequired: "[[[Please enter server name]]]"
            }
        }
    });

    $("#txt-login").validate({
        errorElement: "span",
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            username: {
                isRequired: true
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
            changeFooterPostion();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").text(error.html());
            changeFooterPostion();
        },
        messages: {
            username: {
                isRequired: "[[[Please enter username]]]"
            }
        }
    });

    $("#db-content-holder").validate({
        errorElement: "span",
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
            servername: {
                isRequired: true
            },
            username: {
                required: true,
                sqlUsernamevalidation: true
            },
            password: {
                required: true,
                isValidCredentials: true
            },
            dbname: {
                required: {
                    depends: function () {
                        return ($("input[name='databaseType']:checked").val() === "0");
                    }
                },
                isValidDatabaseName: {
                    depends: function () {
                        return ($("input[name='databaseType']:checked").val() === "0");
                    }
                }
            },
            tablePrefix: {
                isValidPrefix: true
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).closest(".text-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).closest(".text-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
            changeFooterPostion();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").html(error.html());
            changeFooterPostion();
        },
        messages: {
            servername: {
                isRequired: "[[[Please enter server name]]]"
            },
            username: {
                required: "[[[Please enter username]]]"
            },
            password: {
                required: "[[[Please enter password]]]"
            },
            dbname: {
                required: "[[[Please enter the database name]]]"
            }
        }
    });

    $("#mysql-content-holder").validate({
        errorElement: "span",
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
            mySqlUserName: {
                mySqlCredentials:true
            },
            mysqlPassword: {
                mySqlCredentials: true
            },
            mySqlDataBaseName: {
                required: {
                    depends: function () {
                        return ($("input[name='MySqldatabaseType']:checked").val() === "0");
                    }
                },
                isValidDatabaseName: {
                    depends: function () {
                        return ($("input[name='MySqldatabaseType']:checked").val() === "0");
                    }
                }
            },
            tablePrefix: {
                isValidPrefix: true
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).closest(".text-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).closest(".text-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
            changeFooterPostion();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").html(error.html());
            changeFooterPostion();
        },
        messages: {
            mySqlDataBaseName: {
                required: "[[[Please enter database name]]]"
            }

        }
    });

    $("#postgresql-content-holder").validate({
        errorElement: "span",
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
            servername: {
                isRequired: true
            },
            port: {
                required: true,
                isValidPortNumber: true
            },
            username: {
                required: true,
                postgresqlUsernamevalidation: true
            },
            password: {
                required: true,
                isValidPostgresqlCredentials: true
            },
            dbname: {
                required: {
                    depends: function () {
                        return ($("input[name='PostgreSqlDatabaseType']:checked").val() === "0");
                    }
                },
                isValidDatabaseName: {
                    depends: function () {
                        return ($("input[name='PostgreSqlDatabaseType']:checked").val() === "0");
                    }
                }
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).closest(".text-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).closest(".text-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
            changeFooterPostion();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").html(error.html());
            changeFooterPostion();
        },
        messages: {
            servername: {
                isRequired: "[[[Please enter server name]]]"
            },
            port: {
                required: "[[[Please enter port number]]]"
            },
            username: {
                required: "[[[Please enter username]]]"
            },
            password: {
                required: "[[[Please enter password]]]"
            },
            dbname: {
                required: "[[[Please enter the database name]]]"
            }
        }
    });

});

function validate_storage_type() {
    $(".blob-error-message").hide();
    showWaitingPopup($(".startup-page-conatiner"));
    var storageType = $("input[name='IsBlobStorage']:checked").val();
    window.storageType = storageType;
    if (storageType == "1") {
        if ($("#blob-storage-form").valid()) {
            window.accountname = $("#txt-accountname").val();
            window.endpoint = $("#txt-endpoint").val();
            window.accesskey = $("#txt-accesskey").val();
            window.containername = $("#txt-containername").val();
            var blobUrl = $("#txt-bloburl").val();
            var connectionType = $("input[name='Connection']:checked").val();
            var connectionString = "";
            var storageEndPoint = $("#txt-endpoint").val();

            if (connectionType == "http" || connectionType == "https") {
                connectionString = "DefaultEndpointsProtocol=" + connectionType + ";AccountName=" + window.accountname + ";AccountKey=" + window.accesskey;

            } else {
                connectionString = "BlobEndpoint=" + blobUrl + ";AccountName=" + window.accountname + ";AccountKey=" + window.accesskey;
            }
            window.connectionType = connectionType;
            doAjaxPost("POST", "../ServerConfiguration/IsBlobExists",
                {
                    storageEndPoint: storageEndPoint, connectionString: connectionString, connectionType: connectionType, blobUrl: blobUrl, storageType: storageType, storageAccountName: window.accountname, Endpoint: window.endpoint, storageAccountKey: window.accesskey, containerName: window.containername
                },
                function (result) {
                    if (typeof result.Data != "undefined") {
                        if (result.Data.Key.toString().toLowerCase() == "true") {
                            window.azureconnectionString = result.Data.ConnectionString;
                            $("#system-settings-filestorage-container").hide();
                            $("#system-settings-admins-container").slideDown("slow");
                            hideWaitingPopup(".startup-page-conatiner");
                            changeFooterPostion();
                        } else {
                            hideWaitingPopup(".startup-page-conatiner");
                            $(".azure-validation,.blob-error-message").css("display", "block");
                            changeFooterPostion();
                        }
                    } else {
                        hideWaitingPopup(".startup-page-conatiner");
                        $(".azure-validation,.blob-error-message").css("display", "block");
                        changeFooterPostion();
                    }
                }
            );
            return false;
        } else {
            hideWaitingPopup(".startup-page-conatiner");
            changeFooterPostion();
            return false;
        }
    } else {
        $("div.placeholder").remove();
        hideWaitingPopup(".startup-page-conatiner");
        $("#system-settings-filestorage-container").hide();
        $("#system-settings-admins-container").slideDown("slow");
        changeFooterPostion();
        return false;
    }

}

function showUserAccountContainer() {
    $("#system-settings-admins-container").hide();
    $("#system-settings-user-account-container").slideDown("slow");
    $("#txt-username").focus();
    changeFooterPostion();
}

function IsValidEndPoint(domainName) {
    var filter = /(?:http)s?:\/\/(?:(?!.*\d[\/?:])[a-z0-9\-._~%]+|(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\[[a-z0-9\-._~%!$&'()*+,;=:]+\])(?::\d+)?(?:[\/?][\-A-Z0-9+&@#\/%?=~_|$!:,.;]*)?/i;
    if (filter.test(domainName)) {
        return true;
    } else {
        return false;
    }
}

function IsCustomEndPoint(fieldValue, element) {
    var connectionType = $("input[name='Connection']:checked").val();
    if (connectionType == "customendpoint") {
        if (fieldValue == "")
            return false;
        else
            return true;
    }
    else
        return false;
}

function IsValidCustomEndPoint(fieldValue, element) {
    var connectionType = $("input[name='Connection']:checked").val();
    var accountname = $("#txt-accountname").val();
    if (connectionType == "customendpoint") {
        var accountName = $("#txt-accountname").val();
        var elementDomainName = $(element).val().split(".");
        var subdomain = elementDomainName.shift();
        var sndleveldomain = subdomain.split("//");
        if (sndleveldomain[1] != accountname)
            return false;
        else
            return true;
    }
    else
        return false;
}

function validateEmail(email, eventType) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function changeFooterPostion() {
    if (window.innerHeight - $("#system-settings-general").height() > 70) {
        $("#base-footer-div").addClass("footer-fixed");
    } else {
        $("#base-footer-div").removeClass("footer-fixed");
    }   
}

function isValidUserName(userName) {
    if (isKeyUp) {
        return true;
    }
    else {
        var filter = /^[A-Za-z0-9][A-Za-z0-9]*([._-][A-Za-z0-9]+){0,3}$/;
        return filter.test(userName);
    }

}

$(document).on("focus", "input[type=text],input[type=password]", function () {
    if (regexIe8.test(userAgent)) {
        $(this).next(".placeholder").removeClass("show").addClass("hide");
    }
});

$(document).on("focusout", "input[type=text],input[type=password]", function () {
    if (regexIe8.test(userAgent) && $(this).val() === "") {
        $(this).next(".placeholder").removeClass("hide").addClass("show");
    }
});


$(document).on("focus", ".placeholder", function () {
    $(this).prev("input").focus();
});

function addPlacehoder(object) {
    if (regexIe8.test(userAgent)) {
        $(object).find("input[type=text],input[type=password]").each(function () {
            if ($(this).val() === "") {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder") })).insertAfter(this).show();
            }
            else {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder") })).insertAfter(this).hide();
            }
        });
    }

}

function getFormData() {
    if ($(".admin-account-fields-container").valid()) {
        showWaitingPopup($(".startup-page-conatiner"));
        var serverType = $("#database-type").val();
        var database = $("#database-type").val().toLowerCase();
        switch (database) {
            case "mssqlce":
                var prefix = "SyncRS_";
                break;
            case "mssql":
                var prefix = ($("#table-prefix").val() === "" || $("#new-db").is(":checked")) ? "SyncRS_" : $("#table-prefix").val();
                var databaseName = $("#new-db").is(":checked") ? $("#txt-dbname").val() : $("#databaseName").val();
                break;
            case "mysql":
                var prefix = ($("#table-prefix-mysql").val() === "" || $("#new-db-mysql").is(":checked")) ? "SyncRS_" : $("#table-prefix-mysql").val();
                var databaseName = $("#new-db-mysql").is(":checked") ? "`" + $("#mysql-database-name").val() + "`" : "`" + $("#database-name-mysql").val() + "`";
                break;
            case "oracle":
                var prefix = ($("#table-prefix-oracle").val() === "" || $("#new-db-oracle").is(":checked")) ? "SyncRS_" : $("#table-prefix-oracle").val();
                var databaseName = $("#new-db-oracle").is(":checked") ? $("#client-username").val() : $("#database-name-oracle").val();
                break;
            case "postgresql":
                var prefix = ($("#table-prefix-postgresql").val() === "" || $("#new-db-postgresql").is(":checked")) ? "SyncRS_" : $("#table-prefix-postgresql").val();
                var databaseName = $("#new-db-postgresql").is(":checked") ? $("#postgresql-dbname").val() : $("#database-name-postgresql").val();
                break;
        }


        var authenticationType = 0;
        if (!($("#check-windows").val() == "windows"))
            authenticationType = 1;

        var globalAdmin = {
            UserName: $("#txt-username").val(),
            FirstName: $("#txt-firstname").val(),
            LastName: $("#txt-lastname").val(),
            Email: $("#txt-emailid").val(),
            Password: $("#txt-password").val()
        };
        var systemSettingsData = {
            SQLConfiguration:
            {
                ConnectionString: window.connectionString,
                ServerType: serverType,
                AuthenticationType: authenticationType,
                DatabaseName: databaseName,
                Prefix: prefix
            },
            StorageType: window.storageType
        };

        var azureData = {
            AzureBlobStorageUri: window.endpoint,
            AzureBlobStorageContainerName: window.containername,
            ConnectionType: window.connectionType,
            ConnectionString: window.azureconnectionString
        };

        $("#global-admin-details").val(JSON.stringify(globalAdmin));
        $("#system-settings-data").val(JSON.stringify(systemSettingsData));
        $("#azure-data").val(JSON.stringify(azureData));
    }
}

$(document).on("keyup", "#client-username", function () {
    if (regexIe8.test(userAgent)) {
        if ($(this).val() === "") {
            $("#role-name").prop("disabled", true);
            $("#role-name").val("");
            $("#role-name").next(".placeholder").removeClass("hide").addClass("show");
        }
        else {
            $("#role-name").prop({ 'disabled': false, 'readonly': true });
            $("#role-name").focus(this.blur);
            $("#role-name").val($(this).val().substring(0, 25) + "_role");
            $("#role-name").next(".placeholder").removeClass("show").addClass("hide");

        }
    }
    else if ((userAgent.indexOf("Safari") != -1) && (userAgent.indexOf("Chrome") == -1)) {
        $("#role-name").val(($(this).val() === "") ? "" : $(this).val().substring(0, 25) + "_role");
        $("#role-name").css("-webkit-text-fill-color", "black");
    }
    else {
        $("#role-name").val(($(this).val() === "") ? "" : $(this).val().substring(0, 25) + "_role");
    }
});


$(document).on("change", ".css-radio", function () {
    var database = $("#database-type").val().toLowerCase();
    switch (database) {
        case "mssql":
            if ($("input[name='databaseType']:checked").val() === "1") {
                $(".sql-server-existing-db, #sql-existing-db-submit").slideDown("slow");
                $(".database-name, #db-config-submit").hide();
                changeFooterPostion();
                DomResize();
            } else {                
                $(".sql-server-existing-db, #sql-existing-db-submit").hide();
                $(".database-name, #db-config-submit").slideDown("slow");
                $(".databse-dropdown ul").html("");
                $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");               
                changeFooterPostion();
                DomResize();
            }
            break;
        case "mysql":
            if ($("input[name='MySqldatabaseType']:checked").val() === "1") {
                $(".mysql-existing-db, #mysql-existing-db-submit").slideDown("slow");
                $(".mysql-create-db, #mysql-config-submit").hide();
                changeFooterPostion();
                DomResize();
            } else {
                $(".mysql-existing-db,#mysql-existing-db-submit").hide();
                $(".mysql-create-db, #mysql-config-submit").slideDown("slow");
                $(".database-dropdown-mysql ul").html("");
                $("#database-name-mysql").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                
                changeFooterPostion();
                DomResize();
            }
            break;
        case "oracle":
            if ($("input[name='OracledatabaseType']:checked").val() === "1") {
                $(".oracle-existing-db,#oracle-existing-db-submit").slideDown("slow");
                $(".oracle-new-db, #oracle-config-submit").hide();
                DomResize();
            } else {
                $(".oracle-existing-db, #oracle-existing-db-submit").hide();
                $(".oracle-new-db, #oracle-config-submit").slideDown("slow");
                $(".database-dropdown-oracle ul").html("");
                $("#database-name-oracle").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                
                DomResize();
            }
            break;
        case "postgresql":
            if ($("input[name='PostgreSqlDatabaseType']:checked").val() === "1") {
                $(".postgresql-existing-db, #postgresql-existing-db-submit").slideDown("slow");
                $(".database-name-postgresql, #postgresql-config-submit").hide();
                changeFooterPostion();
                DomResize();
            } else {
                $(".postgresql-existing-db, #postgresql-existing-db-submit").hide();
                $(".database-name-postgresql, #postgresql-config-submit").slideDown("slow");
                $(".database-dropdown-postgresql ul").html("");
                $("#database-name-postgresql").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                
                changeFooterPostion();
                DomResize();
            }
            break;
    }

});

$(document).on("click", ".databse-dropdown .dropdown-toggle", function () {
    $(".databse-dropdown ul").html("");
    $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");   
    var iswindows = $("#check-windows").val() === "windows";
    if (!iswindows) {
        $("#txt-login").valid();
        $("#txt-servername").valid();
        $("#txt-password-db").valid();
        if ($("#txt-login").val() !== "" && $("#txt-servername").val() !== "" && $("#txt-password-db").val() !== "") {
            var canProceed = true;
        } else
            var canProceed = false;
    }
    else if ($("#txt-servername").valid()) {
        var canProceed = true;
    } else
        var canProceed = false;

    if (canProceed) {
        $("#waiting-icon").show();
        window.serverName = $("#txt-servername").val();
        window.IsWindowsAuthentication = $("#check-windows").val() == "windows";
        window.login = $("#txt-login").val();
        window.password = $("#txt-password-db").val();
        var databaseType = $("#database-type").val();
        window.databaseName = $("#txt-dbname").val();
        doAjaxPost("POST", getAllDatabaseUrl,
            {
                data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication })
            },
            function (result) {
                if (result.Data.key) {
                    $("#database-error").hide();
                    var items = result.Data.value;
                    var option = "";
                    if (items.length > 0) {
                        for (var t = 0; t < items.length; t++) {
                            option += '<option value=\"' + items[t] + '\">' + items[t] + "</option>";
                        }
                        $("#connection-validation").find(".validation-errors").html("");
                        $("#information-icon").css("display", "none");
                        $("#database-name").append(option).selectpicker("refresh");                        
                        for (var i = 0; i < $("#db-content-holder .databse-dropdown .bootstrap-select li a .text").length ; i++) {
                            var dbTitle = $("#db-content-holder .databse-dropdown .bootstrap-select li a .text").eq(i).text();
                            $("#db-content-holder .databse-dropdown .bootstrap-select li a").eq(i).attr("title", dbTitle);
                        }
                    } else {
                        $("#database-name").selectpicker("refresh").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                   
                        $(".databse-dropdown ul").html("<li class='no-results active' title='[[[no database found]]]' style='display: list-item;'>[[[No database found]]]</li>");
                    }
                    $("#waiting-icon").hide();
                } else {
                    $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                   
                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                    $("#information-icon").css("display", "inline");
                    changeFooterPostion();
                    $("#waiting-icon").hide();
                }
            }
        );
    }
});

$(document).on("click", ".database-dropdown-mysql .dropdown-toggle", function () {
    $(".database-dropdown-mysql ul").html("");
    $("#database-name-mysql").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");    
    if ($("#mysql-odbc-dsn").val() == "") {
        $("#dsn-validate").html("[[[Please select DSN]]]").show();        
        return;
    }
        $("#waiting-iconmysql").show();
        window.dsn = $("#mysql-odbc-dsn").val();
        window.login = $("#mysql-username").val();
        window.password = $("#mysql-password").val();
        window.databaseName = $("#mysql-database-name").val();
        doAjaxPost("POST", getAllDatabaseUrl,
            {
                data: JSON.stringify({ DSN: window.dsn, userName: window.login, password: window.password, databaseName: window.databaseName, ServerType: "MySQL" })
            },
            function (result) {
                if (result.Data.key) {
                    $("#database-error-mysql").hide();
                    var items = result.Data.value;
                    var option = "";
                    if (items.length > 0) {
                        for (var t = 0; t < items.length; t++) {
                            option += '<option value=\"' + items[t] + '\">' + items[t] + "</option>";
                        }
                        $("#connection-validation").find(".validation-errors").html("");
                        $("#information-icon").css("display", "none");
                        $("#database-name-mysql").append(option).selectpicker("refresh");                        
                        for (var i = 0; i < $("#mysql-content-holder .database-dropdown-mysql .bootstrap-select li a .text").length ; i++) {
                            var dbTitle = $("#mysql-content-holder .database-dropdown-mysql .bootstrap-select li a .text").eq(i).text();
                            $("#mysql-content-holder .database-dropdown-mysql .bootstrap-select li a").eq(i).attr("title", dbTitle);
                        }
                    } else {
                        $("#database-name-mysql").selectpicker("refresh").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                       
                        $(".database-dropdown-mysql ul").html("<li class='no-results active' title='[[[no database found]]]' style='display: list-item;'>[[[No database found]]]</li>");
                    }
                    $("#waiting-iconmysql").hide();
                } else {
                    $("#database-name-mysql").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                    
                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                    $("#information-icon").css("display", "inline");
                    changeFooterPostion();
                    $("#waiting-iconmysql").hide();
                }
            }
        );
});

$(document).on("click", ".database-dropdown-oracle .dropdown-toggle", function () {
    $(".database-dropdown-oracle ul").html("");
    $("#database-name-oracle").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");    
    if ($("#oracle-dsn").val() === "" || $("#admin-username").val() === "" || $("#admin-password").val() === "") {
        if ($("#oracle-dsn").val() === "") {
            $("#oracle-dsn").closest(".txt-holder").addClass("has-error");
            $("#oracle-dsn-validate").html("[[[Please select DSN]]]").show();           
        }
        if ($("#admin-username").val() === "") {
            $("#admin-username").closest(".txt-holder").addClass("has-error");
            $("#admin-username").parent().find(">.startup-validation").html("[[[Please enter admin username]]]").show();            
        }
        if ($("#admin-password").val() === "") {
            $("#admin-password").closest(".txt-holder").addClass("has-error");
            $("#admin-password").parent().find(">.startup-validation").html("[[[Please enter admin password]]]").show();            
        }
        return;
    }
    $("#waiting-icon-oracle").show();
    var databaseType = $("#database-type").val();
    doAjaxPost("POST", getAllDatabaseUrl,
        {
            data: JSON.stringify({ ServerType: databaseType, DSN: $("#oracle-dsn").val(), AdminUserName: $("#admin-username").val(), AdminPassword: $("#admin-password").val() })
        },
        function (result) {
            if (result.Data.key) {
                $("#database-error-oracle").hide();
                var items = result.Data.value;
                var option = "";
                if (items.length > 0) {
                    for (var t = 0; t < items.length; t++) {
                        option += '<option value=\"' + items[t] + '\">' + items[t] + "</option>";
                    }
                    $("#connection-validation").find(".validation-errors").html("");
                    $("#information-icon").css("display", "none");
                    $("#database-name-oracle").append(option).selectpicker("refresh");                    
                    for (var i = 0; i < $("#oracle-content-holder .database-dropdown-oracle .bootstrap-select li a .text").length ; i++) {
                        var dbTitle = $("#oracle-content-holder .database-dropdown-oracle .bootstrap-select li a .text").eq(i).text();
                        $("#oracle-content-holder .database-dropdown-oracle .bootstrap-select li a").eq(i).attr("title", dbTitle);
                    }
                } else {
                    $("#database-name-oracle").selectpicker("refresh").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                    
                    $(".database-dropdown-oracle ul").html("<li class='no-results active' title='[[[no database found]]]' style='display: list-item;'>[[[No database found]]]</li>");
                }
                $("#waiting-icon-oracle").hide();
            } else {
                $("#database-name-oracle").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                
                $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                $("#information-icon").css("display", "inline");
                changeFooterPostion();
                $("#waiting-icon-oracle").hide();
            }
        }
    );
});

$(document).on("click", ".database-dropdown-postgresql .dropdown-toggle", function () {
    $(".database-dropdown-postgresql ul").html("");
    $("#database-name-postgresql").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");  

    if ($("#postgresql-content-holder").valid()) {
        var canProceed = true;
    } else
        var canProceed = false;

    if (canProceed) {
        $("#waiting-icon-postgressql").show();
        window.serverName = $("#postgresql-servername").val();
        window.login = $("#postgresql-login").val();
        window.password = $("#postgresql-password-db").val();
        var databaseType = $("#database-type").val();
        window.databaseName = $("#postgresql-dbname").val();
        window.port = $("#postgresql-port").val();
        doAjaxPost("POST", getAllDatabaseUrl,
            {
                data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, port: window.port, userName: window.login, password: window.password })
            },
            function (result) {
                if (result.Data.key) {
                    $("#database-error-postgresql").hide();
                    var items = result.Data.value;
                    var option = "";
                    if (items.length > 0) {
                        for (var t = 0; t < items.length; t++) {
                            option += '<option value=\"' + items[t] + '\">' + items[t] + "</option>";
                        }
                        $("#connection-validation").find(".validation-errors").html("");
                        $("#information-icon").css("display", "none");
                        $("#database-name-postgresql").append(option).selectpicker("refresh");                        
                        for (var i = 0; i < $("#db-content-holder .database-dropdown-postgresql .bootstrap-select li a .text").length ; i++) {
                            var dbTitle = $("#db-content-holder .database-dropdown-postgresql .bootstrap-select li a .text").eq(i).text();
                            $("#db-content-holder .database-dropdown-postgresql .bootstrap-select li a").eq(i).attr("title", dbTitle);
                        }
                    } else {
                        $("#database-name-postgresql").selectpicker("refresh").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                 
                                       
                        $(".database-dropdown-postgresql ul").html("<li class='no-results active' title='[[[no database found]]]' style='display: list-item;'>[[[No database found]]]</li>");
                    }
                    $("#waiting-icon-postgressql").hide();
                } else {
                    $("#database-name-postgresql").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");                    
                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                    $("#information-icon").css("display", "inline");
                    changeFooterPostion();
                    $("#waiting-icon-postgressql").hide();
                }
            }
        );
    }
});



$(document).on("click", "#sql-existing-db-submit", function () {
    $(".has-error").removeClass("has-error");
    $(".validation-txt-errors").hide();
    $(".validation-errors").html("");
    $("#information-icon").css("display", "none");
    DomResize();
    var canProceed = $("#db-content-holder").valid();
    if ($("#database-name").val() == "") {
        $("#database-error").html("[[[Please select a database]]]").show();        
        return;
    }
    if (/^[a-zA-Z_0-9@~!#\$\^&()+=\-,\.\/\{\} ]+$/.test($("#database-name").val()) && !/^[\s]+|[\s]+$/g.test($("#database-name").val())) {
        canProceed = true;
    } else {
        $("#database-error").html("[[[Please avoid special characters, Leading and Trailing spaces]]]").show();        
        return;
    }
    if (canProceed) {
        showWaitingPopup($(".startup-page-conatiner"));
        $(this).prop("disabled", true);
        $("#db_loader").show();
        window.serverName = $("#txt-servername").val();
        window.IsWindowsAuthentication = $("#check-windows").val() == "windows";
        window.login = $("#txt-login").val();
        window.password = $("#txt-password-db").val();
        var databaseType = $("#database-type").val();
        var prefix = $("#table-prefix").val() === "" ? "SyncRS_" : $("#table-prefix").val();
        window.databaseName = $("#database-name").val();
        doAjaxPost("POST", connectDatabaseUrl,
            {
                data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName })
            },
            function (result) {
                if (result.Data.key) {
                    var databaseType = $("#database-type").val();
                    doAjaxPost("POST", checkTableExistsUrl,
                        {
                            data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName, Prefix: prefix })
                        },
                        function (result) {
                            var items = result.Data.value;
                            if (result.Data.key && items.length > 0) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                var html = "[[[The below table(s) already exists in the selected database. Please change the prefix or choose some other database.]]]";
                                html += "<ol class='list-area'>";
                                for (var t = 0; t < items.length; t++) {
                                    html += "<li>" + items[t] + "</li>";
                                }
                                html += "</ol>";
                                $(".message-content").html(html);
                                $("#duplicate-table-list").ejDialog("open");
                                $("#sql-existing-db-submit").prop("disabled", false);
                            } else if (!result.Data.key && items.length <=0) {
                                doAjaxPost("POST", generateSQLTablesUrl,
                                    {
                                        data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName, Prefix: prefix })
                                    },
                                    function (result) {
                                        hideWaitingPopup($(".startup-page-conatiner"));
                                        if (result.Data.key) {
                                            $(".selected").removeClass("selected");
                                            $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                            $("#db_loader").hide();
                                            $("#system-settings-db-selection-container").hide();
                                            StorageSettings();
                                            $("#txt-username").focus();
                                            window.connectionString = result.Data.value;
                                            delete window.serverName;
                                            delete window.login;
                                            delete window.password;
                                            delete window.databaseName;
                                        } else {
                                            $("#sql-existing-db-submit").prop("disabled", false);
                                            $("#db_loader").hide();
                                            $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                            $("#information-icon").css("display", "inline");
                                            changeFooterPostion();
                                        }
                                        changeFooterPostion();
                                        $("#startup-page-conatiner").css("height", $(document).height());
                                    }
                                );
                                $(".db-connect-outer-container").find(".title").html("[[[Database Creation]]]!");
                                $("#database-name").focus();
                            } else  {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                $("#db_config_generate, #db-config-submit").hide();
                                $("#sql-existing-db-submit").show().prop("disabled", false);                                
                                $("#db_loader").hide();
                                $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                $("#information-icon").css("display", "inline");
                                changeFooterPostion();
                            }
                        });
                } else {
                    hideWaitingPopup($(".startup-page-conatiner"));
                    $("#db_config_generate, #db-config-submit").hide();
                    $("#sql-existing-db-submit").show().prop("disabled", false);                    
                    $("#db_loader").hide();
                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                    $("#information-icon").css("display", "inline");
                    changeFooterPostion();
                }
            }
        );
    }
});

$(document).on("click", "#mysql-existing-db-submit", function () {
    $(".has-error").removeClass("has-error");
    $(".validation-txt-errors").hide();
    $(".validation-errors").html("");
    $("#information-icon").css("display", "none");
    DomResize();
    var canProceed = $("#mysql-content-holder").valid();
    if ($("#database-name-mysql").val() == "" || $("#mysql-odbc-dsn").val == "") {
        if ($("#database-name-mysql").val() == "") {
            $("#database-error-mysql").html("[[[Please select a database]]]").show();            
        }
        if ($("#mysql-odbc-dsn").val() == "") {
            $("#dsn-validate").html("[[[Please select DSN]]]").show();           
        }

        return;
    }
    if (/^[a-zA-Z_0-9@~!#\$\^&()+=\-,\.\/\{\} ]+$/.test($("#database-name-mysql").val()) && !/^[\s]+|[\s]+$/g.test($("#database-name-mysql").val())) {
        canProceed = true;
    } else {
        $("#database-error-mysql").html("[[[Please avoid special characters, Leading and Trailing spaces]]]");
        $("#database-error-mysql").show();
        return;
    }
    
    if (canProceed) {
        showWaitingPopup($(".startup-page-conatiner"));
        $(this).prop("disabled", true);
        $("#db_loader").show();
        window.dsn = $("#mysql-odbc-dsn").val();
        window.login = $("#mysql-username").val();
        window.password = $("#mysql-password").val();
        var databaseType = $("#database-type").val();
        var prefix = $("#table-prefix-mysql").val() === "" ? "SyncRS_" : $("#table-prefix-mysql").val();
        window.databaseName = $("#database-name-mysql").val();
        doAjaxPost("POST", connectDatabaseUrl,
            {
                data: JSON.stringify({ DSN: window.dsn, userName: window.login, password: window.password, databaseName: window.databaseName, ServerType: "MySQL", Prefix: prefix })
            },
            function (result) {
                if (result.Data.key) {
                    var databaseType = $("#database-type").val();
                    doAjaxPost("POST", checkTableExistsUrl,
                        {
                            data: JSON.stringify({ DSN: window.dsn, userName: window.login, password: window.password, databaseName: window.databaseName, ServerType: "MySQL", Prefix: prefix })
                        },
                        function (result) {
                            var items = result.Data.value;
                            if (result.Data.key && items.length > 0) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                var html = "[[[The below table(s) are already exists in the selected database. Please change the prefix or choose some other database.]]]";
                                html += "<ol class='list-area'>";
                                for (var t = 0; t < items.length; t++) {
                                    html += "<li>" + items[t] + "</li>";
                                }
                                html += "</ol>";
                                $(".message-content").html(html);
                                $("#duplicate-table-list").ejDialog("open");                               
                                $("#mysql-existing-db-submit").prop("disabled", false);
                            } else if (!result.Data.key && items.length <= 0) {
                                doAjaxPost("POST", generateSQLTablesUrl,
                                    {
                                        data: JSON.stringify({ DSN: window.dsn, userName: window.login, password: window.password, databaseName: window.databaseName, ServerType: "MySQL", Prefix: prefix })
                                    },
                                    function (result) {
                                        hideWaitingPopup($(".startup-page-conatiner"));
                                        if (result.Data.key) {
                                            $(".selected").removeClass("selected");
                                            $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                            $("#db_loader").hide();
                                            $("#system-settings-db-selection-container").hide();
                                            StorageSettings();
                                            $("#txt-username").focus();
                                            window.connectionString = result.Data.value;
                                            delete window.serverName;
                                            delete window.login;
                                            delete window.password;
                                            delete window.databaseName;
                                        } else {
                                            $("#mysql-existing-db-submit").prop("disabled", false);
                                            $("#db_loader").hide();
                                            $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                            $("#information-icon").css("display", "inline");
                                            changeFooterPostion();
                                        }
                                        changeFooterPostion();
                                        $("#startup-page-conatiner").css("height", $(document).height());
                                    }
                                );
                                $(".db-connect-outer-container").find(".title").html("[[[Database Creation]]]!");
                                $("#database-name-mysql").focus();
                            } else {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                $("#db_config_generate, #mysql-config-submit").hide();
                                $("#mysql-existing-db-submit").show().prop("disabled", false);                               
                                $("#db_loader").hide();
                                $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                $("#information-icon").css("display", "inline");
                                changeFooterPostion();
                            } 
                        });
                } else {
                    hideWaitingPopup($(".startup-page-conatiner"));
                    $("#db_config_generate, #mysql-config-submit").hide();
                    $("#mysql-existing-db-submit").show().prop("disabled", false);                    
                    $("#db_loader").hide();
                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                    $("#information-icon").css("display", "inline");
                    changeFooterPostion();
                }
            }
        );
    }

});

$(document).on("click", "#oracle-existing-db-submit", function () {
    $(".has-error").removeClass("has-error");
    $(".validation-txt-errors").hide();
    $(".validation-errors").html("");
    $("#information-icon").css("display", "none");
    DomResize();
    var canProceed = $("#oracle-content-holder").valid();
    if ($("#database-name-oracle").val() == "" || $("#oracle-dsn").val == "") {
        if ($("#database-name-oracle").val() == "") {
            $("#database-error-oracle").html("[[[Please select a database]]]").show();            
        }
        if ($("#oracle-dsn").val() == "") {
            $("#oracle-dsn-validate").html("[[[Please select DSN]]]").show();            
        }

        return;
    }
    if (/^[a-zA-Z_0-9@~!#\$\^&()+=\-,\.\/\{\} ]+$/.test($("#database-name-oracle").val()) && !/^[\s]+|[\s]+$/g.test($("#database-name-oracle").val())) {
        canProceed = true;
    } else {
        $("#database-error-oracle").html("[[[Please avoid special characters, Leading and Trailing spaces]]]").show();        
        return;
    }
    if (canProceed) {
        showWaitingPopup($(".startup-page-conatiner"));
        $(this).prop("disabled", true);
        $("#db_loader").show();
        var databaseType = $("#database-type").val();
        var dsn = $("#oracle-dsn").val();
        var adminUserName = $("#admin-username").val();
        var adminPassword = $("#admin-password").val();
        var clientUserName = $("#database-name-oracle").val();
        var clientPassword = $("#database-password").val();
        var prefix = $("#table-prefix-oracle").val() === "" ? "SyncRS_" : $("#table-prefix-oracle").val();
        window.databaseName = $("#database-name-oracle").val();
        doAjaxPost("POST", connectOracleDatabaseUrl,
            {
                data: JSON.stringify({ ServerType: databaseType, DSN: dsn, AdminUserName: adminUserName, AdminPassword: adminPassword })
            },
            function (result) {
                if (result.Data.key) {
                    doAjaxPost("POST", checkTableExistsUrl,
                        {
                            data: JSON.stringify({ ServerType: databaseType, DSN: dsn, AdminUserName: adminUserName, AdminPassword: adminPassword, ClientUserName: clientUserName, ClientPassword: clientPassword, Prefix: prefix })
                        },
                        function (result) {
                            var items = result.Data.value;
                            if (result.Data.key && items.length > 0) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                var html = "[[[The below table(s) are already exists in the selected database. Please change the prefix or choose some other database.]]]";
                                html += "<ol class='list-area'>";
                                for (var t = 0; t < items.length; t++) {
                                    html += "<li>" + items[t] + "</li>";
                                }
                                html += "</ol>";
                                $(".message-content").html(html);
                                $("#duplicate-table-list").ejDialog("open");                               
                                $("#oracle-existing-db-submit").prop("disabled", false);
                            } 
                            else if (!result.Data.key && items.length <= 0) {
                                doAjaxPost("POST", generateSQLTablesUrl,
                                    {
                                        data: JSON.stringify({ ServerType: databaseType, DSN: dsn, AdminUserName: adminUserName, AdminPassword: adminPassword, ClientUserName: clientUserName, ClientPassword: clientPassword, Prefix: prefix })
                                    },
                                    function (result) {
                                        hideWaitingPopup($(".startup-page-conatiner"));
                                        if (result.Data.key) {
                                            $(".selected").removeClass("selected");
                                            $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                            $("#db_loader").hide();
                                            $("#system-settings-db-selection-container").hide();
                                            StorageSettings();
                                            $("#txt-username").focus();
                                            window.connectionString = result.Data.value;
                                            delete window.serverName;
                                            delete window.login;
                                            delete window.password;
                                            delete window.databaseName;
                                        } else {
                                            $("#oracle-existing-db-submit").prop("disabled", false);
                                            $("#db_loader").hide();
                                            $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                            $("#information-icon").css("display", "inline");
                                            changeFooterPostion();
                                        }
                                        changeFooterPostion();
                                        $("#startup-page-conatiner").css("height", $(document).height());
                                    }
                                );
                                $(".db-connect-outer-container").find(".title").html("[[[Database Creation]]]!");
                                $("#database-name-oracle").focus();
                            }else {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                $("#db_config_generate, #oracle-config-submit").hide();
                                $("#oracle-existing-db-submit").show().prop("disabled", false);                                
                                $("#db_loader").hide();
                                $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                $("#information-icon").css("display", "inline");
                                changeFooterPostion();
                            }
                        });
                } else {
                    hideWaitingPopup($(".startup-page-conatiner"));
                    $("#db_config_generate, #oracle-config-submit").hide();
                    $("#oracle-existing-db-submit").show().prop("disabled", false);                    
                    $("#db_loader").hide();
                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                    $("#information-icon").css("display", "inline");
                    changeFooterPostion();
                }
            }
        );
    }

});

$(document).on("click", "#postgresql-existing-db-submit", function () {
    $(".has-error").removeClass("has-error");
    $(".validation-txt-errors").hide();
    $(".validation-errors").html("");
    $("#information-icon").css("display", "none");
    DomResize();
    var canProceed = $("#postgresql-content-holder").valid();
    if ($("#database-name-postgresql").val() == "") {
        $("#database-error-postgresql").html("[[[Please select a database]]]").show();        
        return;
    }
    if (/^[a-zA-Z_0-9@~!#\$\^&()+=\-,\.\/\{\} ]+$/.test($("#database-name-postgresql").val()) && !/^[\s]+|[\s]+$/g.test($("#database-name-postgresql").val())) {
        canProceed = true;
    } else {
        $("#database-error-postgresql").html("[[[Please avoid special characters, Leading and Trailing spaces]]]").show();        
        return;
    }
    if (canProceed) {
        showWaitingPopup($(".startup-page-conatiner"));
        $(this).prop("disabled", true);
        $("#db_loader").show();
        window.serverName = $("#postgresql-servername").val();
        window.login = $("#postgresql-login").val();
        window.password = $("#postgresql-password-db").val();
        var databaseType = $("#database-type").val();
        window.port = $("#postgresql-port").val();
        var prefix = $("#table-prefix-postgresql").val() === "" ? "SyncRS_" : $("#table-prefix-postgresql").val();
        window.databaseName = $("#database-name-postgresql").val();
        doAjaxPost("POST", connectDatabaseUrl,
            {
                data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, port: window.port, userName: window.login, password: window.password, databaseName: window.databaseName })
            },
            function (result) {
                if (result.Data.key) {
                    var databaseType = $("#database-type").val();
                    doAjaxPost("POST", checkTableExistsUrl,
                        {
                            data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, port: window.port, userName: window.login, password: window.password, databaseName: window.databaseName, Prefix: prefix })
                        },
                        function (result) {
                            var items = result.Data.value;
                            if (result.Data.key && items.length > 0) {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                var html = "[[[The below table(s) already exists in the selected database. Please change the prefix or choose some other database.]]]";
                                html += "<ol class='list-area'>";
                                for (var t = 0; t < items.length; t++) {
                                    html += "<li>" + items[t] + "</li>";
                                }
                                html += "</ol>";
                                $(".message-content").html(html);
                                $("#duplicate-table-list").ejDialog("open");                               
                                $("#postgresql-existing-db-submit").prop("disabled", false);
                            } else if (!result.Data.key && items.length <= 0) {
                                doAjaxPost("POST", generateSQLTablesUrl,
                                    {
                                        data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, port: window.port, userName: window.login, password: window.password, databaseName: window.databaseName, Prefix: prefix })
                                    },
                                    function (result) {
                                        hideWaitingPopup($(".startup-page-conatiner"));
                                        if (result.Data.key) {
                                            $(".selected").removeClass("selected");
                                            $("ul li[data-move-to='startup-page-two']").addClass("selected");
                                            $("#db_loader").hide();
                                            $("#system-settings-db-selection-container").hide();
                                            StorageSettings();
                                            $("#txt-username").focus();
                                            window.connectionString = result.Data.value;
                                            delete window.serverName;
                                            delete window.login;
                                            delete window.password;
                                            delete window.databaseName;
                                        } else {
                                            $("#postgresql-existing-db-submit").prop("disabled", false);
                                            $("#db_loader").hide();
                                            $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                            $("#information-icon").css("display", "inline");
                                            changeFooterPostion();
                                        }
                                        changeFooterPostion();
                                        $("#startup-page-conatiner").css("height", $(document).height());
                                    }
                                );
                                $(".db-connect-outer-container").find(".title").html("[[[Database Creation]]]!");
                                $("#database-name-postgresql").focus();
                            } else {
                                hideWaitingPopup($(".startup-page-conatiner"));
                                $("#db_config_generate, #postgresql-config-submit").hide();
                                $("#postgresql-existing-db-submit").show().prop("disabled", false);                                
                                $("#db_loader").hide();
                                $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                                $("#information-icon").css("display", "inline");
                                changeFooterPostion();
                            }
                        });
                } else {
                    hideWaitingPopup($(".startup-page-conatiner"));
                    $("#db_config_generate, #postgresql-config-submit").hide();
                    $("#postgresql-existing-db-submit").show().prop("disabled", false);                    
                    $("#db_loader").hide();
                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "inline");
                    $("#information-icon").css("display", "inline");
                    changeFooterPostion();
                }
            }
        );
    }
});

function CloseDuplicateListBox() {
    $("#duplicate-table-list").ejDialog("close");
}

$(document).on("change", "#mysql-odbc-dsn", function () {
    if ($("#mysql-odbc-dsn").val() != "") {
        $("#dsn-validate").html("").show();        
    }
});

$(document).on("click", "#info-icon-postgressql", function () {
    $("#prefix-message-postgresql").css("display", "block");
});


$(document).on("click", "#info-icon", function () {
    $("#prefix-message").css("display", "block");
});

$(document).on("click", function (e) {
    if ($(e.target).attr("id") == "info-icon-mysql") {
        $("#prefix-message-mysql").css("display", "block");
    }
    else {
        $("#prefix-message-mysql").css("display", "none");
    }
    if ($(e.target).attr("id") == "info-icon-dsn") {
        $("#dsn-messgage").css("display", "block");
    }
    else {
        $("#dsn-messgage").css("display", "none");
    }
});

$(document).on("click", function (e) {
    if ($(e.target).attr("id") === "info-icon-oracle") {
        $("#prefix-message-oracle").css("display", "block");
    } else {
        $("#prefix-message-oracle").css("display", "none");
    }
    if ($(e.target).attr("id") === "info-icon-dsn-oracle") {
        $("#dsn-message-oracle").css("display", "block");
    } else {
        $("#dsn-message-oracle").css("display", "none");
    }
});

$(document).on("click", "#oracle-odbc-dropdown button.dropdown-toggle", function () {
    var dsn = $("#dsn-count").val();
    if (dsn <= 0) {
        $("#oracle-odbc-dropdown ul").html("<li class='no-results active' title='[[[no dsn found]]]' style='display: list-item;'>[[[No dsn found]]]</li>");
        $("#database-name-oracle").selectpicker("refresh");
    }
});

$(document).on("click", "#mysql-odbc-dropdown button.dropdown-toggle", function () {
    var dsn = $("#dsn-count").val();
    if (dsn <= 0) {
        $("#mysql-odbc-dropdown ul").html("<li class='no-results active' title='[[[no dsn found]]]' style='display: list-item;'>[[[No dsn found]]]</li>");
        $("#database-name-mysql").selectpicker("refresh");
    }
});

function DomResize() {
    $("#startup-page-conatiner").height($("#system-settings-general").height() + $("#base-footer-div").height());
}


//To  stop animation in radio-button on page rendering
$(document).on("click", ".css-radio", function () {
    $(this).siblings("label").removeClass("notransition");
});
$(document).on("click", "#database-type-dropdown, .proceed-button", function () {
    $(".css-radio").siblings("label").addClass("notransition");
});

$(document).on("click", "#include-no", function () {
    $("#delete-resource-info").css("display", "none");
});

$(document).on("click", "#include-yes", function () {
    $("#delete-resource-info").css("display", "block");
});

function StorageSettings() {
    if (isAzureApplication) {
        validate_storage_type();
    }
    else {
        $("#system-settings-filestorage-container").slideDown("slow");
    }
}