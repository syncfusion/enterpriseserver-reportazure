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
                closeNewDatasetPopup();
            } else {
                addDataSetValidate();
            }
            return false;
        }
    });

    $(document).on("keyup", "#file_name", function () {
        if (onSelectValidation()) {
            $("#publish_dataset").removeAttr("disabled");
        }
        else {
            $("#publish_dataset").attr("disabled", "disabled");
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

    $("#new_dataset_tab_content").validate({
        errorElement: 'div',
        onkeyup: function (element, event) {
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
        $("#new_dataset_tab_content").valid();
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
            $("#publish_dataset").trigger("focus");
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
        $("#publish_dataset").removeAttr("disabled");
    }
}

function datasetUploadComplete(datasetUploadStatus) {
    if (datasetUploadStatus.Status) {
        $("#uploadValidation").html("<span class='ReportUploadSuccessMessage'>[[[Dataset has been uploaded successfully.]]]</span>");
        $("#publishedFileName").val(datasetUploadStatus.UploadedReportName);
        if (datasetUploadStatus.IsSharedDataSource) {
            var html = "";
            for (var dataSource = 0; dataSource < datasetUploadStatus.SharedDataSourceList.length; dataSource++) {
                html += '<tr data-key="' + datasetUploadStatus.SharedDataSourceList[dataSource] + '"><td><input type="button" class="btn primary-button select-datasource-btns small-left-margin" value="[[[Select]]]" data-name="' + datasetUploadStatus.SharedDataSourceList[dataSource] + '"></td><td><span class="rdl-datasource-name">' + datasetUploadStatus.SharedDataSourceList[dataSource] + '</span></td><td> :</td><td><span class="selected-datasource" style = "overflow:hidden; text-overflow:ellipsis; display:inline-block; white-space:nowrap; vertical-align:middle; padding-left:5px; max-width: 435px; width: auto;" ></span></td></tr>';
            }
            $("#datasource_list_table").html(html);
            $("#datasource_list").show();
        }
        else {
            $("#datasource_list").hide();
            if (onSelectValidation()) {
                $("#publish_dataset").removeAttr("disabled");
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
    var validate = false;
    ValidateDataSet();
    if ($("#new_dataset_tab_content").valid() && ValidateDataSet()) {
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
                    validate = false;
                }
                else {
                    $("#validate-name").css("display", "none");
                    $("#validate-file").css("display", "none");
                    validate = true;
                }
            }
        });
    }
    window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
    return validate;
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

function onSubmitDataset() {
    $("#dataset_validation").css("display", "none");
    window.parent.$('#addDataSetDom_wrapper').ejWaitingPopup("show");
    var activeTab = $("#dataset_tabs").find("span.dataset-tab-active").attr("id");
    var selectedDataset = new Object();
    var selectedDatasetItem = window.parent.$('#report_iframe').contents().find("table#dataset_list_table tr").filter("[data-key='" + $("#publish_dataset").attr("data-mapid") + "']");
    var isMapping = $("#publish_dataset").attr("data-mapid") != undefined ? true : false;
    switch (activeTab) {
        case "avl_dataset_tab":
            if ($("#available_dataset_table").find(".available-dataset-select").length == 0) {
                window.parent.$('#addDataSetDom_wrapper').ejWaitingPopup("hide");
                $("#dataset_validation").html("Please select the dataset").css("display", "block");
                return;
            }
            selectedDataset = { Id: $("#available_dataset_table").find(".available-dataset-select").attr("data-setid"), Name: $("#available_dataset_table").find(".available-dataset-select").find("td:first-child span").text() };
            closeNewDatasetPopup();
            break;
        case "new_dataset_select_tab":
            selectedDataset = addDataSet();
            if (!selectedDataset) {
                window.parent.$('#addDataSetDom_wrapper').ejWaitingPopup("hide");
                return;
            }
            break;
    }
    if (isMapping) {
        window.parent.document.getElementById("report_iframe").contentWindow.onSelectionOfDataset(selectedDatasetItem, selectedDataset);
    }
    window.parent.$('#addDataSetDom_wrapper').ejWaitingPopup("hide");
}

function addDataSet() {
    var result = new Object();
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
        result.Name = postData.fileName;
        $.ajax({
            type: "POST",
            url: addDatasetUrl,
            data: postData,
            async: false,
            success: function (data) {
                window.parent.$("#addDataSetDom_wrapper").ejWaitingPopup("hide");
                if (data.result.Status) {
                    result.isValid = true;
                    result.Id = data.result.PublishedItemId;
                    closeNewDatasetPopup();
                } else {
                    result.isValid = false;
                    closeNewDatasetPopup();
                    parent.messageBox("su-dataset", "[[[Add Dataset]]]", "[[[Failed to add dataset. Please try again later.]]]", "success");
                }
            },
        });
    }
    return result;
}


function onAvailableDatasetTabSelect() {
    $(".rdl-dataset-tab-contents").hide();
    $("#avl_dataset_tab_content").show();
    $("#dataset_tabs").find(".dataset-tab-active").removeClass("dataset-tab-active");
    $("#dataset_tabs").find("#avl_dataset_tab").addClass("dataset-tab-active");
    $("#rdl_new_tab_arrow").css("left", "50px");
    $("#publish_dataset").attr("value", "[[[Select]]]");
}


function onNewDatasetTabSelect() {
    $("#dataset_validation").css("display", "none");
    $("#dataset_type").selectpicker("refresh");
    $(".rdl-dataset-tab-contents").hide();
    $("#new_dataset_tab_content").show();
    $("#dataset_tabs").find(".dataset-tab-active").removeClass("dataset-tab-active");
    $("#dataset_tabs").find("#new_dataset_select_tab").addClass("dataset-tab-active");
    $("#rdl_new_tab_arrow").css("left", "180px");
    $("#publish_dataset").attr("value", "[[[Add]]]");
}

function closeNewDatasetPopup(e) {
    window.isEditPopup = false;
    $("#publish_dataset").removeAttr("disabled");
    $("#publish_dataset").removeAttr("data-mapId");
    $("#file_name").val("");
    $("#file-description").val("");
    $(".datasource-validation-messages").html("");
    $("#createReportPopupHolder").find("input:not('#prompt_text')").filter("[type='text']").val("");
    $("#createReportPopupHolder").find("textarea").val("");
    $("#createReportPopupHolder").find("input").filter("[type='password']").val("");
    (!$("#version_comment_tr").hasClass("hidden-visibility")) ? $("#version_comment_tr").addClass("hidden-visibility") : "";
    $("#comment").val("");
    $("#comment").attr("readonly", true);
    window.parent.$('#addDataSetDom_wrapper').ejWaitingPopup("hide");
    window.parent.$("#addDataSetDom").ejDialog("close");
    window.parent.$('#report_iframe').contents().find(".select-dataset-btns").first().focus();
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

$(function () {
    $("#available_dataset_table").on("click", "tr", function (e) {
        if (!$(this).hasClass("available-dataset-select") && !$(this).hasClass("partition-headers-validate")) {
            $(".available-dataset-select").removeClass("available-dataset-select");
            $(this).addClass("available-dataset-select");
            $("#avl_dataset_tab").attr("data-isselected", "true");
            $("#save_rdl_with_dataset").removeAttr("disabled");
        }
    });
});

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        window.parent.$("#addDataSetDom").ejDialog("close");
        window.parent.$('#report_iframe').contents().find(".select-dataset-btns").first().focus();
    }
});