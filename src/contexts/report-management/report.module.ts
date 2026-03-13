import { Module } from "@nestjs/common";
import { PrinterService } from "./printer/printer.service";
import { ReportService } from "./report/report.service";
import { ReportController } from "./report/report.controller";
import { SaleModule } from "../sale-management/sale/sale.module";
import { InventoryModule } from "../inventory-management/inventory/inventory.module";
import { CashModule } from "../cash-management/cash.module";
import { BranchOfficeModule } from "../establishment-management/branch-office/branch-office.module";

@Module({
    imports: [
        SaleModule,
        InventoryModule,
        CashModule,
        BranchOfficeModule
    ],
    providers: [
        PrinterService,
        ReportService
    ],
    controllers: [ ReportController],
})
export class ReportModule{}