import bwipjs from "bwip-js";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

const logo: Content = {
	image: 'src/assets/images/la_bonita_1.png',
	width: 20,
	alignment: 'center',
	marginBottom: 4
}

/**
 * Genera un código de barras usando la librería 'bwip-js' (Barcode Writer in Pure JavaScript).
 * Esta librería funciona perfectamente en Node.js sin dependencias nativas.
 * @param {string} data - El valor a codificar en el código de barras (ej. "12345").
 * @returns {Promise<string>} La imagen del código de barras en formato PNG Base64 para PDFMake.
 */
async function getBarcodeBase64(text: string): Promise<string> {
	try {
		// Generar código de barras CODE128 como PNG
		const png = await bwipjs.toBuffer({
			bcid: 'code128',      // Tipo de código de barras
			text: text,           // Datos a codificar
			scale: 2,             // Escala de ampliación
			height: 14,           // Altura en mm
			includetext: false,   // No incluir texto debajo del código
			textxoffset: 0,
		});

		// Convertir PNG a Base64
		const base64 = png.toString('base64');
		const dataUrl = `data:image/png;base64,${base64}`;

		return dataUrl;
	} catch (error) {
		throw error;
	}
}
export async function getBarcode51X25DocumentDefinition(
	productName: string,
	barcodeValue: string
): Promise<TDocumentDefinitions> {
	// Generar el código de barras
	const barcodeBase64 = await getBarcodeBase64(barcodeValue);

	return {
		// header: { text: `Ticket-Venta-${sale.saleId}`, alignment: 'right', margin: [10, 10] },
		pageSize: {
			width: 144.567, // 51mm = 144.567 puntos (ancho real de impresión para etiquetas de 2 pulgadas)
			height: 'auto',
		},
		pageMargins: [4, 4, 4, 4], // Márgenes mínimos para impresora térmica
		content: [
			// Nombre del producto
			{
				text: productName,
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				margin: [0, 1, 0, 1],
				fontSize: 5,
			},
			// Código de barras generado
			{
				image: barcodeBase64,
				width: 110,
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				margin: [0, 2, 0, 2]
			},
			// Valor del código de barras (opcional)
			{
				text: barcodeValue,
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				margin: [0, 1, 0, 0],
				fontSize: 8
			},
		],
		styles: {
			header: {
				fontSize: 12,
				bold: true,
				margin: [0, 0, 0, 5]
			},
			subheader: {
				fontSize: 10,
				margin: [0, 0, 0, 5]
			},
			tableHeader: {
				bold: true,
				fontSize: 9,
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify')
			}
		},
	};
}