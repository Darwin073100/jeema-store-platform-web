import bwipjs from "bwip-js";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

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
			bcid: 'code128',   // Tipo de código de barras
			text: text,           // Datos a codificar
			scale: 2,             // Escala de ampliación
			height: 7,           // Altura en mm
			includetext: true,   // Incluir texto debajo del código
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

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

export async function getBarcode27X13DocumentDefinition(
	productName: string,
	barcodeValue: string
): Promise<TDocumentDefinitions> {

	const barcodeBase64 = await getBarcodeBase64(barcodeValue);

	// Conversiones exactas
	const labelWidth = mmToPt(26);
	const labelHeight = mmToPt(13);
	const gap = mmToPt(4);
	const totalWidth = mmToPt(90);

	// Definimos el contenido de la etiqueta ajustado al milímetro
	const singleLabelContent = (text: string): Content => ({
		stack: [
			{
				image: barcodeBase64,
				width: labelWidth - 10, // Dejamos 2mm de aire a cada lado para el lector
				alignment: 'center',
				margin: [0, 3, 0, 0]
			},
			// {
			// 	text: text,
			// 	fontSize: 6,
			// 	alignment: 'center',
			// 	margin: [0, 3, 0, 0]
			// }
		]
	});

	return {
		pageSize: {
			width: totalWidth,
			height: labelHeight,
		},
		pageMargins: [0, 0, 0, 0],
		content: [
			{
				table: {
					widths: [labelWidth, gap, labelWidth, gap, labelWidth],
					body: [
						[
							singleLabelContent(barcodeValue),
							{ text: '' },
							{
								stack: [
									{
										image: barcodeBase64,
										width: labelWidth - 10, // Dejamos 2mm de aire a cada lado para el lector
										alignment: 'center',
										margin: [0, 3, 0, 0]
									},
									// {
									// 	text: barcodeValue,
									// 	fontSize: 6,
									// 	alignment: 'center',
									// 	margin: [0, 3, 0, 0]
									// }
								]
							},
							{ text: '' },
							singleLabelContent(barcodeValue)
						]
					]
				},
				// EL TRUCO ESTÁ AQUÍ: Eliminamos todo el padding de las celdas
				layout: {
					defaultBorder: false,
					hLineWidth: () => 0,
					vLineWidth: () => 0,
					paddingLeft: () => 0,
					paddingRight: () => 0,
					paddingTop: () => 1, // Un punto de margen superior para centrar verticalmente
					paddingBottom: () => 0,
				},
				margin: [mmToPt(2), 0, 0, 0] // Centrado del bloque en el rollo de 90mm
			},
		],
	};
}