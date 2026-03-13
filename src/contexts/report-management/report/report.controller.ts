import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import * as Express from 'express';
import { SaleNotFoundException } from 'src/contexts/sale-management/sale/domain/exceptions/sale-not-found.exception';
import { InventoryNotFoundException } from 'src/contexts/inventory-management/inventory/domain/exceptions/inventory-not-found.exception';
import { BarcodeRequestDTO } from './dtos/barcode-request.dto';
import { ParseBigIntPipe } from 'src/shared/pipes/parse-bigint.pipe';
import { FindCashSessionAllByBranchOfficeRequestDTO } from 'src/contexts/cash-management/cash-session/presentation/dtos/find-cash-session-all-by-branch-office-request.dto';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly service: ReportService
  ) { }

  @Get('tickets/sales/:saleId')
  async getTicket(@Res() response: Express.Response, @Param('saleId', ParseBigIntPipe) saleId: bigint) {
    try {
      const pdfDoc = await this.service.getTicket88Document(saleId);
      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Ticket_Venta_${saleId.toString()}`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      if (error instanceof SaleNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  @Get('tickets/cash-sessions/:cashSessionId')
  async getTicketCashSession(@Res() response: Express.Response, @Param('cashSessionId', ParseBigIntPipe) cashSessionId: bigint) {
    try {
      const pdfDoc = await this.service.getTicketCloseCashSessionDocument(cashSessionId);
      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Ticket_Venta_${cashSessionId.toString()}`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      if (error instanceof SaleNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  @Get('bill')
  async getBillReport(@Res() response: Express.Response) {
    const pdfDoc = await this.service.getBillReport();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
  @Post('barcode/inventories/:inventoryId')
  async getBarcode44(
    @Res() response: Express.Response, 
    @Param('inventoryId', ParseBigIntPipe) inventoryId: bigint,
    @Body() dto: BarcodeRequestDTO
  ) {
    try {
      const pdfDoc = await this.service.getBracode44Document(inventoryId, dto.barcodeType);
      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Codigo_Barra_Inventario_${inventoryId.toString()}`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      if(error instanceof InventoryNotFoundException){
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  @Post('tickets/cash-sessions/all/branch-offices/:branchOfficeId')
  async findTicketCloaseCashSessionList(
    @Res() response: Express.Response, 
    @Param('branchOfficeId', ParseBigIntPipe) branchOfficeId: bigint,
    @Body() dto: FindCashSessionAllByBranchOfficeRequestDTO
  ) {
    try {
      const pdfDoc = await this.service.getTicketCloseCashSessionListDocument(branchOfficeId, dto.dateInit, dto.dateFinish);
      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Codigo_Barra_Inventario_${branchOfficeId.toString()}`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      if(error instanceof InventoryNotFoundException){
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }


}
