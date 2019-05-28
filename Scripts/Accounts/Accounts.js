var userAgent = navigator.userAgent;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");
var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
var ruleName, rules, needMargin = true;
var containerAdjusted;

$(document).ready(function () {
    $("body").ejWaitingPopup();
    $("body").ejWaitingPopup("show");
    $("body").ejWaitingPopup("hide");
    removePlaceholder();
    addPlacehoder("body");

    $("#login-username, #key-input").bind("keyup", function (event) {
        var str = $(this).val();
        var regex = new RegExp(/[#\%\&\*\|\:\"\'\<\>\?\[\]\\\/\+]/);
        if (regex.test(str)) {
            if ($("#login-username").length > 0) {
                $(".special-char-msg-login").html("[[[Please avoid special characters]]]");
            }
            else {
                $(".special-char-msg").html("[[[Please avoid special characters]]]");
            }
        }
        else {
            $(".special-char-msg").html("");
            $(".special-char-msg-login").html("");
        }
    });

    if (regexIe8.test(userAgent)) {
        $("#drop-down").css("margin-top", "-10px");
        if (window.innerWidth > 1400) {
            if ($("#windows-login").length > 0) {
                $(".login-form").css("margin-bottom", "-80px");
                $("#login-button").css("margin-top", "10px");
            }
            else {
                $(".login-form").css("margin-bottom", "-50px");
                $("#login-button").css("margin-top", "10px");
            }
        }
        else {
            if ($("#windows-login").length > 0) {
                $(".login-form").css("margin-bottom", "-80px");
                $("#login-button").css("margin-top", "10px");
            }
            else {
                $(".login-form").css("margin-bottom", "-50px");
            }
        }
        $(".pwd-success").parent().css("margin-bottom", "25px");
    }
    else {
        if ($("#windows-login").length > 0) {
            if (window.innerWidth < 1400) {
                $(".login-form").css("margin-bottom", "0px");
            }
        }
        else {
            $(".login-form").css("margin-bottom", "0px");
        }
    }

    if ($(".submit-button").length > 0) {
        if (window.innerWidth < 1400) {
            $(".login-form").css("margin-bottom", "-40px");
        }
        else {
            $(".login-form").css("margin-bottom", "-50px");
        }
    }

    $("#remember-me").on("click", function () {
        if (isSafari) {
            $(this).find("label").toggleClass("check");
        }
    });

    $(document).on("click", ".submit-button, .redirect-login", function () {
        $("body").ejWaitingPopup("show");
    });
});


$('#login-username, #login-password').on('change', function () {
    if ($(this).val() != '') {
        $(this).next(".placeholder").removeClass("show").addClass("hide");
    }
});

function FormValidate() {
    if ($("#login-form").valid()) {
        $("body").ejWaitingPopup("show");
    }
    $(".error-message.validation-holder").html("<span class='su su-login-error'></span> [[[Access is denied]]]");
    $(".error-message").css("display", "none");
    return $("#login-form").valid();
}

$(document).on("click", "#login-button-windows", function () {
    $(".error-message.validation-holder").html("<span class='su su-login-error'>&nbsp;&nbsp;[[[Access is denied]]]</span>");
    $(".error-message").css("display", "none");
    $.ajax({
        type: "GET",
        url: rootUrl + "/windowsauthentication/account/login",
        data: {},
        cache: false,
        contentType: "application/json; charset=utf-8",
        statusCode: {
            401: function () {
                $("body").ejWaitingPopup("hide");
                $(".error-message").css("display", "block");
            },
            503: function () {
                $("body").ejWaitingPopup("hide");
                $(".error-message.validation-holder").html("<span class='su su-login-error'>&nbsp;&nbsp;[[[Service UnAvailable]]]</span>");
                $(".error-message").css("display", "block");
            },
            500: function () {
                $("body").ejWaitingPopup("hide");
                $(".error-message").css("display", "block");
            },
            404: function () {
                $("body").ejWaitingPopup("hide");
                $(".error-message").css("display", "block");
            },
            200: function (result) {
                $("body").ejWaitingPopup("hide");
                if (result.responseText.toLowerCase() == "true") {
                    window.location.href = getParameterByName("ReturnUrl");
                } else {
                    $("body").ejWaitingPopup("hide");
                    $(".error-message").css("display", "block");
                }
            },
            304: function (result) {
                $("body").ejWaitingPopup("hide");
                if (result.responseText.toLowerCase() == "true") {
                    window.location.href = "/reports";
                } else {
                    $("body").ejWaitingPopup("hide");
                    $(".error-message.validation-holder").html("<span class='su su-login-error'>&nbsp;&nbsp;[[[Service UnAvailable]]]</span>");
                    $(".error-message").css("display", "block");
                }
            }
        },

        dataType: "json",
        success: function (result) { }
    });
    return false;
});

$(window).load(function () {
    var docWidth = window.innerWidth;
    if (docWidth < 480) {
        $(".ad-text").css('width', '80%');
    }
    if ($("#email-settings-msg").length > 0) {
        if (window.innerWidth <= 1400) {
        }
        else {
            $(".lower-divider").css("top", "40px");
            $(".forgot-password-caption").css("top", "55px");
        }
    }
});

function textboxHighlight(element) {
    for (var i = 0; i < $('#password_policy_rules').find('li>span').length; i++) {
        if ($($('#password_policy_rules').find('li>span')[i]).attr('class') == "su-tick")
            $(element).closest('div').removeClass("has-error");
        else
            rules = "unsatisfied-rule";
    }
    if (rules != "" && rules != undefined) {
        $(element).closest('div').addClass("has-error");
        rules = "";
    }
}

function textboxUnhighlight(element) {
    for (var i = 0; i < $('#password_policy_rules').find('li>span').length; i++) {
        if ($($('#password_policy_rules').find('li>span')[i]).attr('class') != "su-tick")
            rules = "unsatisfied-rule";
        if ($($('#password_policy_rules').find('li>span')[i]).attr('class') == "su-tick")
            $(element).closest('div').removeClass("has-error");
    }
    if (rules != "" && rules != undefined) {
        $(element).closest('div').addClass("has-error");
        rules = "";
    }
    $(element).closest('div').next("div").find("span").html("");
}

$(window).resize(function () {
    var docHeight = window.innerHeight;
    var docWidth = window.innerWidth;
    if (docWidth < 550) {
        $(".ad-text").css('margin-left', '10%');
    }
    else {
        $(".ad-text").css('margin-left', '0');
    }
    if ($("#password_policy_rules").length > 0) {
        if (isSafari) {
            $("#password_policy_rules").css("top", "50px");
        }
        else {
            if (window.innerWidth < 990) {
                $("#password_policy_rules").css("top", "40px");
            }
            else if (window.innerWidth < 1400) {
                $("#password_policy_rules").css("top", "70px");
            }
            else {
                $("#password_policy_rules").css("top", "80px");
            }
        }
    }
});

function IsValidUserNameOrEmail(inputString) {
    var regex = new RegExp(/[#\%\&\*\|\:\"\'\<\>\?\[\]\\\/\+]/);
    return !regex.test(inputString);
}

//IE9 placeholder support function
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

function removePlaceholder() {
    if ($("#hidden-username").val() != '') {
        $("#login-username").val($("#hidden-username").val());
    }

    if ($("#forgot-username").val() != '') {
        $("#key-input").val($("#forgot-username").val());
    }
}

$("#login-form").validate({
    errorElement: "span",
    onkeyup: function (element, event) {
        if (event.keyCode != 9) $(element).valid();
        else true;
    },
    onfocusout: function (element) { $(element).valid(); },
    rules: {
        "username": {
            required: true
        },
        "password": {
            required: true
        }
    },
    highlight: function (element) {
        $(element).closest(".input-field-form").addClass("has-error");
        $("#error-username").css("display", "none");
    },
    unhighlight: function (element) {
        $(element).closest(".input-field-form").removeClass("has-error");
        $(element).parent().find("span.validation-holder").html("");
    },
    errorPlacement: function (error, element) {
        $(element).parent().find("span.validation-holder").html(error);
        $("#error-password").css("display", "none");
    },
    messages: {
        "username": {
            required: "[[[Please enter username]]]"
        },
        "password": {
            required: "[[[Please enter password]]]"
        }
    }
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    var urlValue = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    if (urlValue == null)
        urlValue = reportUrl;
    return urlValue;
}