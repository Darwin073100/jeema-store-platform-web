import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { formatDate } from "src/shared/utils/date-formatter";

const logo: Content = {
	image: 'src/assets/images/la_bonita_1.png',
	width: 80,
	alignment: 'center',
	marginBottom: 4
}

export function getTicketDocumentDefinition(sale: SaleEntity): TDocumentDefinitions {
	const details = sale.saleDetails ? sale.saleDetails.flatMap(item => [
		// Primera fila: Nombre del producto (ocupa toda la fila)
		[
			{ colSpan: 6, text: item.productNameAtSale, fontSize: 6, alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), bold: true },
			'', '', '', '', ''
		],
		// Segunda fila: Datos del producto (cantidad, precio, descuento, subtotal)
		[
			{ text: item.quantity.toString(), fontSize: 6, alignment: 'left' as ('left' | 'right' | 'center' | 'justify') },
			{ text: '', fontSize: 6 },
			{ text: `$${item.unitPriceAtSale?.toFixed(2) ?? '0.00'}`, fontSize: 6, alignment: 'left' as ('left' | 'right' | 'center' | 'justify') },
			{ text: `$${item.discountItem?.toFixed(2) ?? '0.00'}`, fontSize: 6, alignment: 'left' as ('left' | 'right' | 'center' | 'justify') },
			{ text: `$${((item.subtotalItem ?? 0) + (item.discountItem ?? 0)).toFixed(2)}`, fontSize: 6, alignment: 'left' as ('left' | 'right' | 'center' | 'justify') },
			{ text: `$${item.subtotalItem?.toFixed(2) ?? '0.00'}`, fontSize: 6, alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), bold: true }
		],
	]) : [];

	const address = `${sale.branchOffice?.address.city ?? ''} ${sale.branchOffice?.address.state ?? ''}, ${sale.branchOffice?.address.country ?? ''}, ${sale.branchOffice?.address.neighborhood ?? ''}, ${sale.branchOffice?.address.postalCode ?? ''}, ${sale.branchOffice?.address.street ?? ''}`

	return {
		// header: { text: `Ticket-Venta-${sale.saleId}`, alignment: 'right', margin: [10, 10] },
		pageSize: {
			width: 226.77, // 80mm = 226.77 puntos (ancho real de impresión)
			height: 'auto',
		},
		pageMargins: [8, 8, 8, 8], // Márgenes mínimos para impresora térmica
		content: [
			// Logo
			logo,
			// Encabezado
			{
				text: sale.branchOffice?.establishment?.name.toUpperCase() ?? 'Establecimiento',
				style: 'header',
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify')
			},
			{
				text: 'MAYOREO Y MENUDEO',
				style: 'subheader',
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify')
			},
			{
				text: `FOLIO: ${sale.saleId}`,
				alignment: 'right' as ('left' | 'right' | 'center' | 'justify'),
				margin: [0, 5, 0, 0],
				fontSize: 8
			},
			{
				text: `FECHA: ${formatDate(sale.updatedAt)}`,
				alignment: 'right' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8
			},
			{
				text: `SUCURSAL: ${sale.branchOffice?.name}`,
				alignment: 'left' as ('left' | 'right' | 'center' | 'justify'),
				marginTop: 2,
				fontSize: 8
			},
			{
				text: `DIRECCIÓN: ${address}`,
				alignment: 'left' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8
			},
			{
				text: `CLIENTE: ${sale.customer?.firstName.value} ${sale.customer?.lastName?.value}`,
				fontSize: 8,
			},
			{
				text: `LE ATIENDE: ${sale.employee?.firstName} ${sale.employee?.lastName}`,
				fontSize: 8,
				marginBottom: 2
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 210.77, y2: 0, lineWidth: 0.5 }
				]
			},
			// Tabla de productos
			{
				layout: 'lightHorizontalLines',
				table: {
					headerRows: 1,
					widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
					body: [
						[
							{ text: 'CANT.', style: 'tableHeader', fontSize: 7, alignment: 'left' },
							{ text: '', style: 'tableHeader', fontSize: 7, alignment: 'left' },
							{ text: 'PRECIO', style: 'tableHeader', fontSize: 7, alignment: 'left' },
							{ text: 'DES.', style: 'tableHeader', fontSize: 7, alignment: 'left' },
							{ text: 'S.TOTAL', style: 'tableHeader', fontSize: 7, alignment: 'left' },
							{ text: 'TOTAL', style: 'tableHeader', fontSize: 7, alignment: 'left' }
						],
						...details
					]
				}
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 210.77, y2: 0, lineWidth: 0.5 }
				]
			},
			// Totales
			{
				columns: [
					{ text: 'SUBTOTAL:', alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `$${Number(sale.subTotalAmount.toFixed(2)) + Number(sale.discountAmount.toFixed(2))}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				],
				margin: [0, 5, 0, 0]
			},
			{
				columns: [
					{ text: 'DESCUENTO:', alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `$${sale.discountAmount.toFixed(2)}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				]
			},
			{
				columns: [
					{ text: 'TOTAL:', alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '60%', bold: true, fontSize: 9 },
					{ text: `$${sale.totalAmount.toFixed(2)}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', bold: true, fontSize: 9 }
				]
			},
			{
				columns: [
					{ text: 'RECIBIDO:', alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `$${sale.inAmount.toFixed(2)}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				]
			},
			{
				columns: [
					{ text: 'CAMBIO:', alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `$${sale.outAmount.toFixed(2)}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				],
				margin: [0, 0, 0, 5]
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 210.77, y2: 0, lineWidth: 0.5 }
				]
			},
			// {
			// 	text: 'MONTO EN LETRA',
			// 	alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
			// 	fontSize: 7,
			// 	margin: [0, 5, 0, 5]
			// },
			{
				text: `TEL-1: 741-150-6224, TEL-2: 741-107-3337`,
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8,
				marginTop: 2
			},
			{
				text: `FACEBOOK: Papelería y Novedades "La Bonita"`,
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8
			},
			{
				text: `(Escanea el cÓdigo QR)`.toUpperCase(),
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8
			},
			{
                qr: `https://www.facebook.com/share/1Ge4GiSCw6/`,
                fit: 70,
                alignment: "center",
                padding: 2,
				marginTop: 2
            },
			{
				text: [
					'GRACIAS POR TU COMPRA\n',
					'TE ESPERAMOS PRONTO'
				],
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8,
				bold: true,
				margin: [0, 5, 0, 5]
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 210.77, y2: 0, lineWidth: 1, dash: { length: 1, space: 1 } }
				]
			},
			{
				text: 'HECHO POR: Edwin García Quiterio, Tel: 741-107-3337',
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 6,
				margin: [0, 5, 0, 0]
			}
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