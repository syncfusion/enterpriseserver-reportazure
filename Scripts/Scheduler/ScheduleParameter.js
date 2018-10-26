$(document).ready(function () {
        if (parameterObj.length == 0) {
            url = recurrenceType;
            enableTimeIntervalOption();
        }
});

$(document).on("change", ".use-default", function () {
    if ($(this).is(":checked")) {
        $("#" + $(this).attr("dataAttrId")).parent().removeClass("has-error");
        $("#" + $(this).attr("dataAttrId")).attr("disabled", "disabled");
    } else {
        $("#" + $(this).attr("dataAttrId")).removeAttr("disabled");
    }
});

$(document).on("focusout", ".form-control", function () {
    if ($(this).val() === "") {
        $(this).parent().addClass("has-error");
    } else {
        $(this).parent().removeClass("has-error");
    }
});

$(document).on("change", ".form-control", function () {
    if ($(this).val() === "") {
        $(this).parent().addClass("has-error");
    } else {
        $(this).parent().removeClass("has-error");
    }
});

function validateParameters() {
    var validFlag = true;
    for (var par = 0; par < parameterObj.length; par++) {
        var parameterHasValue = !isEmptyOrWhitespace($("#" + parameterObj[par].Name).val());

        if (!parameterHasValue && $("#" + parameterObj[par].Name + "-use-default").is(":checked") === false) {
            $("#" + parameterObj[par].Name).parent().addClass("has-error");
            validFlag = false;
        }
    }
    return validFlag;
}
