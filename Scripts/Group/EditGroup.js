$(document).ready(function () {
    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value)
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $(".group-form").validate({
        errorElement: "span",
        onkeyup: function (element) { $(element).valid(); },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "groupname": {
                isRequired: true,
                isValidName: true
            }
        },
        highlight: function (element) {
            $(element).closest("div").addClass("has-error");
            $("#group-info-name").attr("placeholder", "Group name");
        },
        unhighlight: function (element) {
            $(element).closest("div").removeClass("has-error");
            $(element).closest("div").find("span").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest("div").find("span").html(error.html());
        },
        messages: {
            "groupname": {
                isRequired: "[[[Please enter group name]]]"
            }
        }
    });

    $("#user-list").selectpicker();
    addPlacehoder("#search-area");
    addPlacehoder("#group-name");
    $(document).on("click", "#new-group-button", function () {
        eDialog = $("#new-group-area").data("ejDialog");
        eDialog.open();
        $("#new-group-iframe").attr("src", addGroupViewUrl);
        $("#new-group-area-wrapper").ejWaitingPopup("show");
    });

    $(document).on("change", "#user-list", function () {
        var userVal = $("#user-list").val();
        if (userVal != null)
            $("#user-save-button").attr("disabled", false);
        else
            $("#user-save-button").attr("disabled", true);
    });

    if ($("#user-list option").length > 0) {
        $("#user-list-container .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
    }
    else {
        $("#user-list-container .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");
    }

    $("#user-list-container").on('click', ".bs-select-all-custom", function (e) {
        $("#user-list-container").addClass("value-changed");
        $("#user-list").data("selectpicker").selectAll();
        $(this).removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
        $($(this).children("span")[0]).text("[[[Clear All]]]");
        e.stopPropagation();
    });

    $("#user-list-container").on('click', ".bs-deselect-all-custom", function (e) {
        $("#user-list-container").addClass("value-changed");
        $("#user-list").data("selectpicker").deselectAll();
        $(this).removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
        $($(this).children("span")[0]).text("[[[Select All]]]");
        e.stopPropagation();
    });

    $("#user-list-container").on('click', ".bootstrap-select li a", function (e) {
        $("#user-list-container").addClass("value-changed");;
        var selectedCount = $("#user-list-container .bootstrap-select li.selected").length;
        var allListCount = $("#user-list-container .bootstrap-select li").length;

        if (selectedCount == allListCount) {
            $($("#user-list-container div.bs-select-all-custom").children("span")[0]).text("[[[Clear All]]]");
            $("#user-list-container div.bs-select-all-custom").removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
        }
        else {
            $($("#user-list-container .bs-deselect-all-custom").children("span")[0]).text("[[[Select All]]]");
            $("#user-list-container .bs-deselect-all-custom").removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
        }
        e.stopPropagation();
    });

    $(".back-button").tooltip();
});

function RefreshGroupUsers(groupId, gridObj) {
    gridObj.refreshContent();
}

function fnOnUserGridActionComplete(args) {
    $('[data-toggle="tooltip"]').tooltip();
}

$(document).on("click", ".search-group-users", function () {
    var gridObj = $("#Grid").data("ejGrid");
    gridObj.model.pageSettings.currentPage = 1;
    gridObj.refreshContent();
});
$(document).on('hide.bs.dropdown', "#people-container", function (e) {
    if ($("#people-container").hasClass("value-changed")) {
        $("#people-container").removeClass("value-changed");
        e.preventDefault();
    }
});
$(document).on("change", "#user-list", function () {
    $("#people-container").addClass("value-changed");
});
