var SASSDataSource = (function () {
    function SASSDataSource() {
        this.locale = 'en-US';
        this.controlWidth = 428;
        this.id = 'container';
        this.connectClick = $.proxy(this.connectDataSource, this);
    }
    SASSDataSource.prototype.renderConfig = function (targetTag, dataSource, isEdit) {
        this.renderConfiguration(targetTag);
        this.updateDataSource(dataSource);
    };
    SASSDataSource.prototype.connectDataSource = function (args) {
        if (!args[0].isCancel) {
            args[0].data = this.getDatasourceInfo(args[0].name);
        }
    };
    SASSDataSource.prototype.renderConfiguration = function (targetTag) {
        if (targetTag.find('#' + this.id + '_sass_datasource').length > 0) {
            this.resetInputFields();
        }
        else {
            this.sassConfig = ej.buildTag('div', '', {
                'width': '100%', 'height': '100%', 'display': 'table-row'
            }, { 'id': this.id + '_sass_datasource' });
            targetTag.append(this.sassConfig);
            this.renderSassPanel();
            this.renderErrorToolTip(targetTag);
            this.changedAuthentication({ 'value': 'windows' });
        }
        this.showConfiguration(true);
    };
    SASSDataSource.prototype.renderSassPanel = function () {
        this.sassPanel = ej.buildTag('div', '', {
            'width': '100%', 'height': '100%', 'display': 'table-row'
        }, { 'id': this.id + '_sass_Panel' });
        var sassConfigTable = ej.buildTag('table.e-designer-dsconfig-table', '', {
            'width': '100%'
        }, {
            'unselectable': 'on', 'id': this.id + '_sass_config'
        });
        var field = { id: 'id', text: 'text', value: 'value' };
        this.sassConfig.append(this.sassPanel);
        this.sassPanel.append(sassConfigTable);
        this.renderTextArea(this.getLocale('connectionString'), this.id + '_sass_conStr', sassConfigTable);
        this.renderDropDownItem(this.getLocale('authenticationType'), this.id + '_sass_authtype', sassConfigTable, this.getDropdownValues(), field, '0');
        this.renderTextBoxItem(this.getLocale('promptLabel'), this.id + '_sass_prompt', false, sassConfigTable, this.controlWidth);
        this.renderTextBoxItem(this.getLocale('userName'), this.id + '_sass_usr', false, sassConfigTable, this.controlWidth);
        this.renderTextBoxItem(this.getLocale('password'), this.id + '_sass_pswd', true, sassConfigTable, this.controlWidth);
        if ($('#' + this.id + '_sass_authtype')) {
            this.authType = $('#' + this.id + '_sass_authtype');
            this.ejAuthDrpdwn = this.authType.data('ejDropDownList');
            this.ejAuthDrpdwn.model.change = $.proxy(this.changedAuthentication, this);
        }
        this.promptTag = $('#' + this.id + '_sass_prompt_tr');
        this.connString = $('#' + this.id + '_sass_conStr');
        this.promptCont = $('#' + this.id + '_sass_prompt');
        this.userName = $('#' + this.id + '_sass_usr');
        this.passWord = $('#' + this.id + '_sass_pswd');
        this.userNameTag = $('#' + this.id + '_sass_usr_tr');
        this.passWordTag = $('#' + this.id + '_sass_pswd_tr');
    };
    SASSDataSource.prototype.changedAuthentication = function (args) {
        var value = (args.value) ? args.value : this.ejAuthDrpdwn.getSelectedValue();
        this.hideValidationMsg();
        this.promptTag.css('display', 'none');
        this.userNameTag.css('display', 'none');
        this.passWordTag.css('display', 'none');
        if (value === 'sqlServer' || value === 'prompt') {
            this.userNameTag.css('display', 'table-row');
            this.passWordTag.css('display', 'table-row');
        }
        if (value === 'prompt') {
            this.promptTag.css('display', 'table-row');
        }
        this.updateEJComponentSize();
        this.scrollerRefresh($('#' + this.id + '_dsConfigBodyContainer'));
    };
    SASSDataSource.prototype.updateDataSource = function (dataSource) {
        if (!ej.isNullOrUndefined(dataSource)) {
            var connectionProperties = dataSource.ConnectionProperties;
            this.connString.val(connectionProperties.ConnectString);
            this.userName.val(connectionProperties.UserName);
            this.passWord.val(connectionProperties.PassWord);
            if (connectionProperties.IntegratedSecurity) {
                this.ejAuthDrpdwn.selectItemByValue('windows');
            }
            else {
                if ((dataSource.SecurityType === 'None' || dataSource.SecurityType.toString() === '0')) {
                    this.ejAuthDrpdwn.selectItemByValue('none');
                }
                else if ((ej.isNullOrUndefined(connectionProperties.Prompt) ||
                    (!ej.isNullOrUndefined(connectionProperties.Prompt) && connectionProperties.Prompt.length === 0)) &&
                    (dataSource.SecurityType === 'DataBase' || dataSource.SecurityType.toString() === '2')) {
                    this.ejAuthDrpdwn.selectItemByValue('sqlServer');
                }
                else {
                    this.ejAuthDrpdwn.selectItemByValue('prompt');
                    this.promptCont.val(connectionProperties.Prompt);
                }
            }
        }
    };
    SASSDataSource.prototype.showConfiguration = function (isShow) {
        this.sassConfig.css('display', isShow ? 'table-row' : 'none');
    };
    SASSDataSource.prototype.resetInputFields = function () {
        this.connString.val('');
        this.promptCont.val('');
        this.userName.val('');
        this.passWord.val('');
        this.hideValidationMsg();
        this.ejAuthDrpdwn.selectItemByValue('windows');
    };
    SASSDataSource.prototype.getDatasourceInfo = function (dataSourceName, dataSource) {
        var isValidCon = true;
        var usrName = '';
        var password = '';
        var prompt = '';
        var isIntegrated = true;
        var securityType = 'Integrated';
        this.hideValidationMsg();
        if (this.connString.val().length === 0) {
            this.showValidationMsg(this.connString.attr('id'), true, this.getLocale('alertConnectionString'));
            isValidCon = false;
        }
        if (this.ejAuthDrpdwn.getSelectedValue() === 'prompt' ||
            this.ejAuthDrpdwn.getSelectedValue() === 'sqlServer') {
            usrName = this.userName.val();
            password = this.passWord.val();
            prompt = this.promptCont.val();
            if (usrName.length === 0) {
                this.showValidationMsg(this.userName.attr('id'), true, this.getLocale('alertUserName'));
                isValidCon = false;
            }
            if (password.length === 0) {
                this.showValidationMsg(this.passWord.attr('id'), true, this.getLocale('alertPassword'));
                isValidCon = false;
            }
            if (this.ejAuthDrpdwn.getSelectedValue() === 'prompt' && prompt.length === 0) {
                this.showValidationMsg(this.promptCont.attr('id'), true, this.getLocale('alertPrompt'));
                isValidCon = false;
            }
            securityType = 'DataBase';
            isIntegrated = false;
        }
        else if (this.ejAuthDrpdwn.getSelectedValue() === 'none') {
            securityType = 'None';
            isIntegrated = false;
        }
        if (isValidCon) {
            var reportData = this.createDataSource();
            reportData.Name = dataSourceName;
            reportData.SecurityType = securityType;
            reportData.ConnectionProperties.UserName = usrName;
            reportData.ConnectionProperties.PassWord = password;
            reportData.ConnectionProperties.Prompt = prompt;
            reportData.ConnectionProperties.IntegratedSecurity = isIntegrated;
            reportData.ConnectionProperties.DataProvider = 'Microsoft SQL Server Analysis Services';
            reportData.ConnectionProperties.ConnectString = this.connString.val();
            return reportData;
        }
        return null;
    };
    SASSDataSource.prototype.createDataSource = function () {
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
    SASSDataSource.prototype.getLocale = function (text) {
        var sassLocale;
        var defaultLocale = SASSDataSource.Locale['en-US'];
        if (!ej.isNullOrUndefined(SASSDataSource[this.locale])) {
            sassLocale = SASSDataSource.Locale[this.locale];
        }
        switch (text.toLowerCase()) {
            case 'connectionstring':
                if (sassLocale && sassLocale.connectionString) {
                    return sassLocale.connectionString;
                }
                return defaultLocale.connectionString;
            case 'authenticationtype':
                if (sassLocale && sassLocale.authenticationType) {
                    return sassLocale.authenticationType;
                }
                return defaultLocale.authenticationType;
            case 'window':
                if (sassLocale && sassLocale.window) {
                    return sassLocale.window;
                }
                return defaultLocale.window;
            case 'sqlserver':
                if (sassLocale && sassLocale.sqlServer) {
                    return sassLocale.sqlServer;
                }
                return defaultLocale.sqlServer;
            case 'prompt':
                if (sassLocale && sassLocale.prompt) {
                    return sassLocale.prompt;
                }
                return defaultLocale.prompt;
            case 'none':
                if (sassLocale && sassLocale.none) {
                    return sassLocale.none;
                }
                return defaultLocale.none;
            case 'username':
                if (sassLocale && sassLocale.userName) {
                    return sassLocale.userName;
                }
                return defaultLocale.userName;
            case 'password':
                if (sassLocale && sassLocale.password) {
                    return sassLocale.password;
                }
                return defaultLocale.password;
            case 'promptlabel':
                if (sassLocale && sassLocale.promptLabel) {
                    return sassLocale.promptLabel;
                }
                return defaultLocale.promptLabel;
            case 'alertconnectionstring':
                if (sassLocale && sassLocale.alertMessage && sassLocale.alertMessage.alertConnectionString) {
                    return sassLocale.alertMessage.alertConnectionString;
                }
                return defaultLocale.alertMessage.alertConnectionString;
            case 'alertprompt':
                if (sassLocale && sassLocale.alertMessage && sassLocale.alertMessage.alertPrompt) {
                    return sassLocale.alertMessage.alertPrompt;
                }
                return defaultLocale.alertMessage.alertPrompt;
            case 'alertusername':
                if (sassLocale && sassLocale.alertMessage && sassLocale.alertMessage.alertUserName) {
                    return sassLocale.alertMessage.alertUserName;
                }
                return defaultLocale.alertMessage.alertUserName;
            case 'alertpassword':
                if (sassLocale && sassLocale.alertMessage && sassLocale.alertMessage.alertPassword) {
                    return sassLocale.alertMessage.alertPassword;
                }
                return defaultLocale.alertMessage.alertPassword;
        }
        return text;
    };
    SASSDataSource.prototype.updateCulture = function (culture) {
        this.locale = culture;
        if (this.connString) {
            this.updateRow(this.sassConfig, this.connString.attr('id'), this.getLocale('connectionString'));
            this.updateValidationMsg(this.sassConfig, this.connString.attr('id'), this.getLocale('alertConnectionString'));
        }
        if (this.authType) {
            this.updateRow(this.sassConfig, this.authType.attr('id'), this.getLocale('authenticationType'));
            this.ejAuthDrpdwn.setModel({ 'dataSource': this.getDropdownValues(), 'selectedIndex': '0' });
        }
        if (this.promptCont) {
            this.updateRow(this.sassConfig, this.promptCont.attr('id'), this.getLocale('promptLabel'));
            this.updateValidationMsg(this.sassConfig, this.promptCont.attr('id'), this.getLocale('alertPrompt'));
        }
        if (this.userName) {
            this.updateRow(this.sassConfig, this.userName.attr('id'), this.getLocale('userName'));
            this.updateValidationMsg(this.sassConfig, this.userName.attr('id'), this.getLocale('errorUserName'));
        }
        if (this.passWord) {
            this.updateRow(this.sassConfig, this.passWord.attr('id'), this.getLocale('password'));
            this.updateValidationMsg(this.sassConfig, this.passWord.attr('id'), this.getLocale('alertPassword'));
        }
    };
    SASSDataSource.prototype.renderDropDownItem = function (name, id, target, datasource, fields, selectedIndex, fnction, context) {
        var row = $('<tr id=' + id + '_tr/>');
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
        var dropdown = ej.buildTag('input', '', {}, { 'id': id, 'value': '', 'spellcheck': 'false' });
        coltxt.append(dropdown);
        dropdown.ejDropDownList({
            width: this.controlWidth, dataSource: datasource, fields: fields, change: $.proxy(fnction, context),
            cssClass: 'e-designer-ejwidgets e-designer-content-label', showRoundedCorner: true
        });
        if (selectedIndex) {
            dropdown.data('ejDropDownList').selectItemsByIndices(selectedIndex);
        }
    };
    SASSDataSource.prototype.renderTextBoxItem = function (name, id, isPasswd, target, width, value) {
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
        var txtbox = ej.buildTag('input.e-textbox e-designer-content-label', '', {
            'height': '24px', 'width': width + 'px'
        }, {
            'id': id, 'type': isPasswd ? 'password' : 'text',
            'value': value, 'spellcheck': 'false'
        });
        coltxt.append(txtbox);
    };
    SASSDataSource.prototype.renderTextArea = function (name, id, target, value) {
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
            'height': '65px', 'width': this.controlWidth, 'resize': 'none', 'text-indent': '0px', 'overflow': 'hidden'
        }, {
            'id': id, 'type': 'textarea', 'spellcheck': 'false'
        });
        coltxt.append(txtbox);
    };
    SASSDataSource.prototype.getRowCaption = function (caption, id) {
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
    SASSDataSource.prototype.updateRow = function (target, id, text) {
        target.find('#' + id + '_tr .e-designer-title-label').html(text);
    };
    SASSDataSource.prototype.updateEJComponentSize = function () {
        var panel = $('#' + this.id + '_basicPanel');
        var textBox = panel.find('.e-textbox');
        var textArea = panel.find('.e-textarea');
        var ejObjs = panel.find('.e-js');
        var isOverflow = this.isOverflow();
        if (ejObjs && ejObjs.length > 0) {
            for (var index = 0; index < ejObjs.length; index++) {
                var ejEle = $(ejObjs[index]);
                var ejName = ejEle.data('ejWidgets');
                if (ejName) {
                    var ejObj = ejEle.data(ejName[0]);
                    switch (ejName[0]) {
                        case 'ejDropDownList':
                            ejObj.option('width', (isOverflow ? (ejEle.hasClass('e-dropdownUpload') ? this.controlWidth + 4 : this.controlWidth + 8) :
                                (ejEle.hasClass('e-dropdownUpload') ? this.controlWidth + 10 : this.controlWidth + 12)) + 'px');
                            break;
                        case 'ejAutocomplete':
                            ejObj.option('width', isOverflow ? this.controlWidth + 7 : this.controlWidth + 12 + 'px');
                            break;
                    }
                }
            }
        }
        textArea.width((isOverflow ? this.controlWidth - 8 : this.controlWidth - 4) + 'px');
        textBox.width((isOverflow ? this.controlWidth - 5 : this.controlWidth) + 'px');
    };
    SASSDataSource.prototype.renderErrIndictor = function (target, tooltipId, errMsg) {
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
    SASSDataSource.prototype.showErrIndictor = function (target, isEnable, errMsg) {
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
    SASSDataSource.prototype.renderErrorToolTip = function (target) {
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
    SASSDataSource.prototype.beforeOpenTooltip = function (args) {
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
    SASSDataSource.prototype.showValidationMsg = function (id, isShow, msg) {
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
    SASSDataSource.prototype.hideValidationMsg = function () {
        this.showValidationMsg(this.connString.attr('id'), false);
        this.showValidationMsg(this.promptCont.attr('id'), false);
        this.showValidationMsg(this.userName.attr('id'), false);
        this.showValidationMsg(this.passWord.attr('id'), false);
    };
    SASSDataSource.prototype.updateValidationMsg = function (target, id, msg) {
        var toolTipCont = target.find('#' + id + '_error_icon_td .e-error-tip');
        toolTipCont.removeAttr('e-errormsg');
        toolTipCont.attr('e-errormsg', msg);
    };
    SASSDataSource.prototype.isOverflow = function () {
        if ($('#' + this.id + '_dsConfigContainer').height() > $('#' + this.id + '_dsConfigBodyContainer').height()) {
            return true;
        }
        return false;
    };
    SASSDataSource.prototype.scrollerRefresh = function (scrollerTag) {
        if (scrollerTag.data('ejScroller')) {
            scrollerTag.data('ejScroller').refresh();
        }
    };
    SASSDataSource.prototype.getDropdownValues = function () {
        var windowsText = 'windows';
        var sqlServerText = 'sqlServer';
        var promptText = 'prompt';
        var noneText = 'none';
        var authTypeJson = [
            { id: windowsText.toLowerCase(), text: this.getLocale('window'), value: windowsText },
            { id: sqlServerText.toLowerCase(), text: this.getLocale('sqlServer'), value: sqlServerText },
            { id: promptText.toLowerCase(), text: this.getLocale('prompt'), value: promptText },
            { id: noneText.toLowerCase(), text: this.getLocale('none'), value: noneText }
        ];
        return authTypeJson;
    };
    SASSDataSource.prototype.dispose = function () {
        if (!ej.isNullOrUndefined(this.sassConfig) && this.sassConfig.length > 0) {
            this.destroyEjObjects(this.sassConfig);
            this.sassConfig.remove();
        }
    };
    SASSDataSource.prototype.destroyEjObjects = function (ejObjects, isRootEle) {
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
    return SASSDataSource;
}());
SASSDataSource.Locale = {};
SASSDataSource.Locale['en-US'] = {
    connectionString: 'Connection String',
    authenticationType: 'Authentication Type',
    window: 'Windows',
    sqlServer: 'SQL Server',
    prompt: 'Prompt',
    none: 'None',
    userName: 'Username',
    password: 'Password',
    promptLabel: 'Prompt Text',
    alertMessage: {
        alertConnectionString: 'Specify the Connection String',
        alertPrompt: 'Specify the Prompt Text',
        alertUserName: 'Specify the User Name',
        alertPassword: 'Specify the Password'
    }
};
SASSDataSource.Locale['fr-FR'] = {
    connectionString: 'Chaîne de connexion',
    authenticationType: 'type d\'identification',
    window: 'les fenêtres',
    sqlServer: 'serveur SQL',
    prompt: 'Rapide',
    none: 'Aucun',
    userName: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    promptLabel: 'Texte d\'invite',
    alertMessage: {
        alertConnectionString: 'Spécifiez la chaîne de connexion',
        alertPrompt: 'Spécifiez le texte d\'invite',
        alertUserName: 'Précisez le nom d\'utilisateur',
        alertPassword: 'Spécifiez le mot de passe',
    }
};
