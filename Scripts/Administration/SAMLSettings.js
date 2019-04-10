var isKeyUp = false;
$(document).ready(function() {
    addPlacehoder("body");
    $("#UpdateSAMLSettings-bottom").on('click', function() {
        $(".confirmatioMessage").hide();
        if (!$("#saml-setting").valid()) {
            return;
        }

        var samlSettingsData = {
            IsEnabled: $("#enable-sso").prop("checked"),
            MetadataURI: $("#metadataURI").val(),
            DesignerClientId: $("#designerClientId").val(),
            TenantName: $("#tenantName").val(),
            Authority: $("#authority").val()
        };

        $.ajax({
            type: "POST",
            url: "/Administration/UpdateSAMLSettings",
            data: { samlSettingsData: samlSettingsData },
            beforeSend: showWaitingPopup($("#base_container")),
            success: function (success) {
                hideWaitingPopup($("#base_container"));
                if (success)
                    messageBox("su-single-sign-on", "[[[SSO Settings]]]", "[[[SSO settings has been updated. The application will be restarted automatically inorder to apply this changes.]]]", "success", function () {
                        location.href = "/";
                    });
                else
                    $(".validate-error").show();
                $(".error-message, .success-message").css("display", "none");
            }
        });
    });

    $.validator.addMethod("IsValidMetaDataUrl", function (value, element) {
        if (isKeyUp)
            return true;
        else
            return IsValidMetaDataUrl(value);
    }, "Invalid Metadata URI");

    $('#saml-setting').validate({
        errorElement: 'span',
        onkeyup: function (element, event) { if (event.keyCode != 9) $(element).valid(); else true; },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "metadataURI": {
                required: true
                //IsValidMetaDataUrl: true
            },
            "authority": {
                required: true
            },
            "designerClientId": {
                required: true
            },
            "tenantName": {
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.form-input-field').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('.form-input-field').removeClass('has-error');
            $(element).parent().find("span.validation-message").html("");

        },
        errorPlacement: function (error, element) {
            $(element).parent().find("span.validation-message").html(error);
        },
        messages: {
            "metadataURI": {
                required: "Please enter Metadata URI"
            },
            "authority": {
                required: "Please enter Authority URL"
            },
            "designerClientId": {
                required: "Please enter Designer Client Id"
            },
            "tenantName": {
                required: "Please enter Tenant Name"
            }
        }
    });

});



function IsValidMetaDataUrl(url) {
    var filter = /^(http(s)?:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-]+(\.[a-z]{2,6})?(:\d{1,5})?(\/[a-zA-Z0-9]+[a-zA-Z0-9]*(\.[a-z]{2,8})?)*?$/gm;
    if (filter.test(url)) {
        return true;
    }
    else {
        return false;
    }
}

$(document).on("change", "#enable-sso", function() {
    if ($(this).is(":checked")) {
        $("#metadataURI, #authority, #designerClientId, #tenantName").removeAttr("disabled");
    } else {
        $("#metadataURI, #authority, #designerClientId, #tenantName").attr("disabled", "disabled");
    }
});

$(document).click(function (e) {
    if ($(".popover").children().hasClass("popover-content")) {
        $('.popover-content').attr("id", "popover-content");
        $('.arrow').attr("id", "arrow");
    }
    if (e.target.id != "popover-content" && e.target.id != "arrow" && e.target.id != "relyingParty-info" && e.target.id != "clientId-info" && e.target.id != "authority-info" && e.target.id != "uri-info" && e.target.id != "tenantName-info") {
        $('.popover').css("display", "none");
    }
});