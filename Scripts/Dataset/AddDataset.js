$(function () {

    $(document).on("click", ".select-datasource-btns", function (e) {
        var selectedDataSource = "";
        if ($(this).val() == "Update") {
            selectedDataSource = $(this).siblings("span.selected-datasource").attr("data-key");
        }

        onSelectDataSourceClick($(this).data("name"), selectedDataSource);

    });

    $('#file_name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if ($("#cancelAddDataSet").is(":focus")) {
                closeNewDatasetAddPopup();
            } else {
                addDataSetValidate();
            }
            return false;
        }
    });

    $(document).on("keyup", "#file_name", function () {
        if (onSelectValidation()) {
            $("#publish_file").removeAttr("disabled");
        }
        else {
            $("#publish_file").attr("disabled", "disabled");
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if (e.target.id != "browse_file") {
                $('.PopupClose').click();
                window.parent.$("#createButton").focus();
            } else {
                window.$('#filename').focus();
            }
        }
    });

    $.validator.addMethod("isRequired", function (value, element) {
        return !parent.isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $.validator.addMethod("isValidName", function (value, element) {
        return parent.IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $("#addItemForm").validate({
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
            "dataSetName": {
                isRequired: true,
                isValidName: true
            }
        },
        messages: {
            "dataSetName": {
                isRequired: "[[[Please enter dataset name]]]"
            }
        },
        highlight: function (element) {           
                $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {
            if ($(element).attr('id') == 'file_name') {
                $(element).closest('td').removeClass('has-error');
                $(element).closest('td').find("div").html("");
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('td').find("div").html(error.html());
        }
    });

    $(document).on("focusout", "#filename", function (event) {
        $("#addItemForm").valid();
    });

    $(document).on("change", "#browse_file", function () {
        var filename = $("#browse_file").val();
        if (filename.substring(filename.lastIndexOf('.') + 1) == "rsd") {
            var value = $(this).val() == "" ? "Browse file path" : $(this).val();
            $("#filename").val(value.substring(value.lastIndexOf('\\') + 1));
            $(".fileUpload").removeClass("error-file-upload");
            $("#filename").removeClass('error-file-upload');
            $("#filename").closest('td').find("span.validation-message").html("");
            $('.imagepath').removeClass('has-error');
            $("#publish_file").trigger("focus");
            $('#browse_file').attr('title', $(this).val());
        }
        else {
            $(".fileUpload").addClass("error-file-upload");
            $("#filename").addClass('error-file-upload');
            $("#validate-file").text("[[[Please choose a valid RSD file to upload]]]");
            $("#filename").val("Browse file path");
            $("#browse_file").val("");
            $('#browse_file').attr('title', $(this).val());
            isValid = false;
        }
    });

    $(document).on("click", "#filename", function () {
        $("#browse_file").trigger("click");
		$("#browse_file").focus();
    });
});

function onSelectDataSourceClick(sourceName, selectedDataSource) {
    parent.$("#select_datasource_popup").ejDialog("open");
    parent.$("#select_datasource_popup_wrapper").ejWaitingPopup("show");
    parent.$("#datasource_iframe").attr("src", datasetselectdatasourceUrl + "?sourceName=" + sourceName + "&selectedDataSource=" + selectedDataSource);
}

function onSelectionOfDataSource(element, object) {
    $(element).find(".selected-datasource").attr("data-key", object.Id).html(object.Name);
    var name = $(element).find(".selected-datasource").text();
    $(element).find(".selected-datasource").attr({ "data-original-title": name, "data-toggle": "tooltip" });
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
        $("#publish_file").removeAttr("disabled");
    }
}

function datasetUploadComplete(datasetUploadStatus) {
    if (datasetUploadStatus.Status) {
        $("#uploadValidation").html("<span class='ReportUploadSuccessMessage'>[[[Dataset has been uploaded successfully.]]]</span>");
        $("#publishedFileName").val(datasetUploadStatus.UploadedReportName);
        if (datasetUploadStatus.IsSharedDataSource) {
            var html = "";
            for (var dataSource = 0; dataSource < datasetUploadStatus.SharedDataSourceList.length; dataSource++) {
                html += '<tr data-key="' + datasetUploadStatus.SharedDataSourceList[dataSource] + '"><td><input type="button" class="btn primary-button select-datasource-btns small-left-margin" value="[[[Select]]]" data-name="' + datasetUploadStatus.SharedDataSourceList[dataSource] + '"></td><td><span class="rdl-datasource-name">' + datasetUploadStatus.SharedDataSourceList[dataSource] + '</span></td><td> :</td><td><span class="selected-datasource" style = "overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:bottom; padding-left:5px; max-width: 435px; width: auto;" ></span></td></tr>';
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


function addDataSetValidate() {
    window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("show");
    var dataSetName = $("#file_name").val().trim();
    var isDatasetExist = true;
    ValidateDataSet();
    if ($("#addItemForm").valid() && ValidateDataSet()) {
        $.ajax({
            type: "POST",
            url: window.isDatasetExistUrl,
            data: { dataSetName: dataSetName },
            async: false,
            success: function (data) {
                if (data.Data) {
                    $("#validate-name").parent('span').addClass("has-error");
                    $("#validate-name").text("[[[Dataset name already exists]]]");
                    $("#validate-name").css("display", "block");
                    $("#validate-file").closest('td').removeClass("has-error");
                    $("#validate-file").css("display", "none");
                    isDatasetExist = false;
                }
                else {
                    $("#validate-name").css("display", "none");
                    $("#validate-file").css("display", "none");
                    isDatasetExist = true;
                }
            }
        });
    }
    window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
    return isDatasetExist;
}

function ValidateDataSet() {
    var isValidDataSet = true;
    if ($('#browse_file').val() == '') {
        $(".fileUpload").addClass("error-file-upload");
        $(".fileUpload").addClass("no-left-border");
        $("#filename").addClass('error-file-upload');
        $("#validate-file").html("Please upload a file");
        $("#filename").val("Browse file path");
        isValidDataSet = false;
    }
    else {
        $(".fileUpload").removeClass("error-file-upload");
        $(".fileUpload").removeClass("no-left-border");
        $("#filename").removeClass('error-file-upload');
        $("#filename").closest('td').find("span.validation-message").html("");
        $('.imagepath').removeClass('has-error');
        isValidDataSet = true;
    }
    return isValidDataSet;
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

function addDataSet() {
        var postData = {};
        var dataSourceList;
        var dataSources = [];
        var dataSource = 0;
        if (addDataSetValidate()) {
            window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("show");
            dataSourceList = $("#datasource_list_table tr");
            if (dataSourceList.length !== 0) {
                for (dataSource = 0; dataSource < dataSourceList.length; dataSource++) {
                    dataSources.push({ Name: $(dataSourceList[dataSource]).attr("data-key"), DataSourceId: $(dataSourceList[dataSource]).find("span.selected-datasource").attr("data-key") });
                }
                postData.dataSourceList = JSON.stringify(dataSources);
            }
            postData.fileName = $("#file_name").val();
            postData.description = $("#file-description").val();
            postData.temporaryFileName = $("#publishedFileName").val();
            $.ajax({
                type: "POST",
                url: addDatasetUrl,
                data: postData,
                success: function (data) {
                    window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
                    if (data.result.Status) {
                        closeNewDatasetAddPopup();
                        parent.messageBox("su-dataset", "[[[Add Dataset]]]", "[[[Dataset has been added successfully.]]]", "success", function () {
                            var gridName = window.parent.$('#item-grid-container').attr("data-grid-name");
                            if (gridName == "datasets") {
                                parent.ResetGrid();
                            }
                            parent.onCloseMessageBox();
                        });
                    } else {
                        closeNewDatasetAddPopup();
                        parent.messageBox("su-report", "[[[Add Dataset]]]", "[[[Failed to add dataset. Please try again later.]]]", "success");
                    }
                },
                error: function (e) {
                    window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
                    closeNewDatasetAddPopup();
                    parent.messageBox("su-report", "[[[Add Dataset]]]", "[[[Failed to add dataset. Please try again later.]]]", "success");
                }
            });
        } 
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

//Validation for create dataset
$(document).on("keyup", ".edit-datasetname-field", function () {
    if (enableDatasetCreateButton()) {
        $("#create-report-dataset").removeAttr("disabled");
    }
    else {
        $("#create-report-dataset").prop("disabled", "disabled");
    }
});

function enableDatasetCreateButton() {
    if ($(".edit-datasetname-field").val() != "") {
        return true;
    }
    else {
        return false;
    }
}

//Create button in Add dataset dialog box
$(document).on("click", "#create-report-dataset", function () {  
    $("#dataset-description").val($("#file-description").val());
    $("#dataset-name").val($("#file_name").val());
    if ($("#selected-datasource").find("option:selected").text() == "Select DataSource") {
        var datasourceName = "";
        $("#datasource-name").val(datasourceName);
    }
    else {
        $("#datasource-name").val($("#selected-datasource").find("option:selected").text());
    }
    $("#edit-value").val(false);
    $("#create-report-form").submit();
    parent.$("#addDataSetDom").ejDialog("close");
});