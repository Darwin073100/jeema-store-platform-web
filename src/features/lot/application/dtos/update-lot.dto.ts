import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";

export interface UpdateLotDTO {
    lotId: bigint;
    productId: bigint;
    lotNumber: string;
    purchasePrice: number;
    purchaseUnit: ForSaleEnum;
    initialQuantity: number;
    expirationDate?: Date | null;
    manufacturingDate?: Date | null;
    receivedDate: Date;
}