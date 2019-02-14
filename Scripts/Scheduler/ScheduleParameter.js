debugger;
$(document).ready(function () {
        if (parameterObj.length == 0) {
            url = recurrenceType;
            enableTimeIntervalOption();
        }
        var reportParamType = window.reportParamType;
        var reportElementType = window.reportElementType;
        for (var i = 0; i < window.parameterObj.length; i++) {
            if (window.parameterObj[i].ReportParameterData == null && window.parameterObj[i].DataType == reportParamType.DateTime) {
                $("#" + window.parameterObj[i].Name).ejDatePicker({
                    value: new Date(window.parameterObj[i].Values)
                });
            }
            else if (window.parameterObj[i].ReportParameterData == null && window.parameterObj[i].DataType == reportParamType.Boolean) {
                if (window.parameterObj[i].Values.length > 0 && window.parameterObj[i].Values[0] == "true") {
                    $("#true-" + window.parameterObj[i].Name).ejRadioButton({ size: "medium", checked: true });
                    $("#true-" + window.parameterObj[i].Name).val("true");
                    $("#false-" + window.parameterObj[i].Name).val("false");
                    $("#false-" + window.parameterObj[i].Name).ejRadioButton({ size: "medium" });
                }
                else if (window.parameterObj[i].Values.length > 0) {
                    $("#false-" + window.parameterObj[i].Name).ejRadioButton({ size: "medium", checked: true });
                    $("#false-" + window.parameterObj[i].Name).val("true");
                    $("#true-" + window.parameterObj[i].Name).val("false");
                    $("#true-" + window.parameterObj[i].Name).ejRadioButton({ size: "medium" });
                }
                else {
                    $("#false-" + window.parameterObj[i].Name).ejRadioButton({ size: "medium" });
                    $("#true-" + window.parameterObj[i].Name).ejRadioButton({ size: "medium" });
                }
            }
            else if (window.parameterObj[i].ReportParameterData != null && window.parameterObj[i].ReportParameterData.length > 0) {
                var listItems = "";
                for (var j = 0; j < window.parameterObj[i].ReportParameterData.length; j++) {
                    listItems += '<option value="' + window.parameterObj[i].ReportParameterData[j].ValueField + '">' + window.parameterObj[i].ReportParameterData[j].DisplayField + '</option>';
                }

                $("#" + window.parameterObj[i].Name).html(listItems);
                window.parameterObj[i].ReportParameterData.forEach(function (item, index) {
                    if (item.IsSelected)
                        $("#" + window.parameterObj[i].Name).val(item.ValueField);
                });

                $("#" + window.parameterObj[i].Name).selectpicker("refresh");
                if (window.parameterObj[i].Values != null) {
                    for (var k = 0; k < window.parameterObj[i].Values.length; k++) {
                        $("#" + window.parameterObj[i].Name).selectpicker('val', window.parameterObj[i].Values);
                    }
                }
            } else if (window.parameterObj[i].Values != null) {
                $("#" + window.parameterObj[i].Name).val(window.parameterObj[i].Values);
            }
        }
});

$(document).on("change", ".use-default", function () {
    if ($(this).is(":checked")) {
        if ($(this).attr("dataAttrType") == "RadioButton") {
            $("#true-" + $(this).attr("dataAttrId")).ejRadioButton("disable");
            $("#false-" + $(this).attr("dataAttrId")).ejRadioButton("disable");
        } else if ($(this).attr("dataAttrType") == "DateTime") {
            $("#" + $(this).attr("dataAttrId")).ejDatePicker("disable");
        } else if ($(this).attr("dataAttrType") == "Textbox") {
            $("#" + $(this).attr("dataAttrId")).parent().removeClass("has-error");
            $("#" + $(this).attr("dataAttrId")).attr("disabled", "disabled");
        } else {
            $("#" + $(this).attr("dataAttrId")).attr("disabled", "disabled");
            $("#" + $(this).attr("dataAttrId")).selectpicker("refresh");
        }
    }
    else {
        if ($(this).attr("dataAttrType") == "RadioButton") {
            $("#true-" + $(this).attr("dataAttrId")).ejRadioButton("enable");
            $("#false-" + $(this).attr("dataAttrId")).ejRadioButton("enable");
        } else if ($(this).attr("dataAttrType") == "DateTime") {
            $("#" + $(this).attr("dataAttrId")).ejDatePicker("enable");
        } else {
            $("#" + $(this).attr("dataAttrId")).removeAttr("disabled");
            $("#" + $(this).attr("dataAttrId")).selectpicker("refresh");
        }
    }
});


$(document).on("focusout", ".form-control", function () {
    if ($(this).val() === "") {
        $(this).parent().addClass("has-error");
    } else {
        $(this).parent().removeClass("has-error");
    }
});

$('.hasdependent').change(function () {

    var paramname = $(".hasdependent").attr("id");
    var paramvalue = $(".hasdependent").val();

    $.ajax({
        type: "POST",
        url: getdependentparameter,
        async: false,
        data: { itemId: createdItemId, name: paramname, value: paramvalue },
        success: function (data) {
            for (var i = 0; i < data.Parameters.length; i++) {
                if (data.Parameters[i].ReportParameterData !== null && data.Parameters[i].ReportParameterData.length > 0) {
                    var listItems = "";
                    for (var j = 0; j < data.Parameters[i].ReportParameterData.length; j++) {
                        listItems += '<option value="' + data.Parameters[i].ReportParameterData[j].ValueField + '">' + data.Parameters[i].ReportParameterData[j].DisplayField + '</option>';
                    }
                    $("#" + data.Parameters[i].Name).html(listItems);
                    $("#" + data.Parameters[i].Name).selectpicker("refresh");
                }
            }
        }
    });
});

$(document).on("change", ".form-control", function () {
    if ($(this).val() === "") {
        $(this).parent().addClass("has-error");
    } else {
        $(this).parent().removeClass("has-error");
    }
});
$(document).on("keyup", ".form-control", function (event) {
    if ($(this).val() != "" && $(this).val().indexOf('=') == 0) {
        $(this).parent().removeClass("has-error");
        if ($(this).parent().next().find(".material-checkbox").prop("disabled") == true) {
            $(this).parent().next().find(".material-checkbox").prop("disabled", false);
        }
        $(this).parent().next().find(".material-checkbox").prop("checked", true);
   }
    else if($(this).val() == ""){
        $(this).parent().addClass("has-error");
        $(this).parent().next().find(".material-checkbox").prop("checked", false);
        if($(this).parent().next().find(".parameter-tool-tip").length > 0)
        {
            $(this).parent().next().find(".material-checkbox").prop("disabled", true);
        }
    }
    else if ($(this).val() != "" ) {
        $(this).parent().removeClass("has-error");
    }
});

function validateParameters() {
    var validFlag = true;
    for (var par = 0; par < parameterObj.length; par++) {
        var parameterHasValue = !isEmptyOrWhitespace($("#" + parameterObj[par].Name).val());

        if (!parameterHasValue && $("#" + parameterObj[par].Name).val() == undefined) {
            if ($("#" + parameterObj[par].Name).val() == null) {
                parameterHasValue = false;
            }
            else {
                parameterHasValue = !isEmptyOrWhitespace($("#" + parameterObj[par].Values[0]));
            }
        }
        if (!parameterHasValue && $("#" + parameterObj[par].Name + "-use-default").is(":checked") === false) {
            $("#" + parameterObj[par].Name).parent().addClass("has-error");
            validFlag = false;
        }
    }
    return validFlag;
}

$(document).on("click", ".parameter-name", function (e) {
    e.stopPropagation();
});