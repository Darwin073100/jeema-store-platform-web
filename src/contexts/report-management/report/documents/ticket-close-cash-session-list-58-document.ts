import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import { CashSessionEntity } from "src/contexts/cash-management/cash-session/domain/entities/cash-session.entity";
import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { formatDate, formatDateShort } from "src/shared/utils/date-formatter";
import { numberMoneyFormat } from "src/shared/utils/number-formatter";

export function getTicketCloseCashSessionList58Document(cashSessions: CashSessionEntity[], branchOffice: BranchOfficeEntity | null): TDocumentDefinitions {
	const address = `${branchOffice?.address.city ?? ''} ${branchOffice?.address.state ?? ''}, ${branchOffice?.address.country ?? ''}, ${branchOffice?.address.neighborhood ?? ''}, ${branchOffice?.address.postalCode ?? ''}, ${branchOffice?.address.street ?? ''}`
	let total = 0;
	cashSessions.forEach(item => total = total+(item?.expectedBalance ?? 0)+(item?.diference ?? 0));
	const contend: Content[] = cashSessions?.flatMap(cashSession => [
		{
				text: `- VENTA: ${formatDateShort(cashSession.startTime)} -`, alignment: 'center' as ('left' | 'right' | 'center' | 'justify')
			} as Content,
			{
				columns: [
					{ text: 'SUB. TOTAL:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `$${Number(Number(cashSession?.expectedBalance)-Number(cashSession?.diference))}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				],
				margin: [0, 5, 0, 0]
			} as Content,
			{
				columns: [
					{ text: 'SOBRANTE:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `$${Number(cashSession?.diference?.toFixed(2))}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				]
			} as Content,
			{
				columns: [
					{ text: 'TOTAL:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `$${Number(cashSession?.expectedBalance?.toFixed(2))}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				]
			} as Content,
			{
				columns: [
					{ text: 'NOTAS:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
				],
			} as Content,
			{
				columns: [
					{ text: `${cashSession?.closingNotes ?? 'N/A'}`, alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '100%', fontSize: 8 }
				],
				margin: [0, 0, 0, 5]
			} as Content,
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }
				]
			} as Content,
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 1, dash: { length: 1, space: 1 } }
				]
			} as Content,
	]) ?? [];
	return {
		// header: { text: `Ticket-Venta-${sale.saleId}`, alignment: 'right', margin: [10, 10] },
		pageSize: {
			width: 164.41, // 58mm = 164.41 puntos (ancho real de impresión)
			height: 'auto',
		},
		pageMargins: [2, 2, 2, 2], // Márgenes ajustados para impresora térmica de 58mm
		content: [
			// Encabezado
			{
				text: branchOffice?.name.toUpperCase() ?? 'Sucursal',
				style: 'header',
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify')
			},
			{
				text: `FOLIO: ${new Date().getTime()}`,
				alignment: 'right' as ('left' | 'right' | 'center' | 'justify'),
				margin: [0, 5, 0, 0],
				fontSize: 8
			},
			{
				text: `FECHA: ${formatDate(new Date())}`,
				alignment: 'right' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8
			},
			{
				text: `DIRECCIÓN: ${address}`,
				alignment: 'left' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8,
				marginBottom: 2
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }
				]
			},
			...contend,
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }
				]
			},
			{
				columns: [
					{ text: 'TOTAL:', alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '60%', bold: true },
					{ text: `${numberMoneyFormat(total)}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', bold: true }
				]
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 210.77, y2: 0, lineWidth: 0.5 }
				]
			},
			{
				text: 'Sy JEEMA por: Edwin García Quiterio, Tel: 741-107-3337',
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 6,
				margin: [0, 5, 0, 0]
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