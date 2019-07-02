$(document).ready(function () {

    if (($(parent.window).width()) > 1400) {
        $("#user-delete").addClass("lg-flexible");
    }
    if (($(parent.window).width()) < 1400) {
        $("#user-delete").removeClass("lg-flexible");
    }
});

function sortAddedUsers() {
    var options = parent.$("#user-list option");
    options.sort(function (currentOption, nextOption) {
        if (currentOption.text > nextOption.text) return 1;
        else if (currentOption.text < nextOption.text) return -1;
        else return 0;
    });
    parent.$("#user-list").empty().append(options).selectpicker("refresh");
}