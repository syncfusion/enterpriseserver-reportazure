/**
 * Default [zh-CN] localization for report viewer.
 */
//ejDatePicker
ej.DatePicker.Locale["zh-CN"] = {
    watermarkText: "选择日期",
    buttonText: "今天",
};

//ejReportViewer
ej.ReportViewer.Locale["zh-CN"] = {
    toolbar: {
        print: {
            headerText: "打印",
            contentText: "打印报告。"
        },
        exportformat: {
            headerText: "出口",
            contentText: "选择导出的文件格式。",
            Pdf: "PDF",
            Excel: "Excel",
            Word: "word",
            Html: "HTML",
            PPT: 'PowerPoint',
            CSV: 'CSV'
        },
        first: {
            headerText: "第一",
            contentText: "转至报告的第一页。"
        },
        previous: {
            headerText: "以前",
            contentText: "转至报告的前一页。"
        },
        next: {
            headerText: "下一个",
            contentText: "进入报告的下一页。"
        },
        last: {
            headerText: "持续",
            contentText: "转至报告的最后一页。"
        },
        documentMap: {
            headerText: "文档结构图",
            contentText: "显示或隐藏文档结构图。"
        },
        parameter: {
            headerText: "参数",
            contentText: "显示或隐藏参数窗格。"
        },
        zoomIn: {
            headerText: "放大",
            contentText: "放大到报告中。"
        },
        zoomOut: {
            headerText: "缩小",
            contentText: "缩小的报告。"
        },
        refresh: {
            headerText: "刷新",
            contentText: "刷新报表。"
        },
        printLayout: {
            headerText: "打印布局",
            contentText: "打印布局模式和正常模式之间切换。"
        },
        pageIndex: {
            headerText: "页码",
            contentText: "当前页编号，以查看。"
        },
        zoom: {
            headerText: "放大",
            contentText: "放大或缩小在报告中。"
        },
        back: {
            headerText: "背部",
            contentText: "返回到父报告。"
        },
        fittopage: {
            headerText: "适合页面",
            contentText: "适合报表页到容器。",
            pageWidth: "页面宽度",
            pageHeight: "整页"
        },
        pagesetup: {
            headerText: "页面设置",
            contentText: "选择页面设置选项来改变纸张大小，方向和页边距。"
        },
    },
    pagesetupDialog: {
        close: '关',
        paperSize: '纸张大小',
        height: '高度',
        width: '宽度',
        margins: '边距',
        top: '最佳',
        bottom: '底部',
        right: '对',
        left: '剩下',
        unit: '在',
        orientation: '方向',
        portrait: '肖像',
        landscape: '景观',
        doneButton: '做',
        cancelButton: '取消'
    },
    credential: {
        userName: '用户名',
        password: '密码'
    },
    waterMark: {
        selectOption: '选择选项',
        selectValue: '选择一个值'
    },
    errorMessage: {
        startMessage: '报告查看器遇到一些加载此报告的问题。请',
        middleMessage: ' 点击这里',
        endMessage: '查看错误的详细信息',
        closeMessage: '关闭此消息',
        exportAjaxFailureMsg: '由于连接报告服务失败，无法导出文档。',
        printAjaxFailureMsg: '由于连接报告服务失败，无法打印文档。',
        reportLoadAjaxFailureMsg: '由于连接报告服务失败，无法推进报告操作。',
    },
    progressMessage: {
        exportLoadingMessage: '准备出口文件......请稍候......',
        printLoadingMessage: '准备打印数据......请稍候......',
        printPreparationMessage: '准备打印数据... {0}% 已完成...请稍候...',
        exportPreparationMessage: '准备导出文档... {0}％ 已完成...请稍候...',
    },
    alertMessage: {
        close: '关',
        title: '的ReportViewer',
        done: '好',
        showDetails: '显示详细资料',
        hideDetails: '隐藏细节',
        reportLoad: '已加载报告:',
        RVERR0001: 'ReportViewer无法加载报告',
        RVERR0002: 'ReportViewer无法呈现报告',
        RVERR0003: 'ajax回发中发生错误',
        RVERR0004: '请为参数选择一个值',
        RVERR0005: '{参数名称}参数缺少一个值',
        RVERR0006: '请给出浮点数据类型输入',
        RVERR0007: '请给出整数数据类型输入',
        RVERR0008: 'ReportViewer无法验证数据源凭据',
        RVERR0009: '他的利润率是重叠的或者他们不在报纸上。输入不同的保证金大小.',
        RVERR0010: '请为参数输入一个值',
        RVERR0011: '该参数不能为空',
        RVERR0012: '为报告参数{parameterprompt}提供的值对其类型无效.'
    },
    selectAll: '全选',
    viewButton: "查看报告",
    parameterProcessingMessage: '加载相关参数......'
};
               