/**
 * Default [de-DE] localization for report viewer.
 */
//ejDatePicker
ej.DatePicker.Locale["de-DE"] = {
    watermarkText: "Datum wählen",
    buttonText: "Heute",
};

//ejReportViewer
ej.ReportViewer.Locale["de-DE"] = {
    toolbar: {
        print: {
            headerText: "Drucken",
            contentText: "Bericht ausdrücken."
        },
        exportformat: {
            headerText: "Exportieren",
            contentText: "Exportiertes Datei Format auswählen.",
            Pdf: "PDF",
            Excel: "Excel",
            Word: "Wort",
            Html: "html",
            PPT: "PowerPoint",
            CSV: 'CSV'
        },
        first: {
            headerText: "Erste Seite",
            contentText: "Gehe zur ersten Seite des Berichts."
        },
        previous: {
            headerText: "Vorherige Seite",
            contentText: "Gehe zur vorherigen Seite des Berichts."
        },
        next: {
            headerText: "Nächste Seite",
            contentText: "Gehe zur nächsten Seite des Berichts."
        },
        last: {
            headerText: "Letzte Seite",
            contentText: "Gehe zur letzten Seite des Berichts."
        },
        documentMap: {
            headerText: "Navigationsbereich",
            contentText: "Navigationsbereich anzeigen oder verbergen."
        },
        parameter: {
            headerText: "Parameter",
            contentText: "Parameterfeld anzeigen oder verbergen."
        },
        zoomIn: {
            headerText: "Hineinzoomen",
            contentText: "Bericht vergrößern."
        },
        zoomOut: {
            headerText: "Rauszoomen",
            contentText: "Bericht verkleinern."
        },
        refresh: {
            headerText: "auffrischen",
            contentText: "Bericht aktualisieren."
        },
        printLayout: {
            headerText: "Layout ausdrucken",
            contentText: "Zwischen Drucklayout und Normalem Modus wechseln."
        },
        pageIndex: {
            headerText: "Seitennummer",
            contentText: "Aktuelle Seitenzahl anzuzeigen."
        },
        zoom: {
            headerText: "Zoom",
            contentText: "Verkleinern oder Vergrößern des Berichtes."
        },
        back: {
            headerText: "Zurück",
            contentText: "Zurück zum übergeordneten Bericht."
        },
        fittopage: {
            headerText: "An Seite anpassen",
            contentText: "Die Berichtseite an den Container anpassen.",
            pageWidth: "Seitenbreite",
            pageHeight: "Ganze Seite"
        },
        pagesetup: {
            headerText: "Seiten Setup",
            contentText: "Wähle eine Seiten-Setup-Option aus um die Papierformatausrichtung und die Seitenspanne zu verändern."
        }
    },
    pagesetupDialog: {
        close: 'Schließen',
        paperSize: "Papiergröße",
        height: "Höhe",
        width: "Breite",
        margins: "Spanne",
        top: "Oben",
        bottom: "Boden",
        right: "Recht",
        left: "Links",
        unit: "inch",
        orientation: "Ausrichtung",
        portrait: "Hochformat",
        landscape: "Querformat",
        doneButton: "Erledigt",
        cancelButton: "Stornieren"
    },
    credential: {
        userName: 'Nutzername',
        password: 'Passwort'
    },
    waterMark: {
        selectOption: 'Wähle eine Option',
        selectValue: 'Wähle einen Wert'
    },
    errorMessage: {
        startMessage: 'Report Viewer hat Probleme beim Laden dieses Berichts festgestellt. Bitte',
        middleMessage: ' Klick hier',
        endMessage: 'um die Fehlerdetails zu sehen',
        closeMessage: 'Schließen Sie diese Nachricht',
        exportAjaxFailureMsg: 'Das Dokument kann nicht exportiert werden, weil der Berichtsdienst nicht verbunden wurde.',
        printAjaxFailureMsg: 'Das Dokument kann nicht gedruckt werden, weil der Report Service nicht verbunden wurde.',
        reportLoadAjaxFailureMsg: 'Die Berichtsaktion kann nicht ausgeführt werden, weil der Berichtsdienst nicht verbunden werden konnte.',
    },
    progressMessage: {
        exportLoadingMessage: 'Exportdokument wird vorbereitet ... Bitte warten Sie ...',
        printLoadingMessage: 'Druckdaten vorbereiten ... Bitte warten Sie ...',
        printPreparationMessage: 'Druckdaten werden vorbereitet ... {0}% abgeschlossen ... Bitte warten ...',
        exportPreparationMessage: 'Exportdokument vorbereiten... {0}% abgeschlossen... Warten Sie mal...',
    },
    alertMessage: {
        close: 'Schließen',
        title: 'BerichtViewer',
        done: 'OK',
        showDetails: 'Zeige Details',
        hideDetails: 'Details ausblenden',
        reportLoad: 'Bericht geladen:',
        RVERR0001: 'ReportViewer konnte den Bericht nicht laden',
        RVERR0002: 'ReportViewer konnte den Bericht nicht rendern',
        RVERR0003: 'Beim Ajax-Postback ist ein Fehler aufgetreten',
        RVERR0004: 'Bitte wählen Sie einen Wert für den Parameter',
        RVERR0005: 'Der Parameter {parametername} fehlt ein Wert',
        RVERR0006: 'Bitte geben Sie den Datentyp float ein',
        RVERR0007: 'Bitte geben Sie die Ganzzahl-Datentyp Eingabe',
        RVERR0008: 'ReportViewer konnte die Datenquellenanmeldeinformationen nicht überprüfen',
        RVERR0009: 'Die Ränder sind überlappt oder sie liegen außerhalb des Papiers. Geben Sie eine andere Randgröße ein.',
        RVERR0010: 'Bitte geben Sie einen Wert für den Parameter ein',
        RVERR0011: 'Der Parameter darf nicht leer sein',
        RVERR0012: 'Der für den Berichtsparameter {parameterprompt} angegebene Wert ist für seinen Typ nicht gültig.'
    },
    selectAll: 'Wählen Sie Alle',
    viewButton: "Bericht sehen",
    parameterProcessingMessage: 'Abhängige Parameter werden geladen ...'
};