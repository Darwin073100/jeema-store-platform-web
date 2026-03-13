import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// Define font files
const fonts = {
  Roboto: {
    normal: 'src/assets/fonts/roboto/Roboto-Regular.ttf',
    bold: 'src/assets/fonts/roboto/Roboto-Medium.ttf',
    italics: 'src/assets/fonts/roboto/Roboto-Italic.ttf',
    bolditalics: 'src/assets/fonts/roboto/Roboto-MediumItalic.ttf'
  }
};

@Injectable()
export class PrinterService {
    private printer = new PdfPrinter(fonts);

    createPdf(docDefinition: TDocumentDefinitions) {
        return this.printer.createPdfKitDocument(docDefinition);
    }
}
