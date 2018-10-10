$(document).ready(function () {
    ej.ReportViewer.prototype._onReporClick = function (e) {
        if ($("#sync_report_viewer_toolbar_com").hasClass("active-icon")) {
            if (typeof (e.target.attributes['id']) != "undefined") {
                if (!(e.target.attributes['id'].value == "sync_report_viewer_toolicon_com" || e.target.attributes['id'].value == "sync_report_viewer_toolbar_com" || e.target.attributes['id'].value == "commentImage_popup_image" || e.target.attributes['id'].value == "commentImage_popup_wrapper" || e.target.attributes['id'].value == "commentImage_popup_overLay")) {
                    closeReportComment();
                    $("#sync_report_viewer_toolbar_com").toggleClass("active-icon");
                }
            } else if (e.target.className == "su su-close")
            {
                return;
            }
            else if (!((e.target.className == "su su-with-comment server-comment active") || (e.target.className == "su su-without-comment server-comment active"))) {
                closeReportComment();
                $("#sync_report_viewer_toolbar_com").toggleClass("active-icon");
            }
        }
    };
});

$(document).ready(function () {
    var popupHeight = $("#viewShare_popup").height();
    $("#sharepopup_wrapper_WaitingPopup .e-image").css("top", parseInt(parseInt(popupHeight) / 2) - 30);

    if ($("#is_mobile").val() == "true"  && publicReportAuthentication.toLowerCase() == "true") {
        var mobHeight = $(window).height() - 50;
        $("#sync_report_viewer").css("height", mobHeight);
        $(".server-report-view").css("height", mobHeight);
    }
});

$(window).on("orientationchange", function () {
    if ($("#is_mobile").val() == "true") {
        window.setTimeout(function () {
            var mobHeight = $(window).height();
            if (publicReportAuthentication.toLowerCase() == "true") {
                mobHeight = mobHeight - 50;
                $("#sync_report_viewer").css("height", mobHeight);
                $(".server-report-view").css("height", mobHeight);
            }
            else {
                $("#sync_report_viewer").css("height", mobHeight);
                $(".server-report-view").css("height", mobHeight);
            }
        }, 200);
    }
});

function openReportComment() {
    var itemId = $("#report_Comment").attr("data-item-id");
    var dashboardItemId = $("#dashboard_Comment").attr("data-item-id")
    $("#sync_report_viewer_toolbar_com").toggleClass("active-icon");
    $("#commentModuleContainer").toggleClass("displayNone");
    if ($("#commentModuleContainer").hasClass("displayNone")) {
        closeReportComment();
    } else {
        var headerHeight = $("#is_mobile").val() == "true" ? 0 : $(".e-reportviewer-toolbarcontainer").outerHeight();
        $("#commentModuleContainer").css({ 'height': $(window).height() - ($(".e-reportviewer-toolbarcontainer").outerHeight()), 'top': headerHeight, 'border-top-left-radius': 0 });
        if (typeof (window.frames[0].GetAllComments) === 'function') {
            window.frames[0].GetAllComments(itemId, "report", dashboardItemId, "desc");
        } else {
            $('#commentModuleContainer_iframe').on('load', function () {
                window.frames[0].GetAllComments(itemId, "report", dashboardItemId, "desc");
            });
        }
    }
};

function closeReportComment() {
    $("#commentImage_popup").ejDialog("close");
    $("#commentModuleContainer").addClass("displayNone");
    $("#delete_popup_iframe").addClass("displayNone");

    if ($("#is_mobile").val() == "true") {
        $('#sync_report_viewer').show();
        if ($("#server-mobile-navbar .server-comment").hasClass('active')) {
            $("#server-mobile-navbar a.active").removeClass("active");
            $("#server-mobile-navbar .su-report").addClass('active');
        }
    }
}
function closeCommentOnResize() {
    if ($("#is_mobile").val() == "false") {
        closeReportComment();
    }
}

function openComments() {
    var commentId = getUrlVars(window.location.href.split('#')[0])["comment"];
    if ($("#is_mobile").val() == "true" && window.innerWidth < 410 && typeof (commentId) !== "undefined") {
        $("#sync_report_viewer").hide();
    }
    
    if (typeof (commentId) !== "undefined" && $("#comment_Type").attr("data-item-type").toLowerCase() == "report") {
        if ($("#is_mobile").val() == "true") {
            if (window.innerWidth < 410) {
                $("#sync_report_viewer").hide();
            }
            $("#server-mobile-navbar").find(".server-comment").trigger("click");
        } else {
            $("#sync_report_viewer_toolbar_com").trigger("click");
        }
    }
}

function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function dynamicwithoutCommentIconChange() {
    $("#sync_report_viewer_toolicon_com").removeClass("su-with-comment").addClass("su-without-comment");
}

function dynamicwithCommentIconChange() {
    $("#sync_report_viewer_toolicon_com").removeClass("su-without-comment").addClass("su-with-comment");
}

$(window).on("orientationchange", function () {
    closeReportComment();
});