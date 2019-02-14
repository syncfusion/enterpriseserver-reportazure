/**
 * Default [es-ES] localization for report viewer.
 */
//ejDatePicker
ej.DatePicker.Locale["es-ES"] = {
    watermarkText: "Seleccione fecha",
    buttonText: "Hoy",
};

//ejReportViewer
ej.ReportViewer.Locale["es-ES"] = {
    toolbar: {
        print: {
            headerText: "Impresión",
            contentText: "Imprimir el informe"
        },
        exportformat: {
            headerText: "Exportar",
            contentText: "Seleccione el formato de archivo exportado",
            Pdf: "PDF",
            Excel: "Excel",
            Word: "Word",
            Html: "html",
            PPT: "PowerPoint",
            CSV: 'CSV'
        },
        first: {
            headerText: "primero",
            contentText: "Ir a la primera página del informe."
        },
        previous: {
            headerText: "Anterior",
            contentText: "Ir a la página anterior del informe."
        },
        next: {
            headerText: "Siguiente",
            contentText: "Ir a la página siguiente del informe."
        },
        last: {
            headerText: "Último",
            contentText: "Ir a la última página del informe."
        },
        documentMap: {
            headerText: "Mapa del documento",
            contentText: "Mostrar u ocultar el mapa del documento."
        },
        parameter: {
            headerText: "Parámetro",
            contentText: "Mostrar u ocultar el panel de parámetros."
        },
        zoomIn: {
            headerText: "Acercarse",
            contentText: "Agrandar el informe."
        },
        zoomOut: {
            headerText: "Disminuir el zoom",
            contentText: "Alejar del informe."
        },
        refresh: {
            headerText: "Refrescar",
            contentText: "Actualizar el informe."
        },
        printLayout: {
            headerText: "Diseño de impresión",
            contentText: "Cambiar entre el diseño de impresión y los modos normales."
        },
        pageIndex: {
            headerText: "Número de página",
            contentText: "número de página actual para ver."
        },
        zoom: {
            headerText: "Enfocar",
            contentText: "Zoom para acercar o alejar el informe."
        },
        back: {
            headerText: "Espalda",
            contentText: "Volver al informe de los padres."
        },
        fittopage: {
            headerText: "Ajustar a la página",
            contentText: "Montar la página del informe al contenedor.",
            pageWidth: "Ancho de página",
            pageHeight: "Toda la pagina"
        },
        pagesetup: {
            headerText: "Configurar página",
            contentText: "Elija la opción de configuración de página para cambiar el tamaño del papel, la orientación y los márgenes."
        }
    },
    pagesetupDialog: {
        close: "Cerca",
        paperSize: "Tamaño de papel",
        height: "Altura",
        width: "Anchura",
        margins: "márgenes",
        top: "Parte superior",
        bottom: "Fondo",
        right: "Derecha",
        left: "Izquierda",
        unit: "pg",
        orientation: "Orientación",
        portrait: "Retrato",
        landscape: "Paisaje",
        doneButton: "Hecho",
        cancelButton: "Cancelar"
    },
    credential: {
        userName: "Nombre de usuario",
        password: "Contraseña"
    },
    waterMark: {
        selectOption: "Seleccionar opción",
        selectValue: "Seleccione un valor"
    },
    errorMessage: {
        startMessage: "Report Viewer encontró algunos problemas al cargar este informe. Por favor",
        middleMessage: " haga clic aquí",
        endMessage: "para ver los detalles del error",
        closeMessage: "Cerrar este mensaje",
        exportAjaxFailureMsg: 'No se puede exportar el documento debido a una falla en la conexión del servicio de informes.',
        printAjaxFailureMsg: 'No se puede imprimir el documento debido a una falla en la conexión del servicio de informes.',
        reportLoadAjaxFailureMsg: 'No se puede avanzar la acción de Informe debido a una falla en la conexión del Servicio de Informe.',
    },
    progressMessage: {
        exportLoadingMessage: 'Preparando el documento de exportación ... Por favor espere ...',
        printLoadingMessage: 'Preparando datos de impresión ... Por favor espere ...',
        printPreparationMessage: 'Preparando datos de impresión ... {0}% completado ... Por favor, espere ...',
        exportPreparationMessage: 'Preparando el documento de exportación ... {0}% completado ... Por favor, espere ...',
    },
    alertMessage: {
        close: "Cerca",
        title: "ReportViewer",
        done: "DE ACUERDO",
        showDetails: "Mostrar detalles",
        hideDetails: "Ocultar detalles",
        reportLoad: "Informe cargado:",
        RVERR0001: "ReportViewer no pudo cargar el Informe",
        RVERR0002: "ReportViewer no pudo procesar el Informe",
        RVERR0003: "Se produjo un error en la devolución de datos de ajax",
        RVERR0004: "Seleccione un valor para el parámetro",
        RVERR0005: "Al parámetro {nombre de parámetro} le falta un valor",
        RVERR0006: "Por favor ingrese la entrada del tipo de datos float",
        RVERR0007: "Ingrese la entrada de tipo de datos enteros",
        RVERR0008: "ReportViewer no pudo validar las credenciales de Datasource",
        RVERR0009: "Los márgenes están superpuestos o están fuera del papel. Ingrese un tamaño de margen diferente.",
        RVERR0010: "Ingrese un valor para el parámetro",
        RVERR0011: "El parámetro no puede estar en blanco",
        RVERR0012: "El valor proporcionado para el parámetro de informe {parameterprompt} no es válido para su tipo."
    },
    selectAll: "Seleccionar todo",
    viewButton: "Vista del informe",
    parameterProcessingMessage: 'Cargando parámetros dependientes ...'
};
                