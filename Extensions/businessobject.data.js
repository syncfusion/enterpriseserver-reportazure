var ObjectDataSource = (function () {
    function ObjectDataSource(rptDesigner) {
        this.locale = 'en-US';
        this.id = 'object_Container';
        this.reportDesigner = rptDesigner;
        this.connectClick = $.proxy(this.connectDataSource, this);
        this.renderErrorToolTip(this.id);
    }
    ObjectDataSource.prototype.renderConfig = function (targetTag, dataSource, isEdit) {
        this.renderConfiguration(targetTag);
        this.updateDataSource(dataSource);
        this.scrollerRefresh();
    };
    ObjectDataSource.prototype.updateDataSource = function (dataSource) {
        if (!ej.isNullOrUndefined(dataSource)) {
            var connectionProperties = dataSource.ConnectionProperties;
            if (!ej.isNullOrUndefined(connectionProperties.ConnectString) && connectionProperties.ConnectString.length > 0) {
                this.assemblyDropDown.selectItemByValue(connectionProperties.ConnectString);
            }
        }
        this.scrollerRefresh();
    };
    ObjectDataSource.prototype.resetInputFields = function () {
        this.assemblyDropDown.setModel({ dataSource: [] });
        this.hideValidationMsg(this.id + '_object_Ds_assembly');
        this.scrollerRefresh();
    };
    ObjectDataSource.prototype.connectDataSource = function (args) {
        if (!args[0].isCancel) {
            args[0].data = this.getDatasourceInfo(args[0].name);
        }
    };
    ObjectDataSource.prototype.showConfiguration = function (isShow) {
        this.objectContainer.css('display', isShow ? 'table-row' : 'none');
    };
    ObjectDataSource.prototype.renderConfiguration = function (targetTag) {
        if (targetTag.find('#' + this.id + '_object_datasource').length > 0) {
            this.resetInputFields();
        }
        else {
            this.objectContainer = ej.buildTag('div', '', {
                'width': '100%',
                'height': '100%'
            }, { 'id': this.id + '_object_datasource' });
            targetTag.append(this.objectContainer);
            this.renderObjectDatasourcePanel();
        }
        this.showConfiguration(true);
        this.loadAssemblyCatalog();
    };
    ObjectDataSource.prototype.renderObjectDatasourcePanel = function () {
        var configTable = ej.buildTag('table.e-designer-dsconfig-table', '', {
            'width': '100%',
            'padding-left': '5px',
            'margin-left': '0px'
        }, {
            'unselectable': 'on',
            'id': this.id + '_object_basic_config'
        });
        this.objectContainer.append(configTable);
        this.renderDropDownItem(this.getLocale('assemblytext'), this.id + '_object_Ds_assembly', configTable, [], null, this);
        if (this.objectContainer.find('#' + this.id + '_object_Ds_assembly').length > 0) {
            this.assemblyDropDown = this.objectContainer.find('#' + this.id + '_object_Ds_assembly').data('ejDropDownList');
            this.assemblyDropDown.selectItemsByIndices('0');
        }
        this.scrollerRefresh();
    };
    ObjectDataSource.prototype.renderDropDownItem = function (name, id, target, datasource, fnction, context) {
        var row = $('<tr id=' + id + '_tr/>');
        var col = $('<td unselectable=\'on\'/>');
        var bodyTable = $('<table unselectable=\'on\'></table>');
        bodyTable.append(this.getRowCaption(name, id));
        col.append(bodyTable);
        row.append(col);
        target.append(row);
        var rowtxt = $('<tr></tr>');
        var coltxt = ej.buildTag('td', '', {}, { 'colspan': '2', 'id': id + '_td' });
        var dropdown = ej.buildTag('input', '', {}, { 'id': id, 'value': '', 'spellcheck': 'false' });
        coltxt.append(dropdown);
        rowtxt.append(coltxt);
        bodyTable.append(rowtxt);
        var selectedIndex = (id !== this.id + '_object_Ds_assembly') ? '0' : '';
        dropdown.ejDropDownList({
            width: '221px',
            dataSource: datasource,
            fields: { id: 'Id', text: 'Name', value: 'ItemLocation' },
            change: $.proxy(fnction, context),
            selectedIndex: selectedIndex,
            showRoundedCorner: true,
            cssClass: 'e-reportdesigner-dataset-selection e-designer-content-label'
        });
    };
    ObjectDataSource.prototype.getRowCaption = function (caption, id) {
        var row = ej.buildTag('tr', '', {});
        var labelCell = ej.buildTag('td', '', {});
        var label = ej.buildTag('label.editLabel e-designer-title-label', caption, {}, {
            'id': id + '_labelText'
        });
        var infoIcon = ej.buildTag('span.e-dbrd-info-icon', '', {
            'display': 'none',
        }, {});
        labelCell.append(label, infoIcon);
        row.append(labelCell);
        var errorCell = ej.buildTag('td', '', {}, { 'id': id + '_error_icon_td' });
        this.renderErrIndictor(errorCell, this.id);
        row.append(errorCell);
        return row;
    };
    ObjectDataSource.prototype.renderErrIndictor = function (target, ctrlId) {
        var errorIcon = ej.buildTag('span.e-rptdesigner-error-icon e-rptdesigner-errorinfo e-error-tip', '', {
            'float': 'right',
            'display': 'none',
            'padding-right': '2px'
        }, {});
        target.append(errorIcon);
        errorIcon.bind('mouseover mousedown touchstart', $.proxy(this.showErrTip, this, ctrlId));
        errorIcon.bind('mouseleave touchleave', $.proxy(this.hideErrTip, this, ctrlId));
    };
    ObjectDataSource.prototype.showErrIndictor = function (target, isEnable, errMsg) {
        var errorIcon = target.find('.e-error-tip');
        errorIcon.attr('e-errormsg', errMsg).css('display', isEnable ? 'block' : 'none');
    };
    ObjectDataSource.prototype.showErrTip = function (ctrlId, args) {
        args.preventDefault();
        var targetEle = $(args.currentTarget);
        var tooltip = $('#' + ctrlId + '_error_tooltip');
        $('#' + ctrlId + '_error_tooltip_content').text(targetEle.attr('e-errormsg'));
        var eleOffset = targetEle.offset();
        tooltip.css({
            left: (eleOffset.left + (targetEle.width() / 2)) - tooltip.width(),
            top: eleOffset.top + targetEle.height() + (targetEle.height() / 2),
            'display': 'block'
        });
    };
    ObjectDataSource.prototype.hideErrTip = function (ctrlId, args) {
        $('#' + ctrlId + '_error_tooltip').css('display', 'none');
    };
    ObjectDataSource.prototype.renderErrorToolTip = function (id) {
        if ($('#' + id + '_error_tooltip').length === 0) {
            var toolTip = ej.buildTag('div.e-designer-right-tip e-tooltip-wrap e-widget e-designer-tooltip e-rptdesigner-error-tip', '', {
                'display': 'none'
            }, {
                'id': id + '_error_tooltip'
            });
            var tipContainer = ej.buildTag('div.e-tipContainer');
            var tipContent = ej.buildTag('div', '', {}, { 'id': id + '_error_tooltip_content' });
            $(document.body).append(toolTip);
            toolTip.append(tipContainer);
            tipContainer.append(tipContent);
        }
    };
    ObjectDataSource.prototype.showValidationMsg = function (id, isShow, msg) {
        var target = $('#' + id + '_error_icon_td');
        var errContainer = $('#' + id + '_td').find('.e-designer-content-label');
        if (isShow) {
            this.showErrIndictor(target, true, msg);
            errContainer.addClass('e-rptdesigner-error');
        }
        else {
            this.showErrIndictor(target, false);
            errContainer.removeClass('e-rptdesigner-error');
        }
    };
    ObjectDataSource.prototype.hideValidationMsg = function (id) {
        this.showValidationMsg(id, false);
    };
    ObjectDataSource.prototype.updateValidationMsg = function (target, id, msg) {
        var toolTipCont = target.find('#' + id + '_error_icon_td .e-error-tip');
        toolTipCont.attr('e-errormsg', msg);
    };
    ObjectDataSource.prototype.getDatasourceInfo = function (dataSourceName) {
        var assemblyURI = this.assemblyDropDown.getSelectedValue();
        this.showValidationMsg(this.id + '_object_Ds_assembly', !assemblyURI, this.getLocale('alertMessage'));
        if (!ej.isNullOrUndefined(assemblyURI) && assemblyURI.length > 0) {
            var reportData = this.createDataSource();
            reportData.Name = dataSourceName;
            reportData.ConnectionProperties.DataProvider = 'Object';
            reportData.ConnectionProperties.ConnectString = assemblyURI;
            return reportData;
        }
        return null;
    };
    ObjectDataSource.prototype.createDataSource = function () {
        var dataSource = {
            __type: 'Syncfusion.RDL.DOM.DataSource',
            Name: '',
            Transaction: false,
            DataSourceReference: null,
            SecurityType: 'None',
            ConnectionProperties: {
                __type: 'Syncfusion.RDL.DOM.ConnectionProperties',
                ConnectString: '',
                EmbedCredentials: false,
                DataProvider: '',
                IsDesignState: false,
                IntegratedSecurity: false,
                UserName: '',
                PassWord: '',
                Prompt: '',
                CustomProperties: []
            }
        };
        return dataSource;
    };
    ObjectDataSource.prototype.loadAssemblyCatalog = function () {
        this.reportDesigner.getInstance('ReportUtil').doAjaxPost('POST', this.reportDesigner.model.serviceUrl + '/PostDesignerAction/', {
            action: ej.ReportUtil.DesignerAction.assemblyCatalog,
            data: JSON.stringify({
                'designerAction': ej.ReportUtil.DesignerAction.assemblyCatalog
            })
        }, {
            fnction: $.proxy(this.populateDataSources, this),
            indicator: [$.proxy(this.showLoadingIndicator, this), $.proxy(this.hideLoadingIndicator, this)]
        });
    };
    ObjectDataSource.prototype.populateDataSources = function (args) {
        if (args && typeof args !== 'string' && args.indexOf('Sf_Exception') === -1) {
            var drpDwnObj = $('#' + this.id + '_object_Ds_assembly').data('ejDropDownList');
            var datasource = [];
            for (var index = 0; index < args.length; index++) {
                var location_1 = args[index].ItemLocation;
                if (!ej.isNullOrUndefined(location_1) && location_1.endsWith('.zip')) {
                    datasource.push(args[index]);
                }
            }
            drpDwnObj.setModel({ dataSource: datasource });
        }
    };
    ObjectDataSource.prototype.showLoadingIndicator = function () {
        $('#' + this.id + '_object_Ds_assembly_dropdown').addClass('e-load');
        $('#' + this.id + '_object_Ds_assembly_dropdown>span').removeClass('e-arrow-sans-down');
    };
    ObjectDataSource.prototype.hideLoadingIndicator = function () {
        $('#' + this.id + '_object_Ds_assembly_dropdown').removeClass('e-load');
        $('#' + this.id + '_object_Ds_assembly_dropdown>span').addClass('e-arrow-sans-down');
    };
    ObjectDataSource.prototype.scrollerRefresh = function () {
        var scrollContainer = $('#' + this.id + '_dsConfigBodyContainer');
        if (!ej.isNullOrUndefined(scrollContainer) && scrollContainer.length > 0
            && !ej.isNullOrUndefined(scrollContainer.data('ejScroller'))) {
            scrollContainer.data('ejScroller').refresh();
        }
    };
    ObjectDataSource.prototype.getLocale = function (text) {
        var objectLocale;
        var defaultLocale = ObjectDataSource.Locale['en-US'];
        if (!ej.isNullOrUndefined(ObjectDataSource.Locale[this.locale])) {
            objectLocale = ObjectDataSource.Locale[this.locale];
        }
        switch (text.toLowerCase()) {
            case 'assemblytext':
                if (objectLocale && objectLocale.assemblyText) {
                    return objectLocale.assemblyText;
                }
                return defaultLocale.assemblyText;
            case 'alertmessage':
                if (objectLocale && objectLocale.alertMessage) {
                    return objectLocale.alertMessage;
                }
                return defaultLocale.alertMessage;
        }
        return text;
    };
    ObjectDataSource.prototype.updateCulture = function (culture) {
        this.locale = culture;
        var assemblyTextField = this.objectContainer.find('#' + this.id + '_object_Ds_assembly_labelText');
        if (!ej.isNullOrUndefined(assemblyTextField) && assemblyTextField.length > 0) {
            assemblyTextField.text(this.getLocale('assemblyText'));
        }
        this.updateValidationMsg(this.objectContainer, this.id + '_object_Ds_assembly', this.getLocale('alertMessage'));
    };
    ObjectDataSource.prototype.dispose = function () {
        if (!ej.isNullOrUndefined(this.objectContainer) && this.objectContainer.length > 0) {
            this.destroyEjObjects(this.objectContainer);
            this.objectContainer.remove();
        }
    };
    ObjectDataSource.prototype.destroyEjObjects = function (ejObjects, isRootEle) {
        var elements = isRootEle ? $(ejObjects) : $(ejObjects).find('.e-js');
        for (var i = 0; i < elements.length; i++) {
            var data = elements.eq(i).data();
            var wds = data['ejWidgets'];
            if (wds && wds.length) {
                for (var j = 0; j < wds.length; j++) {
                    if (data[wds[j]] && data[wds[j]].destroy) {
                        data[wds[j]].destroy();
                    }
                }
            }
        }
    };
    return ObjectDataSource;
}());
ObjectDataSource.Locale = {};
ObjectDataSource.Locale['en-US'] = {
    assemblyText: 'Assembly URI',
    alertMessage: 'Select a Assembly URI'
};
ObjectDataSource.Locale['fr-FR'] = {
    assemblyText: 'URI d\'assemblage',
    alertMessage: 'Sélectionnez un URI d\'assemblage'
};
