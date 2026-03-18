import { formatDate } from "@/shared/lib/utils/date-formatter";
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import { CashSessionEntity } from "src/contexts/cash-management/cash-session/domain/entities/cash-session.entity";
import { AccountTypeEnum } from "src/contexts/transaction-management/transaction-type/domain/enums/account-type.enum";

export function getTicketCloseCashSession58Document(cashSession: CashSessionEntity): TDocumentDefinitions {
	const address = `${cashSession?.cashRegister?.branchOffice?.address.city ?? ''} ${cashSession?.cashRegister?.branchOffice?.address.state ?? ''}, ${cashSession?.cashRegister?.branchOffice?.address.country ?? ''}, ${cashSession?.cashRegister?.branchOffice?.address.neighborhood ?? ''}, ${cashSession?.cashRegister?.branchOffice?.address.postalCode ?? ''}, ${cashSession?.cashRegister?.branchOffice?.address.street ?? ''}`

	const incomeAmount = ()=> {
		let income = 0;
		cashSession.transactions
			?.filter(item => item.transactionType?.accountType === AccountTypeEnum.INCOME)
			?.filter(item => item.transactionType?.name !== 'Apertura de Caja')
			?.filter(item => item.transactionType?.name !== 'Ingreso por Sobrante en caja')
			.forEach(item => income = income + Number(item.amount));
		return income;
	}
	const expenseAmount = ()=> {
		let expense = 0;
		cashSession.transactions
			?.filter(item => item.transactionType?.accountType === AccountTypeEnum.EXPENSE)
			?.filter(item => item.transactionType?.name !== 'Retiro de efectivo/Corte de caja')
			.forEach(item => expense = expense + Number(item.amount));
		return expense;
	}
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
				text: cashSession?.cashRegister?.branchOffice?.name.toUpperCase() ?? 'Sucursal',
				style: 'header',
				alignment: 'center' as ('left' | 'right' | 'center' | 'justify')
			},
			{
				text: `FOLIO: ${cashSession.cashSessionId}`,
				alignment: 'right' as ('left' | 'right' | 'center' | 'justify'),
				margin: [0, 5, 0, 0],
				fontSize: 8
			},
			{
				text: `FECHA: ${formatDate(cashSession.startTime)}`,
				alignment: 'right' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8
			},
			{
				text: `DIRECCIÓN: ${address}`,
				alignment: 'left' as ('left' | 'right' | 'center' | 'justify'),
				fontSize: 8
			},
			{
				text: `EMPLEADO: ${cashSession.employee?.firstName} ${cashSession.employee?.lastName}`,
				fontSize: 8,
				marginBottom: 2
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }
				]
			},
			{
				text: `${cashSession.cashRegister?.name}`, alignment: 'center'
			},
			// Totales
			{
				columns: [
					{ text: 'FONDO:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `${numberMoneyFormat(Number(cashSession.startBalance))}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				],
				margin: [0, 5, 0, 5]
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }
				]
			},
			{
				text: 'MOVIMIENTOS GENERALES', alignment: 'center'
			},
			{
				columns: [
					{ text: 'NO MOVIMIENTOS:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `${Number(cashSession.transactions?.length)}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				],
			},
			{
				columns: [
					{ text: 'ENTRADAS:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `${numberMoneyFormat(incomeAmount())}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				],
			},
			{
				columns: [
					{ text: 'SOBRANTE:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `${numberMoneyFormat(Number(cashSession?.diference))}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				]
			},
			{
				columns: [
					{ text: 'SALIDAS:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
					{ text: `- ${numberMoneyFormat(expenseAmount())}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 8 }
				],
			},
			{
				columns: [
					{ text: 'TOTAL:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 10 },
					{ text: `${numberMoneyFormat(Number(cashSession?.expectedBalance)+Number(cashSession.diference))}`, alignment: 'right' as ('left' | 'right' | 'center' | 'justify'), width: '40%', fontSize: 10 }
				]
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }
				]
			},
			{
				columns: [
					{ text: 'NOTAS:', alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '60%', fontSize: 8 },
				],
			},
			{
				columns: [
					{ text: `${cashSession?.closingNotes ?? 'N/A'}`, alignment: 'left' as ('left' | 'right' | 'center' | 'justify'), width: '100%', fontSize: 8 }
				],
				margin: [0, 0, 0, 5]
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5 }
				]
			},
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 1, dash: { length: 1, space: 1 } }
				]
			},
			{
				text: 'Sy JEEMA por: Edwin García Quiterio, Tel: 741-107-3337',
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