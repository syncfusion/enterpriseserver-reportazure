$(document).ready(function () {

    if (($(parent.window).width()) > 1400) {
        $("#permission-container").addClass("permissions");
    }

    if (($(parent.window).width()) < 1400) {
        $("#permission-container").removeClass("permissions");
    }

    addPlacehoder("body");
    bindAllUsersandGroups();

    if ($("#user-search option").length > 0)
        $(".share-popup #user-search-container .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
    else
        $(".share-popup #user-search-container .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");

    if ($("#group-search option").length > 0)
        $(".share-popup #group-search-container .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
    else
        $(".share-popup #group-search-container .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");

    if ($("#is-owner").val().toLowerCase() == "true") {
        $("#permission-container").addClass("is-item-owner");
    } else {
        $("#permission-container").addClass("is-item-viewer");
    }

    $("#user-search-container").on('click', '.bs-select-all-custom', function (e) {
        $("#user-search-container").addClass("value-changed");
        $('#user-search').data("selectpicker").selectAll();
        $(this).removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom').css("display", "inline");
        $($(this).children("span")[0]).text("[[[Clear All]]]");
        e.stopPropagation();
    });

    $("#group-search-container").on('click', '.bs-select-all-custom', function (e) {
        $("#group-search-container").addClass("value-changed");
        $('#group-search').data("selectpicker").selectAll();
        $(this).removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
        $($(this).children("span")[0]).text("[[[Clear All]]]");
        e.stopPropagation();
    });

    $("#user-search-container").on('click', '.bs-deselect-all-custom', function (e) {
        $("#user-search-container").addClass("value-changed");
        $('#user-search').data("selectpicker").deselectAll();
        $(this).removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        $($(this).children("span")[0]).text("[[[Select All]]]");
        e.stopPropagation();
    });

    $("#group-search-container").on('click', '.bs-deselect-all-custom', function (e) {
        $("#group-search-container").addClass("value-changed");
        $('#group-search').data("selectpicker").deselectAll();
        $(this).removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        $($(this).children("span")[0]).text("[[[Select All]]]");
        e.stopPropagation();
    });

    $("#user-search-container").on('click', '.bootstrap-select li a', function (e) {
        $("#user-search-container").addClass("value-changed");;
        var selectedCount = $("#user-search-container .bootstrap-select li.selected").length;
        var allListCount = $("#user-search-container .bootstrap-select li").length;

        if (selectedCount == allListCount) {
            $($('#user-search-container div.bs-select-all-custom').children("span")[0]).text("[[[Clear All]]]");
            $('#user-search-container div.bs-select-all-custom').removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
        }
        if ($(this).parent().hasClass("selected")) {
            var selectedUser = $("#user-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            var userTile = $("<div>").attr("id", $(selectedUser).val()).attr("data-searchtype", "userSearch").addClass("selected-share-items");
            userTile.html("<div class='instant-search'><span class='details' title='" + $(selectedUser).text() + "'>" + $(selectedUser).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            $("#selected-users").append(userTile);
        }
        else {
            var selectedUser = $("#user-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            $(".selected-share-items[id='" + $(selectedUser).val() + "']").remove();
            $($('#user-search-container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
            $("#user-search-container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        }
        $(this).parent().addClass("active");
        e.stopPropagation();
    });

    $("#group-search-container").on('click', '.bootstrap-select .dropdown-menu .selectpicker li a', function (e) {
        $("#group-search-container").addClass("value-changed");;
        var selectedCount = $("#group-search-container .bootstrap-select li.selected").length;
        var allListCount = $("#group-search-container .bootstrap-select li").length;
        if (selectedCount == allListCount) {
            $($('#group-search-container div.bs-select-all-custom').children("span")[0]).text("[[[Clear All]]]");
            $('#group-search-container div.bs-select-all-custom').removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
        }

        if ($(this).parent().hasClass("selected")) {
            var selectedGroup = $("#group-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            var groupTile = $("<div>").attr("id", $(selectedGroup).val()).attr("data-searchtype", "groupSearch").addClass("selected-share-items");
            groupTile.html("<div class='instant-search'><span class='details' title='" + $(selectedGroup).text() + "'>" + $(selectedGroup).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            $("#selected-users").append(groupTile);
        }
        else {
            var selectedGroup = $("#group-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
            $(".selected-share-items").filter("[data-searchtype='groupSearch']").filter("#" + $(selectedGroup).val()).remove();
            $($('#group-search-container .bs-deselect-all-custom').children("span")[0]).text("[[[Select All]]]");
            $("#group-search-container .bs-deselect-all-custom").removeClass('bs-deselect-all-custom').addClass('bs-select-all-custom');
        }
        $(this).parent().addClass("active");
        e.stopPropagation();
    });

    $("#user-search-container").on('click', '.bootstrap-select li a', function (e) {
        ValidateFields();
    });

    $("#group-search-container").on('click', '.bootstrap-select .dropdown-menu .selectpicker li a', function (e) {
        ValidateFields();
    });

    $("#access-selection-container").on('click', '.bootstrap-select .dropdown-menu .selectpicker li a', function (e) {
        ValidateFields();
    });

    $(document).on("click", "#users-tab", function (e) {
        $("#groups-tab").parent().removeClass("active");
        $("#item-user-permission-container").removeClass("hidden").addClass("show");
        $("#item-group-permission-container").removeClass("show").addClass("hidden");
        $("#group-search-area").removeClass("show").addClass("hidden");
        $("#user-search-area").removeClass("hidden").addClass("show");
        $("#clear-search").click();
    });

    $(document).on("click", "#groups-tab", function (e) {
        $("#users-tab").parent().removeClass("active");
        $("#groups-tab").parent().addClass("active");
        $("#item-user-permission-container").removeClass("show").addClass("hidden");
        $("#item-group-permission-container").removeClass("hidden").addClass("show");
        $("#user-search-area").removeClass("show").addClass("hidden");
        $("#group-search-area").removeClass("hidden").addClass("show");
        $("#clear-search").click();
    });

    $(document).on("click", ".itempermission-popup-close", function (e) {
        eDialog = parent.$("#permission-popup").data("ejDialog");
        eDialog.close();
        $("#permission-popup iframe").attr("src", "");
    });
});

function ValidateFields() {
    if (($("#user-search").val() != null || $("#group-search").val() != null) && $("#access-selection").val() != null) {
        $("#save-permission").attr("disabled", false);
    } else {
        $("#save-permission").attr("disabled", true);
    }
}

$(document).on("click", ".group-permission", function () {
    var permId = $(this).attr("data-permission-id");
    $("#groups-tab").click();
    var groupGridObj = $("#itemgrouppermissiongrid").data("ejGrid");
    groupGridObj.clearFiltering();
    groupGridObj.clearSorting();
    var i = groupGridObj._dataManager.dataSource.json.length;
    while (i--) {
        if (groupGridObj._dataManager.dataSource.json[i].PermissionId == permId)
            break;
    }
    if ($("#is-owner").val().toLowerCase() == "true") {
        var pageSize = 5;
    } else {
        var pageSize = 8;
    }
    if (i > pageSize - 1) {
        groupGridObj.gotoPage(((i - (i % pageSize)) / pageSize) + 1);
        groupGridObj.selectRows(i % pageSize);
    } else {
        groupGridObj.gotoPage(1);
        groupGridObj.selectRows(i);
    }
});

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        eDialog = parent.$("#permission-popup").data("ejDialog");
        eDialog.close();
        $("#permission-popup iframe").attr("src", "");
    }
});

$(document).on("click", ".delete-permission", function () {
    var permId = $(this).attr("data-permission-id");
    var itemId = $("#item-id-hidden").val();
    parent.messageBox("su-delete", "[[[Delete Permission]]]", "<div class='delete-msg'>[[[Are you sure you want to delete this permission?]]]</div>", "error", function () {
        parent.showWaitingPopup("messageBox_wrapper");
        $.ajax({
            type: "POST",
            url: deleteuserPermissionUrl,
            data: { permissionId: permId, itemId: itemId },
            success: function (result, data) {
                if (result.toLowerCase() == "true") {
                    $("#clear-search").click();
                    refreshItemUserPermissionGrid();
                    parent.hideWaitingPopup("messageBox_wrapper");
                    parent.onCloseMessageBox();
                }
            }
        });
    });
});

$(document).on("click", ".delete-group-permission", function () {
    var permId = $(this).attr("data-permission-id");
    var itemId = $("#item-id-hidden").val();
    parent.messageBox("su-delete", "[[[Delete Permission]]]", "<div class='delete-msg'>[[[Are you sure you want to delete this permission?]]]</div>", "error", function () {
        parent.showWaitingPopup("messageBox_wrapper");
        $.ajax({
            type: "POST",
            url: deleteGroupPermissionUrl,
            data: { permissionId: permId, itemId: itemId },
            success: function (result, data) {
                if (result.toLowerCase() == "true") {
                    $("#clear-group-search").click();
                    refreshItemGroupPermissionGrid();
                    refreshItemUserPermissionGrid();
                    parent.hideWaitingPopup("messageBox_wrapper");
                    parent.onCloseMessageBox();
                }
            }
        });
    });
});

function refreshItemUserPermissionGrid() {
    window.parent.$('#permission-popup_wrapper').ejWaitingPopup("show");
    var scheduleGridObj = $("#itempermissiongrid").data("ejGrid");
    var currentPage = scheduleGridObj.model.pageSettings.currentPage;
    var sortingInfo = scheduleGridObj.model.sortSettings.sortedColumns;
    var itemId = $("#item-id-hidden").val();
    $.ajax({
        type: "POST",
        url: getItemUserPermissionUrl,
        data: { itemId: itemId },
        success: function (result) {
            $("#itempermissiongrid").ejGrid("option", "model.dataSource", result);
            var currentGridObj = $("#itempermissiongrid").data("ejGrid");
            currentGridObj.gotoPage(currentPage);
            if (sortingInfo != null) {
                if (sortingInfo[0] != null) {
                    currentGridObj.sortColumn(sortingInfo[0].field, sortingInfo[0].direction);
                }
            }
        }
    });
}

function refreshItemGroupPermissionGrid() {
    window.parent.$('#permission-popup_wrapper').ejWaitingPopup("show");
    var scheduleGridObj = $("#itemgrouppermissiongrid").data("ejGrid");
    var currentPage = scheduleGridObj.model.pageSettings.currentPage;
    var sortingInfo = scheduleGridObj.model.sortSettings.sortedColumns;
    var itemId = $("#item-id-hidden").val();
    $.ajax({
        type: "POST",
        url: getItemGroupPermissionUrl,
        data: { itemId: itemId },
        success: function (result) {
            $("#itemgrouppermissiongrid").ejGrid("option", "model.dataSource", result);
            var currentGridObj = $("#itemgrouppermissiongrid").data("ejGrid");
            currentGridObj.gotoPage(currentPage);
            if (sortingInfo != null) {
                if (sortingInfo[0] != null) {
                    currentGridObj.sortColumn(sortingInfo[0].field, sortingInfo[0].direction);
                }
            }
        }
    });
}

function bindAllUsersandGroups() {
    window.parent.$('#permission-popup_wrapper').ejWaitingPopup("show");
    $("#access-selection").append(window.accessList);
    $("#user-search").append(window.userList);
    $("#group-search").append(window.groupList);
    $('#user-search').selectpicker("refresh");
    $('#group-search').selectpicker("refresh");
    window.parent.$('#permission-popup_wrapper').ejWaitingPopup("hide");
}

$(document).on("click", "#save-permission", function () {
    window.parent.$('#permission-popup_wrapper').ejWaitingPopup("show");
    var userlist = $("#user-search").val();
    var grouplist = $("#group-search").val();
    var accessMode = $("#access-selection").val();
    var itemId = $("#item-id-hidden").val();
    var itemType = $("#item-type-id-hidden").val();
    $.ajax({
        type: "POST",
        url: addnewpermissionUrl,
        data: { permissionList: JSON.stringify({ mode: accessMode, itemType: itemType, UserList: userlist, GroupList: grouplist }), itemId: itemId },
        success: function (result, data) {
            if (result.toLowerCase() == "true") {
                $('#user-search-container').find(".dropdown-toggle").click();
                $('#user-search').data("selectpicker").deselectAll();
                $('#group-search-container').find(".dropdown-toggle").click();
                $('#group-search').data("selectpicker").deselectAll();
                $('#group-search-container').find(".dropdown-toggle").click();
                ValidateFields();
                window.parent.$('#permission-popup_wrapper').ejWaitingPopup("hide");
                parent.messageBox("su-manage-permission", "[[[Permission]]]", "[[[Permission has been added successfully.]]]", "success", function () {
                    parent.onCloseMessageBox();
                    refreshItemGroupPermissionGrid();
                    refreshItemUserPermissionGrid();
                });
            } else {
                window.parent.$('#permission-popup_wrapper').ejWaitingPopup("hide");
                parent.messageBox("su-manage-permission", "[[[Permission]]]", "[[[Failed to add permission, please try again later.]]]", "success", function () {
                    parent.onCloseMessageBox();
                });
            }
        }
    });
});