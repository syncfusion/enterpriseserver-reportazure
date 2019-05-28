var dataExtensions = [
    {
        className: 'ODATADataSource',
        name: 'OData',
        imageClass: 'e-reportdesigner-datasource-odata',
        displayName: 'ODATA'
    },
    {
        className: 'PSQLDataSource',
        name: 'PostgreSQL',
        imageClass: 'e-reportdesigner-datasource-psql',
        displayName: 'PostgreSQL'
    },
    {
        className: 'SASSDataSource',
        name: 'Microsoft SQL Server Analysis Services',
        imageClass: 'e-reportdesigner-datasource-ssas',
        displayName: 'SSAS'
    },
    {
        className: 'WebAPIDataSource',
        name: 'WebAPI',
        imageClass: 'e-reportdesigner-datasource-webapi',
        displayName: 'WebAPI'
    }
];
var itemExtensions = [{
        name: 'barcode',
        className: 'EJBarcode',
        imageClass: 'customitem-barcode',
        displayName: '1D Barcode',
        category: 'Barcodes',
        toolTip: {
            requirements: 'Add a report item to the designer area.',
            description: 'Display the barcode lines as report item.',
            title: 'Barcode'
        }
    }, {
        name: 'qrbarcode',
        className: 'EJQRBarcode',
        imageClass: 'customitem-qrbarcode',
        displayName: 'QR Barcode',
        category: 'Barcodes',
        toolTip: {
            requirements: 'Add a report item to the designer area.',
            description: 'Display the barcode lines as report item.',
            title: 'QR Barcode'
        }
    }];
