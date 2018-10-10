var browser = ej.browserInfo();
var itemUrl;

$(document).ready(function () {
    $("#get-item-link").ejDialog({
        width: (window.innerWidth > 460) ? "450px" : (window.innerWidth - 10),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "[[[Get Link]]]",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onGetLinkDialogClose",
        open: "onGetLinkDialogOpen"
    });
});

function onGetLinkDialogClose() {
    $("#get-item-link").ejDialog("close");
}
function onGetLinkDialogOpen() {
    var shareLinkDlg = $("#get-item-link");
    $(".private-note").show();
    shareLinkDlg.ejDialog("open");
    shareLinkDlg.show();
    shareLinkDlg.focus();

    $(".get_link").show();
    var itemLink = $("#item-link");
    var getlink = window.location.href.replace(window.location.search, "");

    var newQuery = getlink.substring(getlink.length - 1) == "?" ? "" : "?";

    var queryName = $("#report-filter-query-name").val();
    var queryValue = $("#report-filter-query-value").val();

    if (queryName != undefined && queryName != "" && queryValue != undefined && queryValue != "") {
        var nameArray = JSON.parse($("#report-filter-query-name").val());
        var valueArray = JSON.parse($("#report-filter-query-value").val());
        if (nameArray != null && valueArray != null) {
            for (i = 0; i < nameArray.length; i++) {
                newQuery += nameArray[i] + "=" + valueArray[i] + "&";
            }
        }
    }

    newQuery = newQuery.slice(0, -1);
    getlink += newQuery;

    var getLinkValue = document.getElementById("get-link-url").value != "" ? document.getElementById("get-link-url").value : getlink;

    itemLink.val(getLinkValue);
    $(".report-name").html(getLinkReportName);

    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-link-copy").removeClass("su su-copy").attr("data-original-title", "").hide();
        itemLink.css({ width: "100%", borderRadius: "4px" });
    }
    else {
        $("#item-link-copy").tooltip({
            animation: false
        });
    }

    document.getElementById("item-link").setSelectionRange(0, window.location.href);
}

$(document).on("click", "#item-link-copy", function () {
    $("#item-link").select();

    var copyBtn = $("#item-link-copy");

    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        copyBtn.removeClass("su su-copy").attr("data-original-title", "");
    }
    else {
        document.execCommand("copy");
        copyBtn.tooltip("hide").attr("data-original-title", "[[[Copied]]]").tooltip("fixTitle").tooltip("show");
        setTimeout(function () {
            copyBtn.attr("data-original-title", "[[[Click to copy]]]");
            copyBtn.tooltip();
        }, 3000);
    }
});