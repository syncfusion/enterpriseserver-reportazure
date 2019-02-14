/**
 * Default [en-US] localization for report viewer.
 */
//ejDatePicker
ej.DatePicker.Locale['en-US'] = {
    watermarkText: "Select date",
    buttonText: 'Today'
};

//ejReportViewer
ej.ReportViewer.Locale["en-US"] = {
    toolbar: {
        print: {
            headerText: 'Print',
            contentText: 'Print the report.'
        },
        exportformat: {
            headerText: 'Export',
            contentText: 'Select the exported file format.',
            Pdf: 'PDF',
            Excel: 'Excel',
            Word: 'Word',
            Html: 'Html',
            PPT: 'PowerPoint',
            CSV: 'CSV'
        },
        first: {
            headerText: 'First',
            contentText: 'Go to the first page of the report.'
        },
        previous: {
            headerText: 'Previous',
            contentText: 'Go to the previous page of the report.'
        },
        next: {
            headerText: 'Next',
            contentText: 'Go to the next page of the report.'
        },
        last: {
            headerText: 'Last',
            contentText: 'Go to the last page of the report.'
        },
        documentMap: {
            headerText: 'Document Map',
            contentText: 'Show or hide the document map.'
        },
        parameter: {
            headerText: 'Parameter',
            contentText: 'Show or hide the parameters pane.'
        },
        zoomIn: {
            headerText: 'Zoom-In',
            contentText: 'Zoom in to the report.'
        },
        zoomOut: {
            headerText: 'Zoom-Out',
            contentText: 'Zoom out of the report.'
        },
        refresh: {
            headerText: 'Refresh',
            contentText: 'Refresh the report.'
        },
        printLayout: {
            headerText: 'Print Layout',
            contentText: 'Change between print layout and normal modes.'
        },
        pageIndex: {
            headerText: 'Page Number',
            contentText: 'Current page number to view.'
        },
        zoom: {
            headerText: 'Zoom',
            contentText: 'Zoom in or out on the report.'
        },
        back: {
            headerText: 'Back',
            contentText: 'Go back to the parent report.'
        },
        fittopage: {
            headerText: 'Fit to Page',
            contentText: 'Fit the report page to the container.',
            pageWidth: 'Page Width',
            pageHeight: 'Whole Page'
        },
        pagesetup: {
            headerText: 'Page Setup',
            contentText: 'Choose page setup option to change paper size, orientation and margins.'
        }
    },
    pagesetupDialog: {
        close: 'Close',
        paperSize: 'Paper Size',
        height: 'Height',
        width: 'Width',
        margins: 'Margins',
        top: 'Top',
        bottom: 'Bottom',
        right: 'Right',
        left: 'Left',
        unit: 'in',
        orientation: 'Orientation',
        portrait: 'Portrait',
        landscape: 'Landscape',
        doneButton: 'Done',
        cancelButton: 'Cancel'
    },
    credential: {
        userName: 'Username',
        password: 'Password'
    },
    waterMark: {
        selectOption: 'Select option',
        selectValue: 'Select a value'
    },
    errorMessage: {
        startMessage: 'Report Viewer encountered some problems loading this report. Please',
        middleMessage: ' Click here',
        endMessage: 'to see the details of the error',
        closeMessage: 'Close this message',
        exportAjaxFailureMsg: 'Unable to export the document due to failure of connecting Report Service.',
        printAjaxFailureMsg: 'Unable to print the document due to failure of connecting Report Service.',
        reportLoadAjaxFailureMsg: 'Unable to progress the Report action due to failure of connecting Report Service.',
    },
    progressMessage: {
        exportLoadingMessage: 'Preparing exporting document... Please wait...',
        printLoadingMessage: 'Preparing print data… Please wait...',
        printPreparationMessage: 'Preparing print data... {0}% completed... Please wait...',
        exportPreparationMessage: 'Preparing exporting document... {0}% completed... Please wait...',
    },
    alertMessage: {
        close: 'Close',
        title: 'ReportViewer',
        done: 'OK',
        showDetails: 'Show details',
        hideDetails: 'Hide details',
        reportLoad: 'Report loaded:',
        RVERR0001: 'ReportViewer could not load the Report',
        RVERR0002: 'ReportViewer could not process the Report',
        RVERR0003: 'An error occurred in the return of ajax data',
        RVERR0004: 'Select a value for the parameter',
        RVERR0005: 'The parameter {parameter name} is missing a value',
        RVERR0006: 'Please enter the input of the float data type',
        RVERR0007: 'Enter the integer data type entry',
        RVERR0008: 'ReportViewer could not validate Datasource credentials',
        RVERR0009: 'The margins are superimposed or are outside the paper. Enter a different margin size.',
        RVERR0010: 'Enter a value for the parameter',
        RVERR0011: 'The parameter cannot be blank',
        RVERR0012: 'The value provided for the report parameter {parameterprompt} is not valid for its type.'
    },
    selectAll: 'Select All',
    viewButton: 'View Report',
    parameterProcessingMessage: 'Loading dependent parameters...'
};
                