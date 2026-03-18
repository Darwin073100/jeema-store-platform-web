import { billReport } from './documents/bill.reports';
import { PrinterService } from '../printer/printer.service';
import { SaleRepository } from 'src/contexts/sale-management/sale/domain/repositories/sale.repository';
import { SaleNotFoundException } from 'src/contexts/sale-management/sale/domain/exceptions/sale-not-found.exception';
import { getBarcode51X25DocumentDefinition } from './documents/barcode-51-25-document';
import { InventoryRepository } from 'src/contexts/inventory-management/inventory/domain/repositories/inventory.repository';
import { InventoryNotFoundException } from 'src/contexts/inventory-management/inventory/domain/exceptions/inventory-not-found.exception';
import { getTicket54DocumentDefinition } from './documents/ticket-58-document';
import { getBarcode27X13DocumentDefinition } from './documents/barcode-27-13-document';
import { BarcodeTypeEnum } from '../enums/barcode-type.enum';
import { getPrices27X13DocumentDefinition } from './documents/prices-27-13-document';
import { CashSessionRepository } from 'src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository';
import { getTicketCloseCashSession58Document } from './documents/ticket-close-cash-session-58-document';
import { getTicketCloseCashSessionList58Document } from './documents/ticket-close-cash-session-list-58-document';
import { BranchOfficeRepository } from 'src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository';

export class ReportService {
    constructor(
        private readonly printerService: PrinterService,
        private saleRepository: SaleRepository,
        private inventoryRepository: InventoryRepository,
        private cashSessionRepository: CashSessionRepository,
        private branchOfficeRepository: BranchOfficeRepository,
    ) { }

    static create(){
        
    }
    
    async getBillReport() {
        return this.printerService.createPdf(billReport());
    }

    async getBracode44Document(inventoryId: bigint, barcodeType: BarcodeTypeEnum) {
        const result = await this.inventoryRepository.findBarcodeById(inventoryId);
        if (!result) {
            throw new InventoryNotFoundException('Etiqueta no encontrada.');
        }
        if(barcodeType === BarcodeTypeEnum.BARCODE27X13){
            const name = result.product?.name.value ?? '';
            const barCode = result.internalBarCode?.value ?? '';
            return this.printerService.createPdf(await getBarcode27X13DocumentDefinition(name, barCode));
        } else if(barcodeType === BarcodeTypeEnum.BARCODE51X25){
            const name = result.product?.name.value ?? '';
            const barCode = result.internalBarCode?.value ?? '';
            return this.printerService.createPdf(await getBarcode51X25DocumentDefinition(name, barCode));
        } else if(barcodeType === BarcodeTypeEnum.BARCODE51X25_PRICE){
            const name = result.product?.name.value ?? '';
            const barCode = result.internalBarCode?.value ?? '';
            return this.printerService.createPdf(await getBarcode51X25DocumentDefinition(name, barCode));
        } else if(barcodeType === BarcodeTypeEnum.PRICES27X13_PRICE){
            return this.printerService.createPdf(await getPrices27X13DocumentDefinition(result.salePriceOne?.value ?? 0, result.salePriceMany?.value ?? 0));
        } else {
            const name = result.product?.name.value ?? '';
            const barCode = result.internalBarCode?.value ?? '';
            return this.printerService.createPdf(await getBarcode51X25DocumentDefinition(name, barCode));
        }

    }

    async getTicket88Document(saleId: bigint) {
        const result = await this.saleRepository.findSaleTicketById(saleId);
        if (!result) {
            throw new SaleNotFoundException('Ticket no encontrado.');
        }
        return this.printerService.createPdf(getTicket54DocumentDefinition(result));
    }
    async getTicketCloseCashSessionDocument(cashSession: bigint) {
        const result = await this.cashSessionRepository.findCashSessionTicket(cashSession);
        if (!result) {
            throw new SaleNotFoundException('Ticket no encontrado.');
        }
        return this.printerService.createPdf(getTicketCloseCashSession58Document(result));
    }
    async getTicketCloseCashSessionListDocument(branchOfficeId: bigint, dateInit: Date, dateFinish: Date) {
        const result = await this.cashSessionRepository.findAllByBranchOffice(branchOfficeId, dateInit, dateFinish);
        if (!result) {
            throw new SaleNotFoundException('Ticket no encontrado.');
        }
        const branchOffice = await this.branchOfficeRepository.findById(branchOfficeId);
        return this.printerService.createPdf(getTicketCloseCashSessionList58Document(result, branchOffice ));
    }
}
