$(function () {
    $("#comment").attr("readonly", true);

    $(document).on("click", ".select-datasource-btns", function (e) {
        var selectedDataSource = "";
        if ($(this).val() == "Update") {
            selectedDataSource = $(this).siblings("span.selected-datasource").attr("data-key");
        }
        onSelectDataSourceClick($(this).data("name"), selectedDataSource);
    });

    $(document).on("keyup", ".text-field", function (e) {
        if (window.isEditPopup) {
            if ($(this).attr("id") === "file_name") {
                if (window.editDatasetData.DatasetName !== $(this).val().trim()) {
                    window.editDatasetData.IsDatasetNameChanged = true;
                }
                else {
                    window.editDatasetData.IsDatasetNameChanged = false;
                }
            }
            if ($(this).attr("id") === "file-description") {
                if (window.editDatasetData.DatasetDescription !== $(this).val()) {
                    window.editDatasetData.IsDatasetDescriptionChanged = true;
                }
                else {
                    window.editDatasetData.IsDatasetDescriptionChanged = false;
                }
            }
            datasetEditValidation();
        }
        else {
            (onSelectValidation()) ? $("#publish_file").removeAttr("disabled") : $("#publish_file").attr("disabled", "disabled");
        }
    });

    $(document).on("click", ".PopupClose", function (e) {
        $("#addDataSetDom").find("iframe").contents().find("html").html("");
        eDialog = parent.$("#addDataSetDom").data("ejDialog");
        eDialog.close();
    });

    $.validator.addMethod("isValidName", function (value, element) {
        return parent.IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !parent.isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $("#editItemForm").validate({
        errorElement: 'div',
        onkeyup: function(element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#validate-name").parent('span').removeClass('has-error');
                $("#validate-name").text("");
            } else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "Name": {
                isRequired: true,
                isValidName: true
            }     
        },
        messages: {
            "Name": {
                isRequired: "[[[Please enter dataset name]]]"
            }
        },
        highlight: function (element) {            
            $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {          
            $(element).closest('td').removeClass('has-error');
            $(element).closest('td').find("div.validation-message").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest('td').find("div.validation-message").html(error.html());
        }
    });

    $('#file_name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if ($("#cancelEditDataSet").is(":focus")) {
                closeNewDatasetAddPopup();
            } else {
                EditDataset();
            }
            return false;
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if (e.target.id != "browse_file") {
                $('.PopupClose').click();
                window.parent.focus();
            } else {
                $('#name').focus();
            }
        }
    });

    $(document).on("click", "#name", function () {
        $("#browse_file").trigger('click');
		$("#browse_file").focus();
    });
});

function onChangeValidation() {
    if ($("#name_change_validation").val() == "true" || $("#description_change_validation").val() == "true" || $("#source_change_validation").val() == "true") {
        $("#publish_file").attr("disabled", false);
    }
    else {
        $("#publish_file").attr("disabled", true);
    }
}

function datasetUploadComplete(datasetUploadStatus) {
    if (datasetUploadStatus.Status) {
        $("#uploadValidation").html("<span class='ReportUploadSuccessMessage'>[[[Dataset has been uploaded successfully.]]]</span>");
        $("#publishedFileName").val(datasetUploadStatus.UploadedReportName);
        if (datasetUploadStatus.IsSharedDataSource) {
            var html = "";
            for (var dataSource = 0; dataSource < datasetUploadStatus.SharedDataSourceList.length; dataSource++) {
                html += '<tr data-key="' + datasetUploadStatus.SharedDataSourceList[dataSource] + '"><td><input type="button" class="btn primary-button select-datasource-btns small-left-margin" value="[[[Select]]]" data-name="' + datasetUploadStatus.SharedDataSourceList[dataSource] + '"></td><td><span class="rdl-datasource-name">' + datasetUploadStatus.SharedDataSourceList[dataSource] + '</span></td><td> :</td><td><span class="selected-datasource" style = "overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:middle; padding-left:5px; max-width: 435px; width: auto" ></span></td></tr>';
            }
            $("#datasource_list_table").html(html);
            $("#datasource_list").show();
        }
        else {
            $("#datasource_list").hide();
            if (onSelectValidation()) {
                $("#publish_file").removeAttr("disabled");
            }
        }
    }
    else {
        $("#uploadValidation").html("<span class='ErrorMessage'>[[[Error while uploading dataset. Please try again.]]]</span>");
    }
}

function createEditDatasetPopup(data) {
    window.editDatasetData = data;
    window.isEditPopup = true;
    window.editDatasetData.IsDatasetNameChanged = false;
    window.editDatasetData.IsCategoryChanged = false;
    window.editDatasetData.IsDatasetDescriptionChanged = false;
    window.editDatasetData.IsFileChanged = false;
    window.editDatasetData.IsDataSourceChanged = false;
    $("#version_comment").show();
    $("#comment").attr("readonly", true);
    $("#file_name").val(data.DatasetName);
    $("#file-description").val(data.DatasetDescription);
    $("#uploadedFileName").val(data.DatasetFileName);
    $("#publishedFileName").val(data.DatasetFileName);
    $("#previousFileName").val(data.DatasetFileName);
    $("#dataset_upload_iframe").contents().find("#upload_browse_file").attr("value", data.DatasetFileName);
    if (data.DataSources.length != 0) {
        var html = "";
        for (var dataSource = 0; dataSource < data.DataSources.length; dataSource++) {
            html += '<tr data-key="' + data.DataSources[dataSource].DataSourceName + '" data-exist-id="' + data.DataSources[dataSource].DataSourceId + '"><td><input type="button" class="btn btn-info select-datasource-btns small-left-margin" value="Update" data-key="' + data.DataSources[dataSource].DataSourceId + '" data-name="' + data.DataSources[dataSource].DataSourceName + '"></td><td><span class="rdl-datasource-name">' + data.DataSources[dataSource].DataSourceName + '</span> </td><td>:</td><td><span class="selected-datasource" data-key="' + data.DataSources[dataSource].DataSourceId + '" data-original-title = "' + data.DataSources[dataSource].Name + '" style = "width:auto; max-width: 435px; overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:top; padding-left:5px" data-toggle = "tooltip">' + data.DataSources[dataSource].Name + '</span></td></tr>';
        }
        $("#datasource_list_table").html(html);
        $("#datasource_list").show();
        $("#datasource_list #datasource_list_table .selected-datasource[data-toggle='tooltip']").tooltip();
    }
    window.parent.$('#addDataSetDom_wrapper').ejWaitingPopup("hide");
    $("#file_name").focus();
}

function EditDataset() {
    if ($('#publish_file').attr("disabled") !== undefined) {
        return;
    }
    var isValidForm = true;
    var iframe_content = $("#dataset_upload_iframe").contents().find("body");
    var fileName = $("#file_name").val().trim();
    if (!$("#editItemForm").valid())
        isValidForm = false;
    if ($("#publishedFileName").attr("value") == "" || $("#publishedFileName").attr("value") == "none") {
        iframe_content.find("#upload_browse_file").closest('span').addClass("has-error");
        iframe_content.find("#browse_file").closest('div').addClass("error-file-upload");
        $("#uploadValidation").html("Please upload the dataset");
        isValidForm = false;
    } else {
        iframe_content.find("#upload_browse_file").closest('span').removeClass("has-error");
        $("#uploadValidation").html("");
    }

    if (isValidForm) {
        window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("show");
        var isAlreadyExist = false;
        var postData = {};
        var dataSourceList;
        var dataSources = [];
        var dataSource = 0;
        var dataSetName = $("#file_name").val().trim();
        if (window.editDatasetData.IsDatasetNameChanged) {
            $.ajax({
                type: "POST",
                url: isDatasetExistUrl,
                data: { dataSetName: dataSetName },
                async: false,
                success: function (data) {
                    if (data.Data) {
                        window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
                        $("#validate-name").parent('div').addClass("has-error");
                        $("#validate-name").html("[[[A dataset with the same name already exists]]]");
                        isAlreadyExist = true;
                        return;
                    }
                }
            });
        }
        if (!isAlreadyExist) {
            $("#name_change_validation").parent('div').removeClass("has-error");
            postData.datasetId = window.editDatasetData.DatasetId;
            postData.isDatasetNameChanged = window.editDatasetData.IsDatasetNameChanged;
            if (window.editDatasetData.IsDatasetNameChanged) {
                postData.fileName = $("#file_name").val().trim();
            }
            postData.isDatasetDescriptionChanged = window.editDatasetData.IsDatasetDescriptionChanged;
            if (window.editDatasetData.IsDatasetDescriptionChanged) {
                postData.fileDescription = $("#file-description").val();
            }
            postData.isFileChanged = window.editDatasetData.IsFileChanged;
            if (window.editDatasetData.IsFileChanged) {
                postData.temporaryFileName = $("#publishedFileName").val();
                dataSourceList = $("#datasource_list_table tr");
                if (dataSourceList.length !== 0) {
                    for (dataSource = 0; dataSource < dataSourceList.length; dataSource++) {
                        dataSources.push({ Name: $(dataSourceList[dataSource]).attr("data-key"), DataSourceId: $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key") });
                    }
                }
                postData.versionComment = $("#comment").val();
            }
            postData.isDataSourceChanged = window.editDatasetData.IsDataSourceChanged;
            if (!window.editDatasetData.IsFileChanged && window.editDatasetData.IsDataSourceChanged) {
                dataSourceList = $("#datasource_list_table tr");
                if (dataSourceList.length !== 0) {
                    for (dataSource = 0; dataSource < dataSourceList.length; dataSource++) {
                        if ($(dataSourceList[dataSource]).attr("data-exist-id") !== $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key")) {
                            dataSources.push({ Name: $(dataSourceList[dataSource]).attr("data-key"), DataSourceId: $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key") });
                        }
                    }
                }
            }
            postData.dataSourceList = JSON.stringify(dataSources);
            $.ajax({
                type: "POST",
                url: editDatasetUrl,
                data: postData,
                success: function (data) {
                    window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
                    if (data.result.Status) {
                        closeNewDatasetAddPopup();
                        parent.messageBox("su-dataset", "[[[Update Dataset]]]", "[[[Dataset has been updated successfully.]]]", "success", function () {
                            var gridName = window.parent.$('#item-grid-container').attr("data-grid-name");
                            if (gridName == "datasets") {
                                parent.ResetGrid();
                            }
                            parent.onCloseMessageBox();
                        });
                    } else {
                        closeNewDatasetAddPopup();
                        parent.messageBox("su-report", "[[[Update Dataset]]]", "[[[Failed to update dataset. Please try again later.]]]", "success");
                    }
                },
                error: function (e) {
                    window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
                    closeNewDatasetAddPopup();
                    parent.messageBox("su-report", "[[[Update Dataset]]]", "[[[Failed to update dataset. Please try again later.]]]", "success");
                }
            });
        }
    }
}

function datasetEditValidation() {
    if ((window.editDatasetData.IsDatasetNameChanged || window.editDatasetData.IsDatasetDescriptionChanged || window.editDatasetData.IsDataSourceChanged) && !window.editDatasetData.IsFileChanged) {
        window.isEdited = true;
    }
    else if (window.editDatasetData.IsFileChanged && onSelectValidation()) {
        window.isEdited = true;
    } else {
        window.isEdited = false;
    }
    if (window.isEdited && $("#file_name").val() != "") {
        $("#publish_file").removeAttr("disabled");
    } else {
        $("#publish_file").attr("disabled", true);
    }
}

function onSelectDataSourceClick(sourceName, selectedDataSource) {
    parent.$("#select_datasource_popup").ejDialog("open");
    parent.$("#select_datasource_popup_wrapper").ejWaitingPopup("show");
    parent.$("#datasource_iframe").attr("src", datasetselectdatasourceUrl + "?sourceName=" + sourceName + "&selectedDataSource=" + selectedDataSource);
}

function onSelectValidation() {
    if ($("#dataset_upload_iframe").contents().find("#rsd_file_upload_btn").attr("disabled") == undefined || $("#dataset_upload_iframe").contents().find("#upload_browse_file").val().toLowerCase() == "browse file path") {
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
    return true;
}

function onSelectionOfDataSource(element, object) {
    $(element).find(".selected-datasource").attr("data-key", object.Id).html(object.Name);
    var name = $(element).find(".selected-datasource").text();
    $(element).find(".selected-datasource").attr({ "data-original-title": name, "data-toggle": "tooltip" });
    $(element).find(".selected-datasource[data-toggle='tooltip']").tooltip();
    $(element).find(".select-datasource-btns").attr("value", "[[[Update]]]");
    $(element).find(".select-datasource-btns").focus();
    if (window.isEditPopup) {
        if (!window.editDatasetData.IsFileChanged) {
            dataSourceSelectionValidationOnEdit();
        } else {
            datasetEditValidation();
        }
    }
    else if (onSelectValidation()) {
        $("#publish_file").removeAttr("disabled");
    }
}

function dataSourceSelectionValidationOnEdit() {
    var dataSources = $("#datasource_list_table tr");
    for (var dataSource = 0; dataSource < dataSources.length; dataSource++) {
        if ($(dataSources[dataSource]).attr("data-exist-id") !== $(dataSources[dataSource]).find(".selected-datasource").attr("data-key")) {
            window.editDatasetData.IsDataSourceChanged = true;
            datasetEditValidation();
            return;
        }
    }
    window.editDatasetData.IsDataSourceChanged = false;
    datasetEditValidation();
}

function closeNewDatasetAddPopup() {
    window.parent.$('#addDataSetDom').ejDialog("close");
    if ($("#publishedFileName").val() != "none") {
        $.ajax({
            type: "POST",
            url: deletetemporarydatasetUrl,
            async: false,
            data: { fileName: $("#publishedFileName").val() },
            success: function (data) {
                $("#publishedFileName").val("");
            }
        });
    }
}