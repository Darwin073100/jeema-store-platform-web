import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";

export interface RegisterLotHttpDTO {
    productId: string;
    suplierId?: string;
    lotNumber: string;
    purchasePrice: number;
    purchaseUnit: ForSaleEnum;
    initialQuantity: number;
    expirationDate?: string | null;
    manufacturingDate?: string | null;
    receivedDate: string;
}