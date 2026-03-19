'use server';
import { unstable_noStore } from "next/cache";
import { BarcodeTypeEnum } from "@/contexts/product-management/product/domain/enums/barcode-type.enum";
import { ReportService } from "@/contexts/report-management/report/report.service";
import { Result } from "@/shared/features/result";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

unstable_noStore();

export async function findBarCodeByInventoryIdAction(inventoryId: bigint, barcodeType: BarcodeTypeEnum) {
    try {
        const pdfService = await ReportService.create();

        const result = await pdfService.getBracode44Document(inventoryId, barcodeType);
        return {
            ...Result.success(result)
        };
    } catch (error) {
        console.error('findBarCodeByInventoryIdAction: ', error);
        return {
            ...handleError(error, 'findBarCodeByInventoryIdAction')
        }
    }
}