$(document).ready(function () {
    addPlacehoder(".ump-url-div");
    addPlacehoder(".client-id-div");
    addPlacehoder(".client-secret-div");
    if ($("#is-ump-url-exists").val() == "true") {
        if ($("#is-ump-configured").val() == "true") {
            $(".system-startUp-settings-bg").removeAttr("style");
            $("#system-settings-db-selection-container").css("display", "block");
        } else {
            window.location.href = $("#redirect-ump-url").val();
        }
    } else {
        $(".system-startUp-settings-bg").removeAttr("style");
        $("#system-settings-db-selection-container").css("display", "none");
        $("#system-settings-ump-container").css("display", "block");
    }

    $.validator.addMethod("isApplicationUrlValid", function (value, element) {
        var givenUrl = $("#protocol-type").val() + "://" + value;
        var url = parseURL(givenUrl);
        if (isValidUrl(givenUrl) == false || parseInt(url.port) > 65535)
            return false;
        else
            return true;
    }, "[[[Please enter the valid URL.]]]");

    $("#ump-settings-fields-container").validate({
        focusInvalid: false,
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                $(element).valid();
                isKeyUp = false;
            }
        },

        rules: {
            umpurl: {
                isRequired: true,
                isApplicationUrlValid: true,
                maxlength: 255
            },
            clientid: {
                isRequired: true
            },
            clientsecret: {
                isRequired: true
            }
        },

        onfocusout: function (element) { $(element).valid(); },

        highlight: function (element) {
            $(element).closest("div").addClass("has-error");
        },

        unhighlight: function (element) {
            $(element).closest("div").removeClass("has-error");
            $(element).parent().find("span.startup-validation").html("");
            $(element).parent().find("span.startup-validation").css("display", "none");
        },
        errorPlacement: function (error, element) {
            $(element).parent().find("span.startup-validation").html(error.html());
            $(element).parent().find("span.startup-validation").css("display", "block");
        },

        messages: {
            umpurl: {
                isRequired: "[[[Please enter the URL.]]]",
                maxlength: "[[[URL should be less than 255 characters.]]]"
            },
            clientid: {
                isRequired: "[[[Please enter client id]]]"
            },
            clientsecret: {
                isRequired: "[[[Please enter client secret]]]"
            }
        }
    });
});

function parseURL(str) {
    var o = parseURL.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseURL.options = {
    strictMode: true,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

function isValidUrl(url) {
    var regexExpression = /^((ftp|http|https?):\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+(\.[a-z]{2,6})?(:\d{1,5})?(\/[a-zA-Z0-9]+[a-zA-Z0-9]*(\.[a-z]{2,8})?)*?$/gm;
    var ipAddressRegex = /(http:\/\/|https:\/\/)([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){3}?(:\d{1,5})?$/gm;
    var hostNameRegex = /^(http|https):\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,63}(:[0-9]{1,5})?(\/.*)?$/gm;
    var localHostRegex = /^(http:\/\/|https:\/\/)[A-Za-z0-9-_]{3,}(?:\:\d+)?$/gm;
    if (!(ipAddressRegex.test(url) || hostNameRegex.test(url) || localHostRegex.test(url) || regexExpression.test(url))) {
        return false;
    } else {
        return true;
    }
}

var systemSettingsApp = angular.module("systemSettingsApp", []);
systemSettingsApp.controller("SystemSettingsController", ['$scope', '$http', function ($scope, $http) {
    $scope.SaveUmsSettingsData = function ($event) {
        if ($event.keyCode == 13 || $event.type == "click") {
            $event.preventDefault();
            var umsDetails = {
                UmsUrl: $("#protocol-type").val() + "://" + $("#ump-url").val(),
                ClientId: $("#txt-clientId").val(),
                ClientSecret: $("#txt-clientSecret").val()
            };
            if ($(".ump-settings-fields-container").valid()) {
                var elem = $(".startup-page-conatiner");
                elem.ejWaitingPopup({ text: " " });
                $(".e-text").append('<span class="configuration-status"></span>');
                elem.ejWaitingPopup("show");
                $("#ex-ump-details").val(JSON.stringify(umsDetails));
                testUmsSettingsData = { umsDetails: $("#ex-ump-details").val() };
                var testResult;
                if ($(".client-id-div").css("display") === "none") {
                    var testUmsVal =
                    $http.post(testUmsUrlIsConfigured, { url: umsDetails.UmsUrl })
                    .success(function (response) {
                        testResult = response;
                        testResult = testResult.toLocaleLowerCase();
                        if (testResult === "true") {
                            elem.ejWaitingPopup("hide");
                            $(".client-id-div, .client-secret-div").slideDown("slow");
                        } else {
                            if ($("#is-server-upgrade").val() === "true") {
                                $http.post(redirectToUmsUrl, { umsDetails: umsDetails, isNewUms: true, isNewDs: false })
                                .success(function (response) {
                                    if (response.Status === true) {
                                        window.location.href = response.Url;
                                    } else {
                                        elem.ejWaitingPopup("hide");
                                        $(".ump-validate").css("display", "block");
                                    }
                                });
                            } else {
                                $http.post(redirectToUmsUrl, { umsDetails: umsDetails, isNewUms: true, isNewDs: true })
                                .success(function (response) {
                                    if (response.Status === true) {
                                        window.location.href = response.Url;
                                    } else {
                                        elem.ejWaitingPopup("hide");
                                        $(".ump-validate").css("display", "block");
                                    }
                                });
                            }
                        }
                    });
                } else {
                    $http.post(testUmsSettingsUrl, testUmsSettingsData)
                    .success(function (response) {
                        testResult = response;
                        testResult = testResult.toLocaleLowerCase();
                        if (testResult === "true") {
                            elem.ejWaitingPopup("hide");
                            $("#system-settings-ump-container").hide();
                            if ($("#is-server-upgrade").val() === "true") {
                                $http.post(redirectToUmsUrl, { umsDetails: umsDetails, isNewUms: false, isNewDs: false })
                                .success(function (response) {
                                    if (response.Status === true) {
                                        window.location.href = response.Url;
                                    } else {
                                        elem.ejWaitingPopup("hide");
                                        $(".ump-validate").css("display", "block");
                                    }
                                });
                            } else {
                                $("#system-settings-db-selection-container").slideDown("slow");
                            }
                        } else {
                            elem.ejWaitingPopup("hide");
                            $(".ump-validate").css("display", "block");
                        }
                    });
                }
            }
            return false;
        }
    }
}]);