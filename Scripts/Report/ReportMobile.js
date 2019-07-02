$(document).on("click", "#server-mobile-navbar .server-comment", function () {
    if (!$(this).hasClass("active")) {
        $("a.active").removeClass("active");
        $("#report-view-toogle").removeClass("report-view-toogle");
        $(this).addClass('active');
        if ($("#comment_Type").attr("data-item-type") == "report") {
            $("#sync_report_viewer_toolbar_com").trigger("click");
        }
        if ($("#is_mobile").val() == "true" && window.innerWidth < 410) {
            $("#sync_report_viewer").hide();
        }
    } else {
        showRenderTab();
    }
});

$(document).on("click", "#server-mobile-navbar .su-report", function () {
    showRenderTab();
});

$(document).on("click", "#server-mobile-navbar .server-item-view", function (e) {
    if (!$(this).hasClass("active")) {
        $("a.active").removeClass("active");
        $("#sync_report_viewer").show();
        if($("#comment_Type").attr("data-item-type") == "report"){
            closeReportComment();
        }
        $(this).addClass('active');
        $("#expand-collapse").click();
    } else {
        showRenderTab();
    }
});

$(document).on("click", "#server-mobile-navbar .su-nav-home", function (e) {
    if (!$(this).hasClass("active")) {
        $("a.active").removeClass("active");
        $(this).addClass('active');
    }
});

function showRenderTab() {
    $("a.active").removeClass("active");
    $(".su-report").addClass('active');
    $("#report-view-toogle").removeClass("report-view-toogle");
    $("#sync_report_viewer").show();
    if ($("#comment_Type").attr("data-item-type") == "report") {
        closeReportComment();
    }
}

$(document).on("touchend", "[data-toggle='tooltip']", function (e) {
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
        $(this).click();
    }
});