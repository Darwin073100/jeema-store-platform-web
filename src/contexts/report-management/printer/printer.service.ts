const PdfPrinter = require('pdfmake/build/pdfmake');
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// Define font files
const fonts = {
  Roboto: {
    normal: 'src/shared/ui/assets/fonts/roboto/Roboto-Regular.ttf',
    bold: 'src/shared/ui/assets/fonts/roboto/Roboto-Medium.ttf',
    italics: 'src/shared/ui/assets/fonts/roboto/Roboto-Italic.ttf',
    bolditalics: 'src/shared/ui/assets/fonts/roboto/Roboto-MediumItalic.ttf'
  }
};

export class PrinterService {
    private printer = new PdfPrinter(fonts);

    createPdf(docDefinition: TDocumentDefinitions) {
        return this.printer.createPdfKitDocument(docDefinition);
    }
}
