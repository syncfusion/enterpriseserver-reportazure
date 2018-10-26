$(function () {
    parent.$("#AddCategoryPopup_wrapper").ejWaitingPopup("hide");

    $.validator.addMethod("isValidName", function (value, element) {
        return parent.IsValidName("name",value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !parent.isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $("#addCategoryForm").validate({
        errorElement: 'div',
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#validate-name").parent("span").removeClass("has-error");
                $("#validate-name").text("");
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
            if ($(element).attr('id') == 'category_name') {
                $(element).closest('td').removeClass('has-error');
                $(element).closest('td').find("div").html("");
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('td').find("div").html(error.html());
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $('.PopupClose').click();
            window.parent.$("#createButton").focus();
        }
    });

    $('#category_name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            addItemValidate();
            return false;
        }
    });
});

function addItemValidate(e) {
    var canProceed = $("#addCategoryForm").valid();
    var categoryName = $("#category_name").val().trim();
    if (!canProceed) {
        return false;
    }
    else {
        parent.$("#AddCategoryPopup_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: isCategoryExistUrl,
            data: { CategoryName: categoryName },
            async: false,
            success: function (data) {
                if (data.Data) {
                    canProceed = false;
                    parent.$("#AddCategoryPopup_wrapper").ejWaitingPopup("hide");
                    $("#validate-name").parent("span").addClass("has-error");
                    $("#validate-name").text("[[[Category name already exists]]]");
                } else {
                    canProceed = true;
                    $("#validate-name").parent('span').removeClass("has-error");
                    $("#validate-name").text("");
                }
            }
        });
    }
    if (canProceed) {
        $('form').submit();
    }
}

function closeAddItemPopup() {
    parent.$("#AddCategoryPopup").ejDialog("close");
}