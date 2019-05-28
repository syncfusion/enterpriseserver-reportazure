$(function () {
    $(document).on("keyup", ".text-field", function (e) {
        if ($(this).attr("id") === "category_name") {
            if (window.editData.Name !== $(this).val().trim()) {
                window.editData.IsNameChanged = true;
            } else {
                window.editData.IsNameChanged = false;
            }
        }
        if ($(this).attr("id") === "category_description") {
            if (window.editData.Description !== $(this).val().trim()) {
                window.editData.IsDescriptionChanged = true;
            } else {
                window.editData.IsDescriptionChanged = false;
            }
        }

    if ((window.editData.IsNameChanged || window.editData.IsDescriptionChanged)) {
        window.isEdited = true;
            $("#saveEditCategory").removeAttr("disabled");
        } else {
        window.isEdited = false;
            $("#saveEditCategory").attr("disabled", "disabled");
    }
    });

    $.validator.addMethod("isValidName", function (value, element) {
        return parent.IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !parent.isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $("#create_category_content").validate({
        errorElement: 'div',
        onkeyup: function(element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#validate-name").parent('span').removeClass('has-error');
                $("#validate-name").html("");
            } else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "categoryName": {
                isRequired: true,
                isValidName: true
            }
        },
        messages: {
            "categoryName": {
                isRequired: "[[[Please enter category name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('td').removeClass('has-error');
            $(element).closest('td').find("div").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest('td').find("div").html(error.html());
        }
    });

    $('#category_name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            updateCategory();
            return false;
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $('.PopupClose').click();
        }
    });
});

function updateCategory() {
    if ($('#saveEditCategory').is('[disabled=disabled]')) {
        return false;
    }
    window.parent.$("#EditCategoryPopup_wrapper").ejWaitingPopup("show");
    if (!$("#create_category_content").valid()) {
        window.parent.$("#EditCategoryPopup_wrapper").ejWaitingPopup("hide");
        return;
    }
    else {
        var postData = getUpdatedCategoryFields();
        $.ajax({
            type: "POST",
            url: editcategoryUrl,
            data: postData,
            success: function (data) {
                if (data.NameExists) {
                    $("#validate-name").parent('span').addClass('has-error');
                    $("#validate-name").html("[[[Category name already exists]]]");
                }
                else {
                    if (data.Status) {
                        parent.$(".item-list-panel").ejWaitingPopup();
                        parent.$("#EditCategoryPopup").ejDialog("close");
                        $("#validate-name").parent("span").removeClass("has-error");
                        $("#validate-name").html("");
                        parent.messageBox("su-folder", "[[[Update Category]]]", "[[[Category has been updated successfully.]]]", "success", function () {
                            parent.onCloseMessageBox();
                            parent.$(".item-list-panel").ejWaitingPopup("show");
                            var categoryScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
                            categoryScope.refreshCategorySection();
                            setTimeout(function () { parent.$(".item-list-panel").ejWaitingPopup("hide"); }, 500);
                        });
                    }
                    else {
                        $("#validate-name").parent("span").addClass("has-error");
                        $("#validate-name").html("[[[Error in update category]]]");
                    }
                }
                window.parent.$("#EditCategoryPopup_wrapper").ejWaitingPopup("hide");
            }
        });
    }
}

function getUpdatedCategoryFields() {
    var categoryname = $("#category_name").val();
    var categoryDescription = $("#category_description").val();
    var itemId = window.editData.ItemId;
    var postData = {
        IsNameChanged: window.editData.IsNameChanged,
        IsDescriptionChanged: window.editData.IsDescriptionChanged,
        IsDataSourceDefinitionChanged: window.editData.IsDataSourceDefinitionChanged,
        Name: categoryname,
        Description: categoryDescription,
        ItemId: itemId
    }
    return postData;
}

function closeEditCategoryPopup() {
    parent.$("#EditCategoryPopup").ejDialog("close");
}

