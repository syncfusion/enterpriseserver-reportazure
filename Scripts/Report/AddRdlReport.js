$(function () {
    window.isEditPopup = false;
    $(document).on("click", "#save_rdl_with_datasource", function (e) {
        updateReportWithDataSource();
    });
    $(document).on("click", ".select-datasource-btns", function (e) {
        var selectedDataSource = "";
        if ($(this).val() == "Update") {
            selectedDataSource = $(this).siblings("span.selected-datasource").attr("data-key");
        }

        onSelectDataSourceClick($(this).data("name"), selectedDataSource);

    });

    $(document).on("click", ".select-dataset-btns", function (e) {
        var selectedDataset = "";
        if ($(this).val() == "Update") {
            selectedDataset = $(this).siblings("span.selected-dataset").attr("data-key");
        }

        onSelectDatasetClick($(this).data("name"), selectedDataset);

    });

    $(document).on("keyup", ".edit-field", function () {
        if (onSelectValidation()) {
            $("#publish_report").removeAttr("disabled");
        }
        else {
            $("#publish_report").attr("disabled", "disabled");
        }
    });

    //Validation for create report
    $(document).on("keyup", ".edit-field", function () {
        if (enableCreateButton()) {
            $("#create-report-in-designer").removeAttr("disabled");
        }
        else {
            $("#create-report-in-designer").prop("disabled", "disabled");
        }
    });
    $(document).on("change", "#selected_category", function () {
        if (enableCreateButton()) {
            $("#create-report-in-designer").removeAttr("disabled");
        }
        else {
            $("#create-report-in-designer").prop("disabled", "disabled");
        }
    });
    function enableCreateButton() {
        if ($("#selected_category").find("option:selected").val() != undefined && $(".edit-field").val() != "") {
            return true;
        }
        else {
            return false;
        }
    }

    $("#createReportPopupHolder input").keypress(function (e) {
        if (e.which == 13 && e.target.id != "publish_report") {
            if ($(".NoStyleCloseClick").is(":focus")) {
                closeNewRDLAddPopup();
            } else {
                addRDLReport();
            }
        }
    });

    $(document).on("keyup", ".edit-text-fields", function (e) {
        if (window.isEditPopup) {
            if ($(this).attr("id") === "file_name") {
                if (window.editReportData.ReportName !== $(this).val()) {
                    window.editReportData.IsReportNameChanged = true;
                }
                else {
                    window.editReportData.IsReportNameChanged = false;
                }
            }
            if ($(this).attr("id") === "file-description") {
                if (window.editReportData.ReportDescription !== $(this).val()) {
                    window.editReportData.IsReportDescriptionChanged = true;
                }
                else {
                    window.editReportData.IsReportDescriptionChanged = false;
                }
            }
            reportEditValidation();
        }
        else {
            (onSelectValidation()) ? $("#publish_report").removeAttr("disabled") : $("#publish_report").attr("disabled", "disabled");
        }
    });

    $(document).on("change", "#selected_category", function (e) {
        if (window.isEditPopup) {
            if (window.editReportData.CategoryId !== $(this).val()) {
                window.editReportData.IsCategoryChanged = true;
            }
            else {
                window.editReportData.IsCategoryChanged = false;
            }
            reportEditValidation();
        }
    });

    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $(".add-report-form").validate({
        errorElement: 'div',
        onkeyup: function(element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }  
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#report_name_validation_error").parent('div').removeClass('has-error');
            } else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "file_name": {
                isRequired: true,
                isValidName: true
            }
            
        },
        messages: {
            "file_name": {
                isRequired: "[[[Please enter report name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('td').removeClass('has-error');
            $(element).closest('td').find("div.validation-messages").html("");
        },
        errorPlacement: function (error, element) {            
            $(element).closest('td').find("div.validation-messages").html(error.html());
        }
    });
    $("#edit-report-form").validate({
        errorElement: 'div',
        onkeyup: function(element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#report_name_validation_error").parent('div').removeClass('has-error');
                $("#report_name_validation_error").html("");
            } else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "file_name": {
                isRequired: true,
                isValidName: true
            }

        },
        messages: {
            "file_name": {
                isRequired: "[[[Please enter report name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('td').removeClass('has-error');
            $(element).closest('td').find("div.validation-messages").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest('td').find("div.validation-messages").html(error.html());
        }
    });
});

function reportEditValidation() {
    if ((window.editReportData.IsReportNameChanged || window.editReportData.IsCategoryChanged || window.editReportData.IsReportDescriptionChanged || window.editReportData.IsDataSourceChanged || window.editReportData.IsDatasetChanged) && !window.editReportData.IsFileChanged) {
        window.isEdited = true;
    }
    else if (window.editReportData.IsFileChanged && onSelectValidation()) {
        window.isEdited = true;
    } else {
        window.isEdited = false;
    }
    if (window.isEdited && $("#file_name").val() != "") {
        $("#publish_report").removeAttr("disabled");
    } else {
        $("#publish_report").attr("disabled", true);
    }
}

function addRDLReport() {
    if ($('#publish_report').attr("disabled")!==undefined) {
        return;
    }
    var reportScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
    var isValidForm = true;
    var iframe_content = $("#report_upload_iframe").contents().find("body");
    var fileName = $("#file_name").val().trim();
    if ($("#selected_category").val() == null || $("#selected_category").val() == "") {
        if ($("#emtpyCategoryList").length == 0) {
            $("#CategoryMessage").removeClass("hide").addClass("show");
        }
        isValidForm = false;
    } else {
        $("#CategoryMessage").removeClass("show").addClass("hide");
    }
    if (!$(".add-report-form,#edit-report-form").valid())
        isValidForm = false;
    if ($("#publishedFileName").attr("value") == "" || $("#publishedFileName").attr("value") == "none") {
        iframe_content.find("#upload_browse_file").closest('span').addClass("has-error");
        iframe_content.find("#browse_file").closest('div').addClass("error-file-upload");
        $("#uploadValidation").html("Please upload the report");
        isValidForm = false;
    } else {
        iframe_content.find("#upload_browse_file").closest('span').removeClass("has-error");
        $("#uploadValidation").html("");
    }

    if (isValidForm) {
        window.parent.$("#report_popup_wrapper").ejWaitingPopup("show");
        var isAlreadyExist = false;
        var postData = {};
        var dataSourceList, datasetList;
        var dataSources = [];
        var datasets = [];
        var dataSource, dataset = 0;
        var categoryId = $("#selected_category option:selected").val();
        if (window.isEditPopup) {
            if (window.editReportData.IsReportNameChanged || window.editReportData.IsCategoryChanged) {
                var itemId = window.editReportData.ReportId;
                $.ajax({
                    type: "POST",
                    url: isItemExistinCategoryForUpdateUrl,
                    data: { categoryId: categoryId, itemName: fileName , itemId: itemId},
                    async: false,
                    success: function (data) {
                        if (data.Data) {
                            window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                            $("#report_name_validation_error").parent('div').addClass("has-error");
                            $("#report_name_validation_error").html("[[[A report with the same name already exists in this category]]]");
                            isAlreadyExist = true;
                            return;
                        }
                    }
                });
            }
            if (!isAlreadyExist) {
                $("#report_name_validation_error").parent('div').removeClass("has-error");
                postData.reportId = window.editReportData.ReportId;
                postData.isReportNameChanged = window.editReportData.IsReportNameChanged;
                if (window.editReportData.IsReportNameChanged) {
                    postData.fileName = $("#file_name").val();
                }
                postData.isCategoryChanged = window.editReportData.IsCategoryChanged;
                if (window.editReportData.IsCategoryChanged) {
                    postData.categoryId = categoryId;
                }
                postData.isReportDescriptionChanged = window.editReportData.IsReportDescriptionChanged;
                if (window.editReportData.IsReportDescriptionChanged) {
                    postData.fileDescription = $("#file-description").val();
                }
                postData.isFileChanged = window.editReportData.IsFileChanged;
                if (window.editReportData.IsFileChanged) {
                    postData.temporaryFileName = $("#publishedFileName").val();
                    dataSourceList = $("#datasource_list_table tr");
                    if (dataSourceList.length !== 0) {
                        for (dataSource = 0; dataSource < dataSourceList.length; dataSource++) {
                            dataSources.push({ Name: $(dataSourceList[dataSource]).attr("data-key"), DataSourceId: $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key") });
                        }
                    }
                    datasetList = $("#dataset_list_table tr");
                    if (datasetList.length !== 0) {
                        for (dataset = 0; dataset < datasetList.length; dataset++) {
                            datasets.push({ Name: $(datasetList[dataset]).attr("data-key"), DatasetId: $(datasetList[dataset]).find("span.selected-dataset").attr("data-key") });
                        }
                    }
                    postData.versionComment = $("#comment").val();
                }
                postData.isDataSourceChanged = window.editReportData.IsDataSourceChanged;
                if (!window.editReportData.IsFileChanged && window.editReportData.IsDataSourceChanged) {
                    dataSourceList = $("#datasource_list_table tr");
                    if (dataSourceList.length !== 0) {
                        for (dataSource = 0; dataSource < dataSourceList.length; dataSource++) {
                            if ($(dataSourceList[dataSource]).attr("data-exist-id") !== $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key")) {
                                dataSources.push({ Name: $(dataSourceList[dataSource]).attr("data-key"), DataSourceId: $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key") });
                            }
                        }
                    }
                }
                postData.isDatasetChanged = window.editReportData.IsDatasetChanged;
                if (!window.editReportData.IsFileChanged && window.editReportData.IsDatasetChanged) {
                    datasetList = $("#dataset_list_table tr");
                    if (datasetList.length !== 0) {
                        for (dataset = 0; dataset < datasetList.length; dataset++) {
                            if ($(datasetList[dataset]).attr("data-exist-id") !== $(datasetList[dataset]).find("span.selected-dataset").attr("data-key")) {
                                datasets.push({ Name: $(datasetList[dataset]).attr("data-key"), DatasetId: $(datasetList[dataset]).find("span.selected-dataset").attr("data-key") });
                            }
                        }
                    }
                }
                postData.dataSourceList = JSON.stringify(dataSources);
                postData.datasetList = JSON.stringify(datasets);
                $.ajax({
                    type: "POST",
                    url: editreportUrl,
                    data: postData,
                    success: function (data) {
                        window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                        if (data.result.Status) {
                            closeNewRDLAddPopup();
                            parent.messageBox("su-report", "[[[Update Report]]]", "[[[Report has been updated successfully.]]]", "success", function () {
                                var gridName = window.parent.$('#item-grid-container').attr("data-grid-name");
                                if (gridName == "reports") {
                                    reportScope.refreshCategorySection(categoryId);
                                }
                                parent.onCloseMessageBox();
                            });
                        } else {
                            closeNewRDLAddPopup();
                            parent.messageBox("su-report", "[[[Update Report]]]", "[[[Failed to update report. Please try again later.]]]", "success");
                        }
                    },
                    error: function (e) {
                        window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                        closeNewRDLAddPopup();
                        parent.messageBox("su-report", "[[[Update Report]]]", "[[[Failed to update report. Please try again later.]]]", "success");
                    }
                });
            }
        } else {
            $.ajax({
                type: "POST",
                url: isItemExistinCategoryUrl,
                data: { categoryId: categoryId, itemName: $("#file_name").val() },
                async: false,
                success: function (data) {
                    if (data.Data) {
                        window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                        $("#report_name_validation_error").parent('div').addClass("has-error");
                        $("#report_name_validation_error").html("[[[A report with the same name already exists in this category]]]");
                        isAlreadyExist = true;
                        return;
                    }
                }
            });
            if (!isAlreadyExist) {
                dataSourceList = $("#datasource_list_table tr");
                if (dataSourceList.length !== 0) {
                    for (dataSource = 0; dataSource < dataSourceList.length; dataSource++) {
                        dataSources.push({ Name: $(dataSourceList[dataSource]).attr("data-key"), DataSourceId: $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key") });
                    }
                    postData.dataSourceList = JSON.stringify(dataSources);
                }
                datasetList = $("#dataset_list_table tr");
                if (datasetList.length !== 0) {
                    for (dataset = 0; dataset < datasetList.length; dataset++) {
                        datasets.push({ Name: $(datasetList[dataset]).attr("data-key"), DatasetId: $(datasetList[dataset]).find("span.selected-dataset").attr("data-key") });
                    }
                    postData.datasetList = JSON.stringify(datasets);
                }
                postData.fileName = $("#file_name").val();
                postData.description = $("#file-description").val();
                postData.selectedCategoryId = categoryId;
                postData.temporaryFileName = $("#publishedFileName").val();
                if (dataSourceList.length !== 0 || datasetList.length !== 0) {
                    $.ajax({
                        type: "POST",
                        url: addsharedrdlreportUrl,
                        data: postData,
                        success: function (data) {
                            window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                            if (data.result.Status) {
                                closeNewRDLAddPopup();
                                parent.messageBox("su-report", "[[[Add Report]]]", "[[[Report has been added successfully.]]]", "success", function () {
                                    var gridName = window.parent.$('#item-grid-container').attr("data-grid-name");
                                    if (gridName == "reports") {
                                        reportScope.refreshCategorySection(categoryId);
                                    }
                                    parent.onCloseMessageBox();
                                });
                            } else {
                                closeNewRDLAddPopup();
                                parent.messageBox("su-report", "[[[Add Report]]]", "[[[Failed to add report. Please try again later.]]]", "success");
                            }
                        },
                        error: function (e) {
                            window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                            closeNewRDLAddPopup();
                            parent.messageBox("su-report", "[[[Add Report]]]", "[[[Failed to add report. Please try again later.]]]", "success");
                        }
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        url: addembeddedrdlreportUrl,
                        data: postData,
                        success: function (data) {
                            window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                            if (data.result.Status) {
                                closeNewRDLAddPopup();
                                parent.messageBox("su-report", "Add Report", "Report has been added successfully.", "success", function () {
                                    var gridName = window.parent.$('#item-grid-container').attr("data-grid-name");
                                    if (gridName == "reports") {
                                        reportScope.refreshCategorySection(categoryId);
                                    }
                                    parent.onCloseMessageBox();
                                });
                            } else {
                                closeNewRDLAddPopup();
                                parent.messageBox("su-report", "[[[Add Report]]]", "[[[Failed to add report. Please try again later.]]]", "success");
                            }
                        },
                        error: function (e) {
                            window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                            closeNewRDLAddPopup();
                            parent.messageBox("su-report", "[[[Add Report]]]", "[[[Failed to add report. Please try again later.]]]", "success");
                        }
                    });
                }
            }
        }
    }
}



function closeNewRDLAddPopup() {
    window.parent.$('#report_popup').ejDialog("close");
    if ($("#publishedFileName").val() != "none") {
        $.ajax({
            type: "POST",
            url: deletetemporaryrdlreportUrl,
            async: false,
            data: { fileName: $("#publishedFileName").val() },
            success: function (data) {
                $("#publishedFileName").val("");
            }
        });
    }
}

function onSelectDataSourceClick(sourceName, selectedDataSource) {
    parent.$("#select_datasource_popup").ejDialog("open");
    parent.$("#select_datasource_popup_wrapper").ejWaitingPopup("show");
    parent.$("#datasource_iframe").attr("src", reportselectdatasourceUrl + "?sourceName=" + sourceName + "&selectedDataSource=" + selectedDataSource);
}


function onSelectDatasetClick(sourceName, selectedDataset) {
    parent.$("#addDataSetDom").ejDialog("open");
    parent.$("#addDataSetDom_wrapper").ejWaitingPopup("show");
    parent.$("#dataset_popup").attr("src", reportselectdatasetUrl + "?sourceName=" + sourceName + "&selectedDataset=" + selectedDataset);
}

function onSelectionOfDataSource(element, object) {
    $(element).find(".selected-datasource").attr("data-key", object.Id).html(object.Name);
    var name = $(element).find(".selected-datasource").text();
    $(element).find(".selected-datasource").attr({"data-original-title":name , "data-toggle": "tooltip" });
    $(element).find(".selected-datasource[data-toggle='tooltip']").tooltip();
    $(element).find(".select-datasource-btns").attr("value", "[[[Update]]]");
    $(element).find(".select-datasource-btns").focus();
    if (window.isEditPopup) {
        if (!window.editReportData.IsFileChanged) {
            dataSourceSelectionValidationOnEdit();
        } else {
            reportEditValidation();
        }
    }
    else if (onSelectValidation()) {
        $("#publish_report").removeAttr("disabled");
    }
}

function onSelectionOfDataset(element, object) {
    $(element).find(".selected-dataset").attr("data-key", object.Id).html(object.Name);
    var name = $(element).find(".selected-dataset").text();
    $(element).find(".selected-dataset").attr({ "data-original-title": name, "data-toggle": "tooltip" });
    $(element).find(".selected-dataset[data-toggle='tooltip']").tooltip();
    $(element).find(".select-dataset-btns").attr("value", "[[[Update]]]");
    $(element).find(".select-dataset-btns").focus();
    if (window.isEditPopup) {
        if (!window.editReportData.IsFileChanged) {
            datasetSelectionValidationOnEdit();
        } else {
            reportEditValidation();
        }
    }
    else if (onSelectValidation()) {
        $("#publish_report").removeAttr("disabled");
    }
}

function dataSourceSelectionValidationOnEdit() {
    var dataSources = $("#datasource_list_table tr");
    for (var dataSource = 0; dataSource < dataSources.length; dataSource++) {
        if ($(dataSources[dataSource]).attr("data-exist-id") !== $(dataSources[dataSource]).find(".selected-datasource").attr("data-key")) {
            window.editReportData.IsDataSourceChanged = true;
            reportEditValidation();
            return;
        }
    }
    window.editReportData.IsDataSourceChanged = false;
    reportEditValidation();
}

function datasetSelectionValidationOnEdit() {
    var datasets = $("#dataset_list_table tr");
    for (var dataset = 0; dataset < datasets.length; dataset++) {
        if ($(datasets[dataset]).attr("data-exist-id") !== $(datasets[dataset]).find(".selected-dataset").attr("data-key")) {
            window.editReportData.IsDatasetChanged = true;
            reportEditValidation();
            return;
        }
    }
    window.editReportData.IsDatasetChanged = false;
    reportEditValidation();
}

function onSelectValidation() {
    if ($("#report_upload_iframe").contents().find("#rdl_file_upload_btn").attr("disabled") == undefined || $("#report_upload_iframe").contents().find("#upload_browse_file").val().toLowerCase() == "browse file path") {
        return false;
    }
    if ($("#file_name").val() == "") {
        return false;
    }
    var dataSources = $(".select-datasource-btns");
    for (var dataSource = 0; dataSource < dataSources.length; dataSource++) {
        if ($(dataSources[dataSource]).attr("value") == "Select") {
            return false;
        }
    }
    var datasets = $(".select-dataset-btns");
    for (var dataset = 0; dataset < datasets.length; dataset++) {
        if ($(datasets[dataset]).attr("value") == "Select") {
            return false;
        }
    }
    return true;
}

function createEditRdlPopup(data) {
    //window.parent.$('#report_popup_wrapper').ejWaitingPopup("show");
    window.editReportData = data;
    window.isEditPopup = true;
    window.editReportData.IsReportNameChanged = false;
    window.editReportData.IsCategoryChanged = false;
    window.editReportData.IsReportDescriptionChanged = false;
    window.editReportData.IsFileChanged = false;
    window.editReportData.IsDataSourceChanged = false;
    $("#version_comment").show();
    $("#comment").attr("readonly", true);
    $("#file_name").val(data.ReportName);
    $("#file-description").val(data.ReportDescription);
    $("#rdl_filename").val(data.ReportFileName);
    $("#publishedFileName").val(data.ReportFileName);
    $("#report_upload_iframe").contents().find("#upload_browse_file").attr("value", data.ReportFileName);
    $('#selected_category').val(data.CategoryId.toLowerCase());
    $("#selected_category").selectpicker("refresh");
    if (data.DataSources.length != 0) {
        var html = "";
        for (var dataSource = 0; dataSource < data.DataSources.length; dataSource++) {
            html += '<tr data-key="' + data.DataSources[dataSource].DataSourceName + '" data-exist-id="' + data.DataSources[dataSource].DataSourceId + '"><td><input type="button" class="btn btn-info select-datasource-btns small-left-margin" value="Update" data-key="' + data.DataSources[dataSource].DataSourceId + '" data-name="' + data.DataSources[dataSource].DataSourceName + '"></td><td><span class="rdl-datasource-name">' + data.DataSources[dataSource].DataSourceName + '</span> </td><td>:</td><td><span class="selected-datasource" data-key="' + data.DataSources[dataSource].DataSourceId + '" data-original-title = "' + data.DataSources[dataSource].Name + '" style = "width:auto; max-width: 527px; overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:top; padding-left:5px" data-toggle = "tooltip">' + data.DataSources[dataSource].Name + '</span></td></tr>';
        }
        $("#datasource_list_table").html(html);
        $("#datasource_list").show();
        $("#datasource_list #datasource_list_table .selected-datasource[data-toggle='tooltip']").tooltip();
    }

    if (data.Datasets.length != 0) {
        var html = "";
        for (var dataset = 0; dataset < data.Datasets.length; dataset++) {
            html += '<tr data-key="' + data.Datasets[dataset].DataSetName + '" data-exist-id="' + data.Datasets[dataset].DataSetId + '"><td><input type="button" class="btn btn-info select-dataset-btns small-left-margin" value="Update" data-key="' + data.Datasets[dataset].DataSetId + '" data-name="' + data.Datasets[dataset].DataSetName + '"></td><td><span class="rdl-dataset-name">' + data.Datasets[dataset].DataSetName + '</span> </td><td>:</td><td><span class="selected-dataset" data-key="' + data.Datasets[dataset].DataSetId + '" data-original-title = "' + data.Datasets[dataset].Name + '" style = "width:auto; max-width: 527px; overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:top; padding-left:5px" data-toggle = "tooltip">' + data.Datasets[dataset].Name + '</span></td></tr>';
        }
        $("#dataset_list_table").html(html);
        $("#dataset_list").show();
        $("#dataset_list #dataset_list_table .selected-dataset[data-toggle='tooltip']").tooltip();
    }
}

function reportUploadComplete(reportUploadStatus) {
    if (reportUploadStatus.Status) {
        $("#uploadValidation").html("<span class='ReportUploadSuccessMessage'>[[[Report has been uploaded successfully.]]]</span>");
        $("#publishedFileName").val(reportUploadStatus.UploadedReportName);
        if (reportUploadStatus.IsSharedDataSource) {
            var html = "";
            for (var dataSource = 0; dataSource < reportUploadStatus.SharedDataSourceList.length; dataSource++) {
                html += '<tr data-key="' + reportUploadStatus.SharedDataSourceList[dataSource] + '"><td><input type="button" class="btn primary-button select-datasource-btns small-left-margin" value="[[[Select]]]" data-name="' + reportUploadStatus.SharedDataSourceList[dataSource] + '"></td><td><span class="rdl-datasource-name">' + reportUploadStatus.SharedDataSourceList[dataSource] + '</span></td><td> :</td><td><span class="selected-datasource" style = "max-width: 527px; overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:middle; padding-left:5px; max-width: 527px;" ></span></td></tr>';
            }
            $("#datasource_list_table").html(html);
            $("#datasource_list").show();
        }
        else {
            $("#datasource_list").hide();
        }

        if (reportUploadStatus.IsSharedDataSet) {
            var html = "";
            for (var dataset = 0; dataset < reportUploadStatus.SharedDataSetList.length; dataset++) {
                html += '<tr data-key="' + reportUploadStatus.SharedDataSetList[dataset] + '"><td><input type="button" class="btn btn-primary select-dataset-btns small-left-margin" value="[[[Select]]]" data-name="' + reportUploadStatus.SharedDataSetList[dataset] + '"></td><td><span class="rdl-dataset-name">' + reportUploadStatus.SharedDataSetList[dataset] + '</span></td><td> :</td><td><span class="selected-dataset" style = "max-width: 527px; overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:middle; padding-left:5px; max-width: 527px;" ></span></td></tr>';
            }
            $("#dataset_list_table").html(html);
            $("#dataset_list").show();
        }
        else {
            $("#dataset_list").hide();
        }

        if (reportUploadStatus.IsSharedDataSet && reportUploadStatus.IsSharedDataSource) {
            $("#publish_report").attr("disabled", "disabled");
        }
        else {
            if (onSelectValidation())
            {
                $("#publish_report").removeAttr("disabled");
            }
        }
    }
    else {
        $("#uploadValidation").html("<span class='ErrorMessage'>[[[Error while uploading report. Please try again.]]]</span>");
    }
}

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        $('.PopupClose').click();
        window.parent.$("#createButton").focus();
    }
});

//Create button in Add report dialog
$(document).on("click", "#create-report-in-designer", function () {
    var categoryId = $("#selected_category option:selected").val();
    var fileName = $("#file_name").val().trim();
    var isAlreadyExist = false;
    $.ajax({
        type: "POST",
        url: isItemExistinCategoryUrl,
        data: { categoryId: categoryId, itemName: fileName },
        async: false,
        success: function (data) {
            if (data.Data) {
                window.parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                $("#report_name_validation_error").parent('div').addClass("has-error");
                $("#report_name_validation_error").html("[[[A report with the same name already exists in this category]]]");                
                isAlreadyExist = true;
                return;
            }            
        }
    });
    $("#report-name").val($('#file_name').val());
    $("#category-name").val($("#selected_category option:selected").text());
    $("#report-description").val($("#file-description").val());
    if($("#selected-dataset").find("option:selected").text() == "Select Dataset") {
        var datasetName = "";
        $("#dataset-name").val(datasetName);
    }
    else {
        $("#dataset-name").val($("#selected-dataset").find("option:selected").text());
        $("#dataset-guid").val($("#selected-dataset").find("option:selected").val());
    }
    $("#edit-value").val(false);
    if (!isAlreadyExist) {   
        $("#report_name_validation_error").parent('div').removeClass('has-error');
        $("#report_name_validation_error").html("");
        var url = reportDesignerUrl;
        $("#create-report-form").attr("action", url);
        $("#create-report-form").submit();
        parent.$("#report_popup").ejDialog("close");
    }    
});