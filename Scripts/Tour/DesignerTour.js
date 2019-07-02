var cookieName = "syncfusion.reports.designer.tour";
var filterContent = '';
var saveContent = '';

var tour = new Tour({
    name: "designerTour",
    steps: [
        {
            element: "#container_itemPanelContainer",
            content: $("#tour-div-1").html()
        }, 
        {
            element: "#container_Dataset",
            content: $("#tour-div-2").html(),
            placement: 'left'
        }, 
        {
            element: "#container_Properties",
            content: $("#tour-div-3").html(),
            placement: 'left'
        },  
        {
            element: "#container_Parameters",
            content: $("#tour-div-4").html(),
            placement: 'left'
        },
        {
            element: "#container_ImageManager",
            content: $("#tour-div-5").html(),
            placement: 'left'
        }, 
        {
            element: "#btn-item-preview",
            content: $("#tour-div-6").html(),
            placement: 'bottom',
            backdropPadding: { top: 2, left: 2, right: 4, bottom: 4 }
        },
        {
            element: "#container_toolbar_li_Save",
            content: $("#tour-div-7").html(),
            placement: 'bottom',
            onShow: function (tour) {
                saveContent = $("#container_toolbar_li_Save").attr("data-content");
                $("#container_toolbar_li_Save").removeAttr("data-content");
            },
            onHide: function (tour) {
                $("#container_toolbar_li_Save").attr("data-content", saveContent);
            }
        },
    ],
    container: "body",
    smartPlacement: true,
    keyboard: true,
    storage: window.localStorage,
    backdrop: true,
    backdropContainer: 'body',
    duration: false,
    delay: false,
    autoscroll: false,
    template: "<div class='popover tour'><div class='popover-content'></div>",
    onEnd: function (tour) {
        $("#backdropFallback").addClass("hide");
    },
    onShown: function (tour) {
        onTourStepShown(tour);
        $(".tour-backdrop.left").css("height", ($(".tour-backdrop.left").height() + 1) + "px");
        $(".tour-backdrop.top").css("height", ($(".tour-backdrop.top").height() + 1) + "px");
        $(".popover.tour, .tour-backdrop, .tour-step-backdrop-parent").css("z-index", ej.getMaxZindex() + 1);
    },
    onHidden: function (tour) {
        onTourStepHidden(tour);
    }
});

var datasourceTour = new Tour({
    name: "datasourceTour",
    steps: [
        {
            element: "#container_Dataset",
            content: $("#datasource-tour-div").html(),
            placement: 'left'
        }
    ],
    container: "body",
    smartPlacement: true,
    keyboard: true,
    storage: window.localStorage,
    backdrop: true,
    backdropContainer: 'body',
    duration: false,
    delay: false,
    autoscroll: false,
    template: "<div class='popover tour'><div class='popover-content'></div>",
    onEnd: function (tour) {
        $("#backdropFallback").addClass("hide");
    },
    onShown: function (tour) {
        onTourStepShown(tour);
        $(".popover.tour, .tour-backdrop, .tour-step-backdrop-parent").css("z-index", ej.getMaxZindex() + 1);
    },
    onHidden: function (tour) {
        onTourStepHidden(tour);
    }
});

$(document).on("click", ".add-datasource-button", function () {
    datasourceTour.end();
    $("#container_Dataset").click();
});