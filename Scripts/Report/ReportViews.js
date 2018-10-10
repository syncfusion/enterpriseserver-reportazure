var containSaveFilter = false;
var SaveFilterName = "";
var CanUpdate = false;
var initialQueryString = "";
var saveQueryString = "";
var parameterArray = [];
var valueArray = [];
var isFirstRequest = true;
var parentRefUrl = (window.location != window.parent.location) ? "" : document.location.href.replace(document.location.pathname + document.location.search, "");
if (parentRefUrl == "") {
    var parentUrl = "";
}
else {
    var parentUrl = parentRefUrl.match(/:\/\/(.[^/]+)/)[1];
}
var iframeRefUrl = window.location.href;
var iframeUrl = iframeRefUrl.match(/:\/\/(.[^/]+)/)[1];

$(document).ready(function () {
    $("#delete-div").ejDialog({
        width: (window.innerWidth > 420) ? "410" : (window.innerWidth - 10),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "Delete View",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onDeleteItemDialogClose",
        open: "onDeleteItemDialogOpen"
    });
    $("#delete-div_wrapper").ejWaitingPopup();
    $("#report-view-toogle").mouseover(function () {
        var ele = document.getElementById("report-views");
        if (!(ele.style.display == 'block' || ele.style.display == '')) {
            $("#report-view-toogle").addClass("cursor-pointer");
            $("#report-view-toogle").removeClass("cursor-default");
        } else {
            $("#report-view-toogle").addClass("cursor-default");
            $("#report-view-toogle").removeClass("cursor-pointer");
        }
    });
    $('#filter_name').keypress(function (e) {
        $('#filter-name-input').removeClass("has-error");
        if (e.which == 13) {//Enter key pressed
            $('#save-filter').click();
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
});

//Report View Toggle when click outside
$(document).on('click', function (e) {
    if ($("#is_mobile").val() == "true") {
        return;
    }

    var ele = document.getElementById("report-views");
    if ((ele.style.display == 'block' || ele.style.display == '') && (e.target.className != "su su-sidebar-collapse")) {
        var clickedOn = $(e.target);
        if ((!(clickedOn.parents().andSelf().is('#report-view-toogle'))) && (!(clickedOn.parents().andSelf().is("#PopupContainerDelete"))) && (!(clickedOn.parents().andSelf().is("#messageBox")))) {
            if ($("#filter_name").val() != "") {
                $("#filter_name").val("");
            }
            CloseReportView();
        }
    } else {
        if (e.target.id == "report-view-toogle") {
            if (containSaveFilter) {
                $("#saved-filter").show();
            }
            $("#sync_report_viewer").toggleClass("sync_report_viewer");
            $(".view-heading").toggle();
            $("#report-views").toggle();
            $("#report-view-toogle").addClass("cursor-default");
            $("#report-view-toogle").removeClass("cursor-pointer");
            var e = document.getElementById("report-views");
            if (e.style.display == 'block' || e.style.display == '') {
                $("#expand-collapse").html('<span class="su su-sidebar-expand"></span>');
                $("#expand-collapse").attr("data-original-title", "[[[Collapse]]]");
                $("#expand-collapse").css('background-color', 'transparent');
                $("#expand-collapse").css('box-shadow', 'none');
            }
            $("#report-view-toogle").toggleClass("report-view-toogle");
            refreshScroller();
        }
    }
    $('[data-toggle="tooltip"]').tooltip();
});

//Reports View Toggle
$(document).on("click", "#expand-collapse", function () {
    if (enableComment.toString().toLowerCase() == "true") {
        closeReportComment();
    }
    if ($("#filter_name").val() != "") {
        $("#filter_name").val("");
    }
    $('body [data-toggle="tooltip"]').tooltip('hide');
    if (containSaveFilter) {
        $("#saved-filter").show();
    }
    $("#sync_report_viewer").toggleClass("sync_report_viewer");
    $(".view-heading").toggle();
    $("#report-views").toggle();
    var e = document.getElementById("report-views");
    var element = document.getElementById("sync_report_viewer");
    if (e.style.display == 'block' || e.style.display == '') {
        $("#expand-collapse").html('<span class="su su-sidebar-expand"></span>');
        $("#expand-collapse").attr("data-original-title", "[[[Collapse]]]");
        $("#expand-collapse").css('background-color', 'transparent');
        $("#expand-collapse").css('box-shadow', 'none');
        $("#header-pane").removeClass("no-border");
    }
    else {
        $("#expand-collapse").html('<span class="su su-sidebar-collapse"></span>');
        $("#expand-collapse").attr("data-original-title", "[[[Report Views]]]");
        $("#header-pane").addClass("no-border");
    }
    $("#report-view-toogle").toggleClass("report-view-toogle");
    refreshScroller();
}).children().on('click', function (event) {
    var e = document.getElementById("report-views");
    var collapse = document.getElementsByClassName('su-sidebar-expand');
    var tag = document.getElementsByClassName('view-link');
    if ((e.style.display == 'block' || e.style.display == '') && (event.target != collapse[0]) && (!(event.target.tagName.toLowerCase() === 'a'))) {
        event.preventDefault();
    }
});

var filtered_Values = "";
var reportviewerObj = null;

$(function () {
    $("#expand-collapse").html('<span class="su su-sidebar-collapse"></span>');
    $('[data-toggle="tooltip"]').tooltip();
});

//close report-view-toogle
function CloseReportView() {
    if (containSaveFilter) {
        $("#saved-filter").show();
    }
    $("#sync_report_viewer").toggleClass("sync_report_viewer");
    $(".view-heading").toggle();
    $("#report-views").toggle();
    $("#expand-collapse").html('<span class="su su-sidebar-collapse"></span>');
    $("#expand-collapse").attr("data-original-title", "[[[Report Views]]]");
    $("#report-view-toogle").toggleClass("report-view-toogle");
}

//Render on complete action
function filterView(args) {
    if (!viewReportClick) {
        var element = document.getElementById("sync_report_viewer");
        reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");
        var paramters = reportviewerObj.getParameters();
        if (paramters[0] != null && paramters[0].Name != 'undefined') {
            SavedViewHeight();
            if ((viewId == null || viewId == "") && !viewReportClick) {
                if ($("#saved-filter-Saveas").css("display") == "none" && $("#saved-filter-update").css("display") == "none") {
                    $("#new-save").show();
                    if (enableComment.toString().toLowerCase() == "true") {
                        $("#new-save").removeClass("pointer-events");
                        $("#new-save").css("opacity", 1);
                    }
                    $("#nofilters").css("display", "none");
                }
            }
        }
        else {
            $("#new-save").addClass("pointer-events");
            $("#new-save").css("opacity", 0.5);
            $("#nofilters").css("display", "block");
            $("#report-view-toogle").hide();
            element.style.cssText = 'width: 100% !important';
            if ($("#is_mobile").val() == "true") {
                mobileViewAvailable();
            }
        }
        if (args.reportParameters != undefined)
        {
            args = args.reportParameters;
            unsavedFilters(args);
        }        
    } else {
        viewReportClick = false;
    }
    $("#save-section").hide();
    GetSavedFilter();
    refreshScroller();
}

//Clear Filter
$(document).on("click", "#clear", function () {
    reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");
    reportviewerObj.reload();
});

//Save filter post action
$(document).on("click", "#save-filter", function (e) {
    SaveFilterName = $("#filter_name").val();
    if (SaveFilterName != null && SaveFilterName.trim() !== '') {
        AddView();
    } else {
        $('#filter-name-input').addClass("has-error");
    }
});

//Add View Name Function 
function AddView() {
    var _data = "Datas";
    var link = "";
    var proxy = $('#sync_report_viewer').data('ejReportViewer');
    var queryString = saveQueryString != "" ? saveQueryString : QueryStringFormation(false);
    var reportViewDiv = document.getElementById("report-views");
    if (reportViewDiv.style.display == 'block' || reportViewDiv.style.display == '') {
        $("#report-view-toogle").ejWaitingPopup("show");
    }
    $.ajax({
        url: addViewUrl,
        data: { name: _data, ItemViewName: SaveFilterName, QueryString: queryString, itemId: item_Id, UserId: userId, UserName: userName },
        type: "POST",
        beforeSend: function (req) {
            req.setRequestHeader('ejAuthenticationToken', proxy._authenticationToken);
        },
        success: function (data) {
            initialQueryString = queryString;
            $("#report-view-toogle").ejWaitingPopup("hide");
            if (!data.Status) {
                messageBox("su-filter", "[[[Add View]]]", "[[[View Name already exist.]]]", "success", function () {
                    onCloseMessageBox();
                });
                $('#filter-name-input').addClass("has-error");
            }
            else {
                messageBox("su-filter", "[[[Add View]]]", "[[[View has been added successfully.]]]", "success", function () {
                    onCloseMessageBox();
                });

                var SavedViewId = data.ItemsView[0].ViewId;
                $("#update-view").attr("viewid", SavedViewId);
                $("#save-section").hide();
                $("#save-lable-section label").html("");
                link = '<a class="saved-view-link txt-overflow" href="/' +
                            pageurl +
                            '?viewid=' +
                            SavedViewId +
                            '" target="_blank" data-toggle="tooltip" data-original-title="' + SaveFilterName + '">' +
                            SaveFilterName +
                            '</a>';
                $("#save-lable-section label").append(link);
                $("#save-lable-section").show();
                $("#new-save").hide();
                $("#saved-filter-update").show();
                $("#update-view").addClass("pointer-events");
                $("#update-view").css("opacity", 0.5);
                $("#saved-filter-Saveas").hide();
                GetSavedFilter();
                refreshScroller();
            }
        },
        error: function (data) {
            $("#report-view-toogle").ejWaitingPopup("hide");
            messageBox("su-filter", "[[[Add View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                onCloseMessageBox();
            });
            $("#report-view-toogle").ejWaitingPopup("hide");
        }
    });
}


//Get Saved Filters
function GetSavedFilter() {    
        var reportViewDiv = document.getElementById("report-views");
        reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");        
        $.ajax({
            type: "POST",
            url: getSavedViewUrl,
            data: { itemId: item_Id, UserId: userId, UserName: userName },
            success: function (data) {
                $('#saved-filter').html("");
                var savedFilter =
                    '<div id="save-view-label"><label class="save-filter-head">[[[SAVED VIEWS]]]</label></div><div id="saved-list" style="display: block"><div class="saved-list-content-div" style="float: left">'
                var Result = jQuery.parseJSON(data.Result);
                if (Result.length > 0) {
                    containSaveFilter = true;
                    $("#saved-filter").show();
                    for (var i = 0; i < Result.length; i++) {
                        var ViewId = Result[i].ViewId;
                        var savedFilterOptions = "";
                        if (Result[i].CanDelete && Result[i].CanShare) {
                            savedFilterOptions =
                                '<div class="saved-opt"><span class="opt" viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"><span viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"  class = "delete su su-delete cursor-pointer" data-toggle="tooltip" data-original-title="[[[Delete]]]" ></span></span><span class="opt" viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"><span  viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '" class = "share su su-share-circle  cursor-pointer" data-toggle="tooltip" data-original-title="[[[Share]]]"></span></span><span class="opt" viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"><span  viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '" class ="su su-copy View-link-copy cursor-pointer" data-original-title="[[[Click to copy]]]" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                        } else if (Result[i].CanDelete) {
                            savedFilterOptions =
                                '<div class="saved-opt"><span class="opt" viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"><span viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"  class = "delete su su-delete cursor-pointer" data-toggle="tooltip" data-original-title="[[[Delete]]]" ></span></span><span class="opt" viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"><span  viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '" class = "su su-copy View-link-copy cursor-pointer" data-original-title="[[[Click to copy]]]" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                        } else if (Result[i].CanShare) {
                            savedFilterOptions =
                                '<div class="saved-opt"><span class="opt" viewid="' + ViewId + '" itemId="' + item_Id + '" viewname="' + Result[i].ViewName + '"><span  viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '" class = "share su su-share-circle  cursor-pointer" data-toggle="tooltip" data-original-title="[[[Share]]]"></span></span><span class="opt" viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '"><span  viewid="' +
                                ViewId +
                                '" itemId="' +
                                item_Id +
                                '" viewname="' +
                                Result[i].ViewName +
                                '" class = "su su-copy View-link-copy cursor-pointer" data-original-title="[[[Click to copy]]]" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                        } else {
                            savedFilterOptions =
                               '<div class="saved-opt"><span class="opt" viewid="' + ViewId + '" itemId="' + item_Id + '" viewname="' + Result[i].ViewName + '"><span  viewid="' +
                               ViewId +
                               '" itemId="' +
                               item_Id +
                               '" viewname="' +
                               Result[i].ViewName +
                               '" class = "su su-copy View-link-copy cursor-pointer" data-original-title="[[[Click to copy]]]" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                        }
                        if (pageurl.indexOf("/embed/") > -1) {
                            pageurl = pageurl.replace("/embed/", "/");
                        }

                        savedFilter += '<li class="saved-view" viewid="' +
                            ViewId +
                            '">' + savedFilterOptions +
                            '<label class="saved-filter cursor-pointer txt-overflow" viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '"><a class="view-link txt-overflow saved-filter-anchor" href="' +
                            pageurl +
                            '?viewid=' +
                            ViewId +
                            '" data-url="' +
                            pageurl +
                            '?viewid=' +
                            ViewId +
                            '" target="_blank" data-toggle="tooltip" data-original-title="' + Result[i].ViewName + '">' +
                            Result[i].ViewName +
                            '</a></label></li>';
                    }
                    $('#saved-filter').append(savedFilter + '</div></div>');
                    if ($('#saved-filter').length == 0) {
                        var links = parent.$('.view-link').attr('data-url');
                        for (var i = 0; i < links.length; i++) {
                            parent.$('.view-link').eq(i).attr('href', parent.$('.view-link').eq(i).attr('data-url'));
                        }
                    }
                    else {
                        var links = $('.view-link').attr('data-url');
                        for (var i = 0; i < links.length; i++) {
                            $('.view-link').eq(i).attr('href', $('.view-link').eq(i).attr('data-url'));
                        }
                    }
                    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
                        $(".View-link-copy").removeClass("su su-copy");
                        $(".View-link-copy").attr("data-original-title", "");
                    }
                    $("#report-view-toogle").show();
                    $('[data-toggle="tooltip"]').tooltip();
                } else {
                    containSaveFilter = false;
                    $("#saved-filter").hide();
                    reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");
                }
                SavedViewHeight();
                refreshScroller();
            },
            error: function (data) {
                SavedViewHeight();
                refreshScroller();
            }
        });
}


//Open the Saved view in new tab
$(document).on("click", ".view", function () {
    var viewId = $(this).attr("viewid");
    window.open(window.location.pathname + '?viewid=' + viewId, '_blank');
});

//Share View Dialog box
$(document).on("click", ".share", function () {
    var viewId = $(this).attr("viewid");
    ShareView(viewId);
});

//update view action
$(document).on("click", "#update-view", function () {
    $("#update-view").show();
    var reportViewDiv = document.getElementById("report-views");
    if (reportViewDiv.style.display == 'block' || reportViewDiv.style.display == '') {
        $("#report-view-toogle").ejWaitingPopup("show");
    }

    var proxy = $('#sync_report_viewer').data('ejReportViewer');
    var queryString = saveQueryString != "" ? saveQueryString : QueryStringFormation(false);
    $.ajax({
        type: "POST",
        url: updateViewUrl,
        data: { itemId: item_Id, QueryString: queryString, ViewId: $(this).attr("viewid"), UserId: userId, UserName: userName },
        beforeSend: function (req) {
            req.setRequestHeader('ejAuthenticationToken', proxy._authenticationToken);
        },
        success: function (data) {
            if (data.Result.Status == true) {
                initialQueryString = queryString;
                $("#update-view").addClass("pointer-events");
                $("#update-view").css("opacity", 0.5);
                messageBox("su-filter", "[[[Update View]]]", "[[[View has been updated successfully.]]]", "success", function () {
                    onCloseMessageBox();
                });
            }
            else {
                $("#save-section").hide();
                messageBox("su-filter", "[[[Update View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                    onCloseMessageBox();
                });
            }
        },
        error: function () {
            $("#report-view-toogle").ejWaitingPopup("hide");
            messageBox("su-filter", "[[[Update View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                onCloseMessageBox();
            });
        }
    });
    $("#report-view-toogle").ejWaitingPopup("hide");
});

//save-as-view action
$(document).on("click", "#save-as-view", function () {
    $("#view-name").hide();
    $("#filter_name").val("");
    $("#save-lable-section").hide();
    $("#save-section").show();
});

//Reset and clear Views
$(document).on("click", ".clear", function () {
    $("#filter_name").val("");
    reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");   
    reportviewerObj.reload();
    GetSavedFilter();
    $("#view-name").show();
    $("#save-section").hide();
    $("#unsaved-filter").show();
    $("#save-lable-section").show();
    $("#update-view").removeClass("pointer-events");
    $("#update-view").css("opacity", 1);
});

$(document).on("click", "#clear-txt", function () {
    $("#filter_name").val("");
    $("#save-lable-section").show();
    $("#save-section").hide();
});

//Delete Dialog Close
function onDeleteItemDialogClose() {
    $("#delete-div").ejDialog("close");
}

//Delete dialog open
function onDeleteItemDialogOpen() {
    $("#delete-div").ejDialog("open");
    $("#delete-msg").show();
    $('#delete-div').focus();
}

var deletedViewId = "";
//Delete Saved View
$(document).on("click", ".delete", function (e) {
    onDeleteItemDialogOpen();
    var viewid = $(this).attr("viewid");
    var viewName = $(this).attr("viewname");
    $("#delete_item").attr("viewid", viewid);
    $("#delete_item_name").html(viewName);
    $("#delete-content").show();
    $(".validationArea").show();
    $(".deleteItem").removeClass("centerAlign");
    $("#delete-confirmation").hide();
    $("#delete-error").hide();
    $(".successArea").hide();
});

//Delete Confirm Action
$(document).on("click", "#delete_item", function () {
    var reportViewDiv = document.getElementById("report-views");
    if (reportViewDiv.style.display == 'block' || reportViewDiv.style.display == '') {
        $("#delete-div_wrapper").ejWaitingPopup("show");
    }
    deletedViewId = $("#update-view").attr("viewid");
    var currentId = $(this).attr("viewid");
    var ItemRequest = { ItemViewName: $("#filter_name").val(), itemId: item_Id, UserId: userId, UserName: userName }
    $.ajax({
        type: "POST",
        url: deleteViewUrl,
        data: { ItemViewName: $("#filter_name").val(), itemId: item_Id, ViewId: $(this).attr("viewid"), UserId: userId, UserName: userName },
        success: function (data) {
            if (data.Result.Status == true) {
                $("#delete-content").hide();
                $("#delete-confirmation").show();
                $("#delete-confirmation .deleteItem").show();
                $(".successArea").show();
                $(".validationArea").hide();
                $(".deleteItem").addClass("centerAlign");
                if (currentId == deletedViewId) {
                    window.location.href = ((window.location.origin + window.location.pathname));
                }
                GetSavedFilter();
            }
            else {
                ("#delete-content").hide();
                $("#delete-confirmation").hide();
                $("#delete-error").show();
                $(".deleteItem").addClass("centerAlign");
                $(".successArea").show();
            }

            $("#delete-div_wrapper").ejWaitingPopup("hide");
        },
        error: function (data) {
            $("#delete-div_wrapper").ejWaitingPopup("hide");
            messageBox("su-delete", "[[[Update View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                onCloseMessageBox();
            });
        }
    });
});

//Show Save text box section
$(document).on("click", "#save-view", function () {
    $("#save-section").show();
    $("#save-lable-section").hide();
    $("#filter_name").val("");
    $("#filter_name").focus();
});

//Copy View-Link
$(document).on("click", ".View-link-copy", function (e) {
    var browser = ej.browserInfo();
    if ($(e.target).parents().closest('li').length) {
        var parentElement = $(e.target).parents().closest('li');
        if (parentElement.find('.view-link').length) {
            var tempText = document.createElement("textarea");
            tempText.id = "copyTextArea";
            tempText.innerText = window.location.origin + parentElement.find('.view-link').attr('href');
            document.querySelector("body").appendChild(tempText);
            var existsTextarea = document.getElementById("copyTextArea");
            existsTextarea.select();
            if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
                $(this).removeClass("su su-copy");
                $(this).attr("data-original-title", "");
            }
            else {
                // copy the text to the clipboard
                document.execCommand('copy');

                $(this).attr("data-original-title", "Copied").tooltip("show");

                setTimeout(function () {
                    $(".View-link-copy").attr("data-original-title", "[[[Click to copy]]]"); $(".View-link-copy").tooltip();
                }, 3000);
            }
            document.querySelector("body").removeChild(tempText);
        }

    }

});

//Saved Views List Height
function SavedViewHeight() {
    if ($('#save-view-label').css('display') != "none") {
        var expandCollpase = $("#header-pane");
        var savelabel = $("#entire-label-section");
        var unsaveFilter = $("#unsaved-filter");
        var unsaveFilterTitle = $("#unsaved-filter-title");
        var noFilter = $("#nofilters");
        var height = ($(window).height() - expandCollpase.outerHeight() - savelabel.outerHeight() - (noFilter.css("display") != "none" ? noFilter.outerHeight() : 0) - (unsaveFilter.css("display") != "none" ? unsaveFilter.outerHeight() : 0) - (unsaveFilterTitle.css("display") != "none" ? unsaveFilterTitle.outerHeight() : 0) - 125);
        $("#saved-list").css("height", height);
        return height;
    }   
}

function getFnObj(obj) {
    if (typeof obj === "function") return obj;
    if (typeof obj === "string" && window[obj])
        return obj;
};

function refreshScroller() {
    var scrollerHeight = "";
    var scrollerWidth = 500;
    var scrollerHeightSavedFilter = "";
    if ($("#unsaved-filter-parameter").children().length) {
        scrollerHeight = $("#unsaved-filter-parameter").height() >= 230 ? 230 : $("#unsaved-filter-parameter").height() + 20;
        $("#unsaved-filter").ejScroller({
            height: scrollerHeight,
            width: scrollerWidth,
            scrollerSize: 6,
            buttonSize: 0,
            enableTouchScroll: iframeUrl == parentUrl ? parent.$("#is_mobile").val() != "false" : $("#is_mobile").val() != "false"
        });
        var scrollercontrol = $("#unsaved-filter").ejScroller("instance");
        scrollercontrol.model.height = scrollerHeight;
        scrollercontrol.refresh();
        if ($("#unsaved-filter .e-vhandle").length) {
            var element = $("#unsaved-filter .e-vhandle");
            if (!(element.css('display') == "none")) {
                var height = element.height() + 29;
                element.css("height", height);
            }
        }
    }
    scrollerHeightSavedFilter = SavedViewHeight() - 10;
    if ($("#saved-list").length) {
        $("#saved-list")
            .ejScroller({
                height: scrollerHeightSavedFilter,
                width: scrollerWidth,
                scrollerSize: 6,
                buttonSize: 0,
                enableTouchScroll: iframeUrl == parentUrl ? parent.$("#is_mobile").val() != "false" : $("#is_mobile").val() != "false"
            });
        var scrollercontrolSaved = $("#saved-list").ejScroller("instance");
        scrollercontrolSaved.model.height = scrollerHeightSavedFilter;
        scrollercontrolSaved.refresh();
        if ($("#saved-filter .e-vhandle").length) {
            var element = $("#saved-filter .e-vhandle");
            if (!(element.css('display') == "none")) {
                var height = element.height() + 29;
                element.css("height", height);
            }
        }
    }
}


//filter details

var containsFilter = false;
var viewReportClick = false;

function ViewReportClick(args) {
    viewReportClick = true;
        var filtered_li = "";
        $("#current-views-head").show();
        reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");
        var paramters = reportviewerObj.getParameters();

        for (var i = 0; i < args.length; i++) {

            if (i >= 1) {
                filtered_li += "<hr/>";
            }
            var paramName = args[i].Name.trim();

            filtered_li += "<li class='unsaved-filter'><div class='param-name'>[[[" +
                paramName +
                "]]]</div><div class='param-value'rel='tooltip' data-placement='left' data-original-title='[[[" + args[i].Labels[0] + "]]]'>[[[" +
                appliedParametersForUI(args[i]) +
                "]]]</div></li>";
        }
        saveQueryString = QueryStringFormation(args, true);

        var url = "";

        if ($("#report-filter-query-name").val() != undefined && $("#report-filter-query-value").val() != undefined) {
            if (parameterArray != null && valueArray != null) {
                for (i = 0; i < parameterArray.length; i++) {
                    url += parameterArray[i] + "=" + valueArray[i] + "&";
                }
            }
        }

        url = url.slice(0, -1);

        if (iframeUrl == parentUrl) {
            if (parent.window.innerWidth >= 1041) {
                if (parent.history.pushState != undefined) {
                    parent.history.pushState(url, "", (parent.location.href));
                }
            }
        }
        else {
            if (window.innerWidth >= 1041) {
                if (history.pushState != undefined) {
                    history.pushState(url, "", (location.href));
                }
            }
        }

        $("#unsaved-filter-parameter").show();
        $('#unsaved-filter-parameter').html('');
        $('#unsaved-filter-parameter').append(filtered_li);
        $("#unsaved-filter,#unsaved-filter-parameter").show();
        $("#save-lable-section").show();
        $("[rel=tooltip]").tooltip({ html: true });
        if (enableComment.toString().toLowerCase() == "true") {
            if ($("#saved-filter-update").css('display') != 'none')
            {
                if (!(initialQueryString == saveQueryString)) {
                    $("#update-view").removeClass("pointer-events");
                    $("#update-view").css("opacity", 1);
                } else {
                    $("#update-view").addClass("pointer-events");
                    $("#update-view").css("opacity", 0.5);
                }
            }            
        }
        refreshScroller();
}

function appliedParametersForUI(args) {
    var values = "";
	if(args.DataType == "DateTime"){
	values = args.Value;
	}
    else if (((args.Labels === null || args.Labels === "undefined" || args.Labels === ""))) {
        values = args.Label;
    }
    else {
        values = args.Labels.toString();
    }

    return values;
}

//unsavedFilters
function unsavedFilters(args) {
    reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");
    var filtered_li = "";
    $("#unsaved-filter-head").show();
    jQuery.each(args,
        function (index, item) {
            if ($.isNumeric(index)) {
                if (index >= 1) {
                    filtered_li += "<hr/>";
                }
                var paramName = args[index].Prompt.trim();
                filtered_li += "<li class='unsaved-filter'><div class='param-name'>[[[" +
                    paramName +
                    "]]]</div><div class='param-value'rel='tooltip' data-placement='left' data-original-title='[[[" + args[index].Value + "]]]'>[[[" +
                    appliedParametersForUI(args[index]) +
                    "]]]</div></li>";
            }
        });
    
    saveQueryString = initialQueryString = QueryStringFormation(args, isFirstRequest);

    var url = "";

    if ($("#report-filter-query-name").val() != undefined && $("#report-filter-query-value").val() != undefined) {
        if (parameterArray != null && valueArray != null) {
            for (i = 0; i < parameterArray.length; i++) {
                url += parameterArray[i] + "=" + valueArray[i] + "&";
            }
        }
    }

    url = url.slice(0, -1);
    
    if (iframeUrl == parentUrl) {
        if (isFirstRequest && parent.window.innerWidth >= 1041) {
            if (parent.history.pushState != undefined) {
                parent.history.pushState(url, "", (parent.location.href));
            }
        }
    }
    else {
        if (isFirstRequest && window.innerWidth >= 1041) {
            if (history.pushState != undefined) {
                history.pushState(url, "", (location.href));
            }
        }
    }
        
    isFirstRequest = false;

    $("#unsaved-filter-parameter").show();
    $('#unsaved-filter-parameter').html('');
    $('#unsaved-filter-parameter').append(filtered_li);
    $("#unsaved-filter,#unsaved-filter-parameter").show();
    $("#save-lable-section").show();
    $("[rel=tooltip]").tooltip({ html: true });
}

//Formation of QueryString
function QueryStringFormation(args, isFilterUpdate) {
    reportviewerObj = $("#sync_report_viewer").data("ejReportViewer");
    var queryString = "";
    parameterArray = [];
    valueArray = [];
    jQuery.each(args,
        function (index, item) {
            if ($.isNumeric(index)) {
                var value = args[index].IsMultiValue ? args[index].Values : (args[index].Value != undefined ? args[index].Value : args[index].Values);
                var parameterValue = "";
                if ($.isArray(value)) {
                    if (value.length > 1) {
                        for (var t = 0; t < value.length; t++) {
                            parameterValue += "\"" + value[t] + "\"" + ",";
                        }
                    }
                    var lastChar = parameterValue.slice(-1);
                    if (lastChar == ',') {
                        parameterValue = parameterValue.slice(0, -1);
                    }
                }
                if (parameterValue == "") {
                    parameterValue ="\"" + value + "\"";
                }
                var nullable = args[index].IsNullable != undefined ? args[index].IsNullable.toString().toLowerCase() : args[index].Nullable.toString().toLowerCase();
                queryString += "{\"name\":\"" + args[index].Name + "\",\"values\":[" + parameterValue + "],\"nullable\":" + nullable + "},";
                if (isFilterUpdate) {
                    parameterArray.push(args[index].Name.trim());
                    valueArray.push(value);
                }
            }
        });

    if (isFilterUpdate) {
        $("#report-filter-query-name").val(JSON.stringify(parameterArray));
        $("#report-filter-query-value").val(JSON.stringify(valueArray));
    }

    queryString = queryString.slice(0, -1);
    return queryString;
}

//MessageBox

function onCloseMessageBox() {
    $("#messageBox").ejDialog("close");
}

function onMessageDialogClose() {
    $("#messageBox").find(".message-content").text("");
    $(".message-box-btn-holder").html("");
    $(".message-box-close").html("");
}

function messageBox(messageIcon, messageHeader, messageText, type, successCallback, errorCallback, width, height, maxHeight) {
    $("#messageBox").find(".message-content").text("");
    $(".message-box-btn-holder").html("");
    $(".message-box-close").html("");
    $("#messageBox").find(".message-header").html("<span class='su " + messageIcon + "'></span> <span class='modal-title' data-toggle='tooltip' data-placement='bottom' data-container='body' title='" + messageHeader + "'  >" + messageHeader + "</h2>");
    $("#messageBox").find(".message-content").html(messageText);
    if (type == "error") {
        var successButton;
        var closeIcon;
        var errorButton;
        if (successCallback != undefined) {
            successButton = $("<input type='button' class='critical-action-button pull-right' value='[[[Yes]]]'></input>");
            successButton.bind("click", $.proxy(getFnObj(successCallback), window));
        }
        if (errorCallback != undefined) {
            errorButton = $("<input type='button' class='secondary-button pull-right' value='[[[No]]]'></input>");
            errorButton.bind("click", $.proxy(getFnObj(errorCallback), window));
            closeIcon = $('<span class="su su-close"></span>');
            closeIcon.bind("click", $.proxy(getFnObj(errorCallback), window));
        }
        else {
            errorButton = $("<input type='button' class='secondary-button pull-right' value='[[[No]]]'></input>");
            closeIcon = $('<span class="su su-close"></span>');
            errorButton.click(function () {
                onCloseMessageBox();
            });
            closeIcon.click(function () {
                onCloseMessageBox();
            });
        }
        $(".message-box-close").html(closeIcon);
        $(".message-box-btn-holder").append(errorButton, successButton);
        $("#messageBox").unbind("keydown");
    }
    else {
        var successButton;
        var closeIcon;
        if (successCallback != undefined) {
            successButton = $("<input type='button' class='secondary-button' value='[[[OK]]]'></input>");
            successButton.bind("click", $.proxy(getFnObj(successCallback), window));
            closeIcon = $('<span class="su su-close"></span>');
            closeIcon.bind("click", $.proxy(getFnObj(successCallback), window));
        }
        else {
            successButton = $("<input type='button' class='secondary-button' value='[[[OK]]]'></input>");
            closeIcon = $('<span class="su su-close"></span>');
            successButton.click(function () {
                onCloseMessageBox();
            });
            closeIcon.click(function () {
                onCloseMessageBox();
            });
        }
        $(".message-box-close").html(closeIcon);
        $(".message-box-btn-holder").append(successButton);
        $("#messageBox").on("keydown", function (event) {
            switch (event.keyCode) {
                case 13:
                case 27:
                    successButton.click();
            }
        });
    }

    $('[data-toggle="tooltip"]').tooltip();
    $("#messageBox").ejDialog("open");
    $("#messageBox").focus();
    setTimeout(function () {
        var sizeobj = $("#messageBox").data("ejDialog");
        if (width != undefined)
            sizeobj.option("width", width);
        if (window.innerWidth > 1040) {
            if (height == undefined)
                height = $("#messageBox").find(".modal-content").height() + 135 + "px";
        }
        sizeobj.option("height", height);
        if (maxHeight != undefined)
            sizeobj.option("maxHeight", maxHeight);
    }, 50);
}