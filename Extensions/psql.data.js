var PSQLDataSource = (function () {
    function PSQLDataSource() {
        this.locale = 'en-US';
        this.controlWidth = 428;
        this.id = 'container';
        this.connectClick = $.proxy(this.connectDataSource, this);
    }
    PSQLDataSource.prototype.renderConfig = function (targetTag, dataSource, isEdit) {
        this.renderConfiguration(targetTag);
        this.updateDataSource(dataSource);
    };
    PSQLDataSource.prototype.renderConfiguration = function (targetTag) {
        if (targetTag.find('#' + this.id + '_psql_datasource').length > 0) {
            this.resetInputFields();
        }
        else {
            this.psqlConfig = ej.buildTag('div', '', {
                'width': '100%', 'height': '100%', 'display': 'table-row'
            }, { 'id': this.id + '_psql_datasource' });
            targetTag.append(this.psqlConfig);
            this.renderPsqlPanel();
            this.renderErrorToolTip(targetTag);
            this.changedAuthentication({ 'value': 'authentication' });
        }
        this.showConfiguration(true);
    };
    PSQLDataSource.prototype.renderPsqlPanel = function () {
        this.psqlPanel = ej.buildTag('div', '', {
            'width': '100%', 'height': '100%', 'display': 'table-row'
        }, { 'id': this.id + '_psql_panel' });
        var psqlConfigTable = ej.buildTag('table.e-designer-dsconfig-table', '', {
            'width': '100%'
        }, {
            'unselectable': 'on', 'id': this.id + '_psql_config'
        });
        var field = { id: 'id', text: 'text', value: 'value' };
        this.psqlConfig.append(this.psqlPanel);
        this.psqlPanel.append(psqlConfigTable);
        this.renderTextArea(this.getLocale('connectionString'), this.id + '_psql_conStr', psqlConfigTable);
        this.renderDropDownItem(this.getLocale('authenticationType'), this.id + '_psql_authtype', psqlConfigTable, this.getDropdownValues(), field, '0');
        this.renderTextBoxItem(this.getLocale('promptLabel'), this.id + '_psql_prompt', false, psqlConfigTable, this.controlWidth);
        this.renderTextBoxItem(this.getLocale('userName'), this.id + '_psql_usr', false, psqlConfigTable, this.controlWidth);
        this.renderTextBoxItem(this.getLocale('password'), this.id + '_psql_pswd', true, psqlConfigTable, this.controlWidth);
        if ($('#' + this.id + '_psql_authtype')) {
            this.authType = $('#' + this.id + '_psql_authtype');
            this.ejAuthDrpdwn = this.authType.data('ejDropDownList');
            this.ejAuthDrpdwn.model.change = $.proxy(this.changedAuthentication, this);
        }
        this.promptTag = $('#' + this.id + '_psql_prompt_tr');
        this.connString = $('#' + this.id + '_psql_conStr');
        this.promptCont = $('#' + this.id + '_psql_prompt');
        this.userName = $('#' + this.id + '_psql_usr');
        this.passWord = $('#' + this.id + '_psql_pswd');
        this.userNameTag = $('#' + this.id + '_psql_usr_tr');
        this.passWordTag = $('#' + this.id + '_psql_pswd_tr');
    };
    PSQLDataSource.prototype.changedAuthentication = function (args) {
        var value = (args.value) ? args.value : this.ejAuthDrpdwn.getSelectedValue();
        this.hideValidationMsg();
        this.promptTag.css('display', 'none');
        this.userNameTag.css('display', 'none');
        this.passWordTag.css('display', 'none');
        if (value === 'authentication' || value === 'prompt') {
            this.userNameTag.css('display', 'table-row');
            this.passWordTag.css('display', 'table-row');
        }
        if (value === 'prompt') {
            this.promptTag.css('display', 'table-row');
        }
        if (value === 'authentication') {
            this.promptCont.val('');
        }
        this.updateEJComponentSize();
        this.scrollerRefresh();
    };
    PSQLDataSource.prototype.updateDataSource = function (dataSource) {
        if (!ej.isNullOrUndefined(dataSource)) {
            var connectionProperties = dataSource.ConnectionProperties;
            this.connString.val(connectionProperties.ConnectString);
            this.userName.val(connectionProperties.UserName);
            this.passWord.val(connectionProperties.PassWord);
            this.promptCont.val(connectionProperties.Prompt);
            if (!connectionProperties.IntegratedSecurity) {
                if (dataSource.SecurityType === 'None' || dataSource.SecurityType.toString() === '0') {
                    this.ejAuthDrpdwn.selectItemByValue('none');
                }
                else if (ej.isNullOrUndefined(connectionProperties.Prompt) || (!ej.isNullOrUndefined(connectionProperties.Prompt) &&
                    connectionProperties.Prompt.length === 0) && (dataSource.SecurityType === 'DataBase' ||
                    dataSource.SecurityType.toString() === '2')) {
                    this.ejAuthDrpdwn.selectItemByValue('authentication');
                }
                else {
                    this.ejAuthDrpdwn.selectItemByValue('prompt');
                }
            }
        }
    };
    PSQLDataSource.prototype.connectDataSource = function (args) {
        if (!args[0].isCancel) {
            args[0].data = this.getDatasourceInfo(args[0].name);
        }
    };
    PSQLDataSource.prototype.showConfiguration = function (isShow) {
        this.psqlConfig.css('display', isShow ? 'table-row' : 'none');
    };
    PSQLDataSource.prototype.resetInputFields = function () {
        this.connString.val('');
        this.promptCont.val('');
        this.userName.val('');
        this.passWord.val('');
        this.hideValidationMsg();
        this.ejAuthDrpdwn.selectItemByValue('authentication');
    };
    PSQLDataSource.prototype.getDatasourceInfo = function (dataSourceName, dataSource) {
        var isValidCon = true;
        var usrName = '';
        var password = '';
        var prompt = '';
        var securityType = 'None';
        this.hideValidationMsg();
        if (this.connString.val().length === 0) {
            this.showValidationMsg(this.connString.attr('id'), true, this.getLocale('alertConnectionString'));
            isValidCon = false;
        }
        if (this.ejAuthDrpdwn.getSelectedValue() === 'prompt' || this.ejAuthDrpdwn.getSelectedValue() === 'authentication') {
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
        }
        if (isValidCon) {
            var reportData = this.createDataSource();
            reportData.Name = dataSourceName;
            reportData.SecurityType = securityType;
            reportData.ConnectionProperties.UserName = usrName;
            reportData.ConnectionProperties.PassWord = password;
            reportData.ConnectionProperties.Prompt = prompt;
            reportData.ConnectionProperties.DataProvider = 'PostgreSQL';
            reportData.ConnectionProperties.ConnectString = this.connString.val();
            return reportData;
        }
        return null;
    };
    PSQLDataSource.prototype.createDataSource = function () {
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
    PSQLDataSource.prototype.getLocale = function (text) {
        var pSQLLocale;
        var defaultLocale = PSQLDataSource.Locale['en-US'];
        if (!ej.isNullOrUndefined(PSQLDataSource.Locale[this.locale])) {
            pSQLLocale = PSQLDataSource.Locale[this.locale];
        }
        switch (text.toLowerCase()) {
            case 'connectionstring':
                if (pSQLLocale && pSQLLocale.connectionString) {
                    return pSQLLocale.connectionString;
                }
                return defaultLocale.connectionString;
            case 'authenticationtype':
                if (pSQLLocale && pSQLLocale.authenticationType) {
                    return pSQLLocale.authenticationType;
                }
                return defaultLocale.authenticationType;
            case 'authentication':
                if (pSQLLocale && pSQLLocale.authentication) {
                    return pSQLLocale.authentication;
                }
                return defaultLocale.authentication;
            case 'prompt':
                if (pSQLLocale && pSQLLocale.prompt) {
                    return pSQLLocale.prompt;
                }
                return defaultLocale.prompt;
            case 'none':
                if (pSQLLocale && pSQLLocale.none) {
                    return pSQLLocale.none;
                }
                return defaultLocale.none;
            case 'username':
                if (pSQLLocale && pSQLLocale.userName) {
                    return pSQLLocale.userName;
                }
                return defaultLocale.userName;
            case 'password':
                if (pSQLLocale && pSQLLocale.password) {
                    return pSQLLocale.password;
                }
                return defaultLocale.password;
            case 'promptlabel':
                if (pSQLLocale && pSQLLocale.promptLabel) {
                    return pSQLLocale.promptLabel;
                }
                return defaultLocale.promptLabel;
            case 'alertconnectionstring':
                if (pSQLLocale && pSQLLocale.alertMessage && pSQLLocale.alertMessage.alertConnectionString) {
                    return pSQLLocale.alertMessage.alertConnectionString;
                }
                return defaultLocale.alertMessage.alertConnectionString;
            case 'alertprompt':
                if (pSQLLocale && pSQLLocale.alertMessage && pSQLLocale.alertMessage.alertPrompt) {
                    return pSQLLocale.alertMessage.alertPrompt;
                }
                return defaultLocale.alertMessage.alertPrompt;
            case 'alertusername':
                if (pSQLLocale && pSQLLocale.alertMessage && pSQLLocale.alertMessage.alertUserName) {
                    return pSQLLocale.alertMessage.alertUserName;
                }
                return defaultLocale.alertMessage.alertUserName;
            case 'alertpassword':
                if (pSQLLocale && pSQLLocale.alertMessage && pSQLLocale.alertMessage.alertPassword) {
                    return pSQLLocale.alertMessage.alertPassword;
                }
                return defaultLocale.alertMessage.alertPassword;
        }
        return text;
    };
    PSQLDataSource.prototype.updateCulture = function (culture) {
        this.locale = culture;
        if (this.connString) {
            this.updateRow(this.psqlConfig, this.connString.attr('id'), this.getLocale('connectionString'));
            this.updateValidationMsg(this.psqlConfig, this.connString.attr('id'), this.getLocale('alertConnectionString'));
        }
        if (this.authType) {
            this.updateRow(this.psqlConfig, this.authType.attr('id'), this.getLocale('authenticationType'));
            this.ejAuthDrpdwn.setModel({ 'dataSource': this.getDropdownValues(), 'selectedIndex': '0' });
        }
        if (this.promptCont) {
            this.updateRow(this.psqlConfig, this.promptCont.attr('id'), this.getLocale('promptLabel'));
            this.updateValidationMsg(this.psqlConfig, this.promptCont.attr('id'), this.getLocale('alertPrompt'));
        }
        if (this.userName) {
            this.updateRow(this.psqlConfig, this.userName.attr('id'), this.getLocale('userName'));
            this.updateValidationMsg(this.psqlConfig, this.userName.attr('id'), this.getLocale('alertUserName'));
        }
        if (this.passWord) {
            this.updateRow(this.psqlConfig, this.passWord.attr('id'), this.getLocale('password'));
            this.updateValidationMsg(this.psqlConfig, this.passWord.attr('id'), this.getLocale('alertPassword'));
        }
    };
    PSQLDataSource.prototype.getDropdownValues = function () {
        var authText = 'authentication';
        var promptText = 'prompt';
        var noneText = 'none';
        var authTypeJson = [{ id: authText.toLowerCase(), text: this.getLocale('authentication'), value: authText },
            { id: promptText.toLowerCase(), text: this.getLocale('prompt'), value: promptText },
            { id: noneText.toLowerCase(), text: this.getLocale('none'), value: noneText }];
        return authTypeJson;
    };
    PSQLDataSource.prototype.renderTextArea = function (name, id, target, value) {
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
    PSQLDataSource.prototype.renderTextBoxItem = function (name, id, isPasswd, target, width, value) {
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
    PSQLDataSource.prototype.renderDropDownItem = function (name, id, target, datasource, fields, selectedIndex, fnction, context) {
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
    PSQLDataSource.prototype.getRowCaption = function (caption, id) {
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
    PSQLDataSource.prototype.updateRow = function (target, id, text) {
        target.find('#' + id + '_tr .e-designer-title-label').html(text);
    };
    PSQLDataSource.prototype.updateEJComponentSize = function () {
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
    PSQLDataSource.prototype.renderErrIndictor = function (target, tooltipId, errMsg) {
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
    PSQLDataSource.prototype.showErrIndictor = function (target, isEnable, errMsg) {
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
    PSQLDataSource.prototype.renderErrorToolTip = function (target) {
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
    PSQLDataSource.prototype.beforeOpenTooltip = function (args) {
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
    PSQLDataSource.prototype.showValidationMsg = function (id, isShow, msg) {
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
    PSQLDataSource.prototype.hideValidationMsg = function () {
        this.showValidationMsg(this.connString.attr('id'), false);
        this.showValidationMsg(this.promptCont.attr('id'), false);
        this.showValidationMsg(this.userName.attr('id'), false);
        this.showValidationMsg(this.passWord.attr('id'), false);
    };
    PSQLDataSource.prototype.updateValidationMsg = function (target, id, msg) {
        var toolTipCont = target.find('#' + id + '_error_icon_td .e-error-tip');
        toolTipCont.removeAttr('e-errormsg');
        toolTipCont.attr('e-errormsg', msg);
    };
    PSQLDataSource.prototype.scrollerRefresh = function () {
        var container = $('#' + this.id + '_dsConfigBodyContainer');
        if (container.length > 0 && !ej.isNullOrUndefined(container.data('ejScroller'))) {
            container.data('ejScroller').refresh();
        }
    };
    PSQLDataSource.prototype.isOverflow = function () {
        if ($('#' + this.id + '_dsConfigContainer').height() > $('#' + this.id + '_dsConfigBodyContainer').height()) {
            return true;
        }
        return false;
    };
    PSQLDataSource.prototype.dispose = function () {
        if (!ej.isNullOrUndefined(this.psqlConfig) && this.psqlConfig.length > 0) {
            this.destroyEjObjects(this.psqlConfig);
            this.psqlConfig.remove();
        }
    };
    PSQLDataSource.prototype.destroyEjObjects = function (ejObjects, isRootEle) {
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
    return PSQLDataSource;
}());
PSQLDataSource.Locale = {};
PSQLDataSource.Locale['en-US'] = {
    connectionString: 'Connection String',
    authenticationType: 'Authentication Type',
    authentication: 'Authentication',
    prompt: 'Prompt',
    none: 'None',
    userName: 'Username',
    password: 'Password',
    promptLabel: 'Prompt Text',
    alertMessage: {
        alertConnectionString: 'Specify the Connection string',
        alertPrompt: 'Specify the Prompt Text',
        alertUserName: 'Specify the User Name',
        alertPassword: 'Specify the Password'
    }
};
PSQLDataSource.Locale['fr-FR'] = {
    connectionString: 'Chaîne de connexion',
    authenticationType: 'type d\'identification',
    authentication: 'Authentification',
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
