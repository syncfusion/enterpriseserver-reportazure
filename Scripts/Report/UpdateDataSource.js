$(function () {
    if ($(parent.window).width() > 1400) {
        $("#datasource-update").addClass("iframe-content-height");
    }
    else {
        $("#datasource-update").removeClass("iframe-content-height");
    }
    parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", true);
    window.parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "hide");
    $(document).on('click', '.bootstrap-select ul li.add-new', function () {
        $(this).parent().prev().addClass("input-value");
        parent.$("#update-data-source-popup-iframe").contents().find('.bootstrap-select ul').find(".select-data-source").show();
        parent.$("#update-data-source-popup-iframe").contents().find('.bootstrap-select ul').find(".divider").show();
        parent.$("#datasource-popup").ejDialog("open");
        parent.$("#datasource-popup_wrapper").ejWaitingPopup("show");
    });
    $(document).on('click', '#add-new-datasource', function () {
        parent.$("#update-data-source-popup-iframe").contents().find("select").removeClass("current-select");
        $(this).parent().prev().children().find("select").addClass("current-select");
        parent.$("#update-data-source-popup-iframe").contents().find('.bootstrap-select ul').find(".select-data-source").show();
        parent.$("#update-data-source-popup-iframe").contents().find('.bootstrap-select ul').find(".divider").show();
        parent.$("#datasource-popup").ejDialog("open");
        parent.$("#datasource-popup_wrapper").ejWaitingPopup("show");
    });
    $(document).on('click', '.dropdown-toggle', function (e) {
        parent.$("#update-data-source-popup-iframe").contents().find("select").removeClass("current-select");
        $('.bootstrap-select.open ul .add-new').remove();
        $(this).parent().prev().addClass("current-select");
        parent.$("#update-data-source-popup-iframe").contents().find('.bootstrap-select ul').find(".select-data-source").show();
        parent.$("#update-data-source-popup-iframe").contents().find('.bootstrap-select ul').find(".divider").show();
    });
    $(document).on('keyup', '.update-datasource.open input', function () {
        var availableDataSources = [];
        $('.bootstrap-select.open ul .add-new').remove();
        var enteredValue = $(this).val();
        var compareValue = enteredValue.toLowerCase();
        if (enteredValue == "") {
            $(".select-data-source").show();
            $(".divider").show();
        }
        else {
            $(".select-data-source").hide();
            $(".divider").hide();
        }
        $(".bootstrap-select.open").find("ul li").each(function () {

            if ($(this).children("a").children("span.text").text() != "") {
                availableDataSources.push($(this).children("a").children("span.text").text().toLowerCase());
            }

        });
        var isValueEqual = $.inArray(compareValue, availableDataSources);
        if (compareValue != "") {
            if (isValueEqual == -1) {
                $('.bootstrap-select.open ul').prepend('<li class="add-new" data-original-index=""><a class="" tabindex="0"><span class="text">' + enteredValue + ' (New Data Source)</span><span class="glyphicon glyphicon-ok check-mark"></span></li>');
                if ($(".bootstrap-select.open").find("li:not('.hide')").length > 2) {
                    $('.bootstrap-select.open ul .divider').show();
                    if ($('.bootstrap-select.open ul li').hasClass("no-results")) {
                        $('.bootstrap-select.open ul .no-results').hide();
                        $('.bootstrap-select.open ul .divider').hide();
                    }
                }
                else {
                    $('.bootstrap-select.open ul .divider').hide();
                }
            }
            else {
                $('.bootstrap-select.open ul .add-new').remove();
                $('.bootstrap-select.open ul .divider').hide();

            }
        }
    });

    $(document).on('click', '#share-datasource', function () {
        $(".success-message, .error-message").html("");
        window.parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "show");
        var itemId = $(this).attr("data-item-id");
        var selectContents = $("#new-datasource-tab-content").contents().find("select");
        var changedDataSources = [];
        var changedInfo;
        $(selectContents).each(function (index, value) {
            if ($(this).attr("data-original-value") != $(this).val()) {
                changedInfo = { DataSourceId: this.value, Name: $(this).attr("name") };
                changedDataSources.push(changedInfo);
            }
        });
        $.ajax({
            type: "POST",
            url: updatedatasource,
            data: { itemId: itemId, updatedDataSources: changedDataSources },
            success: function (data) {
                if (data.Success) {
                    $(".success-message").html("[[[Data source(s) updated successfully.]]]").css("display", "block");
                    parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", true);
                    $(selectContents).each(function (index, value) {
                        $(this).attr("data-original-value", $(this).val());
                    });
                    $(".error-message").css("display", "none");
                    window.parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "hide");
                }
                else {
                    $(".error-message").html("[[[Internal server error. Please try again.]]]").css("display", "block");
                    $(".success-message").css("display", "none");
                    window.parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "hide");
                }
            }
        });
    });

    $(document).on('change', '.update-datasource', function () {
        $(".success-message, .error-message").html("");
        var dataOriginalValue = [];
        var changedValue = [];
        var isValueChanged = $("#new-datasource-tab-content").contents().find("select");
        $(isValueChanged).each(function (index, value) {
            dataOriginalValue.push($(this).attr("data-original-value"));
            changedValue.push($(this).val());
        });
        if (dataOriginalValue.toString() == changedValue.toString()) {
            parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", true);
        }
        else {
            parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", false);
        }
    });

    var filterSettings = [];
    filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: categoryName });
    var listItems = "";
    $(".report-dropdown").append($("<span class='col-sm-4 no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:255px; position:absolute; height:30px; width:30px; top:3px'></span>"));
    $.ajax({
        type: "POST",
        url: getReportUrl,
        data: { filterCollection: filterSettings },
        success: function (result, data) {
            $("#selected_report").attr("disabled", false);
            $("span.loader-gif").remove();
            var reports = result.result;
            for (var t = 0; t < reports.length; t++) {
                if (reports[t].Name === itemName) {
                    listItems += '<option value="' + reports[t].Id + '" selected="selected">' + reports[t].Name + '</option>';
                } else {
                    listItems += '<option value="' + reports[t].Id + '">' + reports[t].Name + '</option>';
                }
                
            }
            $("#selected_report").html("");
            $("#selected_report").html('<option value="" selected="selected" class="hide-option" disabled>[[[Select Report]]]</option>' + listItems).selectpicker("refresh");
            addTitleForReport();
        }
    });
    if ($("#selected_category option:selected").val() != "") {
        $("#category-message").css("display", "none");
    }
});

function closeUpdateDataSourcePopup() {
    parent.$("#update-data-source-popup").ejDialog("close");
    parent.$("#update-data-source-popup-iframe").contents().find("html").text("");
}

function refreshSelectPicker() {
    $("select.update-datasource").selectpicker("refresh");
    parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", false);
    parent.$("#update-data-source-popup-iframe").contents().find(".input-value").removeClass("input-value");
    window.parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "hide");
}

$(document).on("change", "#selected_category", function () {
    $(".success-message, .error-message").html("");
    $("#report-datasources").hide();
    parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", true);
    var selected = $(this).find("option:selected").text();
    $("#selected_report").attr("disabled", true);
    $(".report-dropdown").append($("<span class='col-sm-4 no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:255px; position:absolute; height:30px; width:30px; top:3px'></span>"));
    var filterSettings = [];
    filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: selected });
    var invalid = undefined;
    var listItems = "";
    $.ajax({
        type: "POST",
        url: getReportUrl,
        data: { filterCollection: filterSettings },
        success: function (result, data) {
            $("#selected_report").attr("disabled", false);
            $("span.loader-gif").remove();
            var reports = result.result;
            for (var t = 0; t < reports.length; t++) {
                listItems += '<option value="' + reports[t].Id + '">' + reports[t].Name + '</option>';
            }
            $("#selected_report").html("");
            $("#selected_report").html('<option value="" selected="selected" class="hide-option" disabled>[[[Select Report]]]</option>' + listItems).selectpicker("refresh");
            addTitleForReport();
        }
    });
    if ($("#selected_category option:selected").val() != "") {
        $("#category-message").css("display", "none");
    }
});

$(document).on("change", "#selected_report", function () {
        $(".success-message, .error-message").html("");
        parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", true);
        var selected = $(this).find("option:selected").text();
        var itemId = $(this).find("option:selected").val();
        if (itemId != "") {
            $(".item-name").html(selected);
            $(".item-name").attr("title", selected);
        } else {
            $(".item-name").html("");
            $(".item-name").attr("title", "");
        }
        $(".report-dropdown").append($("<span class='col-sm-4 no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:255px; position:absolute; height:30px; width:30px; top:3px'></span>"));
        $("#share-datasource").attr("data-item-id", itemId);
        if ($("#selected_report option:selected").val() != "") {
            $("#report-message").css("display", "none");
        }
        var sorted = [{ name: "Name", direction: "ascending" }];
        $.when($.ajax({ type: "POST", url: getdatasourcedetailsofreport, data: { itemId: itemId } }), $.ajax({ type: "POST", url: getdatasourceUrl, data: { sorted: sorted } })).done(function(data, dataSourceObj) {
            if (data[0].Success) {
                $("span.loader-gif").remove();
                var dataSourceNames = data[0].Value;
                var datasourceList = dataSourceObj[0].result;
                var reportDatasourcesContent =
                    "<tr><th>[[[Data Source Name]]]</th><th colspan='2'>[[[Select Data Source]]]</th></tr>";
                var dataSourceContent = "";
                var datasourcePermissionFlag = false;
                $.each(dataSourceNames,
                    function(i, dataSourceName) {
                        dataSourceContent += "<tr><td>" +
                            dataSourceName.DataSourceName +
                            "</td><td><div id='data-source - container'><select data-live-search='true' class='selectpicker bottom-margin30 update-datasource form-control' data-container='body' name='" +
                            dataSourceName.DataSourceName +
                            "'data-original-value='" +
                            dataSourceName.DataSourceId +
                            "'>";
                        datasourcePermissionFlag = false;
                        $.each(datasourceList,
                            function(i, dataSource) {
                                if (dataSource.Name === dataSourceName.Name) {
                                    dataSourceContent += "<option value='" +
                                        dataSource.Id +
                                        "' selected='selected'>" +
                                        dataSource.Name +
                                        "</option>";
                                    datasourcePermissionFlag = true;
                                } else {
                                    dataSourceContent += "<option value='" +
                                        dataSource.Id +
                                        "'>" +
                                        dataSource.Name +
                                        "</option>";
                                }
                            });

                        if (!datasourcePermissionFlag) {
                            dataSourceContent += "<option value='" +
                                dataSourceName.DataSourceId +
                                "' selected='selected'>" +
                                dataSourceName.Name +
                                "</option>";
                        }

                        dataSourceContent += "</select></div></td><td><span id='add-new-datasource' class='su-add' data-toggle='tooltip' data-placement='left' title='[[[Add new Data Source]]]'></span></td></tr>";
                    });

                reportDatasourcesContent += dataSourceContent;
                $("#report-datasources").html(reportDatasourcesContent);
                $('.update-datasource').selectpicker('refresh');
                $("[data-toggle='tooltip']").tooltip();
                $("#report-datasources").show();
            } else {
                $("span.loader-gif").remove();
                parent.messageBox("su-update-data-source",
                    "[[[Unable to get Data Source(s) of the Report]]]",
                    "[[[Internal server error. Please try again.]]]",
                    "success",
                    function() {
                        parent.onCloseMessageBox();
                    });
            }
        });
    });

function addTitleForCategory() {
    $("#selected_category").selectpicker("refresh");
    for (var i = 0; i < $(".category-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".category-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".category-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function addTitleForReport() {
    $("#selected_report").selectpicker("refresh");
    for (var i = 0; i < $(".report-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".report-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".report-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}