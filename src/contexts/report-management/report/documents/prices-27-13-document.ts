import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

export async function getPrices27X13DocumentDefinition(
	priceOne: number,
	priceMany: number
): Promise<TDocumentDefinitions> {

	// Conversiones exactas
	const labelWidth = mmToPt(26);
	const labelHeight = mmToPt(13);
	const gap = mmToPt(4);
	const totalWidth = mmToPt(90);

	// Definimos el contenido de la etiqueta ajustado al milímetro
	const singleLabelContent = (): Content => ({
		stack: [
			{
				text: {
					text: `${numberMoneyFormat(Number(priceOne ?? 0))} Men. \n ${numberMoneyFormat(Number(priceMany ?? 0))} May.`, 
					fontSize: 10, 
					bold: true
				},
				alignment: 'left',
				margin: [0, 3, 0, 0]
			},
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
							singleLabelContent(),
							{ text: '' },
							singleLabelContent(),
							{ text: '' },
							singleLabelContent()
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