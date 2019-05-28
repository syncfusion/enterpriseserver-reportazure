var ODATADataSource = (function () {
    function ODATADataSource() {
        this.locale = 'en-US';
        this.id = 'container';
        this.connectClick = $.proxy(this.connectDataSource, this);
    }
    ODATADataSource.prototype.renderConfig = function (targetTag, dataSource, isEdit) {
        this.renderConfiguration(targetTag);
        this.updateDataSource(dataSource);
    };
    ODATADataSource.prototype.renderConfiguration = function (targetTag) {
        if (targetTag.find('#' + this.id + '_odata_datasource').length > 0) {
            this.resetInputFields();
        }
        else {
            this.odataConfig = ej.buildTag('div', '', {
                'width': '100%', 'height': '100%'
            }, { 'id': this.id + '_odata_datasource' });
            targetTag.append(this.odataConfig);
            this.renderOdataPanel();
            this.renderErrorToolTip(targetTag);
        }
        this.showConfiguration(true);
    };
    ODATADataSource.prototype.renderOdataPanel = function () {
        this.odataPanel = ej.buildTag('div', '', {
            'width': '100%', 'height': '100%'
        }, { 'id': this.id + '_odata_Panel' });
        var odataConfigTable = ej.buildTag('table.e-designer-dsconfig-table', '', {
            'width': '100%'
        }, {
            'unselectable': 'on', 'id': this.id + '_odata_config'
        });
        this.odataConfig.append(this.odataPanel);
        this.odataPanel.append(odataConfigTable);
        this.renderTextArea(this.getLocale('connectionString'), this.id + '_odata_conStr', odataConfigTable);
        this.connString = $('#' + this.id + '_odata_conStr');
    };
    ODATADataSource.prototype.updateDataSource = function (dataSource) {
        if (!ej.isNullOrUndefined(dataSource)) {
            this.connString.val(dataSource.ConnectionProperties.ConnectString);
        }
    };
    ODATADataSource.prototype.connectDataSource = function (args) {
        if (!args[0].isCancel) {
            args[0].data = this.getDatasourceInfo(args[0].name);
        }
    };
    ODATADataSource.prototype.showConfiguration = function (isShow) {
        this.odataConfig.css('display', isShow ? 'table-row' : 'none');
    };
    ODATADataSource.prototype.resetInputFields = function () {
        this.connString.val('');
        this.hideValidationMsg();
    };
    ODATADataSource.prototype.getDatasourceInfo = function (dataSourceName, dataSource) {
        var isValidCon = true;
        if (this.connString.val().length === 0) {
            this.showValidationMsg(this.connString.attr('id'), true, this.getLocale('alertMessage'));
            isValidCon = false;
        }
        else {
            this.hideValidationMsg();
        }
        if (isValidCon) {
            var reportData = this.createDataSource();
            reportData.Name = dataSourceName;
            reportData.SecurityType = 'None';
            reportData.ConnectionProperties.UserName = '';
            reportData.ConnectionProperties.PassWord = '';
            reportData.ConnectionProperties.DataProvider = 'OData';
            reportData.ConnectionProperties.ConnectString = this.connString.val();
            return reportData;
        }
        return null;
    };
    ODATADataSource.prototype.createDataSource = function () {
        var dataSource = {
            __type: 'Syncfusion.RDL.DOM.DataSource',
            Name: '',
            Transaction: false,
            DataSourceReference: null,
            SecurityType: 'none',
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
    ODATADataSource.prototype.getLocale = function (text) {
        var odataLocale;
        var defaultLocale = ODATADataSource.Locale['en-US'];
        if (!ej.isNullOrUndefined(ODATADataSource.Locale[this.locale])) {
            odataLocale = ODATADataSource.Locale[this.locale];
        }
        switch (text.toLowerCase()) {
            case 'connectionstring':
                if (odataLocale && odataLocale.connectionString) {
                    return odataLocale.connectionString;
                }
                return defaultLocale.connectionString;
            case 'alertmessage':
                if (odataLocale && odataLocale.alertMessage) {
                    return odataLocale.alertMessage;
                }
                return defaultLocale.alertMessage;
        }
        return text;
    };
    ODATADataSource.prototype.updateCulture = function (culture) {
        this.locale = culture;
        if (this.connString) {
            this.updateRow(this.odataConfig, this.connString.attr('id'), this.getLocale('connectionString'));
            this.updateValidationMsg(this.odataConfig, this.connString.attr('id'), this.getLocale('alertMessage'));
        }
    };
    ODATADataSource.prototype.renderTextArea = function (name, id, target, value) {
        var row = $('<tr id=' + id + '_tr' + '/>');
        var col = $('<td unselectable=\'on\'/>');
        row.append(col);
        target.append(row);
        var bodyTable = $('<table unselectable=\'on\'></table>');
        col.append(bodyTable);
        bodyTable.append(this.getRowCaption(name, id));
        var rowtxt = $('<tr></tr>');
        var coltxt = ej.buildTag('td', '', {}, { 'colspan': '2', 'id': id + '_td' });
        bodyTable.append(rowtxt);
        rowtxt.append(coltxt);
        var txtbox = ej.buildTag('textarea.e-textarea e-ejinputtext e-designer-content-label e-designer-constr-textarea', value, {
            'height': '65px', 'width': '215px', 'resize': 'none', 'text-indent': '0px', 'overflow': 'hidden'
        }, {
            'id': id, 'type': 'textarea', 'spellcheck': 'false'
        });
        coltxt.append(txtbox);
    };
    ODATADataSource.prototype.getRowCaption = function (caption, id) {
        var row = ej.buildTag('tr', '', {});
        var labelCell = ej.buildTag('td', '', {});
        var label = ej.buildTag('label.editLabel e-designer-title-label', caption, { 'max-width': '200px' }, {});
        labelCell.append(label);
        row.append(labelCell);
        var errorCell = ej.buildTag('td', '', {}, { 'id': id + '_error_icon_td' });
        this.renderErrIndictor(errorCell, this.id + '_configurePane');
        row.append(errorCell);
        return row;
    };
    ODATADataSource.prototype.updateRow = function (target, id, text) {
        target.find('#' + id + '_tr .e-designer-title-label').html(text);
    };
    ODATADataSource.prototype.renderErrIndictor = function (target, tooltipId, errMsg) {
        var errorIcon = ej.buildTag('span.e-rptdesigner-error-icon e-rptdesigner-errorinfo e-error-tip', '', {
            'float': 'right',
            'display': 'none',
            'padding-right': '2px'
        }, {
            'e-errormsg': errMsg,
            'e-tooltipId': tooltipId
        });
        target.append(errorIcon);
    };
    ODATADataSource.prototype.showErrIndictor = function (target, isEnable, errMsg) {
        var errorIcon = target.find('.e-error-tip');
        errorIcon.css('display', isEnable ? 'block' : 'none');
        if (errMsg) {
            errorIcon.attr('e-errormsg', errMsg);
        }
        if (isEnable) {
            var tooltipId = errorIcon.attr('e-tooltipId');
            var ejTooltip = $('#' + tooltipId).data('ejTooltip');
            ejTooltip.setModel({
                target: '.e-rptdesigner-error-icon',
            });
        }
    };
    ODATADataSource.prototype.renderErrorToolTip = function (target) {
        if (target && target.length !== 0 && !target.data('ejTooltip')) {
            target.ejTooltip({
                target: '.e-designer-tooltip',
                position: {
                    target: { horizontal: 'bottom', vertical: 'bottom' },
                    stem: { horizontal: 'right', vertical: 'top' }
                },
                tip: {
                    adjust: {
                        xValue: 10,
                        yValue: 100
                    }
                },
                animation: {
                    effect: 'Fade',
                    speed: 500
                },
                isBalloon: false,
                showShadow: true,
                showRoundedCorner: true,
                content: 'Exception Message is not configured',
                beforeOpen: $.proxy(this.beforeOpenTooltip, this)
            });
        }
    };
    ODATADataSource.prototype.beforeOpenTooltip = function (args) {
        if (args.event && args.event.target) {
            args.cancel = !ej.isNullOrUndefined(args.event.buttons) && args.event.buttons !== 0;
            var target = args.event.target;
            if (target) {
                var tooltipId = $(target).attr('e-tooltipId');
                var errMsg = $(target).attr('e-errormsg');
                var ejTooltip = $('#' + tooltipId).data('ejTooltip');
                ejTooltip.setModel({
                    content: errMsg ? errMsg : ''
                });
            }
        }
    };
    ODATADataSource.prototype.showValidationMsg = function (id, isShow, msg) {
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
    ODATADataSource.prototype.hideValidationMsg = function () {
        this.showValidationMsg(this.connString.attr('id'), false);
    };
    ODATADataSource.prototype.updateValidationMsg = function (target, id, msg) {
        var toolTipCont = target.find('#' + id + '_error_icon_td .e-error-tip');
        toolTipCont.removeAttr('e-errormsg');
        toolTipCont.attr('e-errormsg', msg);
    };
    ODATADataSource.prototype.dispose = function () {
        if (!ej.isNullOrUndefined(this.odataConfig) && this.odataConfig.length > 0) {
            this.destroyEjObjects(this.odataConfig);
            this.odataConfig.remove();
        }
    };
    ODATADataSource.prototype.destroyEjObjects = function (ejObjects, isRootEle) {
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
    return ODATADataSource;
}());
ODATADataSource.Locale = {};
ODATADataSource.Locale['en-US'] = {
    connectionString: 'Connection String',
    alertMessage: 'Specify the Connection string'
};
ODATADataSource.Locale['fr-FR'] = {
    connectionString: 'Chaîne de connexion',
    alertMessage: 'Spécifiez la chaîne de connexion'
};
