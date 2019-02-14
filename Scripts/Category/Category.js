$(function() {
    $("#EditCategoryPopup").ejDialog({
        width: "600px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        showHeader: false,
        enableModal: true,
        close: "OnEditCategoryDialogClose",
        closeOnEscape: true
    });
    $("#EditCategoryPopup_wrapper").ejWaitingPopup();
});

$(document).on('click', '.DeleteCategory', function (event) {
    $(this).parents(".dropdown").removeClass("open");
    $(this).parents(".dropdown").find(".dropdown-backdrop").remove();
    event.stopPropagation();
    $("#delete-item-name").html($(this).attr("data-name"));
    $("#delete-item").attr("data-item-id", $(this).attr("data-item-id"));
    $("#delete-item").attr("data-itemtype", $(this).attr("Category"));
    var itemId = $(this).attr("data-item-id");
    var itemName = $(this).attr("data-name");
    var itemTypeId = $(this).attr("data-itemtype");
    $("#item-delete-confirmation").ejDialog("open");
    $("#item-delete-confirmation_wrapper").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: deleteConfirmUrl,
        data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName },
        async: false,
        success: function (data) {
            $("#item-delete-confirmation_wrapper").ejWaitingPopup("hide");
            $("#item-delete-confirmation").html(data);
        }
    });
});
$(document).on('click', '.EditCategory', function (event) {
    $(this).parents(".dropdown").removeClass("open");
    $(this).parents(".dropdown").find(".dropdown-backdrop").remove();
    event.stopPropagation();
    var itemId = $(this).attr("data-item-id");
    $("#EditCategoryPopup").ejDialog("open");
    ShowWaitingProgress("#EditCategoryPopup_wrapper", "show");
    $("#EditCategoryPopup_iframe").attr("src", "category/getcategorydetails?itemId=" + itemId);
});

function OnEditCategoryDialogClose() {
    $("#EditCategoryPopup").find("iframe").contents().find("html").html("");
}
